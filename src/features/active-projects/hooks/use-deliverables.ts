import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fetchProjectDeliverables,
  submitDeliverable,
  reviewDeliverable,
  type SubmitDeliverableParams,
  type ReviewDeliverableParams,
} from '../api/deliverables';
import { projectKeys } from '@/features/projects/hooks/use-projects';
import { dashboardKeys } from '@/features/dashboard/hooks/use-dashboard';

/**
 * Query keys for deliverables
 */
export const deliverableKeys = {
  all: ['deliverables'] as const,
  project: (projectId: string) => [...deliverableKeys.all, 'project', projectId] as const,
};

/**
 * Fetch deliverables for a project
 */
export function useProjectDeliverables(projectId: string) {
  return useQuery({
    queryKey: deliverableKeys.project(projectId),
    queryFn: () => fetchProjectDeliverables(projectId),
    enabled: !!projectId,
  });
}

/**
 * Submit a deliverable (freelancer)
 */
export function useSubmitDeliverable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SubmitDeliverableParams) => submitDeliverable(params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: deliverableKeys.project(data.project_id) });
      queryClient.invalidateQueries({ queryKey: ['project', data.project_id] });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(data.project_id) });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      toast.success('Work submitted successfully! Client will be notified.');
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit work: ${error.message}`);
    },
  });
}

/**
 * Review a deliverable (client)
 */
export function useReviewDeliverable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ReviewDeliverableParams) => reviewDeliverable(params),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: deliverableKeys.project(data.project_id) });
      queryClient.invalidateQueries({ queryKey: ['project', data.project_id] });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });

      if (variables.status === 'approved') {
        toast.success('Work approved! Freelancer has been notified.');
      } else {
        toast.success('Revision request sent to freelancer.');
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to review work: ${error.message}`);
    },
  });
}
