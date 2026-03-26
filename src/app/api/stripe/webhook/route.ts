import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripe } from '@/lib/stripe';
import Stripe from 'stripe';

/**
 * POST /api/stripe/webhook
 * Handles Stripe webhook events:
 * - payment_intent.succeeded: Add credits, record payment
 * - payment_intent.payment_failed: Mark payment failed
 * - customer.subscription.created: Update user to subscription plan
 * - customer.subscription.updated: Update subscription status
 * - customer.subscription.deleted: Downgrade to free plan
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    const stripe = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

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

    const supabase = await createClient();

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan || 'analyst';
        
        if (userId) {
          // Record payment
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any).from('payments').insert({
            user_id: userId,
            stripe_payment_id: session.payment_intent as string,
            amount: session.amount_total || 0,
            status: 'completed',
          });

          // Update user plan and credits based on purchased tier
          let newPlanType: 'free' | 'basic' | 'pro' | 'enterprise' = 'basic';
          let newCredits: number = 1; // Default for analyst

          if (plan === 'professional') {
            newPlanType = 'pro';
            newCredits = -1; // Unlimited for professional
          } else if (plan === 'analyst') {
            newPlanType = 'basic';
            newCredits = 1; // 1 credit for analyst
          }

          // Update user plan and credits
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any)
            .from('users')
            .update({
              plan_type: newPlanType,
              credits_remaining: newCredits,
            })
            .eq('id', userId);

          console.log(`Checkout completed for user ${userId}: plan ${plan}, new type: ${newPlanType}, credits: ${newCredits}`);
        }
        break;
      }

      case 'payment_intent.succeeded': {
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
          
          // Record payment
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any).from('payments').insert({
            user_id: userId,
            stripe_payment_id: paymentIntent.id,
            amount: paymentIntent.amount,
            status: 'completed',
          });

          console.log(`PaymentIntent ${paymentIntent.id} succeeded for user ${userId}`);
        }
        break;
      }

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
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (userData) {
          const userId = (userData as { id: string }).id;
          
          // Downgrade to free plan, keep remaining credits
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any)
            .from('users')
            .update({
              plan_type: 'free',
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
