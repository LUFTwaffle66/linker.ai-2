-- =============================================
-- Enable RLS for Messaging Tables
-- =============================================
-- This migration ensures RLS is enabled and creates comprehensive policies

-- =============================================
-- 1. FIRST DISABLE THEN RE-ENABLE ROW LEVEL SECURITY
-- =============================================
-- This ensures a clean slate

-- Disable RLS first (in case it was enabled before)
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- Now enable RLS for all messaging tables
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 2. DROP EXISTING POLICIES (if any)
-- =============================================

-- Drop existing policies for conversations
DROP POLICY IF EXISTS "Users can view conversations they are a part of" ON conversations;
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update conversations they are part of" ON conversations;
DROP POLICY IF EXISTS "Users can delete conversations they are part of" ON conversations;

-- Drop existing policies for conversation_participants
DROP POLICY IF EXISTS "Users can view their own participant records" ON conversation_participants;
DROP POLICY IF EXISTS "Users can be added to conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can update their own participant records" ON conversation_participants;
DROP POLICY IF EXISTS "Users can delete their own participant records" ON conversation_participants;

-- Drop existing policies for messages
DROP POLICY IF EXISTS "Users can view messages in conversations they are a part of" ON messages;
DROP POLICY IF EXISTS "Users can send messages in conversations they are a part of" ON messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON messages;

-- =============================================
-- 3. CONVERSATIONS TABLE POLICIES
-- =============================================

-- SELECT: Users can view conversations they are a part of
CREATE POLICY "conversations_select_policy"
  ON conversations FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT conversation_id FROM conversation_participants
      WHERE user_id = auth.uid()
    )
  );

-- INSERT: Authenticated users can create conversations
CREATE POLICY "conversations_insert_policy"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- UPDATE: Users can update conversations they are part of
CREATE POLICY "conversations_update_policy"
  ON conversations FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT conversation_id FROM conversation_participants
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    id IN (
      SELECT conversation_id FROM conversation_participants
      WHERE user_id = auth.uid()
    )
  );

-- DELETE: Users can delete conversations they are part of
CREATE POLICY "conversations_delete_policy"
  ON conversations FOR DELETE
  TO authenticated
  USING (
    id IN (
      SELECT conversation_id FROM conversation_participants
      WHERE user_id = auth.uid()
    )
  );

-- =============================================
-- 4. CONVERSATION_PARTICIPANTS TABLE POLICIES
-- =============================================

-- SELECT: Users can view all participants in conversations they are part of
CREATE POLICY "conversation_participants_select_policy"
  ON conversation_participants FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants
      WHERE user_id = auth.uid()
    )
  );

-- INSERT: Authenticated users can add participants to conversations
CREATE POLICY "conversation_participants_insert_policy"
  ON conversation_participants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- UPDATE: Users can update their own participant records
CREATE POLICY "conversation_participants_update_policy"
  ON conversation_participants FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- DELETE: Users can delete their own participant records (leave conversation)
CREATE POLICY "conversation_participants_delete_policy"
  ON conversation_participants FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- =============================================
-- 5. MESSAGES TABLE POLICIES
-- =============================================

-- SELECT: Users can view messages in conversations they are a part of
CREATE POLICY "messages_select_policy"
  ON messages FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants
      WHERE user_id = auth.uid()
    )
  );

-- INSERT: Users can send messages in conversations they are a part of
CREATE POLICY "messages_insert_policy"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants
      WHERE user_id = auth.uid()
    )
  );

-- UPDATE: Users can update their own messages
CREATE POLICY "messages_update_policy"
  ON messages FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

-- DELETE: Users can delete their own messages
CREATE POLICY "messages_delete_policy"
  ON messages FOR DELETE
  TO authenticated
  USING (sender_id = auth.uid());

-- =============================================
-- 6. CREATE INDEXES FOR PERFORMANCE
-- =============================================

-- Indexes for conversation_participants
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id
  ON conversation_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id
  ON conversation_participants(conversation_id);

-- Indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id
  ON messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id
  ON messages(sender_id);

CREATE INDEX IF NOT EXISTS idx_messages_created_at
  ON messages(created_at DESC);

-- Indexes for conversations
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at
  ON conversations(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversations_last_message_id
  ON conversations(last_message_id);

-- =============================================
-- 7. TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================

-- Function to update conversations.updated_at when a new message is sent
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET
    updated_at = NOW(),
    last_message_id = NEW.id
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS trigger_update_conversation_timestamp ON messages;

CREATE TRIGGER trigger_update_conversation_timestamp
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();

-- Function to update participant metadata when new message is sent
CREATE OR REPLACE FUNCTION update_participant_metadata()
RETURNS TRIGGER AS $$
BEGIN
  -- Update all participants except the sender
  UPDATE conversation_participants
  SET
    unread_count = unread_count + 1,
    has_new_messages = true
  WHERE
    conversation_id = NEW.conversation_id
    AND user_id != NEW.sender_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS trigger_update_participant_metadata ON messages;

CREATE TRIGGER trigger_update_participant_metadata
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_participant_metadata();

-- =============================================
-- 8. HELPER FUNCTIONS
-- =============================================

-- Function to mark conversation as read for a user
CREATE OR REPLACE FUNCTION mark_conversation_as_read(p_conversation_id UUID, p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE conversation_participants
  SET
    unread_count = 0,
    has_new_messages = false
  WHERE
    conversation_id = p_conversation_id
    AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION mark_conversation_as_read(UUID, UUID) TO authenticated;

-- Function to get or create conversation between two users
CREATE OR REPLACE FUNCTION get_or_create_conversation(p_user1_id UUID, p_user2_id UUID)
RETURNS UUID AS $$
DECLARE
  v_conversation_id UUID;
BEGIN
  -- Try to find existing conversation between these two users
  SELECT cp1.conversation_id INTO v_conversation_id
  FROM conversation_participants cp1
  INNER JOIN conversation_participants cp2
    ON cp1.conversation_id = cp2.conversation_id
  WHERE cp1.user_id = p_user1_id
    AND cp2.user_id = p_user2_id
  LIMIT 1;

  -- If conversation doesn't exist, create it
  IF v_conversation_id IS NULL THEN
    -- Create new conversation
    INSERT INTO conversations (id, created_at, updated_at)
    VALUES (uuid_generate_v4(), NOW(), NOW())
    RETURNING id INTO v_conversation_id;

    -- Add both participants
    INSERT INTO conversation_participants (conversation_id, user_id, unread_count, has_new_messages)
    VALUES
      (v_conversation_id, p_user1_id, 0, false),
      (v_conversation_id, p_user2_id, 0, false);
  END IF;

  RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_or_create_conversation(UUID, UUID) TO authenticated;
