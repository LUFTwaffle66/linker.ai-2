import { supabase } from '@/lib/supabase';

/**
 * Browse data types
 */
export interface BrowseProject {
  id: string;
  client_id: string;
  title: string;
  category: string;
  description: string;
  skills: string[];
  fixed_budget: number;
  timeline: string;
  status: string;
  proposal_count: number;
  is_featured: boolean;
  created_at: string;
  client: {
    id: string;
    full_name: string;
    company_name: string | null;
    avatar_url: string | null;
  };
}

export interface BrowseFreelancer {
  id: string;
  user_id: string;
  title: string;
  bio: string;
  location: string;
  experience: number;
  skills: string[];
  hourly_rate: number;
  portfolio: any[];
  onboarding_completed: boolean;
  user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

export interface BrowseFilters {
  category?: string;
  skills?: string[];
  minBudget?: number;
  maxBudget?: number;
  search?: string;
}

export interface FreelancerFilters {
  skills?: string[];
  minRate?: number;
  maxRate?: number;
  minExperience?: number;
  location?: string;
  search?: string;
  minRating?: number;
  availableOnly?: boolean;
  topRatedOnly?: boolean;
}

/**
 * Fetch all published projects for browse page
 */
export async function fetchBrowseProjects(filters?: BrowseFilters) {
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
    .eq('is_published', true)
    .eq('status', 'open');

  // Apply filters
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.skills && filters.skills.length > 0) {
    query = query.overlaps('skills', filters.skills);
  }

  if (filters?.minBudget !== undefined) {
    query = query.gte('fixed_budget', filters.minBudget);
  }

  if (filters?.maxBudget !== undefined) {
    query = query.lte('fixed_budget', filters.maxBudget);
  }

  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) throw error;
  return data as BrowseProject[];
}

/**
 * Fetch featured projects (for homepage or featured section)
 */
export async function fetchFeaturedProjects(limit: number = 6) {
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
    .eq('is_featured', true)
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as BrowseProject[];
}

/**
 * Fetch all freelancer profiles for browse page
 */
export async function fetchBrowseFreelancers(filters?: FreelancerFilters) {
  let query = supabase
    .from('freelancer_profiles')
    .select(`
      *,
      user:users!freelancer_profiles_user_id_fkey(
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('onboarding_completed', true);

  // Apply filters
  if (filters?.skills && filters.skills.length > 0) {
    query = query.overlaps('skills', filters.skills);
  }

  if (filters?.minRate !== undefined) {
    query = query.gte('hourly_rate', filters.minRate);
  }

  if (filters?.maxRate !== undefined) {
    query = query.lte('hourly_rate', filters.maxRate);
  }

  if (filters?.minExperience !== undefined) {
    query = query.gte('experience', filters.minExperience);
  }

  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }

  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`
    );
  }

  query = query.order('experience', { ascending: false });

  const { data, error } = await query;

  if (error) throw error;
  return data as BrowseFreelancer[];
}

/**
 * Fetch top-rated/featured freelancers
 */
export async function fetchTopFreelancers(limit: number = 8) {
  const { data, error } = await supabase
    .from('freelancer_profiles')
    .select(`
      *,
      user:users!freelancer_profiles_user_id_fkey(
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('onboarding_completed', true)
    .order('experience', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as BrowseFreelancer[];
}

/**
 * Get all unique categories from projects
 */
export async function fetchProjectCategories() {
  const { data, error } = await supabase
    .from('projects')
    .select('category')
    .eq('is_published', true);

  if (error) throw error;

  // Extract unique categories
  const categories = [...new Set(data.map((p) => p.category))].filter(Boolean);
  return categories as string[];
}

/**
 * Get all unique skills from freelancers
 */
export async function fetchFreelancerSkills() {
  const { data, error } = await supabase
    .from('freelancer_profiles')
    .select('skills')
    .eq('onboarding_completed', true);

  if (error) throw error;

  // Flatten and get unique skills
  const allSkills = data.flatMap((f) => f.skills || []);
  const uniqueSkills = [...new Set(allSkills)].filter(Boolean);
  return uniqueSkills as string[];
}

/**
 * Get statistics for browse page
 */
export async function fetchBrowseStats() {
  const [projectsCount, freelancersCount] = await Promise.all([
    supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .eq('is_published', true)
      .eq('status', 'open'),
    supabase
      .from('freelancer_profiles')
      .select('id', { count: 'exact', head: true })
      .eq('onboarding_completed', true),
  ]);

  return {
    totalProjects: projectsCount.count || 0,
    totalFreelancers: freelancersCount.count || 0,
  };
}
