-- Migration 007: Fix handle_new_user trigger to handle existing users gracefully
-- Problem: OTP sign-in for existing users causes "Database error saving new user"
-- because the trigger fires again and hits a UNIQUE constraint on id or email.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, plan_type, credits_remaining, free_analysis_count)
    VALUES (NEW.id, NEW.email, 'free', 3, 0)
    ON CONFLICT (id) DO UPDATE
        SET email = EXCLUDED.email
    WHERE public.users.id = EXCLUDED.id;
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- Email unique constraint: update existing row by email
        UPDATE public.users
        SET id = NEW.id
        WHERE email = NEW.email;
        RETURN NEW;
    WHEN OTHERS THEN
        -- Any other error: log and continue without crashing auth
        RAISE WARNING 'handle_new_user: unexpected error % %', SQLSTATE, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
