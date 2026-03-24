-- Migration 005: Fix User Creation RLS Policy

-- Allow user creation via trigger during signup
DROP POLICY IF EXISTS "Enable insert for new user signup" ON public.users;

CREATE POLICY "Enable insert for new user signup" ON public.users
    FOR INSERT 
    WITH CHECK (true);

-- Ensure users can only view their own data
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE 
    USING (auth.uid() = id);
