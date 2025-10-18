import { queryOptions, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjectMessages, sendProjectMessage } from './projects';
import type { SendProjectMessageFormData } from '../types';

export const getProjectMessagesQueryOptions = (projectId: string) => {
  return queryOptions({
    queryKey: ['project-messages', projectId] as const,
    queryFn: () => getProjectMessages(projectId),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export function useProjectMessages(projectId: string) {
  return useQuery(getProjectMessagesQueryOptions(projectId));
}

export function useSendProjectMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendProjectMessageFormData) => sendProjectMessage(data),
    onSuccess: (newMessage, variables) => {
      // Add the new message to the messages cache
      queryClient.setQueryData(
        ['project-messages', variables.projectId],
        (old: any) => {
          if (!old) return [newMessage];
          return [...old, newMessage];
        }
      );
    },
  });
}
