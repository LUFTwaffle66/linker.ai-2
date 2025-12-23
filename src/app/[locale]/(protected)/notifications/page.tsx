'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { formatDistanceToNow } from 'date-fns';
import { CheckCheck, Trash2, Filter, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
  useArchiveNotification,
  NotificationItem,
} from '@/features/notifications';
import type { NotificationCategory } from '@/features/notifications';

export default function NotificationsPage() {
  const router = useRouter();
  const locale = useLocale();
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | 'all'>('all');
  const [showArchived, setShowArchived] = useState(false);

  // Fetch notifications based on filters
  const {
    data: notifications = [],
    isLoading,
    error,
  } = useNotifications({
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    is_archived: showArchived,
  });

  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();
  const { mutate: archiveNotification } = useArchiveNotification();

  const unreadNotifications = notifications.filter((n) => !n.is_read);
  const unreadCount = unreadNotifications.length;

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

  const handleArchive = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    archiveNotification(notificationId);
  };

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Card className="p-8 text-center">
          <p className="text-destructive">Error loading notifications</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-muted-foreground mt-1">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <Button
            onClick={() => markAllAsRead()}
            disabled={isMarkingAll}
            variant="outline"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as NotificationCategory | 'all')}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="project_opportunity">Projects</SelectItem>
            <SelectItem value="proposal">Proposals</SelectItem>
            <SelectItem value="contract">Contracts</SelectItem>
            <SelectItem value="payment">Payments</SelectItem>
            <SelectItem value="message">Messages</SelectItem>
            <SelectItem value="review">Reviews</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>

        <Tabs value={showArchived ? 'archived' : 'active'} className="flex-1">
          <TabsList className="grid w-full sm:w-[300px] grid-cols-2">
            <TabsTrigger value="active" onClick={() => setShowArchived(false)}>
              Active
            </TabsTrigger>
            <TabsTrigger value="archived" onClick={() => setShowArchived(true)}>
              Archived
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Notifications List */}
      <Card>
        {isLoading ? (
          // Loading state
          <div className="divide-y">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4">
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          // Empty state
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              {showArchived ? (
                <Archive className="w-8 h-8 text-muted-foreground" />
              ) : (
                <CheckCheck className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {showArchived ? 'No archived notifications' : 'All caught up!'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {showArchived
                ? 'You have no archived notifications.'
                : 'You have no notifications at the moment.'}
            </p>
          </div>
        ) : (
          // Notifications list
          <div className="divide-y">
            {notifications.map((notification) => (
              <div key={notification.id} className="relative group">
                <NotificationItem
                  notification={notification}
                  onClick={() =>
                    handleNotificationClick(notification.id, notification.action_url)
                  }
                  onDelete={(e) => handleDelete(notification.id, e)}
                />

                {/* Additional actions */}
                {!showArchived && (
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => handleArchive(notification.id, e)}
                      title="Archive"
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Stats Footer */}
      {!isLoading && notifications.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          {selectedCategory !== 'all' && ` in ${selectedCategory.replace('_', ' ')}`}
        </div>
      )}
    </div>
  );
}
