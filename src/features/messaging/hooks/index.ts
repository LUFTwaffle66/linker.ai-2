import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getConversations,
  getMessages,
  sendMessage,
  createOrGetConversation,
} from '../api/messaging';
import { useChatMessages } from './use-chat-messages';

export const messagingKeys = {
  all: ['messaging'] as const,
  conversations: () => [...messagingKeys.all, 'conversations'] as const,
  conversation: (id: string) => [...messagingKeys.conversations(), id] as const,
  messages: (conversationId: string) => [...messagingKeys.conversation(conversationId), 'messages'] as const,
};

export function useConversations(userId: string) {
  return useQuery({
    queryKey: messagingKeys.conversations(),
    queryFn: () => getConversations(userId),
  });
}

export function useMessages(conversationId: string, userId: string) {
  return useQuery({
    queryKey: messagingKeys.messages(conversationId),
    queryFn: () => getMessages(conversationId, userId),
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, senderId, content }: { conversationId: string; senderId: string; content: string }) =>
      sendMessage(conversationId, senderId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: messagingKeys.messages(variables.conversationId) });
      queryClient.invalidateQueries({ queryKey: messagingKeys.conversations() });
    },
  });
}

export function useCreateOrGetConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId1, userId2 }: { userId1: string; userId2: string }) =>
      createOrGetConversation(userId1, userId2),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagingKeys.conversations() });
    },
  });
}

export { useChatMessages };
