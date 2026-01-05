import { supabase, createClient } from '@/lib/supabase';
import { createNotification } from '@/features/notifications/api/notifications';
import { paths } from '@/config/paths';
import type { ProjectPostingFormData } from '../types';

/**
 * Project data types
 */
export interface Project {
  id: string;
  client_id: string;
  title: string;
  category: string;
  description: string;
  skills: string[];
  fixed_budget: number;
  timeline: string;
  attachments: any[];
  invited_freelancers: string[];
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
  proposal_count: number;
  hired_freelancer_id: string | null;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  closed_at: string | null;
  upfront_paid?: boolean;
  final_paid?: boolean;
  upfront_date?: string | null;
  final_date?: string | null;
}

export interface ProjectWithClient extends Project {
  client: {
    id: string;
    full_name: string;
    company_name: string | null;
    avatar_url: string | null;
    created_at: string;
  };
  proposals?: {
    total_budget: number;
    status: string;
    duration_value?: number | null;
    duration_unit?: 'days' | 'weeks' | 'months' | null;
    timeline?: string | null;
    created_at?: string;
  }[];
}

export interface CreateProjectParams {
  title: string;
  category: string;
  description: string;
  skills: string[];
  budgetAmount: string;
  timeline: string;
  location?: string; // Note: Not stored in DB as we're remote-only, but kept for form compatibility
  attachments?: any[];
  invitedFreelancers?: string[];
  isPublished?: boolean;
}

export interface UpdateProjectParams {
  title?: string;
  category?: string;
  description?: string;
  skills?: string[];
  fixed_budget?: number;
  timeline?: string;
  attachments?: any[];
  invited_freelancers?: string[];
  status?: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
  is_published?: boolean;
  is_featured?: boolean;
}

const CATEGORY_SKILL_MAP: Record<string, string[]> = {
  // AI Support/Chatbots
  'cd712613-4973-43ef-aabf-0b50a822d69f': [
    'GPT-4',
    'ChatGPT',
    'OpenAI API',
    'API Integration',
    'Claude API',
  ],
  // Data Entry/Automation
  'b5ac074a-d3dd-4829-b008-5a15d664996a': [
    'Python',
    'Automation',
    'RPA',
    'ETL',
    'Excel',
    'API Integration',
    'Google Cloud',
    'Docker',
    'React',
  ],
  // Social Media Automation
  'fe3fee36-061e-440e-91d9-6412dfac504c': [
    'Marketing',
    'Social Media',
    'Content Automation',
    'Copywriting',
    'Zapier',
    'ChatGPT',
    'GPT-4',
    'OpenAI API',
    'API Integration',
    'React',
  ],
};

async function autoInviteFreelancers(projectId: string, categoryId: string, clientId: string) {
  const skills = CATEGORY_SKILL_MAP[categoryId];
  if (!skills || skills.length === 0) return;

  try {
    const { data: freelancers, error: freelancerError } = await supabase
      .from('freelancer_profiles')
      .select('user_id')
      .overlaps('skills', skills)
      .limit(20);

    if (freelancerError) {
      console.error('Failed to fetch freelancers for auto-invite:', freelancerError);
      return;
    }

    if (!freelancers || freelancers.length === 0) return;

    const invites = freelancers.slice(0, 20).map((freelancer) => ({
      project_id: projectId,
      client_id: clientId,
      freelancer_id: freelancer.user_id,
    }));

    const { error: inviteError } = await supabase.from('project_invitations').insert(invites);
    if (inviteError) {
      console.error('Failed to insert project invitations:', inviteError);
    }
  } catch (error) {
    console.error('Auto-invite failed:', error);
  }
}

/**
 * Fetch all published projects
 */
export async function fetchPublishedProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      client:users!projects_client_id_fkey(
        id,
        full_name,
        company_name,
        avatar_url,
        created_at
      ),
      proposals:proposals!proposals_project_id_fkey(
        total_budget,
        status,
        duration_value,
        duration_unit,
        timeline,
        created_at
      )
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ProjectWithClient[];
}

/**
 * Fetch projects by client ID
 */
export async function fetchClientProjects(clientId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      client:users!projects_client_id_fkey(
        id,
        full_name,
        company_name,
        avatar_url,
        created_at
      ),
      proposals:proposals!proposals_project_id_fkey(
        total_budget,
        status,
        duration_value,
        duration_unit,
        timeline,
        created_at
      )
    `)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ProjectWithClient[];
}

/**
 * Fetch a single project by ID
 */
export const fetchProjectById = async (id: string): Promise<ProjectWithClient | null> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      client:users!projects_client_id_fkey(
        id,
        full_name,
        company_name,
        avatar_url,
        created_at
      ),
      proposals:proposals!proposals_project_id_fkey(
        total_budget,
        status,
        duration_value,
        duration_unit,
        timeline,
        created_at
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  return data as ProjectWithClient;
};

/**
 * Create a new project
 */
export async function createProject(params: CreateProjectParams) {
  const {
    title,
    category,
    description,
    skills,
    budgetAmount,
    timeline,
    attachments = [],
    invitedFreelancers = [],
    isPublished = true,
  } = params;

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .insert({
      client_id: user.id,
      title,
      category,
      description,
      skills,
      fixed_budget: parseFloat(budgetAmount),
      timeline,
      attachments,
      invited_freelancers: invitedFreelancers,
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    })
    .select(`
      *,
      client:users!projects_client_id_fkey(
        id,
        full_name,
        company_name,
        avatar_url,
        created_at
      )
    `)
    .single();

  if (error) throw error;

  // Auto-invite relevant freelancers based on service category (stored in category)
  if (category) {
    await autoInviteFreelancers(data.id, category, user.id);
  }

  // Send notifications to invited freelancers
  if (invitedFreelancers.length > 0 && isPublished) {
    const clientName = data.client.company_name || data.client.full_name;

    // Send notification to each invited freelancer
    for (const freelancerId of invitedFreelancers) {
      try {
        await createNotification({
          user_id: freelancerId,
          category: 'project_opportunity',
          type: 'project_invitation',
          title: 'Project Invitation',
          message: `${clientName} invited you to submit a proposal for "${title}"`,
          project_id: data.id,
          actor_id: user.id,
          metadata: {
            project_title: title,
            client_name: clientName,
            budget: parseFloat(budgetAmount),
            timeline,
            category,
            skills,
          },
          action_url: paths.app.projectDetail.getHref(data.id),
        });
      } catch (notificationError) {
        // Log error but don't fail the project creation
        console.error('Failed to send invitation notification:', notificationError);
      }
    }
  }

  return data as ProjectWithClient;
}

/**
 * Update an existing project
 */
export async function updateProject(projectId: string, params: UpdateProjectParams) {
  const { data, error } = await supabase
    .from('projects')
    .update(params)
    .eq('id', projectId)
    .select(`
      *,
      client:users!projects_client_id_fkey(
        id,
        full_name,
        company_name,
        avatar_url,
        created_at
      )
    `)
    .single();

  if (error) throw error;
  return data as ProjectWithClient;
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string) {
  const { error } = await supabase.from('projects').delete().eq('id', projectId);

  if (error) throw error;
}

/**
 * Publish a draft project
 */
export async function publishProject(projectId: string) {
  return updateProject(projectId, {
    is_published: true,
    status: 'open',
  });
}

/**
 * Close a project
 */
export async function closeProject(projectId: string) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('projects')
    .update({
      status: 'completed',
      closed_at: new Date().toISOString(),
    })
    .eq('id', projectId)
    .select(`
      *,
      client:users!projects_client_id_fkey(
        id,
        full_name,
        company_name,
        avatar_url,
        created_at
      )
    `)
    .single();

  if (error) throw error;

  const notificationTargets = [data?.client_id, data?.hired_freelancer_id].filter(
    Boolean
  ) as string[];

  if (data && notificationTargets.length > 0) {
    const notifications = notificationTargets.map((userId) => ({
      user_id: userId,
      category: 'projects',
      type: 'project_completed',
      title: 'Project Completed',
      message: `The project "${data.title}" has been completed. Please leave a review.`,
      project_id: projectId,
      actor_id: user.id,
      is_read: false,
      action_url: `/projects/${projectId}`,
      metadata: { project_name: data.title, action: 'leave_review' },
    }));

    const { error: notificationError } = await supabase.from('notifications').insert(notifications);
    if (notificationError) {
      console.error('Failed to send completion notifications:', notificationError);
    }
  }

  return data as ProjectWithClient;
}

/**
 * Hire a freelancer for a project
 */
export async function hireFreelancer(projectId: string, freelancerId: string) {
  const { data, error } = await supabase
    .from('projects')
    .update({
      hired_freelancer_id: freelancerId,
      status: 'in_progress',
    })
    .eq('id', projectId)
    .select(`
      *,
      client:users!projects_client_id_fkey(
        id,
        full_name,
        company_name,
        avatar_url,
        created_at
      )
    `)
    .single();

  if (error) throw error;
  return data as ProjectWithClient;
}

/**
 * Invite freelancers to a project
 */
export async function inviteFreelancers(projectId: string, freelancerIds: string[]) {
  // Fetch current invited freelancers and project details
  const { data: project } = await supabase
    .from('projects')
    .select(`
      *,
      client:users!projects_client_id_fkey(
        id,
        full_name,
        company_name,
        avatar_url,
        created_at
      )
    `)
    .eq('id', projectId)
    .single();

  if (!project) throw new Error('Project not found');

  const currentInvites = project.invited_freelancers || [];
  const updatedInvites = [...new Set([...currentInvites, ...freelancerIds])];

  // Find newly invited freelancers (not previously invited)
  const newInvites = freelancerIds.filter((id) => !currentInvites.includes(id));

  // Update project with new invites
  const result = await updateProject(projectId, {
    invited_freelancers: updatedInvites,
  });

  // Send notifications to newly invited freelancers
  if (newInvites.length > 0 && project.is_published) {
    const clientName = project.client.company_name || project.client.full_name;

    for (const freelancerId of newInvites) {
      try {
        await createNotification({
          user_id: freelancerId,
          category: 'project_opportunity',
          type: 'project_invitation',
          title: 'Project Invitation',
          message: `${clientName} invited you to submit a proposal for "${project.title}"`,
          project_id: projectId,
          actor_id: project.client_id,
          metadata: {
            project_title: project.title,
            client_name: clientName,
            budget: project.fixed_budget,
            timeline: project.timeline,
            category: project.category,
            skills: project.skills,
          },
          action_url: paths.app.projectDetail.getHref(projectId),
        });
      } catch (notificationError) {
        console.error('Failed to send invitation notification:', notificationError);
      }
    }
  }

  return result;
}

/**
 * Fetch projects where user is hired freelancer
 */
export async function fetchFreelancerProjects(freelancerId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      client:users!projects_client_id_fkey(
        id,
        full_name,
        company_name,
        avatar_url,
        created_at
      ),
      proposals:proposals!proposals_project_id_fkey(
        total_budget,
        status,
        duration_value,
        duration_unit,
        timeline,
        created_at
      )
    `)
    .eq('hired_freelancer_id', freelancerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ProjectWithClient[];
}

/**
 * Search projects by skills and category
 */
export async function searchProjects(params: {
  skills?: string[];
  category?: string;
  minBudget?: number;
  maxBudget?: number;
}) {
  let query = supabase
    .from('projects')
    .select(`
      *,
      client:users!projects_client_id_fkey(
        id,
        full_name,
        company_name,
        avatar_url,
        created_at
      )
    `)
    .eq('is_published', true);

  if (params.category) {
    query = query.eq('category', params.category);
  }

  if (params.skills && params.skills.length > 0) {
    query = query.overlaps('skills', params.skills);
  }

  if (params.minBudget !== undefined) {
    query = query.gte('fixed_budget', params.minBudget);
  }

  if (params.maxBudget !== undefined) {
    query = query.lte('fixed_budget', params.maxBudget);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) throw error;
  return data as ProjectWithClient[];
}
