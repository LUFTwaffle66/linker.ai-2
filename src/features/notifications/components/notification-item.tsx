'use client';

import { formatDistanceToNow } from 'date-fns';
import {
  Briefcase,
  FileText,
  DollarSign,
  MessageSquare,
  Star,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Notification, NotificationCategory } from '../types';

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

// Icon mapping for notification categories
const categoryIcons: Record<NotificationCategory, React.ReactNode> = {
  project_opportunity: <Briefcase className="w-4 h-4" />,
  proposal: <FileText className="w-4 h-4" />,
  contract: <Briefcase className="w-4 h-4" />,
  payment: <DollarSign className="w-4 h-4" />,
  message: <MessageSquare className="w-4 h-4" />,
  review: <Star className="w-4 h-4" />,
  system: <AlertCircle className="w-4 h-4" />,
};

// Color mapping for notification categories
const categoryColors: Record<NotificationCategory, string> = {
  project_opportunity: 'text-blue-500 bg-blue-50 dark:bg-blue-950',
  proposal: 'text-purple-500 bg-purple-50 dark:bg-purple-950',
  contract: 'text-green-500 bg-green-50 dark:bg-green-950',
  payment: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950',
  message: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950',
  review: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950',
  system: 'text-gray-500 bg-gray-50 dark:bg-gray-950',
};

export function NotificationItem({ notification, onClick, onDelete }: NotificationItemProps) {
  const locale = useLocale();
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  // Helper to fix the URL
  const getActionUrl = (url: string | null | undefined) => {
    if (!url) return '/';
    // If it already has the locale, return it
    if (url.startsWith(`/${locale}`)) return url;
    // Otherwise prepend it
    return `/${locale}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(e);
  };

  const content = (
    <div className="flex gap-3">
      {/* Icon or Actor Avatar */}
      <div className="flex-shrink-0">
        {notification.actor_avatar_url ? (
          <Avatar className="h-10 w-10">
            <AvatarImage src={notification.actor_avatar_url} alt={notification.actor_name} />
            <AvatarFallback>
              {notification.actor_name?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div
            className={cn(
              'h-10 w-10 rounded-full flex items-center justify-center',
              categoryColors[notification.category]
            )}
          >
            {categoryIcons[notification.category]}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p
              className={cn(
                'text-sm font-medium leading-snug',
                !notification.is_read && 'font-semibold'
              )}
            >
              {notification.title}
            </p>
            {notification.actor_name && (
              <p className="text-xs text-muted-foreground mt-0.5">From {notification.actor_name}</p>
            )}
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {notification.message}
            </p>
          </div>

          {/* Delete button */}
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 h-8 w-8 flex-shrink-0"
            onClick={handleDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
          {!notification.is_read && (
            <>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="h-2 w-2 rounded-full bg-primary"></span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const wrapperClasses = cn(
    'group relative p-4 cursor-pointer transition-colors hover:bg-muted/50',
    !notification.is_read && 'bg-primary/5'
  );

  return (
    <Link href={getActionUrl(notification.action_url)} className={wrapperClasses} onClick={onClick}>
      {content}
    </Link>
  );
}
