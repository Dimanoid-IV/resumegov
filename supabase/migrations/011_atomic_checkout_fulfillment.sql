-- A Checkout session is the durable order identity. The payment row and credit
-- grant must commit together so a webhook retry can safely recover any failure.
CREATE OR REPLACE FUNCTION public.fulfill_checkout_session(
  p_session_id text,
  p_user_id uuid,
  p_plan text,
  p_amount integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_payment_id uuid;
  v_credits integer;
BEGIN
  IF left(p_session_id, 3) <> 'cs_' OR p_user_id IS NULL OR p_amount IS NULL OR p_amount < 0 THEN
    RAISE EXCEPTION 'Invalid checkout fulfillment input';
  END IF;

  v_credits := CASE p_plan
    WHEN 'single' THEN 1
    WHEN 'analyst' THEN 3
    WHEN 'professional' THEN -1
    ELSE NULL
  END;
  IF v_credits IS NULL THEN
    RAISE EXCEPTION 'Unknown checkout plan';
  END IF;

  INSERT INTO public.payments (user_id, stripe_payment_id, amount, status)
  VALUES (p_user_id, p_session_id, p_amount, 'completed')
  ON CONFLICT (stripe_payment_id) DO NOTHING
  RETURNING id INTO v_payment_id;

  IF v_payment_id IS NULL THEN
    RETURN false;
  END IF;

  UPDATE public.users
  SET plan_type = CASE
        WHEN credits_remaining = -1 OR p_plan = 'professional' THEN 'pro'
        ELSE 'basic'
      END,
      credits_remaining = CASE
        WHEN credits_remaining = -1 OR v_credits = -1 THEN -1
        WHEN plan_type = 'free' THEN v_credits
        ELSE coalesce(credits_remaining, 0) + v_credits
      END
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Checkout user profile not found';
  END IF;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.fulfill_checkout_session(text, uuid, text, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.fulfill_checkout_session(text, uuid, text, integer) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.fulfill_checkout_session(text, uuid, text, integer) TO service_role;
