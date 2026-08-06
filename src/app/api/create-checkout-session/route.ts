import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database';
import { getStripe } from '@/lib/stripe';
import { getBillingConfig } from '@/lib/billing-env';

type UserRow = Database['public']['Tables']['users']['Row'];

// Price IDs resolved per-request to ensure env vars are available in serverless context

/**
 * POST /api/create-checkout-session
 * Creates a Stripe checkout session for one-time payment
 * Body: { plan: 'single' | 'analyst' | 'professional' }
 */
export async function POST(request: NextRequest) {
  try {
    // Resolve env vars inside handler to ensure availability in serverless context
    const billing = getBillingConfig(request.nextUrl.origin);
    const singlePriceId = billing.singlePriceId;
    const analystPriceId = billing.analystPriceId;
    const professionalPriceId = billing.professionalPriceId;

    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body to determine plan
    const body = await request.json();
    const { plan, analysisId: requestedAnalysisId } = body as { plan?: string; analysisId?: string };
    let analysisId: string | null = null;
    if (requestedAnalysisId) {
      const { data: ownedAnalysis } = await supabase
        .from('analyses')
        .select('id')
        .eq('id', requestedAnalysisId)
        .eq('user_id', user.id)
        .maybeSingle();
      if (!ownedAnalysis) {
        return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
      }
      analysisId = requestedAnalysisId;
    }

    // Determine price ID based on plan
    let priceId: string;
    let planType: string;
    
    if (plan === 'professional') {
      if (!professionalPriceId) {
        console.error('Missing STRIPE_PRICE_PROFESSIONAL');
        return NextResponse.json({ error: 'Professional plan not configured' }, { status: 500 });
      }
      priceId = professionalPriceId;
      planType = 'professional';
    } else if (plan === 'analyst') {
      if (!analystPriceId) {
        console.error('Missing STRIPE_PRICE_ANALYST');
        return NextResponse.json({ error: 'Analyst plan not configured' }, { status: 500 });
      }
      priceId = analystPriceId;
      planType = 'analyst';
    } else if (plan === 'single') {
      priceId = singlePriceId;
      planType = 'single';
    } else {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
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
      mode: planType === 'professional' ? 'subscription' : 'payment',
      success_url: analysisId
        ? `${billing.siteUrl}/dashboard?upgraded=true&plan=${planType}&analysisId=${encodeURIComponent(analysisId)}`
        : `${billing.siteUrl}/dashboard?upgraded=true&plan=${planType}`,
      cancel_url: analysisId
        ? `${billing.siteUrl}/results/${encodeURIComponent(analysisId)}?checkout=cancelled`
        : `${billing.siteUrl}/dashboard?checkout=cancelled`,
      metadata: {
        userId: user.id,
        plan: planType,
        analysisId: analysisId || '',
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
    const message = error instanceof Error ? error.message : String(error);
    console.error('Stripe checkout error:', message, error);
    return NextResponse.json(
      { error: 'Internal server error', detail: message },
      { status: 500 }
    );
  }
}
