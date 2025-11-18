-- Migration: Seed mock data for conversations and messages
-- Description: Populates the messaging tables with realistic mock data

DO $$
DECLARE
  -- Your actual user (Devansh Tiwari)
  user_devansh UUID := 'c96cb8a9-c3db-42b1-88f8-07d77f657987';

  -- Other user IDs (will be fetched from database)
  user_sarah UUID;
  user_michael UUID;
  user_emily UUID;

  -- Conversation IDs
  conversation_1 UUID;
  conversation_2 UUID;
  conversation_3 UUID;
BEGIN
  -- Fetch other user IDs
  SELECT id INTO user_sarah FROM users WHERE email = 'sarah.johnson@example.com';
  SELECT id INTO user_michael FROM users WHERE email = 'michael.chen@example.com';
  SELECT id INTO user_emily FROM users WHERE email = 'emily.rodriguez@example.com';

  -- =============================================
  -- Create Conversations
  -- =============================================

  -- Conversation 1: Devansh and Sarah
  INSERT INTO conversations DEFAULT VALUES RETURNING id INTO conversation_1;
  INSERT INTO conversation_participants (conversation_id, user_id)
  VALUES (conversation_1, user_devansh), (conversation_1, user_sarah);

  -- Conversation 2: Devansh and Michael
  INSERT INTO conversations DEFAULT VALUES RETURNING id INTO conversation_2;
  INSERT INTO conversation_participants (conversation_id, user_id)
  VALUES (conversation_2, user_devansh), (conversation_2, user_michael);

  -- Conversation 3: Devansh and Emily
  INSERT INTO conversations DEFAULT VALUES RETURNING id INTO conversation_3;
  INSERT INTO conversation_participants (conversation_id, user_id)
  VALUES (conversation_3, user_devansh), (conversation_3, user_emily);

  -- =============================================
  -- Insert Mock Messages
  -- =============================================

  -- Messages for Conversation 1
  INSERT INTO messages (conversation_id, sender_id, content, created_at)
  VALUES
    (conversation_1, user_devansh, 'Hi Sarah, I saw your profile and was really impressed with your work in NLP. I''d love to connect and learn more about your experience.', NOW() - INTERVAL '2 days'),
    (conversation_1, user_sarah, 'Hi Devansh, thanks for reaching out! I''d be happy to chat. What are you working on?', NOW() - INTERVAL '2 days' + INTERVAL '5 minutes');

  -- Messages for Conversation 2
  INSERT INTO messages (conversation_id, sender_id, content, created_at)
  VALUES
    (conversation_2, user_michael, 'Hey Devansh, I saw you''re a full-stack developer. I have a project that could use your expertise. Are you available for a quick call this week?', NOW() - INTERVAL '1 day'),
    (conversation_2, user_devansh, 'Hi Michael, thanks for the message. I''m definitely interested. I''m free tomorrow afternoon. Does that work for you?', NOW() - INTERVAL '1 day' + INTERVAL '10 minutes');

  -- Messages for Conversation 3
  INSERT INTO messages (conversation_id, sender_id, content, created_at)
  VALUES
    (conversation_3, user_emily, 'Hi Devansh, I saw your proposal for the sales forecasting project. I''m the data scientist on the team. I''d love to discuss your approach to the dashboard and deployment.', NOW() - INTERVAL '5 hours'),
    (conversation_3, user_devansh, 'Hi Emily, great to hear from you. I''m excited about the project. I''m free to chat anytime this afternoon. Let me know what works for you.', NOW() - INTERVAL '5 hours' + INTERVAL '15 minutes');

  -- =============================================
  -- Update Conversation Metadata
  -- =============================================

  -- Update last message ID for each conversation
  UPDATE conversations SET last_message_id = (SELECT id FROM messages WHERE conversation_id = conversation_1 ORDER BY created_at DESC LIMIT 1) WHERE id = conversation_1;
  UPDATE conversations SET last_message_id = (SELECT id FROM messages WHERE conversation_id = conversation_2 ORDER BY created_at DESC LIMIT 1) WHERE id = conversation_2;
  UPDATE conversations SET last_message_id = (SELECT id FROM messages WHERE conversation_id = conversation_3 ORDER BY created_at DESC LIMIT 1) WHERE id = conversation_3;

  -- Update unread counts
  UPDATE conversation_participants SET unread_count = 1 WHERE conversation_id = conversation_1 AND user_id = user_devansh;
  UPDATE conversation_participants SET unread_count = 1 WHERE conversation_id = conversation_2 AND user_id = user_devansh;

  RAISE NOTICE 'Mock conversations and messages seeded successfully!';
END $$;
