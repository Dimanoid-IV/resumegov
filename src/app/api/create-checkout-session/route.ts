import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database';
import { getStripe } from '@/lib/stripe';

type UserRow = Database['public']['Tables']['users']['Row'];

const ANALYST_PRICE_ID = process.env.STRIPE_PRICE_ANALYST || 'price_analyst';
const PROFESSIONAL_PRICE_ID = process.env.STRIPE_PRICE_PROFESSIONAL || 'price_professional';

/**
 * POST /api/create-checkout-session
 * Creates a Stripe checkout session for one-time payment
 * Body: { plan: 'analyst' | 'professional' }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body to determine plan
    const body = await request.json();
    const { plan } = body;

    // Determine price ID based on plan
    let priceId: string;
    let planType: string;
    
    if (plan === 'professional') {
      priceId = PROFESSIONAL_PRICE_ID;
      planType = 'professional';
    } else {
      // Default to analyst
      priceId = ANALYST_PRICE_ID;
      planType = 'analyst';
    }

    // Get user profile for Stripe customer ID
    const { data: userProfileData, error: profileError } = await supabase
      .from('users')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfileData) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    const userProfile = userProfileData as UserRow;
    let customerId = userProfile.stripe_customer_id;

    // Create Stripe customer if not exists
    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: userProfile.email || user.email,
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

    // Create checkout session for one-time payment
    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard?upgraded=true&plan=${planType}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard`,
      metadata: {
        userId: user.id,
        plan: planType,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}