import assert from 'node:assert/strict';
import test from 'node:test';
import { paidCheckoutSession, subscriptionGrantsAccess, creditsAfterSubscriptionEnd } from '../src/lib/checkout-events.ts';

const paidSession = {
  id: 'cs_test_paid',
  payment_status: 'paid',
  amount_total: 999,
  currency: 'usd',
  metadata: { userId: '03fc12f7-f4b1-4d4f-98aa-59d502870db5', plan: 'single' },
};

test('fulfills a confirmed Checkout session', () => {
  assert.equal(paidCheckoutSession('checkout.session.completed', paidSession)?.id, 'cs_test_paid');
});

test('only an active paid subscription grants unlimited access', () => {
  assert.equal(subscriptionGrantsAccess('active'), true);
  assert.equal(subscriptionGrantsAccess('incomplete'), false);
  assert.equal(subscriptionGrantsAccess('past_due'), false);
  assert.equal(subscriptionGrantsAccess('canceled'), false);
});

test('subscription end removes unlimited access without erasing finite credits', () => {
  assert.equal(creditsAfterSubscriptionEnd(-1), 0);
  assert.equal(creditsAfterSubscriptionEnd(2), 2);
});

test('waits for asynchronous payment success before fulfillment', () => {
  const unpaid = { ...paidSession, payment_status: 'unpaid' };
  assert.equal(paidCheckoutSession('checkout.session.completed', unpaid), null);
  assert.equal(paidCheckoutSession('checkout.session.async_payment_succeeded', paidSession)?.id, 'cs_test_paid');
});

test('does not fulfill on a PaymentIntent event or unknown plan', () => {
  assert.equal(paidCheckoutSession('payment_intent.succeeded', paidSession), null);
  assert.equal(paidCheckoutSession('checkout.session.completed', { ...paidSession, metadata: { ...paidSession.metadata, plan: 'other' } }), null);
});
