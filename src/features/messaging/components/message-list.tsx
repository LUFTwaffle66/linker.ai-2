"use client";

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './message-bubble';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';
import type { Message } from '../types';

interface MessageListProps {
  conversationId: string;
  currentUserId: string;
  messages: Message[];
  loading: boolean;
}

export function MessageList({ conversationId, currentUserId, messages, loading }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationId, messages]);


  const getDateLabel = (date: Date): string => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return "";
  };

  const shouldShowDateSeparator = (currentMessage: Message, previousMessage?: Message): boolean => {
    if (!previousMessage) return true;

    const currentDate = new Date(currentMessage.created_at);
    const previousDate = new Date(previousMessage.created_at);

    return !isSameDay(currentDate, previousDate);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground">No messages yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Send a message to start the conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div key={message.id}>
            {shouldShowDateSeparator(message, messages[index - 1]) && (
              <div className="flex items-center justify-center my-4">
                <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                  {getDateLabel(new Date(message.created_at))}
                </div>
              </div>
            )}

            <MessageBubble
              message={message}
              isCurrentUser={message.sender.id === currentUserId}
            />
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
