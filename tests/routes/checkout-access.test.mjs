import assert from 'node:assert/strict';
import { mock, test } from 'node:test';

const buyer = '03fc12f7-f4b1-4d4f-98aa-59d502870db5';
const ownId = '60b8e85b-8b3a-466d-a46c-c437ac346c41';
const otherId = '3bb8c411-ad3c-499b-a3f5-0768190dadf4';
let authenticated = true;
let databaseError = false;
let sessions = [];

function database(server) {
  return {
    auth: { getUser: async () => ({ data: { user: authenticated ? { id: buyer } : null }, error: null }) },
    from(table) {
      const filters = {};
      const query = {
        select() { return query; },
        eq(key, value) { filters[key] = value; return query; },
        async maybeSingle() {
          // Reproduces production: the session-bound read hides even an owned row.
          if (!server) return { data: null, error: null };
          if (databaseError) return { data: null, error: { code: '08006' } };
          return { data: table === 'analyses' && filters.id === ownId && filters.user_id === buyer ? { id: ownId } : null, error: null };
        },
        async single() { return { data: { stripe_customer_id: 'cus_fixture', email: 'qa@example.test' }, error: null }; },
      };
      return query;
    },
  };
}

mock.module('../../src/lib/supabase/server.ts', { namedExports: { createClient: async () => database(false) } });
mock.module('../../src/lib/supabase/admin.ts', { namedExports: { createAdminClient: () => database(true) } });
mock.module('../../src/lib/billing-env.ts', { namedExports: { getBillingConfig: () => ({ siteUrl: 'http://localhost', singlePriceId: 'price_single', analystPriceId: 'price_pack', professionalPriceId: 'price_monthly' }) } });
mock.module('../../src/lib/stripe.ts', { namedExports: { getStripe: () => ({
  checkout: { sessions: { create: async params => { sessions.push(params); return { id: 'cs_test_fixture', url: 'https://checkout.stripe.com/c/pay/test_fixture', amount_total: 1999, currency: 'usd' }; } } },
  customers: { create: async () => { throw new Error('Existing customer must be reused'); } },
}) } });
mock.module('../../src/lib/gtag-server.ts', { namedExports: { GA_MEASUREMENT_ID: 'G-FIXTURE', trackGA4Event: async () => true } });

const { POST } = await import('../../src/app/api/create-checkout-session/route.ts');
const { GET } = await import('../../src/app/api/checkout/route.ts');
function request(method, id = ownId) {
  const url = `http://localhost/api/${method === 'GET' ? 'checkout' : 'create-checkout-session'}?plan=analyst&analysisId=${id}`;
  const r = new Request(url, method === 'POST' ? { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ plan: 'analyst', analysisId: id }) } : undefined);
  Object.defineProperty(r, 'nextUrl', { value: new URL(url) });
  Object.defineProperty(r, 'cookies', { value: { get: () => undefined, getAll: () => [] } });
  return r;
}

for (const [method, handler] of [['POST', POST], ['GET', GET]]) {
  test(`${method} checkout accepts an owned analysis even when the session-bound query hides it`, async () => {
    authenticated = true; databaseError = false; sessions = [];
    const response = await handler(request(method));
    if (method === 'POST') { assert.equal(response.status, 200); assert.match((await response.json()).url, /^https:\/\/checkout\.stripe\.com\//); }
    else { assert.equal(response.headers.get('location'), 'https://checkout.stripe.com/c/pay/test_fixture'); }
    assert.equal(sessions.length, 1);
    assert.equal(sessions[0].metadata.userId, buyer);
    assert.equal(sessions[0].metadata.analysisId, ownId);
    assert.match(sessions[0].success_url, /analysisId=60b8e85b-8b3a-466d-a46c-c437ac346c41/);
    assert.deepEqual(sessions[0].line_items, [{ price: 'price_pack', quantity: 1 }]);
  });

  test(`${method} checkout never creates a session for someone else's or a missing analysis`, async () => {
    authenticated = true; databaseError = false; sessions = [];
    const response = await handler(request(method, otherId));
    assert.equal(sessions.length, 0);
    if (method === 'POST') assert.equal(response.status, 404);
    else assert.equal(response.headers.get('location'), 'http://localhost/dashboard?error=analysis_not_found');
  });

  test(`${method} checkout does not treat a database outage as a missing analysis`, async () => {
    authenticated = true; databaseError = true; sessions = [];
    const response = await handler(request(method));
    assert.equal(sessions.length, 0);
    if (method === 'POST') assert.equal(response.status, 503);
    else assert.equal(response.headers.get('location'), 'http://localhost/dashboard?error=checkout_unavailable');
  });

  test(`${method} checkout still requires authentication`, async () => {
    authenticated = false; databaseError = false; sessions = [];
    const response = await handler(request(method));
    assert.equal(sessions.length, 0);
    if (method === 'POST') assert.equal(response.status, 401);
    else assert.match(response.headers.get('location'), /^http:\/\/localhost\/login\?next=/);
  });
}
