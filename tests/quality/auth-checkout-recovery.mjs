// Manual smoke: real Supabase session + synthetic account; Stripe is always mocked.
// No customer account, email delivery, live Checkout session, or charge is used.
import assert from 'node:assert/strict';
import { mock } from 'node:test';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server.js';

let sessionCookies = [];
let checkoutPayload;
// Billing and Stripe are fixtures: this smoke verifies real auth and ownership,
// not live price configuration or payment fulfillment.
mock.module('../../src/lib/billing-env.ts', { namedExports: { getBillingConfig: () => ({ siteUrl: 'http://localhost', singlePriceId: 'price_single_fixture', analystPriceId: 'price_pack_fixture', professionalPriceId: 'price_monthly_fixture' }) } });
mock.module('next/headers', { namedExports: { cookies: async () => ({
  getAll: () => sessionCookies,
  set: (name, value) => { sessionCookies = [...sessionCookies.filter(c => c.name !== name), { name, value }]; },
}) } });
mock.module('../../src/lib/stripe.ts', { namedExports: { getStripe: () => ({
  customers: { create: async () => ({ id: 'cus_synthetic_never_sent_to_stripe' }) },
  checkout: { sessions: { create: async params => {
    checkoutPayload = params;
    return { id: 'cs_test_synthetic', url: 'https://checkout.stripe.com/c/pay/test_synthetic', amount_total: 1999, currency: 'usd' };
  } } },
}) } });
mock.module('../../src/lib/gtag-server.ts', { namedExports: { GA_MEASUREMENT_ID: 'G-FIXTURE', trackGA4Event: async () => true } });
const { GET: authenticate } = await import('../../src/app/auth/callback/route.ts');
const { GET: checkoutGet } = await import('../../src/app/api/checkout/route.ts');
const { POST: checkoutPost } = await import('../../src/app/api/create-checkout-session/route.ts');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const email = `qa-recovery-${randomUUID()}@resumegov.com`;
const created = await admin.auth.admin.createUser({ email, email_confirm: true, user_metadata: { qa: true } });
assert.ifError(created.error);
const id = created.data.user.id;
try {
  const resume = await admin.from('resumes').insert({ user_id: id, original_text: 'Synthetic QA fixture only.' }).select('id').single();
  assert.ifError(resume.error);
  const job = await admin.from('job_posts').insert({ user_id: id, original_text: 'Synthetic QA vacancy only.' }).select('id').single();
  assert.ifError(job.error);
  const analysis = await admin.from('analyses').insert({ user_id: id, resume_id: resume.data.id, job_post_id: job.data.id }).select('id').single();
  assert.ifError(analysis.error);

  const link = await admin.auth.admin.generateLink({ type: 'magiclink', email });
  assert.ifError(link.error);
  const params = new URLSearchParams({ token_hash: link.data.properties.hashed_token, type: 'email', next: '/upload?auth=success' });
  // No PKCE verifier and no cookies on the initial request, like another browser.
  const signed = await authenticate(new NextRequest(`http://localhost/auth/callback?${params}`));
  assert.equal(signed.headers.get('location'), 'http://localhost/upload?auth=success');
  sessionCookies = signed.cookies.getAll();
  assert.ok(sessionCookies.some(c => c.name.includes('auth-token')), 'Session must reach the browser');
  const cookie = sessionCookies.map(c => `${c.name}=${c.value}`).join('; ');
  for (const method of ['POST', 'GET']) {
    checkoutPayload = null;
    const endpoint = method === 'POST' ? 'create-checkout-session' : 'checkout';
    const request = new NextRequest(`http://localhost/api/${endpoint}?plan=analyst&analysisId=${analysis.data.id}`, {
      method, headers: { cookie, ...(method === 'POST' ? { 'content-type': 'application/json' } : {}) },
      ...(method === 'POST' ? { body: JSON.stringify({ plan: 'analyst', analysisId: analysis.data.id }) } : {}),
    });
    const result = await (method === 'POST' ? checkoutPost : checkoutGet)(request);
    assert.equal(result.status, method === 'POST' ? 200 : 307);
    assert.ok(checkoutPayload, 'Owned analysis must reach the mocked Stripe boundary');
    assert.equal(checkoutPayload.metadata.userId, id);
    assert.equal(checkoutPayload.metadata.analysisId, analysis.data.id);
  }

  checkoutPayload = null;
  const foreign = await checkoutPost(new NextRequest('http://localhost/api/create-checkout-session', {
    method: 'POST', headers: { cookie, 'content-type': 'application/json' },
    body: JSON.stringify({ plan: 'analyst', analysisId: randomUUID() }),
  }));
  assert.equal(foreign.status, 404);
  assert.equal(checkoutPayload, null);
  const replay = await authenticate(new NextRequest(`http://localhost/auth/callback?${params}`));
  assert.equal(new URL(replay.headers.get('location')).searchParams.get('error'), 'email_link_expired');
  console.log(JSON.stringify({ success: true, checks: ['cross-browser-email-login', 'redirect-session-cookie', 'GET-owned-checkout', 'POST-owned-checkout', 'ownership-rejection', 'used-token-rejection'], stripe: 'mocked; no live sessions or charges' }));
} finally {
  const deleted = await admin.auth.admin.deleteUser(id);
  assert.ifError(deleted.error);
  console.log('Synthetic QA account and fixture rows removed; customer data unchanged.');
}
