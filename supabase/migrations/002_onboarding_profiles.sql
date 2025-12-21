-- =============================================
-- LinkerAI Onboarding Profiles Schema
-- =============================================

-- =============================================
-- 1. CLIENT PROFILES TABLE
-- =============================================
CREATE TABLE client_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Profile Information
  profile_image TEXT,
  location VARCHAR(255),

  -- Company Information
  website VARCHAR(500),
  industry VARCHAR(100),
  company_size VARCHAR(50),
  about_company TEXT,

  -- Project Goals
  project_goals TEXT[], -- Array of goal strings
  project_description TEXT,

  -- Budget & Timeline
  budget_range VARCHAR(20) CHECK (budget_range IN ('small', 'medium', 'large', 'enterprise')),
  timeline VARCHAR(20) CHECK (timeline IN ('urgent', 'short', 'medium', 'long')),

  -- Metadata
  onboarding_completed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for client_profiles
CREATE INDEX idx_client_profiles_user_id ON client_profiles(user_id);
CREATE INDEX idx_client_profiles_industry ON client_profiles(industry);
CREATE INDEX idx_client_profiles_budget ON client_profiles(budget_range);

-- Trigger for client_profiles updated_at
CREATE TRIGGER update_client_profiles_updated_at
  BEFORE UPDATE ON client_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 2. FREELANCER PROFILES TABLE
-- =============================================
CREATE TABLE freelancer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Profile Information
  profile_image TEXT,
  title VARCHAR(255), -- Professional title
  location VARCHAR(255),

  -- Professional Info
  bio TEXT,
  experience INT, -- Years of experience

  -- Skills
  skills TEXT[], -- Array of skill strings

  -- Portfolio (first item from onboarding)
  portfolio_title VARCHAR(255),
  portfolio_description TEXT,
  portfolio_tags TEXT[],
  portfolio_image TEXT,

  -- Rate
  hourly_rate DECIMAL(10, 2),

  -- Metadata
  onboarding_completed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for freelancer_profiles
CREATE INDEX idx_freelancer_profiles_user_id ON freelancer_profiles(user_id);
CREATE INDEX idx_freelancer_profiles_skills ON freelancer_profiles USING GIN(skills);
CREATE INDEX idx_freelancer_profiles_hourly_rate ON freelancer_profiles(hourly_rate);

-- Trigger for freelancer_profiles updated_at
CREATE TRIGGER update_freelancer_profiles_updated_at
  BEFORE UPDATE ON freelancer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 3. ROW LEVEL SECURITY
-- =============================================

-- Disable RLS for now (we handle auth at application layer)
ALTER TABLE client_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE freelancer_profiles DISABLE ROW LEVEL SECURITY;

-- =============================================
-- 4. HELPER FUNCTIONS
-- =============================================

-- Function to get client profile by user_id
CREATE OR REPLACE FUNCTION get_client_profile(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  profile_image TEXT,
  location VARCHAR,
  website VARCHAR,
  industry VARCHAR,
  company_size VARCHAR,
  about_company TEXT,
  project_goals TEXT[],
  project_description TEXT,
  budget_range VARCHAR,
  timeline VARCHAR,
  onboarding_completed BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cp.id, cp.user_id, cp.profile_image, cp.location, cp.website,
    cp.industry, cp.company_size, cp.about_company, cp.project_goals,
    cp.project_description, cp.budget_range, cp.timeline,
    cp.onboarding_completed, cp.created_at, cp.updated_at
  FROM client_profiles cp
  WHERE cp.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get freelancer profile by user_id
CREATE OR REPLACE FUNCTION get_freelancer_profile(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  profile_image TEXT,
  title VARCHAR,
  location VARCHAR,
  bio TEXT,
  experience INT,
  skills TEXT[],
  portfolio_title VARCHAR,
  portfolio_description TEXT,
  portfolio_tags TEXT[],
  portfolio_image TEXT,
  hourly_rate DECIMAL,
  onboarding_completed BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    fp.id, fp.user_id, fp.profile_image, fp.title, fp.location,
    fp.bio, fp.experience, fp.skills, fp.portfolio_title,
    fp.portfolio_description, fp.portfolio_tags, fp.portfolio_image,
    fp.hourly_rate, fp.onboarding_completed, fp.created_at, fp.updated_at
  FROM freelancer_profiles fp
  WHERE fp.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
