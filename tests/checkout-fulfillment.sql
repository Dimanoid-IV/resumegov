\set ON_ERROR_STOP on

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN CREATE ROLE service_role; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN CREATE ROLE anon; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN CREATE ROLE authenticated; END IF;
END $$;

CREATE TABLE public.users (
  id uuid PRIMARY KEY,
  email text NOT NULL,
  plan_type text NOT NULL DEFAULT 'free',
  credits_remaining integer NOT NULL DEFAULT 0
);

CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id),
  stripe_payment_id text NOT NULL UNIQUE,
  amount integer NOT NULL,
  status text NOT NULL
);

\ir ../supabase/migrations/011_atomic_checkout_fulfillment.sql

INSERT INTO public.users (id, email, plan_type, credits_remaining)
VALUES ('03fc12f7-f4b1-4d4f-98aa-59d502870db5', 'buyer@example.com', 'free', 3);

DO $$
DECLARE
  buyer uuid := '03fc12f7-f4b1-4d4f-98aa-59d502870db5';
  credits integer;
  plan text;
  payment_count integer;
BEGIN
  IF NOT public.fulfill_checkout_session('cs_test_single', buyer, 'single', 999) THEN
    RAISE EXCEPTION 'first paid session must grant one credit';
  END IF;
  IF public.fulfill_checkout_session('cs_test_single', buyer, 'single', 999) THEN
    RAISE EXCEPTION 'replayed session must not grant a second credit';
  END IF;

  SELECT plan_type, credits_remaining INTO plan, credits FROM public.users WHERE id = buyer;
  IF plan <> 'basic' OR credits <> 1 THEN
    RAISE EXCEPTION 'single purchase from free should produce basic plan and one credit';
  END IF;

  IF NOT public.fulfill_checkout_session('cs_test_analyst', buyer, 'analyst', 1999) THEN
    RAISE EXCEPTION 'a different session should be fulfilled';
  END IF;
  SELECT credits_remaining INTO credits FROM public.users WHERE id = buyer;
  IF credits <> 4 THEN
    RAISE EXCEPTION 'analyst purchase should add three credits';
  END IF;

  IF NOT public.fulfill_checkout_session('cs_test_professional', buyer, 'professional', 2900) THEN
    RAISE EXCEPTION 'subscription checkout should be fulfilled';
  END IF;
  SELECT plan_type, credits_remaining INTO plan, credits FROM public.users WHERE id = buyer;
  IF plan <> 'pro' OR credits <> -1 THEN
    RAISE EXCEPTION 'professional purchase should set unlimited credits';
  END IF;

  SELECT count(*) INTO payment_count FROM public.payments WHERE user_id = buyer;
  IF payment_count <> 3 THEN
    RAISE EXCEPTION 'one durable payment row is required per fulfilled session';
  END IF;
END $$;
