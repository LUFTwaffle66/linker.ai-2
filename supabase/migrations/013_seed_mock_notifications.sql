-- Seed Mock Notifications for Devansh Tiwari
-- Creates realistic notifications across all categories for testing

DO $$
DECLARE
  -- Devansh's user ID
  v_user_id UUID := 'bb08dda8-82c5-4389-8979-da54991f34fb';

  -- Get some project and proposal IDs for reference
  v_project_1 UUID;
  v_project_2 UUID;
  v_project_3 UUID;
  v_proposal_1 UUID;
  v_proposal_2 UUID;

  -- Some mock client IDs
  v_client_1 UUID;
  v_client_2 UUID;
BEGIN
  -- Get some existing projects (from seed data)
  SELECT id INTO v_project_1 FROM projects WHERE title ILIKE '%AI Chatbot%' LIMIT 1;
  SELECT id INTO v_project_2 FROM projects WHERE title ILIKE '%Report Generation%' LIMIT 1;
  SELECT id INTO v_project_3 FROM projects WHERE title ILIKE '%Sales Forecasting%' LIMIT 1;

  -- Get proposals submitted by Devansh
  SELECT id INTO v_proposal_1 FROM proposals WHERE freelancer_id = v_user_id LIMIT 1 OFFSET 0;
  SELECT id INTO v_proposal_2 FROM proposals WHERE freelancer_id = v_user_id LIMIT 1 OFFSET 1;

  -- Get some client IDs
  SELECT client_id INTO v_client_1 FROM projects WHERE id = v_project_1;
  SELECT client_id INTO v_client_2 FROM projects WHERE id = v_project_2;

  -- =====================================================
  -- RECENT NOTIFICATIONS (Last few hours)
  -- =====================================================

  -- 1. New proposal received notification (2 hours ago)
  INSERT INTO notifications (
    user_id, category, type, title, message,
    project_id, proposal_id, actor_id,
    action_url, is_read,
    created_at
  )
  SELECT
    v_user_id,
    'proposal',
    'proposal_viewed',
    'Client viewed your proposal',
    'Sarah Johnson has viewed your proposal for "' || p.title || '".',
    p.id,
    v_proposal_1,
    p.client_id,
    '/proposals/' || v_proposal_1,
    false,
    NOW() - INTERVAL '2 hours'
  FROM projects p
  WHERE p.id = v_project_1;

  -- 2. New project matching skills (3 hours ago)
  INSERT INTO notifications (
    user_id, category, type, title, message,
    project_id, metadata, action_url, is_read,
    created_at
  )
  VALUES (
    v_user_id,
    'project_opportunity',
    'project_match_skills',
    'New project matches your skills!',
    'A new project "Enterprise AI Automation System" matches your expertise in Python, GPT-4, FastAPI.',
    v_project_3,
    '{"skills": ["Python", "GPT-4", "FastAPI"]}',
    '/browse?tab=projects',
    false,
    NOW() - INTERVAL '3 hours'
  );

  -- 3. Payment received notification (5 hours ago)
  INSERT INTO notifications (
    user_id, category, type, title, message,
    project_id, metadata, action_url, is_read,
    created_at
  )
  VALUES (
    v_user_id,
    'payment',
    'upfront_payment_secured',
    'Upfront payment secured',
    'The client has paid 50% upfront for "AI Chatbot Development". You can now start working!',
    v_project_1,
    '{"amount": 6000}',
    '/projects/' || v_project_1,
    false,
    NOW() - INTERVAL '5 hours'
  );

  -- =====================================================
  -- YESTERDAY NOTIFICATIONS
  -- =====================================================

  -- 4. Proposal accepted (1 day ago)
  INSERT INTO notifications (
    user_id, category, type, title, message,
    project_id, proposal_id, actor_id,
    action_url, is_read,
    created_at
  )
  SELECT
    v_user_id,
    'proposal',
    'proposal_accepted',
    'Congratulations! Your proposal was accepted',
    u.full_name || ' has accepted your proposal for "' || p.title || '". You can start working once the upfront payment is secured.',
    p.id,
    v_proposal_1,
    p.client_id,
    '/projects/' || p.id,
    true,
    NOW() - INTERVAL '1 day'
  FROM projects p
  JOIN users u ON u.id = p.client_id
  WHERE p.id = v_project_1;

  -- 5. New message notification (1 day ago)
  INSERT INTO notifications (
    user_id, category, type, title, message,
    actor_id, action_url, is_read,
    created_at
  )
  SELECT
    v_user_id,
    'message',
    'client_message',
    'New message',
    u.full_name || ': Hi Devansh, I have a few questions about the project timeline...',
    v_client_1,
    '/messages',
    true,
    NOW() - INTERVAL '1 day' - INTERVAL '3 hours'
  FROM users u
  WHERE u.id = v_client_1;

  -- =====================================================
  -- OLDER NOTIFICATIONS (2-7 days ago)
  -- =====================================================

  -- 6. Proposal submitted confirmation (2 days ago)
  INSERT INTO notifications (
    user_id, category, type, title, message,
    project_id, proposal_id, action_url, is_read,
    created_at
  )
  VALUES (
    v_user_id,
    'proposal',
    'proposal_submitted',
    'Proposal submitted successfully',
    'Your proposal for "Advanced ML Model Training" has been sent to the client.',
    v_project_2,
    v_proposal_2,
    '/proposals/' || v_proposal_2,
    true,
    NOW() - INTERVAL '2 days'
  );

  -- 7. Project invitation (3 days ago)
  INSERT INTO notifications (
    user_id, category, type, title, message,
    project_id, actor_id, action_url, is_read,
    created_at
  )
  SELECT
    v_user_id,
    'project_opportunity',
    'project_invitation',
    'You''ve been invited to a project',
    u.full_name || ' has invited you to apply for "Custom CRM Integration with AI".',
    v_project_3,
    v_client_2,
    '/projects/' || v_project_3,
    true,
    NOW() - INTERVAL '3 days'
  FROM users u
  WHERE u.id = v_client_2;

  -- 8. Contract started (4 days ago)
  INSERT INTO notifications (
    user_id, category, type, title, message,
    project_id, action_url, is_read,
    created_at
  )
  VALUES (
    v_user_id,
    'contract',
    'contract_started',
    'Project started!',
    'Your contract for "AI Chatbot Development" has officially started. Good luck!',
    v_project_1,
    '/projects/' || v_project_1,
    true,
    NOW() - INTERVAL '4 days'
  );

  -- 9. Review received (5 days ago)
  INSERT INTO notifications (
    user_id, category, type, title, message,
    actor_id, metadata, action_url, is_read,
    created_at
  )
  SELECT
    v_user_id,
    'review',
    'review_received',
    'New review received',
    u.full_name || ' left you a 5-star review: "Excellent work! Very professional and delivered on time."',
    v_client_1,
    '{"rating": 5}',
    '/profile',
    true,
    NOW() - INTERVAL '5 days'
  FROM users u
  WHERE u.id = v_client_1;

  -- 10. Final payment released (6 days ago)
  INSERT INTO notifications (
    user_id, category, type, title, message,
    project_id, metadata, action_url, is_read,
    created_at
  )
  VALUES (
    v_user_id,
    'payment',
    'final_payment_released',
    'Final payment released!',
    'The remaining 50% for "Data Analysis Dashboard" has been released. Total: $8,500',
    v_project_2,
    '{"amount": 8500}',
    '/dashboard/earnings',
    true,
    NOW() - INTERVAL '6 days'
  );

  -- 11. Proposal declined (7 days ago)
  INSERT INTO notifications (
    user_id, category, type, title, message,
    project_id, proposal_id, action_url, is_read,
    created_at
  )
  VALUES (
    v_user_id,
    'proposal',
    'proposal_declined',
    'Proposal not selected',
    'Your proposal for "E-commerce Platform Migration" was not selected. Keep applying to find the perfect match!',
    v_project_3,
    v_proposal_2,
    '/browse?tab=projects',
    true,
    NOW() - INTERVAL '7 days'
  );

  -- 12. System notification (1 week ago)
  INSERT INTO notifications (
    user_id, category, type, title, message,
    action_url, is_read,
    created_at
  )
  VALUES (
    v_user_id,
    'system',
    'project_posted',
    'Welcome to LinkerAI!',
    'Your profile is now live. Start browsing projects and submit proposals to get hired!',
    '/browse?tab=projects',
    true,
    NOW() - INTERVAL '1 week'
  );

  -- =====================================================
  -- ARCHIVED NOTIFICATIONS (for testing archive feature)
  -- =====================================================

  -- 13. Archived notification
  INSERT INTO notifications (
    user_id, category, type, title, message,
    action_url, is_read, is_archived,
    created_at
  )
  VALUES (
    v_user_id,
    'system',
    'project_posted',
    'Profile Setup Complete',
    'You''ve completed your freelancer profile setup. Great job!',
    '/profile',
    true,
    true,
    NOW() - INTERVAL '2 weeks'
  );

  -- 14. Another archived notification
  INSERT INTO notifications (
    user_id, category, type, title, message,
    action_url, is_read, is_archived,
    created_at
  )
  VALUES (
    v_user_id,
    'payment',
    'withdrawal_successful',
    'Withdrawal successful',
    'Your withdrawal of $5,000 has been processed successfully.',
    '/payments',
    true,
    true,
    NOW() - INTERVAL '3 weeks'
  );

  RAISE NOTICE 'Successfully created mock notifications for Devansh Tiwari';
  RAISE NOTICE 'Total notifications: 14 (12 active, 2 archived)';
  RAISE NOTICE 'Unread notifications: 3';

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating mock notifications: %', SQLERRM;
    RAISE NOTICE 'Note: This is expected if projects/proposals dont exist yet';
END $$;
