-- Migration 007: Fix handle_new_user trigger to handle existing users gracefully
-- Problem: OTP sign-in for existing users causes "Database error saving new user"
-- because the trigger fires again and hits a UNIQUE constraint on email.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, plan_type, credits_remaining, free_analysis_count)
    VALUES (NEW.id, NEW.email, 'free', 3, 0)
    ON CONFLICT (id) DO UPDATE
        SET email = EXCLUDED.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
