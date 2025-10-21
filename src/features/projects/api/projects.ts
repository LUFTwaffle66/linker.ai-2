import { supabase } from '@/lib/supabase';
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
}

export interface ProjectWithClient extends Project {
  client: {
    id: string;
    full_name: string;
    company_name: string | null;
    avatar_url: string | null;
  };
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
        avatar_url
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
        avatar_url
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
export async function fetchProjectById(projectId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      client:users!projects_client_id_fkey(
        id,
        full_name,
        company_name,
        avatar_url
      )
    `)
    .eq('id', projectId)
    .single();

  if (error) throw error;
  return data as ProjectWithClient;
}

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
        avatar_url
      )
    `)
    .single();

  if (error) throw error;
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
        avatar_url
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
        avatar_url
      )
    `)
    .single();

  if (error) throw error;
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
        avatar_url
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
  // Fetch current invited freelancers
  const { data: project } = await supabase
    .from('projects')
    .select('invited_freelancers')
    .eq('id', projectId)
    .single();

  const currentInvites = project?.invited_freelancers || [];
  const updatedInvites = [...new Set([...currentInvites, ...freelancerIds])];

  return updateProject(projectId, {
    invited_freelancers: updatedInvites,
  });
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
        avatar_url
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
