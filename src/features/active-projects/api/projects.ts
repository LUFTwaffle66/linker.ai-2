import { addDays, format, isValid } from 'date-fns';
import { supabase } from '@/lib/supabase';
import type {
  ProjectInfo,
  ProjectMessage,
  ProjectUpdate,
  ProjectFile,
  SendProjectMessageFormData,
} from '../types';
import { deriveProjectSnapshot } from '@/features/projects/utils/derive-project-status';
import { formatDurationLabel } from '@/features/proposals/utils/duration';

// API Error class
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Get project details
 */
export const getProject = async (projectId: string): Promise<ProjectInfo> => {
  // Fetch core project details
  const { data, error } = await supabase
  .from('projects')
  .select(`
    *,
    client:users!projects_client_id_fkey(
      id,
      full_name,
      company_name,
      avatar_url
    ),
    freelancer:users!projects_hired_freelancer_id_fkey(
      id,
      full_name,
      avatar_url
    )
  `)
  .eq('id', projectId)
  .single();
  if (error || !data) {
    throw new ApiError(404, 'Project not found');
  }
  // Fetch hired freelancer bid (actual agreed budget)
  let freelancerBidAmount = null;

  if (data.hired_freelancer_id) {
    const { data: bidData, error: bidError } = await supabase
      .from('proposals')
      .select('total_budget')
      .eq('project_id', projectId)
      .eq('freelancer_id', data.hired_freelancer_id)
      .maybeSingle();

    if (bidError) {
      console.error("Failed to load freelancer's bid:", bidError);
    }

    freelancerBidAmount = bidData ? Number(bidData.total_budget) : null;
  }


  // Fetch payment intents for this project to derive real payment status
  const { data: paymentIntents, error: paymentError } = await supabase
    .from('payment_intents')
    .select('*')
    .eq('project_id', projectId);

  if (paymentError) {
    console.error('Failed to load payment intents', paymentError);
  }

  const upfrontIntent =
    paymentIntents?.find((pi) => pi.milestone_type === 'upfront_50') ?? null;
  const finalIntent =
    paymentIntents?.find((pi) => pi.milestone_type === 'final_50') ?? null;

  // Use payment transactions as the source of truth for payment status
  const { data: paymentTransactions, error: paymentTxError } = await supabase
    .from('payment_transactions')
    .select('id, status, type, description, created_at, amount')
    .eq('project_id', projectId);

  if (paymentTxError) {
    console.error('Failed to load payment transactions', paymentTxError);
  }

  // Fetch deliverables to drive progress state
  const { data: deliverables, error: deliverablesError } = await supabase
    .from('project_deliverables')
    .select('id, status')
    .eq('project_id', projectId);

  if (deliverablesError) {
    console.error('Failed to load deliverables', deliverablesError);
  }

  // Fetch proposals to derive the agreed-upon duration/timeline
  const { data: projectProposals, error: proposalsError } = await supabase
    .from('proposals')
    .select('id, status, freelancer_id, timeline, duration_value, duration_unit, created_at')
    .eq('project_id', projectId);

  if (proposalsError) {
    console.error('Failed to load proposals for timeline derivation', proposalsError);
  }

  const hiredProposal =
    projectProposals?.find(
      (proposal: any) =>
        proposal.status === 'accepted' &&
        (!data.hired_freelancer_id || proposal.freelancer_id === data.hired_freelancer_id)
    ) ??
    projectProposals?.find(
      (proposal: any) => data.hired_freelancer_id && proposal.freelancer_id === data.hired_freelancer_id
    ) ??
    projectProposals?.find((proposal: any) => proposal.status === 'accepted');

  const convertDurationToDays = (
    value?: number | null,
    unit?: 'days' | 'weeks' | 'months' | null
  ) => {
    if (!value || !unit) return null;
    if (unit === 'months') return value * 30;
    if (unit === 'weeks') return value * 7;
    return value;
  };

  const safeParseDate = (value?: string | null) => {
    if (!value) return null;
    const parsed = new Date(value);
    return isValid(parsed) ? parsed : null;
  };

  const agreedDurationValue = hiredProposal?.duration_value ?? null;
  const agreedDurationUnit = hiredProposal?.duration_unit ?? null;
  const agreedDurationDays = convertDurationToDays(agreedDurationValue, agreedDurationUnit);
  const startedAt = data.started_at ?? data.published_at ?? data.created_at;
  const parsedStartDate = safeParseDate(startedAt);

  const computedDeadline = parsedStartDate && agreedDurationDays
    ? addDays(parsedStartDate, agreedDurationDays)
    : null;

  const deadlineDate = computedDeadline && isValid(computedDeadline)
    ? computedDeadline.toISOString()
    : null;

  const agreedDurationLabel =
    hiredProposal?.timeline ||
    (agreedDurationValue && agreedDurationUnit
      ? formatDurationLabel(agreedDurationValue, agreedDurationUnit)
      : null);

  const deadlineLabel =
    (computedDeadline && isValid(computedDeadline) ? format(computedDeadline, 'MMM d') : null) ||
    agreedDurationLabel ||
    data.timeline;

  const derivedSnapshot = deriveProjectSnapshot({
    project: data,
    paymentIntents,
    paymentTransactions,
    agreedBudgetOverride: freelancerBidAmount,
  });

  // Transform database data to ProjectInfo format
  const projectInfo: ProjectInfo = {
    id: data.id,
    clientId: data.client_id,
    freelancerId: data.hired_freelancer_id,
    title: data.title,
    client: data.client.company_name || data.client.full_name,
    clientAvatar: data.client.avatar_url || '',
    freelancer: data.freelancer?.full_name || '',
    freelancerAvatar: data.freelancer?.avatar_url || '',
    budget: derivedSnapshot.budget,
    upfrontAmount: derivedSnapshot.budget * 0.5,
    finalAmount: derivedSnapshot.budget * 0.5,
    upfrontPaid: derivedSnapshot.upfrontPaid,
    upfrontDate: derivedSnapshot.upfrontDate || data.created_at,
    finalPaid: derivedSnapshot.finalPaid,
    finalDate: derivedSnapshot.finalDate,
    startDate: startedAt,
    startedAt,
    durationValue: agreedDurationValue,
    durationUnit: agreedDurationUnit,
    deadline: deadlineLabel,
    deadlineDate,
    progress: derivedSnapshot.progress,
    status: derivedSnapshot.status as ProjectInfo['status'],
    attachments: (data.attachments ?? []) as any[],
    deliverables: [], // TODO: Add when milestones table is ready
  };

  return projectInfo;
};

/**
 * Get project messages
 * Fetches messages from the messaging system conversation between client and freelancer
 * Automatically creates conversation if it doesn't exist
 */
export const getProjectMessages = async (projectId: string): Promise<ProjectMessage[]> => {
  // Get project details to find client and freelancer
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('client_id, hired_freelancer_id, status')
    .eq('id', projectId)
    .single();

  if (projectError || !project || !project.hired_freelancer_id) {
    return [];
  }

  // Only proceed if project is in progress (freelancer is hired)
  if (project.status !== 'in_progress' && project.status !== 'completed') {
    return [];
  }

  // Find conversation where both client and freelancer are participants
  let conversationId: string | null = null;

  const { data: clientConversations } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', project.client_id);

  if (clientConversations && clientConversations.length > 0) {
    const conversationIds = clientConversations.map(c => c.conversation_id);

    const { data: sharedConversation } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', project.hired_freelancer_id)
      .in('conversation_id', conversationIds)
      .single();

    if (sharedConversation) {
      conversationId = sharedConversation.conversation_id;
    }
  }

  // If no conversation exists, create one automatically
  if (!conversationId) {
    try {
      console.log('Creating new conversation for project:', projectId);
      const { data: newConversation, error: convError } = await supabase
        .from('conversations')
        .insert({})
        .select('id')
        .single();

      if (convError) {
        console.error('Failed to create conversation:', convError);
        return [];
      }

      if (newConversation) {
        conversationId = newConversation.id;
        console.log('Created conversation:', conversationId);

        // Add both participants
        const { error: participantsError } = await supabase
          .from('conversation_participants')
          .insert([
            { conversation_id: conversationId, user_id: project.client_id },
            { conversation_id: conversationId, user_id: project.hired_freelancer_id },
          ]);

        if (participantsError) {
          console.error('Failed to add participants:', participantsError);
          return [];
        }

        console.log('Added participants to conversation');
      } else {
        return [];
      }
    } catch (error) {
      console.error('Exception creating conversation:', error);
      return [];
    }
  }

  // Fetch messages from the conversation
  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select(`
      *,
      sender:users!messages_sender_id_fkey(id, full_name, avatar_url, role)
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (messagesError || !messages) {
    return [];
  }

  // Transform to ProjectMessage format
  return messages.map((msg) => {
    const senderName = msg.sender?.full_name || 'Unknown';
    const senderRole = msg.sender?.role || 'user';
    const initials = senderName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    return {
      id: msg.id,
      sender: msg.sender_id === project.client_id ? 'client' : 'freelancer',
      senderName,
      senderRole,
      avatar: initials,
      content: msg.content,
      timestamp: new Date(msg.created_at).toLocaleTimeString(),
      date: new Date(msg.created_at).toLocaleDateString(),
      type: msg.attachment_url ? 'file' : 'text',
      fileName: msg.attachment_name || undefined,
      fileSize: msg.attachment_size ? `${(msg.attachment_size / 1024).toFixed(1)} KB` : undefined,
    };
  });
};

/**
 * Send a message in project
 * Creates a message in the messaging system conversation
 */
export const sendProjectMessage = async (
  data: SendProjectMessageFormData
): Promise<ProjectMessage> => {
  // Get current user from auth session
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new ApiError(401, 'Not authenticated');

  // Get project details
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('client_id, hired_freelancer_id')
    .eq('id', data.projectId)
    .single();

  if (projectError || !project || !project.hired_freelancer_id) {
    throw new ApiError(404, 'Project not found or no freelancer hired');
  }

  // Find conversation where both client and freelancer are participants
  let conversationId: string | null = null;

  const { data: clientConversations } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', project.client_id);

  if (clientConversations && clientConversations.length > 0) {
    const conversationIds = clientConversations.map(c => c.conversation_id);

    const { data: sharedConversation } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', project.hired_freelancer_id)
      .in('conversation_id', conversationIds)
      .single();

    if (sharedConversation) {
      conversationId = sharedConversation.conversation_id;
    }
  }

  // If no conversation exists, create one
  if (!conversationId) {
    const { data: newConversation, error: convError } = await supabase
      .from('conversations')
      .insert({})
      .select('id')
      .single();

    if (convError || !newConversation) {
      throw new ApiError(500, 'Failed to create conversation');
    }

    conversationId = newConversation.id;

    // Add both participants to the conversation
    const { error: participantsError } = await supabase
      .from('conversation_participants')
      .insert([
        { conversation_id: conversationId, user_id: project.client_id },
        { conversation_id: conversationId, user_id: project.hired_freelancer_id },
      ]);

    if (participantsError) {
      throw new ApiError(500, 'Failed to add participants to conversation');
    }
  }

  // TODO: Handle file attachments upload to storage

  // Insert message
  const { data: message, error: messageError } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: data.content,
      // attachment_url, attachment_name, attachment_size would be set after file upload
    })
    .select(`
      *,
      sender:users!messages_sender_id_fkey(id, full_name, avatar_url, role)
    `)
    .single();

  if (messageError || !message) {
    throw new ApiError(500, 'Failed to send message');
  }

  const senderName = message.sender?.full_name || 'Unknown';
  const senderRole = message.sender?.role || 'user';
  const initials = senderName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return {
    id: message.id,
    sender: message.sender_id === project.client_id ? 'client' : 'freelancer',
    senderName,
    senderRole,
    avatar: initials,
    content: message.content,
    timestamp: new Date(message.created_at).toLocaleTimeString(),
    date: new Date(message.created_at).toLocaleDateString(),
    type: 'text',
  };
};

/**
 * Get project updates
 */
export const getProjectUpdates = async (projectId: string): Promise<ProjectUpdate[]> => {
  const updates: ProjectUpdate[] = [];

  // Fetch deliverables and convert to updates
  const { data: deliverables } = await supabase
    .from('project_deliverables')
    .select(`
      *,
      freelancer:users!project_deliverables_freelancer_id_fkey(
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (deliverables) {
    for (const deliverable of deliverables) {
      const freelancerName = deliverable.freelancer?.full_name || 'Freelancer';
      const freelancerInitials = freelancerName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

      // Add submission update
      updates.push({
        id: `${deliverable.id}-submitted`,
        type: 'deliverable_submitted',
        title: `Work Submitted: ${deliverable.title}`,
        description: deliverable.description || 'Deliverable has been submitted for review',
        user: freelancerName,
        avatar: freelancerInitials,
        timestamp: new Date(deliverable.submitted_at).toLocaleString(),
        date: new Date(deliverable.submitted_at).toLocaleDateString(),
      });

      // Add review update if reviewed
      if (deliverable.reviewed_at) {
        if (deliverable.status === 'approved') {
          updates.push({
            id: `${deliverable.id}-approved`,
            type: 'deliverable_approved',
            title: `Work Approved: ${deliverable.title}`,
            description: deliverable.review_feedback || 'Work has been approved by client',
            user: 'Client',
            avatar: 'CL',
            timestamp: new Date(deliverable.reviewed_at).toLocaleString(),
            date: new Date(deliverable.reviewed_at).toLocaleDateString(),
          });
        } else if (deliverable.status === 'revision_requested') {
          updates.push({
            id: `${deliverable.id}-revision`,
            type: 'deliverable_revision_requested',
            title: `Revision Requested: ${deliverable.title}`,
            description: deliverable.review_feedback || 'Client has requested revisions',
            user: 'Client',
            avatar: 'CL',
            timestamp: new Date(deliverable.reviewed_at).toLocaleString(),
            date: new Date(deliverable.reviewed_at).toLocaleDateString(),
          });
        }
      }
    }
  }

  // Sort all updates by timestamp (most recent first)
  updates.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return updates;
};

/**
 * Get project files
 */
export const getProjectFiles = async (projectId: string): Promise<ProjectFile[]> => {
  // TODO: Implement real file fetching from database
  return [];
};

/**
 * Upload file to project
 */
export const uploadProjectFile = async (
  projectId: string,
  file: File
): Promise<ProjectFile> => {
  // TODO: Implement real file upload to storage and database
  throw new ApiError(501, 'Not implemented yet');
};

/**
 * Request final payment
 */
export const requestFinalPayment = async (projectId: string): Promise<void> => {
  // TODO: Implement real payment request logic
  throw new ApiError(501, 'Not implemented yet');
};
