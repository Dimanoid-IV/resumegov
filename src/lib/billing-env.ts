type BillingConfig = {
  environment: 'production' | 'test';
  siteUrl: string;
  stripeSecretKey: string;
  webhookSecret: string;
  singlePriceId: string;
  analystPriceId: string;
  professionalPriceId: string;
};

const PRODUCTION_HOSTS = new Set(['resumegov.com', 'www.resumegov.com']);

export function getBillingConfig(requestOrigin?: string): BillingConfig {
  const vercelEnv = process.env.VERCEL_ENV;
  const isTest = process.env.BILLING_TEST_MODE === 'true';
  const isProduction = vercelEnv === 'production' && !isTest;

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';
  const singlePriceId = process.env.STRIPE_PRICE_SINGLE ?? '';
  const analystPriceId = process.env.STRIPE_PRICE_ANALYST ?? '';
  const professionalPriceId = process.env.STRIPE_PRICE_PROFESSIONAL ?? '';
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';

  if (!stripeSecretKey || !webhookSecret || !singlePriceId || !analystPriceId || !professionalPriceId) {
    throw new Error('Billing environment is incomplete');
  }

  if (isProduction) {
    if (!stripeSecretKey.startsWith('sk_live_')) {
      throw new Error('Production billing requires a live Stripe key');
    }
  } else {
    if (!isTest) {
      throw new Error('Billing is disabled outside production unless BILLING_TEST_MODE=true');
    }
    if (!stripeSecretKey.startsWith('sk_test_') && !stripeSecretKey.startsWith('rkcs_test_')) {
      throw new Error('Test billing requires a Stripe test key');
    }

    const testSupabaseUrl = process.env.TEST_SUPABASE_URL ?? '';
    const activeSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    if (!testSupabaseUrl || activeSupabaseUrl !== testSupabaseUrl) {
      throw new Error('Test billing requires the dedicated test Supabase project');
    }
  }

  const siteUrl = isProduction ? configuredSiteUrl : (requestOrigin ?? configuredSiteUrl);
  if (!siteUrl) throw new Error('Billing site URL is missing');

  const siteHost = new URL(siteUrl).hostname;
  if (!isProduction && PRODUCTION_HOSTS.has(siteHost)) {
    throw new Error('Test billing cannot return users to the production domain');
  }

  return {
    environment: isProduction ? 'production' : 'test',
    siteUrl,
    stripeSecretKey,
    webhookSecret,
    singlePriceId,
    analystPriceId,
    professionalPriceId,
  };
}
