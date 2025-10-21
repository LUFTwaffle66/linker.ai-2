import { supabase } from '@/lib/supabase';
import type { ProposalFormData } from '../types';

/**
 * Proposal data types
 */
export interface Proposal {
  id: string;
  project_id: string;
  freelancer_id: string;
  cover_letter: string;
  total_budget: number;
  timeline: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn';
  viewed_by_client: boolean;
  client_feedback: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProposalWithDetails extends Proposal {
  project: {
    id: string;
    title: string;
    category: string;
    description: string;
    fixed_budget: number;
    timeline: string;
    status: string;
  };
  freelancer: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  client: {
    id: string;
    full_name: string;
    company_name: string | null;
    avatar_url: string | null;
  };
}

export interface CreateProposalParams {
  projectId: string;
  coverLetter: string;
  totalBudget: string;
  timeline: string;
  attachments?: any[];
}

export interface UpdateProposalParams {
  cover_letter?: string;
  total_budget?: number;
  timeline?: string;
  status?: 'submitted' | 'under_review' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn';
  viewed_by_client?: boolean;
  client_feedback?: string;
}

/**
 * Fetch proposals by project ID
 */
export async function fetchProjectProposals(projectId: string) {
  const { data, error } = await supabase
    .from('proposals')
    .select(`
      *,
      freelancer:users!proposals_freelancer_id_fkey(
        id,
        full_name,
        avatar_url
      ),
      project:projects!proposals_project_id_fkey(
        id,
        title,
        category,
        description,
        fixed_budget,
        timeline,
        status,
        client:users!projects_client_id_fkey(
          id,
          full_name,
          company_name,
          avatar_url
        )
      )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Flatten the client data from project
  return data.map((proposal) => ({
    ...proposal,
    client: proposal.project.client,
  })) as ProposalWithDetails[];
}

/**
 * Fetch proposals by freelancer ID
 */
export async function fetchFreelancerProposals(freelancerId: string) {
  const { data, error } = await supabase
    .from('proposals')
    .select(`
      *,
      freelancer:users!proposals_freelancer_id_fkey(
        id,
        full_name,
        avatar_url
      ),
      project:projects!proposals_project_id_fkey(
        id,
        title,
        category,
        description,
        fixed_budget,
        timeline,
        status,
        client:users!projects_client_id_fkey(
          id,
          full_name,
          company_name,
          avatar_url
        )
      )
    `)
    .eq('freelancer_id', freelancerId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Flatten the client data from project
  return data.map((proposal) => ({
    ...proposal,
    client: proposal.project.client,
  })) as ProposalWithDetails[];
}

/**
 * Fetch a single proposal by ID
 */
export async function fetchProposalById(proposalId: string) {
  const { data, error } = await supabase
    .from('proposals')
    .select(`
      *,
      freelancer:users!proposals_freelancer_id_fkey(
        id,
        full_name,
        avatar_url
      ),
      project:projects!proposals_project_id_fkey(
        id,
        title,
        category,
        description,
        fixed_budget,
        timeline,
        status,
        client:users!projects_client_id_fkey(
          id,
          full_name,
          company_name,
          avatar_url
        )
      )
    `)
    .eq('id', proposalId)
    .single();

  if (error) throw error;

  // Flatten the client data from project
  return {
    ...data,
    client: data.project.client,
  } as ProposalWithDetails;
}

/**
 * Create a new proposal
 */
export async function createProposal(params: CreateProposalParams) {
  const { projectId, coverLetter, totalBudget, timeline } = params;

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Check if user already submitted a proposal for this project
  const { data: existingProposal } = await supabase
    .from('proposals')
    .select('id')
    .eq('project_id', projectId)
    .eq('freelancer_id', user.id)
    .single();

  if (existingProposal) {
    throw new Error('You have already submitted a proposal for this project');
  }

  const { data, error } = await supabase
    .from('proposals')
    .insert({
      project_id: projectId,
      freelancer_id: user.id,
      cover_letter: coverLetter,
      total_budget: parseFloat(totalBudget),
      timeline,
    })
    .select(`
      *,
      freelancer:users!proposals_freelancer_id_fkey(
        id,
        full_name,
        avatar_url
      ),
      project:projects!proposals_project_id_fkey(
        id,
        title,
        category,
        description,
        fixed_budget,
        timeline,
        status,
        client:users!projects_client_id_fkey(
          id,
          full_name,
          company_name,
          avatar_url
        )
      )
    `)
    .single();

  if (error) throw error;

  // Flatten the client data from project
  return {
    ...data,
    client: data.project.client,
  } as ProposalWithDetails;
}

/**
 * Update an existing proposal
 */
export async function updateProposal(proposalId: string, params: UpdateProposalParams) {
  const { data, error } = await supabase
    .from('proposals')
    .update(params)
    .eq('id', proposalId)
    .select(`
      *,
      freelancer:users!proposals_freelancer_id_fkey(
        id,
        full_name,
        avatar_url
      ),
      project:projects!proposals_project_id_fkey(
        id,
        title,
        category,
        description,
        fixed_budget,
        timeline,
        status,
        client:users!projects_client_id_fkey(
          id,
          full_name,
          company_name,
          avatar_url
        )
      )
    `)
    .single();

  if (error) throw error;

  // Flatten the client data from project
  return {
    ...data,
    client: data.project.client,
  } as ProposalWithDetails;
}

/**
 * Delete/withdraw a proposal
 */
export async function deleteProposal(proposalId: string) {
  const { error } = await supabase.from('proposals').delete().eq('id', proposalId);

  if (error) throw error;
}

/**
 * Withdraw a proposal (soft delete - changes status)
 */
export async function withdrawProposal(proposalId: string) {
  return updateProposal(proposalId, { status: 'withdrawn' });
}

/**
 * Mark proposal as viewed by client
 */
export async function markProposalAsViewed(proposalId: string) {
  return updateProposal(proposalId, { viewed_by_client: true });
}

/**
 * Accept a proposal
 */
export async function acceptProposal(proposalId: string, clientFeedback?: string) {
  const proposal = await updateProposal(proposalId, {
    status: 'accepted',
    client_feedback: clientFeedback,
  });

  // Also update the project to mark this freelancer as hired
  await supabase
    .from('projects')
    .update({
      hired_freelancer_id: proposal.freelancer_id,
      status: 'in_progress',
    })
    .eq('id', proposal.project_id);

  return proposal;
}

/**
 * Reject a proposal
 */
export async function rejectProposal(proposalId: string, clientFeedback?: string) {
  return updateProposal(proposalId, {
    status: 'rejected',
    client_feedback: clientFeedback,
  });
}

/**
 * Shortlist a proposal
 */
export async function shortlistProposal(proposalId: string) {
  return updateProposal(proposalId, { status: 'shortlisted' });
}

/**
 * Move proposal to under review
 */
export async function reviewProposal(proposalId: string) {
  return updateProposal(proposalId, { status: 'under_review' });
}

/**
 * Get proposal statistics for a project
 */
export async function getProposalStats(projectId: string) {
  const { data, error } = await supabase
    .from('proposals')
    .select('status')
    .eq('project_id', projectId);

  if (error) throw error;

  const stats = {
    total: data.length,
    submitted: data.filter((p) => p.status === 'submitted').length,
    under_review: data.filter((p) => p.status === 'under_review').length,
    shortlisted: data.filter((p) => p.status === 'shortlisted').length,
    accepted: data.filter((p) => p.status === 'accepted').length,
    rejected: data.filter((p) => p.status === 'rejected').length,
    withdrawn: data.filter((p) => p.status === 'withdrawn').length,
  };

  return stats;
}
