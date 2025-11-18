-- =====================================================
-- ENABLE RLS POLICIES FOR USERS AND PROFILES
-- =====================================================
-- This migration enables Row Level Security on users, freelancer_profiles,
-- and client_profiles tables with appropriate policies

-- =====================================================
-- USERS TABLE RLS POLICIES
-- =====================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view user profiles" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Allow user creation during signup" ON users;

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all user profiles (public data)
CREATE POLICY "Anyone can view user profiles"
  ON users FOR SELECT
  USING (true);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Users can view their own full profile (including private data)
-- Note: The above SELECT policy already covers this, but keeping for clarity
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Policy: Allow inserting users during signup
-- During signup, auth.uid() might not match yet, so we allow inserts
-- and rely on the application logic to ensure correct user_id
CREATE POLICY "Allow user creation during signup"
  ON users FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- FREELANCER_PROFILES TABLE RLS POLICIES
-- =====================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view freelancer profiles" ON freelancer_profiles;
DROP POLICY IF EXISTS "Freelancers can insert their own profile" ON freelancer_profiles;
DROP POLICY IF EXISTS "Freelancers can update their own profile" ON freelancer_profiles;
DROP POLICY IF EXISTS "Freelancers can delete their own profile" ON freelancer_profiles;

-- Enable RLS on freelancer_profiles table
ALTER TABLE freelancer_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view freelancer profiles (for browse/search)
CREATE POLICY "Anyone can view freelancer profiles"
  ON freelancer_profiles FOR SELECT
  USING (true);

-- Policy: Freelancers can insert their own profile
CREATE POLICY "Freelancers can insert their own profile"
  ON freelancer_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Freelancers can update their own profile
CREATE POLICY "Freelancers can update their own profile"
  ON freelancer_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Freelancers can delete their own profile
CREATE POLICY "Freelancers can delete their own profile"
  ON freelancer_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- CLIENT_PROFILES TABLE RLS POLICIES
-- =====================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view client profiles" ON client_profiles;
DROP POLICY IF EXISTS "Clients can insert their own profile" ON client_profiles;
DROP POLICY IF EXISTS "Clients can update their own profile" ON client_profiles;
DROP POLICY IF EXISTS "Clients can delete their own profile" ON client_profiles;

-- Enable RLS on client_profiles table
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view client profiles (for project owners)
CREATE POLICY "Anyone can view client profiles"
  ON client_profiles FOR SELECT
  USING (true);

-- Policy: Clients can insert their own profile
CREATE POLICY "Clients can insert their own profile"
  ON client_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Clients can update their own profile
CREATE POLICY "Clients can update their own profile"
  ON client_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Clients can delete their own profile
CREATE POLICY "Clients can delete their own profile"
  ON client_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- NOTES
-- =====================================================
-- 1. All profiles are publicly viewable for discovery/browse features
-- 2. Users can only modify their own profiles
-- 3. auth.uid() will work correctly now that we're using Supabase Auth
-- 4. If you need to hide certain profile fields from public view,
--    you can create database views that expose only public fields
