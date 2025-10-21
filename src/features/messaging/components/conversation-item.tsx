import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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

  if (!otherParticipant) return null;

  const initials = otherParticipant.user.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || '';

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-accent border-b',
        isActive && 'bg-accent'
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
            <p className="font-semibold text-sm truncate">{otherParticipant.user.full_name}</p>
            {conversation.isStarred && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
            {conversation.isMuted && <VolumeX className="w-3 h-3 text-muted-foreground" />}
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {conversation.lastMessage?.created_at && formatDistanceToNow(new Date(conversation.lastMessage.created_at), {
              addSuffix: true,
            })}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="flex-1 text-sm text-muted-foreground truncate overflow-hidden text-ellipsis">
            {conversation.lastMessage?.sender_id === currentUserId && <span className="font-medium">You: </span>}
            {conversation.lastMessage?.content}
          </p>
          {conversation.unread_count > 0 && (
            <Badge variant="default" className="rounded-full px-2 py-0 text-xs">
              {conversation.unread_count}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
