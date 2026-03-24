-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    stripe_customer_id TEXT,
    plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'basic', 'pro', 'enterprise')),
    credits_remaining INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resumes table
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    original_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job posts table
CREATE TABLE job_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    original_text TEXT NOT NULL,
    parsed_json JSONB DEFAULT '{}',
    gs_level TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analyses table
CREATE TABLE analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    job_post_id UUID NOT NULL REFERENCES job_posts(id) ON DELETE CASCADE,
    compatibility_score INTEGER CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
    keyword_score INTEGER CHECK (keyword_score >= 0 AND keyword_score <= 100),
    specialized_score INTEGER CHECK (specialized_score >= 0 AND specialized_score <= 100),
    compliance_score INTEGER CHECK (compliance_score >= 0 AND compliance_score <= 100),
    achievement_score INTEGER CHECK (achievement_score >= 0 AND achievement_score <= 100),
    word_count INTEGER,
    feedback_json JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optimizations table
CREATE TABLE optimizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
    compressed_resume_text TEXT NOT NULL,
    qualification_coverage_percent INTEGER CHECK (qualification_coverage_percent >= 0 AND qualification_coverage_percent <= 100),
    final_word_count INTEGER NOT NULL,
    ksa_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_payment_id TEXT NOT NULL UNIQUE,
    amount INTEGER NOT NULL, -- in cents
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_job_posts_user_id ON job_posts(user_id);
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_resume_id ON analyses(resume_id);
CREATE INDEX idx_analyses_job_post_id ON analyses(job_post_id);
CREATE INDEX idx_optimizations_analysis_id ON optimizations(analysis_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_stripe_payment_id ON payments(stripe_payment_id);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Resumes policies
CREATE POLICY "Users can CRUD own resumes" ON resumes
    FOR ALL USING (auth.uid() = user_id);

-- Job posts policies
CREATE POLICY "Users can CRUD own job posts" ON job_posts
    FOR ALL USING (auth.uid() = user_id);

-- Analyses policies
CREATE POLICY "Users can CRUD own analyses" ON analyses
    FOR ALL USING (auth.uid() = user_id);

-- Optimizations policies
CREATE POLICY "Users can view own optimizations" ON optimizations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM analyses 
            WHERE analyses.id = optimizations.analysis_id 
            AND analyses.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create own optimizations" ON optimizations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM analyses 
            WHERE analyses.id = optimizations.analysis_id 
            AND analyses.user_id = auth.uid()
        )
    );

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, plan_type, credits_remaining)
    VALUES (NEW.id, NEW.email, 'free', 3);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
