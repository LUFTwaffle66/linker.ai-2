'use client';

import { useState, useMemo } from 'react'; // Added useMemo for performance
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth/lib/auth-client';
import { ConversationList } from './conversation-list';
import { ChatHeader } from './chat-header';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { EmptyState } from './empty-state';
import { useChatMessages } from '../hooks/use-chat-messages';
import { useParticipantStatus } from '../hooks/use-participant-status';
import type { Conversation } from '../types';

export function MessagingView() {
  const { user } = useAuth();
  const currentUserId = user?.id;
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const { messages, loading, sendMessage } = useChatMessages(activeConversation?.id ?? null);
  const searchParams = useSearchParams();
  const deepLinkConversationId = searchParams.get('chat_id');

  const handleConversationSelect = (conversation: Conversation) => {
    setActiveConversation(conversation);
  };

  const handleConversationDeleted = () => {
    setActiveConversation(null);
  };

  // ------------------------------------------------------------------
  // 🔧 FIX: Correctly calculate "Other User" from the participants array
  // ------------------------------------------------------------------
  const otherParticipantData = useMemo(() => {
    if (!activeConversation || !currentUserId) return null;

    // Find the participant that is NOT me
    const participant = activeConversation.participants.find(
      (p: any) => p.user.id !== currentUserId
    );

    return participant ? participant.user : null;
  }, [activeConversation, currentUserId]);

  const otherParticipantId = otherParticipantData?.id;

  // 2. Now this Hook gets a REAL ID (e.g., "user-123") instead of undefined
  const { isOnline, lastSeen } = useParticipantStatus(otherParticipantId);

  // 3. Create the clean object for the Header
  const otherParticipant = otherParticipantData
    ? {
        id: otherParticipantData.id,
        name: otherParticipantData.full_name, // Mapped correctly from DB
        avatar: otherParticipantData.avatar_url, // Mapped correctly from DB
        type: 'client' as const,
        isOnline: isOnline,
        lastSeen: lastSeen,
      }
    : null;
  // ------------------------------------------------------------------

  if (!currentUserId) {
    return (
      <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto overflow-hidden">
      
      {/* Conversation List - Left Sidebar */}
      <div className="w-80 shrink-0 border-r h-full overflow-y-auto">
        <ConversationList
          currentUserId={currentUserId}
          activeConversationId={activeConversation?.id || null}
          onConversationSelect={handleConversationSelect}
          deepLinkConversationId={deepLinkConversationId}
        />
      </div>

      {/* Chat Area - Right Side */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {activeConversation && otherParticipant ? (
          <>
            <div className="shrink-0">
              <ChatHeader
                otherParticipant={otherParticipant as any}
                conversation={activeConversation}
                onConversationDeleted={handleConversationDeleted}
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <MessageList
                conversationId={activeConversation.id}
                currentUserId={currentUserId}
                messages={messages}
                loading={loading}
              />
            </div>

            <div className="shrink-0">
              <MessageInput conversationId={activeConversation.id} onSendMessage={sendMessage} />
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}