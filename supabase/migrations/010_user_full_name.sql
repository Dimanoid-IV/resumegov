-- Store an optional display name for admin reporting and future account UX.
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Recover names already present in Supabase Auth metadata, when available.
UPDATE public.users AS profile
SET full_name = NULLIF(BTRIM(COALESCE(
    auth_user.raw_user_meta_data ->> 'full_name',
    auth_user.raw_user_meta_data ->> 'name',
    ''
)), '')
FROM auth.users AS auth_user
WHERE profile.id = auth_user.id
  AND profile.full_name IS NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    submitted_name TEXT := NULLIF(BTRIM(COALESCE(
        NEW.raw_user_meta_data ->> 'full_name',
        NEW.raw_user_meta_data ->> 'name',
        ''
    )), '');
BEGIN
    INSERT INTO public.users (
        id,
        email,
        full_name,
        plan_type,
        credits_remaining,
        free_analysis_count
    )
    VALUES (NEW.id, NEW.email, submitted_name, 'free', 3, 0)
    ON CONFLICT (id) DO UPDATE
        SET email = EXCLUDED.email,
            full_name = COALESCE(public.users.full_name, EXCLUDED.full_name)
    WHERE public.users.id = EXCLUDED.id;
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        UPDATE public.users
        SET id = NEW.id,
            full_name = COALESCE(public.users.full_name, submitted_name)
        WHERE email = NEW.email;
        RETURN NEW;
    WHEN OTHERS THEN
        RAISE WARNING 'handle_new_user: unexpected error % %', SQLSTATE, SQLERRM;
        RETURN NEW;
END;
$$;
