import assert from 'node:assert/strict';
import { mock, test } from 'node:test';

let verified = [];
let exchanges = [];
let otpError = null;
let codeError = null;
mock.module('next/headers', { namedExports: { cookies: async () => ({ getAll: () => [], set() {} }) } });
mock.module('@supabase/ssr', { namedExports: { createServerClient: (_url, _key, options) => ({ auth: {
  verifyOtp: async params => {
    verified.push(params);
    if (!otpError) options.cookies.setAll([{ name: 'sb-qa-auth-token', value: 'fixture-session', options: { path: '/', httpOnly: true, sameSite: 'lax' } }]);
    return { data: { session: otpError ? null : { access_token: 'fixture-session' } }, error: otpError };
  },
  exchangeCodeForSession: async code => { exchanges.push(code); return { data: { session: codeError ? null : {} }, error: codeError }; },
} }) } });
const { GET } = await import('../../src/app/auth/callback/route.ts');
function request(query) {
  const r = new Request(`http://localhost/auth/callback?${query}`);
  Object.defineProperty(r, 'cookies', { value: { getAll: () => [] } });
  return r;
}
function reset() { verified = []; exchanges = []; otpError = null; codeError = null; }

test('email token hash signs in without a browser PKCE verifier and sets the session on the redirect', async () => {
  reset();
  const response = await GET(request('token_hash=fixture_hash&type=email&next=%2Fupload%3Fauth%3Dsuccess'));
  assert.equal(response.headers.get('location'), 'http://localhost/upload?auth=success');
  assert.match(response.headers.get('set-cookie') || '', /sb-qa-auth-token=fixture-session/);
  assert.deepEqual(verified, [{ token_hash: 'fixture_hash', type: 'email' }]);
  assert.deepEqual(exchanges, []);
});

test('email login preserves the selected checkout and owned analysis reference', async () => {
  reset();
  const response = await GET(request('token_hash=fixture_hash&type=email&next=%2Fapi%2Fcheckout%3Fplan%3Dsingle%26analysisId%3D03fc12f7-f4b1-4d4f-98aa-59d502870db5'));
  assert.equal(response.headers.get('location'), 'http://localhost/api/checkout?plan=single&analysisId=03fc12f7-f4b1-4d4f-98aa-59d502870db5');
});

test('expired email links return a usable retry destination without exposing the token or raw provider error', async () => {
  reset(); otpError = { code: 'otp_expired', message: 'Provider details fixture_hash' };
  const response = await GET(request('token_hash=fixture_hash&type=email&next=%2Fapi%2Fcheckout%3Fplan%3Dsingle'));
  const location = new URL(response.headers.get('location'));
  assert.equal(location.pathname, '/login');
  assert.equal(location.searchParams.get('next'), '/api/checkout?plan=single');
  assert.equal(location.searchParams.get('error'), 'email_link_expired');
  assert.doesNotMatch(location.href, /fixture_hash|Provider/);
});

test('old PKCE links remain supported and a missing verifier has a recoverable message', async () => {
  reset();
  let response = await GET(request('code=legacy&next=%2Fdashboard'));
  assert.equal(response.headers.get('location'), 'http://localhost/dashboard');
  assert.deepEqual(exchanges, ['legacy']);
  codeError = { code: 'flow_state_not_found', message: 'PKCE code verifier not found in storage' };
  response = await GET(request('code=legacy&next=%2Fupload%3Fauth%3Dsuccess'));
  assert.equal(new URL(response.headers.get('location')).searchParams.get('error'), 'email_link_browser');
});

test('callback rejects external, API, and malformed redirect destinations', async () => {
  reset();
  for (const next of ['//evil.example', 'https://evil.example', '/admin', '/api/checkout?plan=unknown', '/api/admin/refund', '/\\evil.example']) {
    const response = await GET(request(`code=legacy&next=${encodeURIComponent(next)}`));
    assert.equal(response.headers.get('location'), 'http://localhost/upload');
  }
});

test('recovery links still return to password recovery and invalid token types are never verified', async () => {
  reset();
  let response = await GET(request('code=legacy&type=recovery'));
  assert.equal(response.headers.get('location'), 'http://localhost/reset-password?recovered=1');
  response = await GET(request('token_hash=fixture_hash&type=sms'));
  assert.deepEqual(verified, []);
  assert.equal(new URL(response.headers.get('location')).pathname, '/start');
});
