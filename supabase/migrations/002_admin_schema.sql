-- Add is_admin flag to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Hallucination flags table for admin review
CREATE TABLE IF NOT EXISTS hallucination_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    optimization_id UUID REFERENCES optimizations(id) ON DELETE SET NULL,
    analysis_id UUID REFERENCES analyses(id) ON DELETE SET NULL,
    flagged_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    flag_type TEXT NOT NULL CHECK (flag_type IN (
        'hallucinated_job',
        'fabricated_metric',
        'wrong_gs_level',
        'wrong_qualification',
        'inaccurate_score',
        'other'
    )),
    notes TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_hallucination_flags_optimization_id ON hallucination_flags(optimization_id);
CREATE INDEX IF NOT EXISTS idx_hallucination_flags_analysis_id ON hallucination_flags(analysis_id);
CREATE INDEX IF NOT EXISTS idx_hallucination_flags_flagged_by ON hallucination_flags(flagged_by);

-- Enable RLS
ALTER TABLE hallucination_flags ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write hallucination flags
-- (Admin API routes use service role key which bypasses RLS, but this protects direct access)
CREATE POLICY "Admins can manage hallucination flags" ON hallucination_flags
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Allow admins to view all users
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        auth.uid() = id OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Allow admins to update all payments (for refunds)
CREATE POLICY "Admins can update all payments" ON payments
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = TRUE)
    );
