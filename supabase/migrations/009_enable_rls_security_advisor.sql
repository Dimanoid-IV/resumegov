-- Migration 009: Fix Security Advisor RLS errors
-- Re-enables RLS on all public tables (policies already exist but RLS was disabled).
-- Also hardens SECURITY DEFINER functions (search_path) and tightens permissive INSERT policies.

-- ─── 1. Enable RLS on all public application tables ───────────────────────────

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hallucination_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- ─── 2. Helper: is_admin() avoids recursive RLS on public.users ───────────────

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.users WHERE id = auth.uid()),
    FALSE
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- Replace recursive admin policies with is_admin() helper
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can update all payments" ON public.payments;
CREATE POLICY "Admins can update all payments" ON public.payments
    FOR UPDATE
    USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage hallucination flags" ON public.hallucination_flags;
CREATE POLICY "Admins can manage hallucination flags" ON public.hallucination_flags
    FOR ALL
    USING (public.is_admin());

-- ─── 3. Tighten overly permissive INSERT policies ─────────────────────────────
-- Signup uses SECURITY DEFINER trigger (bypasses RLS); no need for WITH CHECK (true).
-- System writes (Stripe webhook, usage logs) should use the service role key.

DROP POLICY IF EXISTS "Enable insert for new user signup" ON public.users;

DROP POLICY IF EXISTS "System can insert usage logs" ON public.ai_usage_logs;
CREATE POLICY "Users can insert own usage logs" ON public.ai_usage_logs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ─── 4. Fix handle_new_user search_path (Function Search Path Mutable warning) ─

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.users (id, email, plan_type, credits_remaining, free_analysis_count)
    VALUES (NEW.id, NEW.email, 'free', 3, 0)
    ON CONFLICT (id) DO UPDATE
        SET email = EXCLUDED.email
    WHERE public.users.id = EXCLUDED.id;
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        UPDATE public.users
        SET id = NEW.id
        WHERE email = NEW.email;
        RETURN NEW;
    WHEN OTHERS THEN
        RAISE WARNING 'handle_new_user: unexpected error % %', SQLSTATE, SQLERRM;
        RETURN NEW;
END;
$$;
