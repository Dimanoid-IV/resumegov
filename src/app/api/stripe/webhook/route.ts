import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getStripe } from '@/lib/stripe';
import { getBillingConfig } from '@/lib/billing-env';
import { trackGA4Event } from '@/lib/gtag-server';
import { paidCheckoutSession, subscriptionGrantsAccess, creditsAfterSubscriptionEnd } from '@/lib/checkout-events';
import Stripe from 'stripe';

/**
 * POST /api/stripe/webhook
 * Handles Stripe webhook events:
 * - checkout.session.completed / async_payment_succeeded: grant paid access
 * - payment_intent.payment_failed: Mark payment failed
 * - customer.subscription.created: Update user to subscription plan
 * - customer.subscription.updated: Update subscription status
 * - customer.subscription.deleted: Downgrade to free plan
 *
 * Uses the service-role client: webhooks have no user session, and RLS
 * correctly blocks anon/authenticated writes to payments/users.
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    const stripe = getStripe();
    const webhookSecret = getBillingConfig().webhookSecret;

    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Webhook signature verification failed: ${errorMessage}`);
      return NextResponse.json(
        { error: `Webhook signature verification failed` },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const session = paidCheckoutSession(event.type, event.data.object as Stripe.Checkout.Session);
        if (!session) {
          console.log(`Checkout ${event.data.object.id} is not paid or lacks valid fulfillment metadata`);
          break;
        }

        const userId = session.metadata!.userId!;
        const plan = session.metadata!.plan!;
        // The database function commits payment history and the credit grant in
        // one transaction. A replay returns false without changing either row.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: newlyFulfilled, error: fulfillmentError } = await (supabase as any).rpc(
          'fulfill_checkout_session',
          {
            p_session_id: session.id,
            p_user_id: userId,
            p_plan: plan,
            p_amount: session.amount_total || 0,
          },
        );
        if (fulfillmentError) throw fulfillmentError;

        if (newlyFulfilled) {
          const amountInMajorUnits = (session.amount_total || 0) / 100;
          await trackGA4Event({
            eventName: 'purchase',
            clientId: session.metadata?.gaClientId || undefined,
            sessionId: session.metadata?.gaSessionId || undefined,
            userId,
            params: {
              transaction_id: session.id,
              value: amountInMajorUnits,
              currency: (session.currency || 'usd').toUpperCase(),
              plan,
              items: [
                {
                  item_id: plan,
                  item_name: `ResumeGov ${plan}`,
                  price: amountInMajorUnits,
                  quantity: 1,
                },
              ],
            },
          });
          console.log(`Checkout ${session.id} fulfilled for plan ${plan}`);
        } else {
          console.log(`Checkout ${session.id} already fulfilled`);
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Checkout session events are the source of truth for order history and
        // credit fulfillment. Recording this PaymentIntent separately can race
        // with the session event and suppress the credit grant.
        console.log(`PaymentIntent ${paymentIntent.id} succeeded; awaiting Checkout session fulfillment`);
        break;
      }

      case 'checkout.session.async_payment_failed':
        console.warn(`Checkout ${event.data.object.id} asynchronous payment failed`);
        break;

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const customerId = paymentIntent.customer as string;
        
        if (!customerId) break;

        // Find user by Stripe customer ID
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (userData) {
          const userId = (userData as { id: string }).id;
          
          // Record failed payment
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any).from('payments').insert({
            user_id: userId,
            stripe_payment_id: paymentIntent.id,
            amount: paymentIntent.amount,
            status: 'failed',
          });

          console.log(`PaymentIntent ${paymentIntent.id} failed for user ${userId}`);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        if (!subscriptionGrantsAccess(subscription.status)) {
          console.log(`Subscription ${subscription.id} is ${subscription.status}; no paid access granted`);
          break;
        }
        const customerId = subscription.customer as string;

        // Find user by Stripe customer ID
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (userData) {
          const userId = (userData as { id: string }).id;
          
          // Update to subscription plan with unlimited credits
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any)
            .from('users')
            .update({
              credits_remaining: -1, // Unlimited
              plan_type: 'pro',
            })
            .eq('id', userId);

          console.log(`Subscription ${subscription.id} activated for user ${userId}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by Stripe customer ID
        const { data: userData } = await supabase
          .from('users')
          .select('id, credits_remaining')
          .eq('stripe_customer_id', customerId)
          .single();

        if (userData) {
          const { id: userId, credits_remaining: creditsRemaining } = userData as {
            id: string;
            credits_remaining: number;
          };
          
          // Downgrade to free plan, keep remaining credits
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any)
            .from('users')
            .update({
              plan_type: 'free',
              credits_remaining: creditsAfterSubscriptionEnd(creditsRemaining),
            })
            .eq('id', userId);

          console.log(`Subscription ${subscription.id} canceled for user ${userId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
