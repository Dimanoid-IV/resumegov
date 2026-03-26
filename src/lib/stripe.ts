import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }
  if (!stripeInstance) {
    stripeInstance = new Stripe(key, {
      apiVersion: '2026-02-25.clover',
    });
  }
  return stripeInstance;
}

// Backwards compatibility
export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    return getStripe()[prop as keyof Stripe];
  },
});

type UserRow = Database['public']['Tables']['users']['Row'];

export const getStripeCustomerId = async (userId: string, email: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('users')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  if (error || !data) {
    throw new Error('User not found');
  }

  const user = data as Pick<UserRow, 'stripe_customer_id'>;

  if (user.stripe_customer_id) {
    return user.stripe_customer_id;
  }

  // Create new customer
  const customer = await getStripe().customers.create({
    email,
    metadata: {
      supabaseUserId: userId,
    },
  });

  // Save customer ID
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from('users')
    .update({ stripe_customer_id: customer.id })
    .eq('id', userId);

  return customer.id;
};
