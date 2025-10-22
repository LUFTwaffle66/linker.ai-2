import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  ClientOnboardingData,
  FreelancerOnboardingData,
} from './validations';

// =============================================
// Client Profile Functions
// =============================================

export interface ClientProfile {
  id: string;
  user_id: string;
  profile_image?: string;
  location?: string;
  website?: string;
  industry?: string;
  company_size?: string;
  about_company?: string;
  project_goals?: string[];
  project_description?: string;
  budget_range?: 'small' | 'medium' | 'large' | 'enterprise';
  timeline?: 'urgent' | 'short' | 'medium' | 'long';
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export async function createClientProfile(
  supabase: SupabaseClient,
  userId: string,
  data: ClientOnboardingData
): Promise<ClientProfile> {
  const { data: profile, error } = await supabase
    .from('client_profiles')
    .insert({
      user_id: userId,
      profile_image: data.profileImage || null,
      location: data.location,
      website: data.website || null,
      industry: data.industry,
      company_size: data.companySize,
      about_company: data.aboutCompany,
      project_goals: data.projectGoals,
      project_description: data.projectDescription || null,
      budget_range: data.budgetRange,
      timeline: data.timeline,
      onboarding_completed: true,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create client profile: ${error.message}`);
  }

  return profile;
}

export async function updateClientProfile(
  supabase: SupabaseClient,
  userId: string,
  data: Partial<ClientOnboardingData>
): Promise<ClientProfile> {
  const updateData: Record<string, unknown> = {};

  if (data.profileImage !== undefined) updateData.profile_image = data.profileImage;
  if (data.location !== undefined) updateData.location = data.location;
  if (data.website !== undefined) updateData.website = data.website;
  if (data.industry !== undefined) updateData.industry = data.industry;
  if (data.companySize !== undefined) updateData.company_size = data.companySize;
  if (data.aboutCompany !== undefined) updateData.about_company = data.aboutCompany;
  if (data.projectGoals !== undefined) updateData.project_goals = data.projectGoals;
  if (data.projectDescription !== undefined) updateData.project_description = data.projectDescription;
  if (data.budgetRange !== undefined) updateData.budget_range = data.budgetRange;
  if (data.timeline !== undefined) updateData.timeline = data.timeline;

  const { data: profile, error } = await supabase
    .from('client_profiles')
    .update(updateData)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update client profile: ${error.message}`);
  }

  return profile;
}

export async function getClientProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<ClientProfile | null> {
  const { data: profile, error } = await supabase
    .from('client_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    throw new Error(`Failed to get client profile: ${error.message}`);
  }

  return profile;
}

// =============================================
// Freelancer Profile Functions
// =============================================

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
  url?: string;
}

export interface WorkExperience {
  position: string;
  company: string;
  period: string;
  description: string;
}

export interface FreelancerProfile {
  id: string;
  user_id: string;
  profile_image?: string;
  title?: string;
  location?: string;
  bio?: string;
  experience?: number;
  skills?: string[];
  portfolio?: PortfolioItem[]; // JSONB array field
  work_experience?: WorkExperience[]; // JSONB array field
  hourly_rate?: number;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export async function createFreelancerProfile(
  supabase: SupabaseClient,
  userId: string,
  data: FreelancerOnboardingData
): Promise<FreelancerProfile> {
  // Prepare portfolio data - support both new array format and old single-item format
  let portfolioData: PortfolioItem[] = [];

  if (data.portfolio && data.portfolio.length > 0) {
    // New format: array of portfolio items
    portfolioData = data.portfolio.map(item => ({
      id: crypto.randomUUID(),
      title: item.title,
      description: item.description,
      tags: item.tags,
      imageUrl: item.imageUrl || undefined,
      url: item.url || undefined,
    }));
  } else if (data.portfolioTitle && data.portfolioDescription) {
    // Old format: single portfolio item (backward compatibility)
    portfolioData = [{
      id: crypto.randomUUID(),
      title: data.portfolioTitle,
      description: data.portfolioDescription,
      tags: data.portfolioTags || [],
      imageUrl: undefined,
      url: undefined,
    }];
  }

  const { data: profile, error } = await supabase
    .from('freelancer_profiles')
    .insert({
      user_id: userId,
      profile_image: data.profileImage || null,
      title: data.title,
      location: data.location,
      bio: data.bio,
      experience: parseInt(data.experience),
      skills: data.skills,
      portfolio: portfolioData.length > 0 ? portfolioData : [],
      hourly_rate: parseFloat(data.hourlyRate),
      onboarding_completed: true,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create freelancer profile: ${error.message}`);
  }

  return profile;
}

export async function updateFreelancerProfile(
  supabase: SupabaseClient,
  userId: string,
  data: Partial<FreelancerOnboardingData>
): Promise<FreelancerProfile> {
  const updateData: Record<string, unknown> = {};

  if (data.profileImage !== undefined) updateData.profile_image = data.profileImage;
  if (data.title !== undefined) updateData.title = data.title;
  if (data.location !== undefined) updateData.location = data.location;
  if (data.bio !== undefined) updateData.bio = data.bio;
  if (data.experience !== undefined) updateData.experience = parseInt(data.experience);
  if (data.skills !== undefined) updateData.skills = data.skills;
  if (data.hourlyRate !== undefined) updateData.hourly_rate = parseFloat(data.hourlyRate);

  // Handle portfolio updates - support both new array format and old single-item format
  if (data.portfolio !== undefined && data.portfolio.length > 0) {
    // New format: array of portfolio items
    updateData.portfolio = data.portfolio.map(item => ({
      id: crypto.randomUUID(),
      title: item.title,
      description: item.description,
      tags: item.tags,
      imageUrl: item.imageUrl || undefined,
      url: item.url || undefined,
    }));
  } else if (data.portfolioTitle !== undefined && data.portfolioDescription !== undefined) {
    // Old format: convert single portfolio item to array format
    updateData.portfolio = [{
      id: crypto.randomUUID(),
      title: data.portfolioTitle,
      description: data.portfolioDescription,
      tags: data.portfolioTags || [],
      imageUrl: undefined,
      url: undefined,
    }];
  }

  const { data: profile, error } = await supabase
    .from('freelancer_profiles')
    .update(updateData)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update freelancer profile: ${error.message}`);
  }

  return profile;
}

export async function getFreelancerProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<FreelancerProfile | null> {
  const { data: profile, error } = await supabase
    .from('freelancer_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    throw new Error(`Failed to get freelancer profile: ${error.message}`);
  }

  return profile;
}
