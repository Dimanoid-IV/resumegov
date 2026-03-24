import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getStripe } from '@/lib/stripe';

/**
 * POST /api/admin/refund
 * Issues a Stripe refund for a payment and updates DB status.
 * Body: { paymentId: string }
 * Requires: is_admin = true
 */
export async function POST(request: NextRequest) {
  try {
    // Verify caller is an authenticated admin
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!(profile as { is_admin?: boolean } | null)?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json({ error: 'Missing paymentId' }, { status: 400 });
    }

    // Fetch payment record using admin client
    const admin = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: payment, error: paymentError } = await (admin as any)
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    const p = payment as { id: string; stripe_payment_id: string; status: string; amount: number };

    if (p.status === 'refunded') {
      return NextResponse.json({ error: 'Payment already refunded' }, { status: 409 });
    }

    if (p.status !== 'completed') {
      return NextResponse.json(
        { error: `Cannot refund payment with status: ${p.status}` },
        { status: 422 }
      );
    }

    // Issue refund via Stripe
    const stripe = getStripe();
    const refund = await stripe.refunds.create({
      payment_intent: p.stripe_payment_id,
      reason: 'requested_by_customer',
    });

    if (refund.status !== 'succeeded' && refund.status !== 'pending') {
      return NextResponse.json(
        { error: `Stripe refund failed: ${refund.status}` },
        { status: 502 }
      );
    }

    // Update payment status in DB
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin as any)
      .from('payments')
      .update({ status: 'refunded' })
      .eq('id', paymentId);

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      status: refund.status,
      amount: refund.amount,
    });
  } catch (error) {
    console.error('Admin refund error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
