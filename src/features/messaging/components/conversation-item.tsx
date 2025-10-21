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
  // Get the other participant (not the current user)
  const otherParticipant = conversation.participants.find((p) => p.id !== currentUserId);

  if (!otherParticipant) return null;

  const initials = otherParticipant.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

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
          <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {otherParticipant.isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm truncate">{otherParticipant.name}</p>
            {conversation.isStarred && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
            {conversation.isMuted && <VolumeX className="w-3 h-3 text-muted-foreground" />}
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), {
              addSuffix: true,
            })}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="flex-1 text-sm text-muted-foreground truncate overflow-hidden text-ellipsis">
            {conversation.lastMessage.senderId === currentUserId && <span className="font-medium">You: </span>}
            {conversation.lastMessage.content}
          </p>
          {conversation.unreadCount > 0 && (
            <Badge variant="default" className="rounded-full px-2 py-0 text-xs">
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
