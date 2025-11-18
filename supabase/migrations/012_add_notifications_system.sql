-- Notifications System Migration
-- This migration creates tables for in-app notifications only
-- Based on notifications.md specification

-- =====================================================
-- ENUMS for Notification Types
-- =====================================================

-- Notification categories
CREATE TYPE notification_category AS ENUM (
  'project_opportunity',
  'proposal',
  'contract',
  'payment',
  'message',
  'review',
  'system'
);

-- Notification types for freelancers
CREATE TYPE freelancer_notification_type AS ENUM (
  -- Project & Opportunity
  'project_match_skills',
  'project_invitation',

  -- Proposal & Application
  'proposal_submitted',
  'proposal_viewed',
  'proposal_message',
  'proposal_accepted',
  'proposal_declined',
  'offer_received',

  -- Project & Contract
  'contract_started',
  'client_message',
  'project_requirements_updated',
  'contract_ended',
  'review_received',

  -- Payment & Financial
  'upfront_payment_secured',
  'final_payment_released',
  'withdrawal_successful'
);

-- Notification types for clients
CREATE TYPE client_notification_type AS ENUM (
  -- Project Posting & Discovery
  'project_posted',
  'new_proposal_received',
  'ai_suggested_freelancers',
  'invited_freelancer_responded',

  -- Proposal & Hiring
  'freelancer_message',
  'freelancer_accepted_offer',
  'freelancer_declined_offer',
  'reminder_review_proposals',

  -- Project & Contract
  'contract_started',
  'freelancer_message_active',
  'reminder_pay_upfront',
  'reminder_pay_final',
  'contract_ended',
  'reminder_leave_review',

  -- Payment & Financial
  'upfront_payment_successful',
  'final_payment_successful',
  'invoice_received'
);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User information
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Notification details
  category notification_category NOT NULL,
  type TEXT NOT NULL, -- Will store either freelancer_notification_type or client_notification_type
  title TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Related entities (nullable for flexibility)
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  payment_intent_id UUID, -- No FK constraint yet, will be added when payment_intents table is created

  -- Actor (who triggered this notification)
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  actor_name TEXT,
  actor_avatar_url TEXT,

  -- Metadata for additional context
  metadata JSONB DEFAULT '{}',

  -- Action URL (where to navigate when clicked)
  action_url TEXT,

  -- Status
  is_read BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATION PREFERENCES TABLE
-- =====================================================

CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,

  -- In-app notification preferences by category
  inapp_project_updates BOOLEAN DEFAULT true,
  inapp_proposal_updates BOOLEAN DEFAULT true,
  inapp_messages BOOLEAN DEFAULT true,
  inapp_payments BOOLEAN DEFAULT true,
  inapp_reviews BOOLEAN DEFAULT true,
  inapp_system BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_project_id ON notifications(project_id);
CREATE INDEX idx_notifications_proposal_id ON notifications(proposal_id);
CREATE INDEX idx_notifications_category ON notifications(category);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_actor_id ON notifications(actor_id);

-- Notification preferences index
CREATE INDEX idx_notification_preferences_user_id ON notification_preferences(user_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Notification preferences policies
CREATE POLICY "Users can view their own preferences"
  ON notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_category notification_category,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_project_id UUID DEFAULT NULL,
  p_proposal_id UUID DEFAULT NULL,
  p_conversation_id UUID DEFAULT NULL,
  p_payment_intent_id UUID DEFAULT NULL,
  p_actor_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}',
  p_action_url TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_notification_id UUID;
  v_actor_name TEXT;
  v_actor_avatar TEXT;
  v_should_show_notification BOOLEAN;
BEGIN
  -- Check if user wants in-app notifications for this category
  SELECT
    CASE p_category
      WHEN 'project_opportunity' THEN inapp_project_updates
      WHEN 'proposal' THEN inapp_proposal_updates
      WHEN 'message' THEN inapp_messages
      WHEN 'payment' THEN inapp_payments
      WHEN 'review' THEN inapp_reviews
      WHEN 'system' THEN inapp_system
      ELSE true
    END
  INTO v_should_show_notification
  FROM notification_preferences
  WHERE user_id = p_user_id;

  -- If user has disabled this category, don't create notification
  IF v_should_show_notification = false THEN
    RETURN NULL;
  END IF;

  -- Get actor details if provided
  IF p_actor_id IS NOT NULL THEN
    SELECT full_name, avatar_url
    INTO v_actor_name, v_actor_avatar
    FROM users
    WHERE id = p_actor_id;
  END IF;

  -- Insert notification
  INSERT INTO notifications (
    user_id,
    category,
    type,
    title,
    message,
    project_id,
    proposal_id,
    conversation_id,
    payment_intent_id,
    actor_id,
    actor_name,
    actor_avatar_url,
    metadata,
    action_url
  ) VALUES (
    p_user_id,
    p_category,
    p_type,
    p_title,
    p_message,
    p_project_id,
    p_proposal_id,
    p_conversation_id,
    p_payment_intent_id,
    p_actor_id,
    v_actor_name,
    v_actor_avatar,
    p_metadata,
    p_action_url
  )
  RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$;

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(p_notification_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE notifications
  SET
    is_read = true,
    read_at = NOW(),
    updated_at = NOW()
  WHERE id = p_notification_id
    AND user_id = auth.uid();
END;
$$;

-- Function to mark all notifications as read
CREATE OR REPLACE FUNCTION mark_all_notifications_read()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE notifications
  SET
    is_read = true,
    read_at = NOW(),
    updated_at = NOW()
  WHERE user_id = auth.uid()
    AND is_read = false;
END;
$$;

-- Function to get unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO v_count
  FROM notifications
  WHERE user_id = auth.uid()
    AND is_read = false
    AND is_archived = false;

  RETURN v_count;
END;
$$;

-- Function to archive notification
CREATE OR REPLACE FUNCTION archive_notification(p_notification_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE notifications
  SET
    is_archived = true,
    updated_at = NOW()
  WHERE id = p_notification_id
    AND user_id = auth.uid();
END;
$$;

-- Function to delete old archived notifications (cleanup)
CREATE OR REPLACE FUNCTION cleanup_old_notifications(p_days_old INTEGER DEFAULT 30)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  DELETE FROM notifications
  WHERE is_archived = true
    AND created_at < NOW() - INTERVAL '1 day' * p_days_old;

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to create default notification preferences for new users
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_create_default_notification_preferences
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_notification_preferences();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE notifications IS 'Stores all in-app notifications for users';
COMMENT ON TABLE notification_preferences IS 'User preferences for in-app notification categories';

COMMENT ON FUNCTION create_notification IS 'Helper function to create notification with user preference checks';
COMMENT ON FUNCTION mark_notification_read IS 'Mark a single notification as read';
COMMENT ON FUNCTION mark_all_notifications_read IS 'Mark all user notifications as read';
COMMENT ON FUNCTION get_unread_notification_count IS 'Get count of unread notifications for current user';
COMMENT ON FUNCTION archive_notification IS 'Archive a notification (soft delete)';
COMMENT ON FUNCTION cleanup_old_notifications IS 'Delete old archived notifications for cleanup';
