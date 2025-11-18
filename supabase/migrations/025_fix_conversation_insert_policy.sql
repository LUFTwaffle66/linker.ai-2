-- Drop the existing policy if it exists
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON conversations;

-- Create the new policy
CREATE POLICY "Authenticated users can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (true);
