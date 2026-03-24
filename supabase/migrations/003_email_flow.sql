-- Track free analyses for email-first onboarding flow
ALTER TABLE users ADD COLUMN IF NOT EXISTS free_analysis_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_free_analysis_at TIMESTAMPTZ;

-- Update handle_new_user to initialize new columns
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, plan_type, credits_remaining, free_analysis_count)
    VALUES (NEW.id, NEW.email, 'free', 3, 0)
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
