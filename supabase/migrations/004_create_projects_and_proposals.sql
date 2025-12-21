-- Migration: Create projects and proposals tables
-- Description: Creates tables for project posting and proposal submission with fixed-price budgeting

-- =============================================
-- Table: projects
-- Description: Stores all project postings (fixed-price, remote-only)
-- =============================================
CREATE TABLE IF NOT EXISTS projects (
  -- Primary identifier
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign key to client
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Project details
  title VARCHAR(500) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  skills TEXT[] NOT NULL,

  -- Budget and timeline (fixed-price only)
  fixed_budget DECIMAL(12, 2) NOT NULL CHECK (fixed_budget >= 0),
  timeline VARCHAR(50) NOT NULL,

  -- Attachments and invitations
  attachments JSONB DEFAULT '[]'::jsonb,
  invited_freelancers UUID[],

  -- Status and metadata
  status VARCHAR(30) DEFAULT 'open' CHECK (status IN ('draft', 'open', 'in_progress', 'completed', 'cancelled')),
  proposal_count INTEGER DEFAULT 0 CHECK (proposal_count >= 0),
  hired_freelancer_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Visibility flags
  is_published BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

-- Index for better query performance
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_is_published ON projects(is_published);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_skills ON projects USING GIN(skills);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at_trigger
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_projects_updated_at();

-- Trigger to set published_at when is_published changes to true
CREATE OR REPLACE FUNCTION set_project_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_published = TRUE AND (OLD.is_published = FALSE OR OLD.published_at IS NULL) THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER project_published_at_trigger
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION set_project_published_at();

-- =============================================
-- Table: proposals
-- Description: Stores freelancer proposals for projects (fixed-price only)
-- =============================================
CREATE TABLE IF NOT EXISTS proposals (
  -- Primary identifier
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign keys
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Proposal details
  cover_letter TEXT NOT NULL,
  total_budget DECIMAL(10, 2) NOT NULL CHECK (total_budget >= 0),
  timeline VARCHAR(100) NOT NULL,

  -- Status and visibility
  status VARCHAR(20) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'shortlisted', 'accepted', 'rejected', 'withdrawn')),
  viewed_by_client BOOLEAN NOT NULL DEFAULT FALSE,

  -- Client feedback
  client_feedback TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  UNIQUE(project_id, freelancer_id) -- One proposal per freelancer per project
);

-- Indexes for better query performance
CREATE INDEX idx_proposals_project_id ON proposals(project_id);
CREATE INDEX idx_proposals_freelancer_id ON proposals(freelancer_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_created_at ON proposals(created_at DESC);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_proposals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER proposals_updated_at_trigger
  BEFORE UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_proposals_updated_at();

-- Trigger to increment proposal_count on projects table
CREATE OR REPLACE FUNCTION increment_project_proposal_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects
  SET proposal_count = proposal_count + 1
  WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER proposal_count_increment_trigger
  AFTER INSERT ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION increment_project_proposal_count();

-- Trigger to decrement proposal_count when proposal is deleted
CREATE OR REPLACE FUNCTION decrement_project_proposal_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects
  SET proposal_count = GREATEST(0, proposal_count - 1)
  WHERE id = OLD.project_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER proposal_count_decrement_trigger
  AFTER DELETE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION decrement_project_proposal_count();

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published projects
CREATE POLICY "Anyone can view published projects"
  ON projects FOR SELECT
  USING (is_published = TRUE);

-- Policy: Clients can view their own projects (including drafts)
CREATE POLICY "Clients can view their own projects"
  ON projects FOR SELECT
  USING (client_id = auth.uid());

-- Policy: Clients can insert their own projects
CREATE POLICY "Clients can create projects"
  ON projects FOR INSERT
  WITH CHECK (client_id = auth.uid());

-- Policy: Clients can update their own projects
CREATE POLICY "Clients can update their own projects"
  ON projects FOR UPDATE
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

-- Policy: Clients can delete their own projects
CREATE POLICY "Clients can delete their own projects"
  ON projects FOR DELETE
  USING (client_id = auth.uid());

-- Enable RLS on proposals table
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Policy: Freelancers can view their own proposals
CREATE POLICY "Freelancers can view their own proposals"
  ON proposals FOR SELECT
  USING (freelancer_id = auth.uid());

-- Policy: Clients can view proposals for their projects
CREATE POLICY "Clients can view proposals for their projects"
  ON proposals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = proposals.project_id
      AND projects.client_id = auth.uid()
    )
  );

-- Policy: Freelancers can create proposals
CREATE POLICY "Freelancers can create proposals"
  ON proposals FOR INSERT
  WITH CHECK (freelancer_id = auth.uid());

-- Policy: Freelancers can update their own proposals (before acceptance)
CREATE POLICY "Freelancers can update their own proposals"
  ON proposals FOR UPDATE
  USING (freelancer_id = auth.uid() AND status NOT IN ('accepted', 'rejected'))
  WITH CHECK (freelancer_id = auth.uid());

-- Policy: Clients can update proposals for their projects (status changes)
CREATE POLICY "Clients can update proposals for their projects"
  ON proposals FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = proposals.project_id
      AND projects.client_id = auth.uid()
    )
  );

-- Policy: Freelancers can delete their own proposals (before acceptance)
CREATE POLICY "Freelancers can delete their own proposals"
  ON proposals FOR DELETE
  USING (freelancer_id = auth.uid() AND status NOT IN ('accepted', 'rejected'));

-- =============================================
-- Comments for documentation
-- =============================================
COMMENT ON TABLE projects IS 'Stores all project postings with fixed-price budgeting';
COMMENT ON TABLE proposals IS 'Stores freelancer proposals for projects with fixed-price bids';
COMMENT ON COLUMN projects.fixed_budget IS 'Fixed-price budget for the entire project (no hourly rates)';
COMMENT ON COLUMN proposals.total_budget IS 'Freelancer bid amount for the entire project (fixed-price only)';
