import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestFinalPayment } from './projects';

export function useRequestFinalPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => requestFinalPayment(projectId),
    onSuccess: (_, projectId) => {
      // Invalidate project updates to show new request
      queryClient.invalidateQueries({
        queryKey: ['project-updates', projectId],
      });
    },
  });
}
