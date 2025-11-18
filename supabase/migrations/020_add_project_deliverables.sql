-- Create project deliverables table for work submissions
-- No file attachments - deliverables are text-based only
CREATE TABLE IF NOT EXISTS project_deliverables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted', -- submitted, approved, revision_requested
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  review_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_deliverables_project ON project_deliverables(project_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_freelancer ON project_deliverables(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_status ON project_deliverables(status);

-- Enable RLS
ALTER TABLE project_deliverables ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Freelancers can view and create their own deliverables
CREATE POLICY "deliverables_freelancer_select" ON project_deliverables
  FOR SELECT
  TO authenticated
  USING (freelancer_id = auth.uid());

CREATE POLICY "deliverables_freelancer_insert" ON project_deliverables
  FOR INSERT
  TO authenticated
  WITH CHECK (freelancer_id = auth.uid());

-- Clients can view deliverables for their projects
CREATE POLICY "deliverables_client_select" ON project_deliverables
  FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE client_id = auth.uid()
    )
  );

-- Clients can update deliverables for their projects (for review)
CREATE POLICY "deliverables_client_update" ON project_deliverables
  FOR UPDATE
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE client_id = auth.uid()
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_deliverables_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deliverables_updated_at
  BEFORE UPDATE ON project_deliverables
  FOR EACH ROW
  EXECUTE FUNCTION update_deliverables_updated_at();
