import { NextRequest, NextResponse } from 'next/server';
import { getBillingConfig } from '@/lib/billing-env';

export async function GET(request: NextRequest) {
  if (
    process.env.VERCEL_ENV === 'production' &&
    process.env.BILLING_TEST_MODE !== 'true'
  ) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const billing = getBillingConfig(request.nextUrl.origin);
    return NextResponse.json({
      ready: true,
      billingEnvironment: billing.environment,
      isolatedSupabase: process.env.NEXT_PUBLIC_SUPABASE_URL === process.env.TEST_SUPABASE_URL,
      liveChargesPossible: false,
      analystPriceConfigured: Boolean(billing.analystPriceId),
      professionalPriceConfigured: Boolean(billing.professionalPriceId),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ready: false,
        error: error instanceof Error ? error.message : 'Billing readiness check failed',
        liveChargesPossible: false,
      },
      { status: 503 }
    );
  }
}
