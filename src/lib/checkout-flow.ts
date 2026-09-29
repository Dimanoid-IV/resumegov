export type CheckoutPlan = 'single' | 'analyst' | 'professional';

const CHECKOUT_PLANS = new Set<CheckoutPlan>(['single', 'analyst', 'professional']);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function checkoutPath(plan: CheckoutPlan, analysisId?: string | null): string {
  const params = new URLSearchParams({ plan });
  if (analysisId && UUID.test(analysisId)) params.set('analysisId', analysisId);
  return `/api/checkout?${params.toString()}`;
}

export function loginPathForCheckout(plan: CheckoutPlan, analysisId?: string | null): string {
  return `/login?next=${encodeURIComponent(checkoutPath(plan, analysisId))}`;
}

export function safePostLoginPath(requested: string | null): string {
  if (!requested) return '/dashboard';
  try {
    const parsed = new URL(requested, 'https://resumegov.invalid');
    if (parsed.origin !== 'https://resumegov.invalid' || parsed.pathname !== '/api/checkout') {
      return '/dashboard';
    }
    const plan = parsed.searchParams.get('plan');
    if (!CHECKOUT_PLANS.has(plan as CheckoutPlan)) return '/dashboard';
    const analysisId = parsed.searchParams.get('analysisId');
    if (analysisId && !UUID.test(analysisId)) return '/dashboard';
    return checkoutPath(plan as CheckoutPlan, analysisId);
  } catch {
    return '/dashboard';
  }
}
