import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { Notification } from '@/types';

interface UseRealtimeNotificationsResult {
  notifications: Notification[];
  isLoading: boolean;
  error: Error | null;
}

export function useRealtimeNotifications(userId?: string): UseRealtimeNotificationsResult {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const load = async () => {
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError);
      } else if (data) {
        setNotifications(data as Notification[]);
      }

      setIsLoading(false);
    };

    void load();

    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const notification = payload.new as Notification;
          if (!isMounted) return;
          setNotifications((prev) => [notification, ...prev]);
          toast(notification.title, { description: notification.message });
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { notifications, isLoading, error };
}
