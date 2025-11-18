-- Migration: Add Full-Text Search for Projects and Freelancers
-- Description: Adds tsvector columns and indexes for efficient full-text search
-- Date: 2024-10-29

-- ============================================================================
-- PROJECTS FULL-TEXT SEARCH
-- ============================================================================

-- Add tsvector column to projects table for full-text search
ALTER TABLE projects ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create a function to update the search vector for projects
CREATE OR REPLACE FUNCTION projects_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.skills, ' '), '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update search vector on insert/update
DROP TRIGGER IF EXISTS projects_search_vector_trigger ON projects;
CREATE TRIGGER projects_search_vector_trigger
  BEFORE INSERT OR UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION projects_search_vector_update();

-- Create GIN index for fast full-text search on projects
CREATE INDEX IF NOT EXISTS projects_search_vector_idx
  ON projects USING GIN(search_vector);

-- Update existing rows with search vectors
UPDATE projects SET search_vector =
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(category, '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(array_to_string(skills, ' '), '')), 'B');

-- ============================================================================
-- FREELANCER PROFILES FULL-TEXT SEARCH
-- ============================================================================

-- Add tsvector column to freelancer_profiles table for full-text search
ALTER TABLE freelancer_profiles ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create a function to update the search vector for freelancer profiles
CREATE OR REPLACE FUNCTION freelancer_profiles_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.bio, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.skills, ' '), '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.location, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update search vector on insert/update
DROP TRIGGER IF EXISTS freelancer_profiles_search_vector_trigger ON freelancer_profiles;
CREATE TRIGGER freelancer_profiles_search_vector_trigger
  BEFORE INSERT OR UPDATE ON freelancer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION freelancer_profiles_search_vector_update();

-- Create GIN index for fast full-text search on freelancer profiles
CREATE INDEX IF NOT EXISTS freelancer_profiles_search_vector_idx
  ON freelancer_profiles USING GIN(search_vector);

-- Update existing rows with search vectors
UPDATE freelancer_profiles SET search_vector =
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(bio, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(array_to_string(skills, ' '), '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(location, '')), 'C');

-- ============================================================================
-- HELPER FUNCTIONS FOR SEARCH
-- ============================================================================

-- Function to search projects with ranking
CREATE OR REPLACE FUNCTION search_projects(search_query TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  fixed_budget NUMERIC,
  skills TEXT[],
  status TEXT,
  client_id UUID,
  created_at TIMESTAMPTZ,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.title,
    p.description,
    p.category,
    p.fixed_budget,
    p.skills,
    p.status,
    p.client_id,
    p.created_at,
    ts_rank(p.search_vector, websearch_to_tsquery('english', search_query)) as rank
  FROM projects p
  WHERE p.search_vector @@ websearch_to_tsquery('english', search_query)
  ORDER BY rank DESC, p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to search freelancers with ranking
CREATE OR REPLACE FUNCTION search_freelancers(search_query TEXT)
RETURNS TABLE (
  user_id UUID,
  title TEXT,
  bio TEXT,
  skills TEXT[],
  location TEXT,
  experience INTEGER,
  hourly_rate NUMERIC,
  created_at TIMESTAMPTZ,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    fp.user_id,
    fp.title,
    fp.bio,
    fp.skills,
    fp.location,
    fp.experience,
    fp.hourly_rate,
    fp.created_at,
    ts_rank(fp.search_vector, websearch_to_tsquery('english', search_query)) as rank
  FROM freelancer_profiles fp
  WHERE fp.search_vector @@ websearch_to_tsquery('english', search_query)
  ORDER BY rank DESC, fp.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON COLUMN projects.search_vector IS 'Full-text search vector for projects (auto-updated)';
COMMENT ON COLUMN freelancer_profiles.search_vector IS 'Full-text search vector for freelancer profiles (auto-updated)';
COMMENT ON FUNCTION projects_search_vector_update() IS 'Automatically updates search vector for projects on insert/update';
COMMENT ON FUNCTION freelancer_profiles_search_vector_update() IS 'Automatically updates search vector for freelancer profiles on insert/update';
COMMENT ON FUNCTION search_projects(TEXT) IS 'Search projects with relevance ranking and typo tolerance';
COMMENT ON FUNCTION search_freelancers(TEXT) IS 'Search freelancers with relevance ranking and typo tolerance';
