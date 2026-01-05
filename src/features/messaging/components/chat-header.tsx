import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Star, VolumeX, Volume2, AlertTriangle, Trash2, Ban } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { User, Conversation } from '../types';

interface ChatHeaderProps {
  otherParticipant: User & { 
    isOnline?: boolean; 
    lastSeen?: string | null 
  };
  conversation: Conversation;
  onConversationDeleted: () => void;
}

export function ChatHeader({ otherParticipant, conversation, onConversationDeleted }: ChatHeaderProps) {
  // DEBUG LOG: Open your browser console to see this
  console.log('ChatHeader received participant:', otherParticipant);
  const initials = otherParticipant.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar>
            <AvatarImage src={otherParticipant.avatar || undefined} alt={otherParticipant.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {otherParticipant.isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
          )}
        </div>

        <div>
          <h3 className="font-semibold">{otherParticipant.name}</h3>
          <p className="text-sm text-muted-foreground">
            {otherParticipant.isOnline
              ? 'Online'
              : otherParticipant.lastSeen
              ? `Last seen ${formatDistanceToNow(new Date(otherParticipant.lastSeen), {
                  addSuffix: true,
                })}`
              : 'Offline'}
          </p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>
            <Star
              className={`w-4 h-4 mr-2 ${
                conversation.isStarred ? 'fill-yellow-400 text-yellow-400' : ''
              }`}
            />
            {conversation.isStarred ? 'Unstar' : 'Star'} Conversation
          </DropdownMenuItem>

          <DropdownMenuItem>
            {conversation.isMuted ? (
              <>
                <Volume2 className="w-4 h-4 mr-2" />
                Unmute
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 mr-2" />
                Mute
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-orange-600">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Report
          </DropdownMenuItem>

          <DropdownMenuItem className="text-orange-600">
            <Ban className="w-4 h-4 mr-2" />
            Block User
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Conversation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
