import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fetchProjectProposals,
  fetchFreelancerProposals,
  fetchProposalById,
  createProposal,
  updateProposal,
  deleteProposal,
  withdrawProposal,
  markProposalAsViewed,
  acceptProposal,
  rejectProposal,
  shortlistProposal,
  reviewProposal,
  getProposalStats,
  type CreateProposalParams,
  type UpdateProposalParams,
} from '../api/proposals';
import { projectKeys } from '@/features/projects/hooks/use-projects';
import { dashboardKeys } from '@/features/dashboard/hooks/use-dashboard';

/**
 * Query keys for proposals
 */
export const proposalKeys = {
  all: ['proposals'] as const,
  lists: () => [...proposalKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...proposalKeys.lists(), filters] as const,
  details: () => [...proposalKeys.all, 'detail'] as const,
  detail: (id: string) => [...proposalKeys.details(), id] as const,
  project: (projectId: string) => [...proposalKeys.all, 'project', projectId] as const,
  freelancer: (freelancerId: string) => [...proposalKeys.all, 'freelancer', freelancerId] as const,
  stats: (projectId: string) => [...proposalKeys.all, 'stats', projectId] as const,
};

/**
 * Fetch proposals for a specific project
 */
export function useProjectProposals(projectId: string) {
  return useQuery({
    queryKey: proposalKeys.project(projectId),
    queryFn: () => fetchProjectProposals(projectId),
    enabled: !!projectId,
  });
}

/**
 * Fetch proposals by a specific freelancer
 */
export function useFreelancerProposals(freelancerId: string) {
  return useQuery({
    queryKey: proposalKeys.freelancer(freelancerId),
    queryFn: () => fetchFreelancerProposals(freelancerId),
    enabled: !!freelancerId,
  });
}

/**
 * Fetch a single proposal by ID
 */
export function useProposal(proposalId: string) {
  return useQuery({
    queryKey: proposalKeys.detail(proposalId),
    queryFn: () => fetchProposalById(proposalId),
    enabled: !!proposalId,
  });
}

/**
 * Fetch proposal statistics for a project
 */
export function useProposalStats(projectId: string) {
  return useQuery({
    queryKey: proposalKeys.stats(projectId),
    queryFn: () => getProposalStats(projectId),
    enabled: !!projectId,
  });
}

/**
 * Create a new proposal
 */
export function useCreateProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateProposalParams) => createProposal(params),
    onSuccess: (data) => {
      // Invalidate project proposals
      queryClient.invalidateQueries({ queryKey: proposalKeys.project(data.project_id) });

      // Invalidate freelancer proposals
      if (data.freelancer_id) {
        queryClient.invalidateQueries({ queryKey: proposalKeys.freelancer(data.freelancer_id) });
      }

      // Invalidate project details to update proposal count
      queryClient.invalidateQueries({ queryKey: ['project', data.project_id] });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(data.project_id) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });

      // Invalidate proposal stats
      queryClient.invalidateQueries({ queryKey: proposalKeys.stats(data.project_id) });

      toast.success('Proposal submitted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit proposal: ${error.message}`);
    },
  });
}

/**
 * Update an existing proposal
 */
export function useUpdateProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ proposalId, params }: { proposalId: string; params: UpdateProposalParams }) =>
      updateProposal(proposalId, params),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.detail(variables.proposalId) });
      queryClient.invalidateQueries({ queryKey: proposalKeys.project(data.project_id) });

      if (data.freelancer_id) {
        queryClient.invalidateQueries({ queryKey: proposalKeys.freelancer(data.freelancer_id) });
      }

      queryClient.invalidateQueries({ queryKey: ['project', data.project_id] });
      queryClient.invalidateQueries({ queryKey: proposalKeys.stats(data.project_id) });

      toast.success('Proposal updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update proposal: ${error.message}`);
    },
  });
}

/**
 * Delete a proposal
 */
export function useDeleteProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (proposalId: string) => deleteProposal(proposalId),
    onSuccess: (_, proposalId) => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
      queryClient.removeQueries({ queryKey: proposalKeys.detail(proposalId) });
      toast.success('Proposal deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete proposal: ${error.message}`);
    },
  });
}

/**
 * Withdraw a proposal
 */
export function useWithdrawProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (proposalId: string) => withdrawProposal(proposalId),
    onSuccess: (data, proposalId) => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.detail(proposalId) });
      queryClient.invalidateQueries({ queryKey: proposalKeys.project(data.project_id) });

      if (data.freelancer_id) {
        queryClient.invalidateQueries({ queryKey: proposalKeys.freelancer(data.freelancer_id) });
      }

      queryClient.invalidateQueries({ queryKey: ['project', data.project_id] });
      queryClient.invalidateQueries({ queryKey: proposalKeys.stats(data.project_id) });

      toast.success('Proposal withdrawn successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to withdraw proposal: ${error.message}`);
    },
  });
}

/**
 * Mark proposal as viewed by client
 */
export function useMarkProposalAsViewed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (proposalId: string) => markProposalAsViewed(proposalId),
    onSuccess: (data, proposalId) => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.detail(proposalId) });
      queryClient.invalidateQueries({ queryKey: proposalKeys.project(data.project_id) });
      queryClient.invalidateQueries({ queryKey: ['project', data.project_id] });
    },
    onError: (error: Error) => {
      console.error('Failed to mark proposal as viewed:', error.message);
    },
  });
}

/**
 * Accept a proposal
 */
export function useAcceptProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ proposalId, feedback }: { proposalId: string; feedback?: string }) =>
      acceptProposal(proposalId, feedback),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.detail(variables.proposalId) });
      queryClient.invalidateQueries({ queryKey: proposalKeys.project(data.project_id) });
      queryClient.invalidateQueries({ queryKey: proposalKeys.stats(data.project_id) });

      // Invalidate project details since hired_freelancer_id changed
      queryClient.invalidateQueries({ queryKey: ['project', data.project_id] });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(data.project_id) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });

      toast.success('Proposal accepted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to accept proposal: ${error.message}`);
    },
  });
}

/**
 * Reject a proposal
 */
export function useRejectProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ proposalId, feedback }: { proposalId: string; feedback?: string }) =>
      rejectProposal(proposalId, feedback),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.detail(variables.proposalId) });
      queryClient.invalidateQueries({ queryKey: proposalKeys.project(data.project_id) });
      queryClient.invalidateQueries({ queryKey: proposalKeys.stats(data.project_id) });
      queryClient.invalidateQueries({ queryKey: ['project', data.project_id] });

      toast.success('Proposal rejected');
    },
    onError: (error: Error) => {
      toast.error(`Failed to reject proposal: ${error.message}`);
    },
  });
}

/**
 * Shortlist a proposal
 */
export function useShortlistProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (proposalId: string) => shortlistProposal(proposalId),
    onSuccess: (data, proposalId) => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.detail(proposalId) });
      queryClient.invalidateQueries({ queryKey: proposalKeys.project(data.project_id) });
      queryClient.invalidateQueries({ queryKey: proposalKeys.stats(data.project_id) });
      queryClient.invalidateQueries({ queryKey: ['project', data.project_id] });

      toast.success('Proposal shortlisted!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to shortlist proposal: ${error.message}`);
    },
  });
}

/**
 * Move proposal to under review
 */
export function useReviewProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (proposalId: string) => reviewProposal(proposalId),
    onSuccess: (data, proposalId) => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.detail(proposalId) });
      queryClient.invalidateQueries({ queryKey: proposalKeys.project(data.project_id) });
      queryClient.invalidateQueries({ queryKey: proposalKeys.stats(data.project_id) });
      queryClient.invalidateQueries({ queryKey: ['project', data.project_id] });

      toast.success('Proposal moved to under review!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update proposal status: ${error.message}`);
    },
  });
}
