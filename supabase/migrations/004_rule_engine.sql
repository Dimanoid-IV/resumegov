-- Migration 004: Rule Engine Lite Schema Updates

-- Add rule engine fields to analyses table
ALTER TABLE public.analyses 
ADD COLUMN IF NOT EXISTS word_count_original INTEGER,
ADD COLUMN IF NOT EXISTS word_count_final INTEGER,
ADD COLUMN IF NOT EXISTS coverage_original NUMERIC,
ADD COLUMN IF NOT EXISTS coverage_final NUMERIC,
ADD COLUMN IF NOT EXISTS compliance_score NUMERIC,
ADD COLUMN IF NOT EXISTS risk_level TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_analyses_risk_level ON public.analyses(risk_level);
CREATE INDEX IF NOT EXISTS idx_analyses_compliance_score ON public.analyses(compliance_score);
