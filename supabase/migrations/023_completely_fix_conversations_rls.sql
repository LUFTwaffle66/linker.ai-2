-- =============================================
-- COMPLETELY FIX CONVERSATIONS RLS - REMOVE ALL BLOCKING POLICIES
-- =============================================

-- First, let's see what policies exist and drop ALL of them
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE tablename = 'conversations'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON conversations', pol.policyname);
    END LOOP;
END $$;

-- Now create simple, working policies
-- SELECT: Users can view conversations they're part of
CREATE POLICY "conversations_select"
  ON conversations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = conversations.id
        AND conversation_participants.user_id = auth.uid()
    )
  );

-- INSERT: Any authenticated user can create a conversation
-- We'll verify they're a participant through the application layer
CREATE POLICY "conversations_insert"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- UPDATE: Users can update conversations they're part of
CREATE POLICY "conversations_update"
  ON conversations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = conversations.id
        AND conversation_participants.user_id = auth.uid()
    )
  );

-- DELETE: Users can delete conversations they're part of
CREATE POLICY "conversations_delete"
  ON conversations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = conversations.id
        AND conversation_participants.user_id = auth.uid()
    )
  );

-- Also ensure conversation_participants INSERT policy is simple
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE tablename = 'conversation_participants'
          AND policyname LIKE '%insert%'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON conversation_participants', pol.policyname);
    END LOOP;
END $$;

-- Allow any authenticated user to add participants
CREATE POLICY "conversation_participants_insert"
  ON conversation_participants FOR INSERT
  TO authenticated
  WITH CHECK (true);
