import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { browseKeys } from '@/features/browse';
import { profileKeys } from '@/features/profiles/hooks/use-client-profile';
import { projectKeys } from '@/features/projects/hooks/use-projects';
import { createReview, getReviewByReviewer, type Review } from '../api/reviews';

export const reviewKeys = {
  all: ['reviews'] as const,
  projectReviewer: (projectId: string, reviewerId: string) =>
    [...reviewKeys.all, 'project', projectId, 'reviewer', reviewerId] as const,
};

export function useProjectReview(
  projectId?: string,
  reviewerId?: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey:
      projectId && reviewerId
        ? reviewKeys.projectReviewer(projectId, reviewerId)
        : reviewKeys.all,
    queryFn: () => getReviewByReviewer(projectId!, reviewerId!),
    enabled: Boolean(projectId && reviewerId && enabled),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.projectReviewer(variables.projectId, variables.reviewerId),
      });
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: profileKeys.freelancer(variables.revieweeId) });
      queryClient.invalidateQueries({ queryKey: profileKeys.client(variables.revieweeId) });
      queryClient.invalidateQueries({ queryKey: browseKeys.freelancers() });
      toast.success('Review submitted!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit review: ${error.message}`);
    },
  });
}
