import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, VolumeX } from 'lucide-react';
import type { Conversation } from '../types';

interface ConversationItemProps {
  conversation: Conversation;
  currentUserId: string;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({
  conversation,
  currentUserId,
  isActive,
  onClick,
}: ConversationItemProps) {
  const otherParticipant = conversation.participants.find((p: any) => p.user.id !== currentUserId);
  const lastMessage = conversation.lastMessage || (conversation as any).last_message;
  const lastMessageSenderId = lastMessage?.sender_id ?? conversation.last_message_sender_id;
  const lastMessageContent = lastMessage?.content ?? conversation.last_message_content;
  const lastMessageCreatedAt = lastMessage?.created_at ?? conversation.last_message_created_at;
  const unreadCount = conversation.conversation_participants?.[0]?.unread_count ?? 0;
  const isUnread = unreadCount > 0;

  if (!otherParticipant) return null;

  const initials = otherParticipant.user.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || '';

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/50 border-b',
        isActive && 'bg-accent',
        isUnread && !isActive && 'bg-muted/50'
      )}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar>
          <AvatarImage src={otherParticipant.user.avatar_url} alt={otherParticipant.user.full_name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <p className={cn('text-sm truncate', isUnread ? 'font-semibold' : 'font-medium')}>
              {otherParticipant.user.full_name}
            </p>
            {conversation.isStarred && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
            {conversation.isMuted && <VolumeX className="w-3 h-3 text-muted-foreground" />}
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {lastMessageCreatedAt &&
              formatDistanceToNow(new Date(lastMessageCreatedAt), {
                addSuffix: true,
              })}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="flex-1 text-sm text-muted-foreground truncate overflow-hidden text-ellipsis">
            {lastMessageSenderId === currentUserId && <span className="font-medium">You: </span>}
            {lastMessageContent}
          </p>
          {isUnread && (
            unreadCount > 0 ? (
              <span className="ml-2 rounded-full bg-blue-600 text-white text-xs px-2 py-0.5">
                {unreadCount}
              </span>
            ) : (
              <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-blue-500" />
            )
          )}
        </div>
      </div>
    </div>
  );
}
