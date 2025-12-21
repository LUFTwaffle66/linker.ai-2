/**
 * Notification API Functions
 * Direct interaction with Supabase notifications tables
 */

import { supabase } from '@/lib/supabase';
import type {
  Notification,
  NotificationCategory,
  NotificationPreferences,
  CreateNotificationRequest,
  NotificationFilters,
  NotificationStats,
} from '../types';

const DEFAULT_PAGE_SIZE = 10;

/**
 * Fetch notifications for the current user
 * RLS policies automatically filter by auth.uid()
 */
export async function fetchNotifications(
  filters?: NotificationFilters
): Promise<Notification[]> {
  let query = supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false});

  // Apply filters
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.is_read !== undefined) {
    query = query.eq('is_read', filters.is_read);
  }

  if (filters?.is_archived !== undefined) {
    query = query.eq('is_archived', filters.is_archived);
  }

  // Pagination using range
  if (filters?.offset !== undefined && filters?.limit !== undefined) {
    const from = filters.offset;
    const to = from + filters.limit - 1;
    query = query.range(from, to);
  } else if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Notification[];
}

/**
 * Fetch unread notifications count for the current user
 * RLS policies automatically filter by auth.uid()
 */
export async function fetchUnreadCount(): Promise<number> {
  const { data, error } = await supabase.rpc('get_unread_notification_count');

  if (error) throw error;
  return data || 0;
}

/**
 * Fetch notification statistics for the current user
 * RLS policies automatically filter by auth.uid()
 */
export async function fetchNotificationStats(): Promise<NotificationStats> {
  const { data, error } = await supabase
    .from('notifications')
    .select('category, is_read');

  if (error) throw error;

  const stats: NotificationStats = {
    total: data.length,
    unread: data.filter((n) => !n.is_read).length,
    by_category: {},
  };

  // Count by category
  data.forEach((notification) => {
    const category = notification.category as NotificationCategory;
    if (!stats.by_category[category]) {
      stats.by_category[category] = 0;
    }
    stats.by_category[category] = (stats.by_category[category] || 0) + 1;
  });

  return stats;
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const { error } = await supabase.rpc('mark_notification_read', {
    p_notification_id: notificationId,
  });

  if (error) throw error;
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  const { error } = await supabase.rpc('mark_all_notifications_read');

  if (error) throw error;
}

/**
 * Archive a notification
 */
export async function archiveNotification(notificationId: string): Promise<void> {
  const { error } = await supabase.rpc('archive_notification', {
    p_notification_id: notificationId,
  });

  if (error) throw error;
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  if (error) throw error;
}

/**
 * Create a notification (typically called from backend/webhook)
 */
export async function createNotification(
  request: CreateNotificationRequest
): Promise<string | null> {
  const { data, error } = await supabase.rpc('create_notification', {
    p_user_id: request.user_id,
    p_category: request.category,
    p_type: request.type,
    p_title: request.title,
    p_message: request.message,
    p_project_id: request.project_id || null,
    p_proposal_id: request.proposal_id || null,
    p_conversation_id: request.conversation_id || null,
    p_payment_intent_id: request.payment_intent_id || null,
    p_actor_id: request.actor_id || null,
    p_metadata: request.metadata || {},
    // Auto-generate invitation link when applicable
    p_action_url:
      request.type === 'project_invitation' && request.project_id
        ? `/projects/${request.project_id}?fromInvitation=true`
        : request.action_url || null,
  });

  if (error) throw error;

  // Also record project invitations for proposal flow
  if (request.type === 'project_invitation' && request.project_id && request.user_id) {
    await supabase.from('project_invitations').insert({
      project_id: request.project_id,
      client_id: request.actor_id || null,
      freelancer_id: request.user_id,
    });
  }

  return data;
}

/**
 * Fetch notification preferences for the current user
 * RLS policies automatically filter by auth.uid()
 */
export async function fetchNotificationPreferences(): Promise<NotificationPreferences> {
  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .single();

  if (error) throw error;
  return data as NotificationPreferences;
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences> {
  const { data, error } = await supabase
    .from('notification_preferences')
    .update(preferences)
    .eq('user_id', preferences.user_id!)
    .select()
    .single();

  if (error) throw error;
  return data as NotificationPreferences;
}

/**
 * Subscribe to real-time notification updates
 */
export function subscribeToNotifications(
  userId: string,
  callback: (notification: Notification) => void
) {
  const channel = supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new as Notification);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
