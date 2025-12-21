import { supabase } from '@/lib/supabase';
import { createNotification } from '@/features/notifications/api/notifications';
import { paths } from '@/config/paths';
import type { ProposalFormData } from '../types';
import { formatDurationLabel } from '../utils/duration';

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
  duration_value?: number | null;
  duration_unit?: 'days' | 'weeks' | 'months' | null;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn';
  viewed_by_client: boolean;
  client_feedback: string | null;
  attachments?: any[];
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
  duration_value: number;
  duration_unit: 'days' | 'weeks' | 'months';
  timeline?: string;
  attachments?: any[];
}

export interface UpdateProposalParams {
  cover_letter?: string;
  total_budget?: number;
  timeline?: string;
  duration_value?: number | null;
  duration_unit?: 'days' | 'weeks' | 'months' | null;
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
      attachments,
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
      attachments,
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
      attachments,
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
    .maybeSingle();

  if (error) throw error;

  // Return null if no proposal is found
  if (!data) return null;

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
  const { projectId, coverLetter, totalBudget, duration_value, duration_unit, timeline } = params;
  const formattedTimeline = timeline || formatDurationLabel(duration_value, duration_unit);

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Check if user already submitted a proposal for this project
  // Check if user already submitted a proposal for this project
const { data: existingProposal, error } = await supabase
  .from('proposals')
  .select('id')
  .eq('project_id', projectId)
  .eq('freelancer_id', user.id)
  .maybeSingle();

// Unexpected database error
if (error) {
  console.error(error);
  throw new Error('Failed to check existing proposals');
}

// Proposal already exists
if (existingProposal) {
  throw new Error('You have already submitted a proposal for this project');
}

  const { data, error: insertError } = await supabase
    .from('proposals')
    .insert({
      project_id: projectId,
      freelancer_id: user.id,
      cover_letter: coverLetter,
      total_budget: parseFloat(totalBudget),
      timeline: formattedTimeline,
      duration_value,
      duration_unit,
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
        client_id,
        client:users!projects_client_id_fkey(
          id,
          full_name,
          company_name,
          avatar_url
        )
      )
    `)
    .single();

  if (insertError) throw insertError;

  // Send notification to client
  try {
    await createNotification({
      user_id: data.project.client_id,
      category: 'proposal',
      type: 'new_proposal_received',
      title: 'New Proposal Received',
      message: `${data.freelancer.full_name} submitted a proposal for your project "${data.project.title}"`,
      project_id: projectId,
      proposal_id: data.id,
      actor_id: user.id,
      metadata: {
        freelancer_name: data.freelancer.full_name,
        project_title: data.project.title,
        budget: parseFloat(totalBudget),
        timeline: formattedTimeline,
        duration_value,
        duration_unit,
      },
      action_url: paths.app.projectDetail.getHref(projectId),
    });
  } catch (notificationError) {
    // Log error but don't fail the proposal creation
    console.error('Failed to send notification:', notificationError);
  }

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
  const updateData = { ...params };

  if (!updateData.timeline && (updateData.duration_value || updateData.duration_unit)) {
    updateData.timeline = formatDurationLabel(updateData.duration_value ?? undefined, updateData.duration_unit ?? undefined);
  }

  const { data, error } = await supabase
    .from('proposals')
    .update(updateData)
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

  if (!proposal) throw new Error('Proposal not found or could not be updated.');

  // Also update the project to mark this freelancer as hired
  await supabase
    .from('projects')
    .update({
      hired_freelancer_id: proposal.freelancer_id,
      status: 'in_progress',
    })
    .eq('id', proposal.project_id);

  // Create conversation between client and freelancer
  try {
    // Check if a conversation already exists between these two users
    const { data: clientConversations } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', proposal.client.id);

    let conversationExists = false;

    if (clientConversations && clientConversations.length > 0) {
      const conversationIds = clientConversations.map((c) => c.conversation_id);

      const { data: sharedConversation } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', proposal.freelancer_id)
        .in('conversation_id', conversationIds)
        .single();

      if (sharedConversation) {
        conversationExists = true;
      }
    }

    // Create conversation if it doesn't exist
    if (!conversationExists) {
      const { data: newConversation, error: convError } = await supabase
        .from('conversations')
        .insert({})
        .select('id')
        .single();

      if (!convError && newConversation) {
        // Add both participants to the conversation
        await supabase.from('conversation_participants').insert([
          { conversation_id: newConversation.id, user_id: proposal.client.id },
          { conversation_id: newConversation.id, user_id: proposal.freelancer_id },
        ]);
      }
    }
  } catch (conversationError) {
    console.error('Failed to create conversation:', conversationError);
    // Don't throw - conversation can be created later when first message is sent
  }

  // Send notification to freelancer
  try {
    await createNotification({
      user_id: proposal.freelancer_id,
      category: 'proposal',
      type: 'proposal_accepted',
      title: 'Proposal Accepted!',
      message: `Congratulations! Your proposal for "${proposal.project.title}" has been accepted.`,
      project_id: proposal.project_id,
      proposal_id: proposalId,
      actor_id: proposal.client.id,
      metadata: {
        project_title: proposal.project.title,
        client_name: proposal.client.company_name || proposal.client.full_name,
        budget: proposal.total_budget,
        client_feedback: clientFeedback,
      },
      action_url: paths.app.projectDetail.getHref(proposal.project_id),
    });
  } catch (notificationError) {
    console.error('Failed to send notification:', notificationError);
  }

  return proposal;
}

/**
 * Reject a proposal
 */
export async function rejectProposal(proposalId: string, clientFeedback?: string) {
  const proposal = await updateProposal(proposalId, {
    status: 'rejected',
    client_feedback: clientFeedback,
  });

  if (!proposal) throw new Error('Proposal not found or could not be updated.');

  // Send notification to freelancer
  try {
    await createNotification({
      user_id: proposal.freelancer_id,
      category: 'proposal',
      type: 'proposal_declined',
      title: 'Proposal Update',
      message: `Your proposal for "${proposal.project.title}" was not selected.`,
      project_id: proposal.project_id,
      proposal_id: proposalId,
      actor_id: proposal.client.id,
      metadata: {
        project_title: proposal.project.title,
        client_name: proposal.client.company_name || proposal.client.full_name,
        client_feedback: clientFeedback,
      },
      action_url: paths.public.findWork.getHref(),
    });
  } catch (notificationError) {
    console.error('Failed to send notification:', notificationError);
  }

  return proposal;
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
