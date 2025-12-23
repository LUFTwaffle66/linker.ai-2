'use client';

import { useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from '../hooks/use-notifications';
import { NotificationItem } from './notification-item';
import { paths } from '@/config/paths';

export function NotificationList() {
  const router = useRouter();
  const { data: notifications = [], isLoading } = useNotifications({
    is_archived: false,
    limit: 20,
  });
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();
  const locale = useLocale();

  const unreadNotifications = notifications.filter((n) => !n.is_read);

  const handleNotificationClick = (notificationId: string, actionUrl?: string) => {
    // Mark as read
    markAsRead(notificationId);

    // Navigate if action URL exists
    if (actionUrl) {
      const localizedUrl = `/${locale}/${actionUrl.replace(/^\//, '')}`;
      router.push(localizedUrl);
    }
  };

  const handleDelete = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(notificationId);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <CheckCheck className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">All caught up!</p>
        <p className="text-xs text-muted-foreground mt-1">
          You have no notifications at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="font-semibold">Notifications</h3>
          {unreadNotifications.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {unreadNotifications.length} unread
            </p>
          )}
        </div>
        {unreadNotifications.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAllAsRead()}
            className="text-xs"
          >
            <CheckCheck className="w-4 h-4 mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Notification List */}
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={() =>
                handleNotificationClick(notification.id, notification.action_url)
              }
              onDelete={(e) => handleDelete(notification.id, e)}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <Separator />
      <div className="p-2">
        <Button
          variant="ghost"
          className="w-full text-sm"
          onClick={() => router.push(paths.app.notifications.getHref())}
        >
          View all notifications
        </Button>
      </div>
    </div>
  );
}
