import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database';
import { getStripe } from '@/lib/stripe';

type UserRow = Database['public']['Tables']['users']['Row'];

const ANALYST_PRICE_ID = process.env.STRIPE_PRICE_ANALYST || 'price_analyst';
const PROFESSIONAL_PRICE_ID = process.env.STRIPE_PRICE_PROFESSIONAL || 'price_professional';

/**
 * GET /api/checkout
 * Redirects to Stripe Checkout for one-time payment
 * Query: ?plan=analyst|professional
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      // Redirect to login with return URL
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Get plan from query params
    const searchParams = request.nextUrl.searchParams;
    const plan = searchParams.get('plan') || 'analyst';

    // Determine price ID
    const priceId = plan === 'professional' ? PROFESSIONAL_PRICE_ID : ANALYST_PRICE_ID;

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
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard?upgraded=true&plan=${plan}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard`,
      metadata: {
        userId: user.id,
        plan,
      },
    });

    if (!session.url) {
      return NextResponse.redirect(new URL('/dashboard?error=checkout_failed', request.url));
    }

    // Redirect to Stripe Checkout
    return NextResponse.redirect(session.url);
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.redirect(new URL('/dashboard?error=checkout_failed', request.url));
  }
}
