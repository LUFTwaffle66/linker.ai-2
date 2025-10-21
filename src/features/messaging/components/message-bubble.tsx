import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
import { FileAttachment } from './file-attachment';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  return (
    <div className={cn('flex', isCurrentUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[70%] rounded-lg p-3',
          isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.attachments.map((file) => (
              <FileAttachment key={file.id} file={file} />
            ))}
          </div>
        )}

        <div
          className={cn(
            'flex items-center gap-1 mt-1',
            isCurrentUser ? 'justify-end' : 'justify-start'
          )}
        >
          <span
            className={cn(
              'text-xs',
              isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
            )}
          >
            {/* {format(new Date(message.timestamp), 'HH:mm')} */}
          </span>

          {isCurrentUser && (
            <span className="text-primary-foreground/70">
              {message.read ? (
                <CheckCheck className="w-3 h-3" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
