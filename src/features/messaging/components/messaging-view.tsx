'use client';

import { useState } from 'react';
import { useAuth } from '@/features/auth/lib/auth-client';
import { ConversationList } from './conversation-list';
import { ChatHeader } from './chat-header';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { EmptyState } from './empty-state';
import { useChatMessages } from '../hooks/use-chat-messages';
import type { Conversation } from '../types';

export function MessagingView() {
  const { user } = useAuth();
  const currentUserId = user?.id;
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const { messages, loading, sendMessage } = useChatMessages(activeConversation?.id ?? null);

  const handleConversationSelect = (conversation: Conversation) => {
    setActiveConversation(conversation);
  };

  const handleConversationDeleted = () => {
    setActiveConversation(null);
  };

  // Get the other participant (not the current user)
  const otherParticipant = activeConversation
    ? {
        id: activeConversation.other_participant_id,
        name: activeConversation.other_participant_name,
        avatar: activeConversation.other_participant_avatar,
        type: 'client' as const, // Placeholder
        isOnline: false, // Placeholder, as this info is not in the conversation object
        lastSeen: undefined, // Placeholder
      }
    : null;

  if (!currentUserId) {
    return (
      <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto">
      {/* Conversation List - Left Sidebar */}
      <div className="w-80 shrink-0">
        <ConversationList
          currentUserId={currentUserId}
          activeConversationId={activeConversation?.id || null}
          onConversationSelect={handleConversationSelect}
        />
      </div>

      {/* Chat Area - Right Side */}
      <div className="flex-1 flex flex-col">
        {activeConversation && otherParticipant ? (
          <>
            <ChatHeader
              otherParticipant={otherParticipant}
              conversation={activeConversation}
              onConversationDeleted={handleConversationDeleted}
            />

            <MessageList
              conversationId={activeConversation.id}
              currentUserId={currentUserId}
              messages={messages}
              loading={loading}
            />

            <MessageInput conversationId={activeConversation.id} onSendMessage={sendMessage} />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
