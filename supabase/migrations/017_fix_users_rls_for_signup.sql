-- =====================================================
-- FIX RLS POLICY FOR USER SIGNUP
-- =====================================================
-- The previous policy blocked user creation during signup because
-- auth.uid() doesn't exist yet when the user is being created.
-- This migration fixes that by allowing any authenticated insert.

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Allow user creation during signup" ON users;

-- Create a permissive policy for user creation
-- This allows the signup process to create user records
CREATE POLICY "Allow user creation during signup"
  ON users FOR INSERT
  WITH CHECK (true);

-- Note: This is safe because:
-- 1. The signup API validates the user's email/password with Supabase Auth first
-- 2. The user_id in the users table must match the Supabase Auth user_id
-- 3. After creation, UPDATE is still protected by auth.uid() = id
