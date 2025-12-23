'use client';

import { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChatHeader, MessageInput, MessageList } from '@/features/messaging';
import { useChatMessages } from '@/features/messaging/hooks/use-chat-messages';
import { useConversation } from '@/features/messaging/hooks/use-conversations';
import { useAuth } from '@/features/auth/lib/auth-client';
import { useRouter } from '@/i18n/routing';

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;

  return <ConversationChatWindow conversationId={conversationId} />;
}

function ConversationChatWindow({ conversationId }: { conversationId: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const { data: conversation, isLoading: isConversationLoading } = useConversation(conversationId);
  const { messages, loading: isMessageLoading, sendMessage } = useChatMessages(conversationId);

  const otherParticipant = useMemo(() => {
    if (!conversation || !user?.id) return null;
    const participant = conversation.participants?.find((p: any) => p.user.id !== user.id);
    if (!participant) return null;

    return {
      id: participant.user.id,
      name: participant.user.full_name || 'Unknown user',
      avatar: participant.user.avatar_url || '',
      type: 'client' as const,
      isOnline: false,
    };
  }, [conversation, user?.id]);

  const isLoading = isConversationLoading || isMessageLoading;

  if (!user) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-muted-foreground">Loading your account...</p>
      </div>
    );
  }

  if (!isLoading && (!conversation || !otherParticipant)) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center space-y-2">
          <p className="font-semibold">Conversation not found</p>
          <Button variant="outline" onClick={() => router.push('/messages')}>
            Go back to messages
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] max-w-5xl mx-auto flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.push('/messages')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to messages
        </Button>
      </div>

      <div className="flex-1 flex flex-col border rounded-lg overflow-hidden bg-background">
        {conversation && otherParticipant ? (
          <ChatHeader
            otherParticipant={otherParticipant}
            conversation={{
              ...conversation,
              isMuted: (conversation as any).isMuted ?? (conversation as any).is_muted ?? false,
              isStarred: (conversation as any).isStarred ?? (conversation as any).is_starred ?? false,
            }}
            onConversationDeleted={() => router.push('/messages')}
          />
        ) : (
          <div className="p-4 border-b text-sm text-muted-foreground">Loading conversation...</div>
        )}

        <MessageList
          conversationId={conversationId}
          currentUserId={user.id}
          messages={messages}
          loading={isLoading}
        />

        <MessageInput conversationId={conversationId} onSendMessage={sendMessage} />
      </div>
    </div>
  );
}
