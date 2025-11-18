-- =============================================
-- FIX CONVERSATIONS INSERT POLICY
-- Allow authenticated users to create conversations
-- =============================================

-- Drop the existing INSERT policy that's blocking creation
DROP POLICY IF EXISTS "conversations_insert_policy" ON conversations;

-- Create a simple policy that allows any authenticated user to create conversations
-- The participant check will happen in conversation_participants table
CREATE POLICY "conversations_insert_policy"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (true); -- Allow any authenticated user to create a conversation
