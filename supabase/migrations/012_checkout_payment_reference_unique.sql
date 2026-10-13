-- Legacy databases created through the dashboard may lack the UNIQUE constraint
-- declared in 001. Checkout fulfillment requires it for ON CONFLICT and replay safety.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_attribute a
      ON a.attrelid = c.conrelid AND a.attname = 'stripe_payment_id'
    WHERE c.conrelid = 'public.payments'::regclass
      AND c.contype = 'u'
      AND c.conkey = ARRAY[a.attnum]::smallint[]
  ) THEN
    ALTER TABLE public.payments
      ADD CONSTRAINT payments_stripe_payment_id_key UNIQUE (stripe_payment_id);
  END IF;
END;
$$;
COMMIT;
