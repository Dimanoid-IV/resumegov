import assert from 'node:assert/strict';
import {test} from 'node:test';
import {resolveRefundPaymentIntent} from '../src/lib/refund-reference.ts';
test('refund resolves a durable Checkout reference to the actual PaymentIntent',async()=>{
  const id=await resolveRefundPaymentIntent({retrieveSession:async()=>({payment_intent:'pi_paid',invoice:null}),retrieveInvoice:async()=>{throw Error('not an invoice');}},'cs_paid');
  assert.equal(id,'pi_paid');
});
test('refund preserves support for historical PaymentIntent references',async()=>{
  const id=await resolveRefundPaymentIntent({retrieveSession:async()=>{throw Error('unexpected');},retrieveInvoice:async()=>{throw Error('unexpected');}},'pi_legacy');
  assert.equal(id,'pi_legacy');
});
test('subscription checkout resolves its paid invoice PaymentIntent',async()=>{
  const id=await resolveRefundPaymentIntent({retrieveSession:async()=>({payment_intent:null,invoice:'in_paid'}),retrieveInvoice:async()=>({payments:{data:[{status:'paid',payment:{type:'payment_intent',payment_intent:'pi_invoice'}}]}})},'cs_subscription');
  assert.equal(id,'pi_invoice');
});
