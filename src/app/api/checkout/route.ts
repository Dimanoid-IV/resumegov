import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database';
import { getStripe } from '@/lib/stripe';
import { getBillingConfig } from '@/lib/billing-env';
import { getGAIdentifiersFromCookies } from '@/lib/ga-cookies';
import { loginPathForCheckout, type CheckoutPlan } from '@/lib/checkout-flow';
import { trackGA4Event } from '@/lib/gtag-server';

type UserRow = Database['public']['Tables']['users']['Row'];

/**
 * GET /api/checkout
 * Redirects to Stripe Checkout for one-time payment
 * Query: ?plan=single|analyst|professional
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const requestedPlan = searchParams.get('plan') || 'analyst';
    const requestedAnalysisId = searchParams.get('analysisId');
    const plan: CheckoutPlan = ['single', 'analyst', 'professional'].includes(requestedPlan)
      ? requestedPlan as CheckoutPlan
      : 'analyst';
    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.redirect(new URL(loginPathForCheckout(plan, requestedAnalysisId), request.url));
    }

    const billing = getBillingConfig(request.nextUrl.origin);
    const cookieAnalytics = getGAIdentifiersFromCookies(request);
    const gaClientId = searchParams.get('gaClientId')?.slice(0, 64) || cookieAnalytics.clientId || '';
    const gaSessionId = searchParams.get('gaSessionId')?.replace(/\D/g, '').slice(0, 24) || cookieAnalytics.sessionId || '';
    let analysisId: string | null = null;
    if (requestedAnalysisId) {
      const { data: ownedAnalysis } = await supabase
        .from('analyses')
        .select('id')
        .eq('id', requestedAnalysisId)
        .eq('user_id', user.id)
        .maybeSingle();
      if (!ownedAnalysis) {
        return NextResponse.redirect(new URL('/dashboard?error=analysis_not_found', request.url));
      }
      analysisId = requestedAnalysisId;
    }

    // Determine price ID
    const priceId = plan === 'professional'
      ? billing.professionalPriceId
      : plan === 'single'
        ? billing.singlePriceId
        : billing.analystPriceId;

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
      mode: plan === 'professional' ? 'subscription' : 'payment',
      success_url: analysisId
        ? `${billing.siteUrl}/dashboard?upgraded=true&plan=${plan}&analysisId=${encodeURIComponent(analysisId)}`
        : `${billing.siteUrl}/dashboard?upgraded=true&plan=${plan}`,
      cancel_url: analysisId
        ? `${billing.siteUrl}/results/${encodeURIComponent(analysisId)}?checkout=cancelled`
        : `${billing.siteUrl}/dashboard?checkout=cancelled`,
      metadata: {
        userId: user.id,
        plan,
        analysisId: analysisId || '',
        gaClientId,
        gaSessionId,
      },
      client_reference_id: user.id,
    });

    if (!session.url) {
      return NextResponse.redirect(new URL('/dashboard?error=checkout_failed', request.url));
    }

    await trackGA4Event({
      eventName: 'begin_checkout',
      clientId: gaClientId || undefined,
      sessionId: gaSessionId || undefined,
      userId: user.id,
      params: {
        plan,
        value: (session.amount_total || 0) / 100,
        currency: (session.currency || 'usd').toUpperCase(),
        items: [{ item_id: plan, item_name: `ResumeGov ${plan}`, quantity: 1 }],
      },
    });

    // Redirect to Stripe Checkout
    return NextResponse.redirect(session.url);
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.redirect(new URL('/dashboard?error=checkout_failed', request.url));
  }
}
