import assert from 'node:assert/strict';
import test from 'node:test';
import { checkoutPath, loginPathForCheckout, safePostLoginPath } from '../src/lib/checkout-flow.ts';

test('selected plan survives an unauthenticated checkout redirect', () => {
  assert.equal(checkoutPath('single'), '/api/checkout?plan=single');
  assert.equal(
    loginPathForCheckout('single'),
    '/login?next=%2Fapi%2Fcheckout%3Fplan%3Dsingle',
  );
  assert.equal(
    safePostLoginPath('/api/checkout?plan=single'),
    '/api/checkout?plan=single',
  );
});

test('checkout return path keeps an owned analysis identifier', () => {
  const analysisId = '03fc12f7-f4b1-4d4f-98aa-59d502870db5';
  assert.equal(
    safePostLoginPath(`/api/checkout?plan=analyst&analysisId=${analysisId}`),
    `/api/checkout?plan=analyst&analysisId=${analysisId}`,
  );
});

test('post-login redirects reject external or unexpected destinations', () => {
  for (const input of ['//evil.example', 'https://evil.example', '/api/checkout?plan=unknown', '/admin']) {
    assert.equal(safePostLoginPath(input), '/dashboard');
  }
});
