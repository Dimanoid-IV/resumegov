type CheckoutSession = {
  id: string;
  payment_status: string;
  amount_total: number | null;
  currency: string | null;
  metadata: { userId?: string; plan?: string; gaClientId?: string; gaSessionId?: string } | null;
};

export function paidCheckoutSession(eventType: string, session: CheckoutSession): CheckoutSession | null {
  if (eventType !== 'checkout.session.completed' && eventType !== 'checkout.session.async_payment_succeeded') {
    return null;
  }
  if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
    return null;
  }
  if (!session.metadata?.userId || !['single', 'analyst', 'professional'].includes(session.metadata.plan ?? '')) {
    return null;
  }
  return session;
}

export function subscriptionGrantsAccess(status: string): boolean {
  return status === 'active';
}

export function creditsAfterSubscriptionEnd(current: number): number {
  return current === -1 ? 0 : current;
}
