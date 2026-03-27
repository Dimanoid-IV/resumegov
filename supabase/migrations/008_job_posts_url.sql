-- Migration 008: Add job_url column to job_posts
-- Stores the optional USAJOBS vacancy announcement URL provided by the user

ALTER TABLE job_posts
  ADD COLUMN IF NOT EXISTS job_url TEXT;
