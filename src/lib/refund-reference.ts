type Reference = string | { id: string } | null | undefined;
type RefundLookup = {
  retrieveSession: (id: string) => Promise<{ payment_intent: Reference; invoice: Reference }>;
  retrieveInvoice: (id: string) => Promise<{ payments?: { data: { status: string; payment: { type: string; payment_intent?: Reference } }[] } }>;
};
function id(reference: Reference): string | null {
  return typeof reference === 'string' ? reference : reference?.id ?? null;
}
export async function resolveRefundPaymentIntent(lookup: RefundLookup, reference: string): Promise<string> {
  if (reference.startsWith('pi_')) return reference;
  if (!reference.startsWith('cs_')) throw new Error('Unsupported payment reference');
  const session = await lookup.retrieveSession(reference);
  const directIntent = id(session.payment_intent);
  if (directIntent) return directIntent;
  const invoiceId = id(session.invoice);
  if (invoiceId) {
    const invoice = await lookup.retrieveInvoice(invoiceId);
    const payment = invoice.payments?.data.find(p => p.status === 'paid' && p.payment.type === 'payment_intent');
    const invoiceIntent = id(payment?.payment.payment_intent);
    if (invoiceIntent) return invoiceIntent;
  }
  throw new Error('No refundable PaymentIntent was found for this order');
}
