"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ConversationItem } from './conversation-item';
import { useConversations } from '../hooks';
import type { Conversation } from '../types';

interface ConversationListProps {
  currentUserId: string;
  activeConversationId: string | null;
  onConversationSelect: (conversation: Conversation) => void;
}

export function ConversationList({
  currentUserId,
  activeConversationId,
  onConversationSelect,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: conversations, isLoading } = useConversations(currentUserId);

  const displayedConversations = conversations?.filter((c) => {
    const otherParticipant = c.participants.find((p: any) => p.user.id !== currentUserId);
    return otherParticipant?.user.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {/* <pre>{JSON.stringify(conversations, null, 2)}</pre> */}
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground">Loading conversations...</div>
        ) : !displayedConversations || displayedConversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            {searchQuery ? 'No conversations found' : 'No conversations yet'}
          </div>
        ) : (
          <div>
            {displayedConversations.map((conversation: Conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                currentUserId={currentUserId}
                isActive={activeConversationId === conversation.id}
                onClick={() => onConversationSelect(conversation)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
