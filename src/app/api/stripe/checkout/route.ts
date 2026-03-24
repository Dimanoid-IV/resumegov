import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database';
import { getStripe } from '@/lib/stripe';

type UserRow = Database['public']['Tables']['users']['Row'];

// Pricing plans configuration
export const STRIPE_PRICES = {
  single: {
    id: process.env.STRIPE_PRICE_SINGLE || 'price_single',
    credits: 1,
    name: 'Single Optimization',
  },
  pack3: {
    id: process.env.STRIPE_PRICE_PACK_3 || 'price_pack_3',
    credits: 3,
    name: '3 Credits Pack',
  },
  subscription: {
    id: process.env.STRIPE_PRICE_SUBSCRIPTION || 'price_subscription',
    credits: -1, // -1 means unlimited
    name: 'Monthly Subscription',
  },
} as const;

export type PriceKey = keyof typeof STRIPE_PRICES;

/**
 * GET /api/stripe/checkout
 * Returns available pricing plans
 */
export async function GET() {
  return NextResponse.json({
    plans: [
      {
        id: 'single',
        name: 'Single Optimization',
        credits: 1,
        price: 999, // $9.99
      },
      {
        id: 'pack3',
        name: '3 Credits Pack',
        credits: 3,
        price: 2499, // $24.99
      },
      {
        id: 'subscription',
        name: 'Monthly Subscription',
        credits: -1, // Unlimited
        price: 2999, // $29.99/month
        interval: 'month',
      },
    ],
  });
}

/**
 * POST /api/stripe/checkout
 * Creates a Stripe checkout session
 * Body: { planId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile for Stripe customer ID
    const { data: userProfileData, error: profileError } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfileData) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    const userProfile = userProfileData as Pick<UserRow, 'stripe_customer_id'>;

    const body = await request.json();
    const { planId } = body;

    if (!planId || !STRIPE_PRICES[planId as PriceKey]) {
      return NextResponse.json(
        { error: 'Invalid planId. Use: single, pack3, or subscription' },
        { status: 400 }
      );
    }

    const plan = STRIPE_PRICES[planId as PriceKey];
    const isSubscription = planId === 'subscription';

    // Create or retrieve Stripe customer
    let customerId = userProfile?.stripe_customer_id;
    
    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: user.email,
        metadata: {
          supabaseUserId: user.id,
        },
      });
      customerId = customer.id;
      
      // Save customer ID to database
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // Create checkout session
    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: plan.id,
          quantity: 1,
        },
      ],
      mode: isSubscription ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=true&plan=${planId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        planId,
        credits: plan.credits,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url }, { status: 200 });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
