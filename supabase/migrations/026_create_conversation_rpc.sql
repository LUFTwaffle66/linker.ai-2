CREATE OR REPLACE FUNCTION create_and_get_conversation(
  user_id_1 uuid,
  user_id_2 uuid
)
RETURNS uuid AS $$
DECLARE
  conversation_id uuid;
BEGIN
  -- Check if a conversation already exists
  SELECT cp1.conversation_id INTO conversation_id
  FROM conversation_participants cp1
  JOIN conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
  WHERE cp1.user_id = user_id_1 AND cp2.user_id = user_id_2;

  -- If it exists, return the ID
  IF conversation_id IS NOT NULL THEN
    RETURN conversation_id;
  END IF;

  -- Otherwise, create a new conversation
  INSERT INTO conversations DEFAULT VALUES RETURNING id INTO conversation_id;

  -- Add participants
  INSERT INTO conversation_participants (conversation_id, user_id)
  VALUES (conversation_id, user_id_1), (conversation_id, user_id_2);

  RETURN conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
