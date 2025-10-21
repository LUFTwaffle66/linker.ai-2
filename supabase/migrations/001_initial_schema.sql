-- =============================================
-- LinkerAI Authentication Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. USERS TABLE
-- =============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,

  -- Role-based authentication (primary role)
  role VARCHAR(20) NOT NULL DEFAULT 'freelancer'
    CHECK (role IN ('admin', 'client', 'freelancer')),

  company_name VARCHAR(255),
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  phone VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  is_banned BOOLEAN DEFAULT FALSE,
  banned_reason TEXT,
  banned_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- =============================================
-- 2. AUTO-UPDATE TIMESTAMP FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- =============================================

-- Disable RLS for custom authentication
-- We're using Better Auth, not Supabase Auth, so we handle auth at the application layer
-- RLS is disabled to prevent infinite recursion with auth.uid()
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- =============================================
-- 4. SEED ADMIN USER (OPTIONAL)
-- =============================================
-- Default password: 'admin123' (bcrypt hash)
-- IMPORTANT: Change this in production!
INSERT INTO users (email, password_hash, full_name, role, email_verified)
VALUES (
  'admin@linkerai.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- 'password'
  'Admin User',
  'admin',
  true
);

-- =============================================
-- 5. HELPER FUNCTIONS
-- =============================================

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION user_has_role(user_id UUID, required_role VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = user_id
    AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS VARCHAR AS $$
DECLARE
  user_role VARCHAR;
BEGIN
  SELECT role INTO user_role
  FROM users
  WHERE id = user_id;

  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
