-- Drop the existing policy
DROP POLICY "Users can create conversations" ON conversations;

-- Create the new policy
CREATE POLICY "Authenticated users can create conversations"
  ON conversations FOR INSERT
  WITH CHECK ( auth.uid() IS NOT NULL );
