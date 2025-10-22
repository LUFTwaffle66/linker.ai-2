import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getConversations,
  getConversation,
  updateConversationSettings,
  deleteConversation,
  searchConversations,
} from '../api/messaging';
import type { ConversationSettings } from '../types';
import { useAuth } from '@/features/auth/lib/auth-client';

export const messagingKeys = {
  all: ['messaging'] as const,
  conversations: (userId?: string) => [...messagingKeys.all, 'conversations', userId] as const,
  conversation: (id: string) => [...messagingKeys.all, 'conversation', id] as const,
  messages: (conversationId: string) => [...messagingKeys.all, 'messages', conversationId] as const,
  search: (query: string, userId?: string) => [...messagingKeys.all, 'search', query, userId] as const,
};

/**
 * Hook to fetch all conversations for the current user
 */
export function useConversations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: messagingKeys.conversations(user?.id),
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return getConversations(user.id);
    },
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000, // Consider data fresh for 1 minute
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
}

/**
 * Hook to fetch a single conversation
 * @param conversationId - The conversation ID
 */
export function useConversation(conversationId: string) {
  return useQuery({
    queryKey: messagingKeys.conversation(conversationId),
    queryFn: () => getConversation(conversationId),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to update conversation settings (mute, star, block)
 */
export function useUpdateConversationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      settings,
    }: {
      conversationId: string;
      settings: Partial<ConversationSettings>;
    }) => updateConversationSettings(conversationId, settings),
    onSuccess: (updatedConversation: any) => {
      // Update the specific conversation in cache
      if (updatedConversation?.id) {
        queryClient.setQueryData(
          messagingKeys.conversation(updatedConversation.id),
          updatedConversation
        );
      }

      // Invalidate the conversations list to reflect changes
      queryClient.invalidateQueries({
        queryKey: messagingKeys.conversations(),
      });
    },
  });
}

/**
 * Hook to delete a conversation
 */
export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => deleteConversation(conversationId),
    onSuccess: (_, conversationId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: messagingKeys.conversation(conversationId),
      });

      // Invalidate conversations list
      queryClient.invalidateQueries({
        queryKey: messagingKeys.conversations(),
      });

      // Remove messages for this conversation
      queryClient.removeQueries({
        queryKey: messagingKeys.messages(conversationId),
      });
    },
  });
}

/**
 * Hook to search conversations
 * @param query - Search query
 */
export function useSearchConversations(query: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: messagingKeys.search(query, user?.id),
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return searchConversations(query);
    },
    enabled: query.length > 0 && !!user?.id,
    staleTime: 30 * 1000, // 30 seconds
  });
}
