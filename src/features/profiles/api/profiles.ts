import { supabase } from '@/lib/supabase';
import type { ClientProfileData, FreelancerProfileData } from '../types';

// API Error class
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Fetch client profile by user ID
 * @param userId - The user ID to fetch profile for
 * @returns Promise<ClientProfileData>
 */
export const getClientProfile = async (userId: string): Promise<ClientProfileData> => {
  // Fetch user data
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (userError) {
    console.error('User fetch error:', userError);
    throw new ApiError(404, `User not found: ${userError.message}`);
  }

  if (!user) {
    console.error('No user data returned for ID:', userId);
    throw new ApiError(404, 'User not found');
  }

  // Fetch client profile
  const { data: profileData, error: profileError } = await supabase
    .from('client_profiles')
    .select('*')
    .eq('user_id', userId);

  if (profileError) {
    if (profileError.code === 'PGRST116') {
      throw new ApiError(404, 'Client profile not found');
    }
    throw new ApiError(500, profileError.message);
  }

  const profile = profileData?.[0] ?? null;

  if (!profile) {
    throw new ApiError(404, 'Client profile not found');
  }

  // Map Supabase data to ClientProfileData type
  return {
    id: user.id,
    name: user.full_name,
    title: 'Client',
    company: user.company_name || '',
    avatar: user.avatar_url || profile.profile_image || '',
    location: profile.location || '',
    memberSince: new Date(user.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    }),
    rating: 5.0,
    reviewCount: 0,
    verified: user.email_verified,
    industries: profile.industry ? [profile.industry] : [],
    bio: profile.about_company || '',
    lookingFor: profile.project_goals
      ? profile.project_goals.map((goal: string) => ({
          title: goal,
          description: '',
        }))
      : [],
    stats: {
      memberSince: new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      }),
      projectsPosted: 0, // TODO: Calculate from projects table
      totalSpent: '$0', // TODO: Calculate from payments table
      repeatExperts: '0%',
      avgProjectSize: '$0',
    },
    verification: {
      paymentMethodVerified: true,
      businessLicenseVerified: false,
      taxIdVerified: false,
      phoneVerified: !!user.phone,
      emailVerified: user.email_verified,
    },
    recentActivity: [],
    pastProjects: [],
  };
};

/**
 * Fetch freelancer profile by user ID
 * @param userId - The user ID to fetch profile for
 * @returns Promise<FreelancerProfileData>
 */
export const getFreelancerProfile = async (userId: string): Promise<FreelancerProfileData> => {
  // Fetch user data
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (userError) {
    console.error('User fetch error:', userError);
    throw new ApiError(404, `User not found: ${userError.message}`);
  }

  if (!user) {
    console.error('No user data returned for ID:', userId);
    throw new ApiError(404, 'User not found');
  }

  // Fetch freelancer profile
  const { data: profileData, error: profileError } = await supabase
    .from('freelancer_profiles')
    .select('*')
    .eq('user_id', userId);

  if (profileError) {
    if (profileError.code === 'PGRST116') {
      throw new ApiError(404, 'Freelancer profile not found');
    }
    throw new ApiError(500, profileError.message);
  }

  const profile = profileData?.[0] ?? null;

  if (!profile) {
    throw new ApiError(404, 'Freelancer profile not found');
  }

  // Stats: completed projects + total earnings from successful transactions
  const [{ count: completedProjects = 0, error: completedProjectsError }, { data: earningsData, error: earningsError }] =
    await Promise.all([
      supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .eq('hired_freelancer_id', userId)
        .eq('status', 'completed'),
      supabase
        .from('payment_transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('type', 'payment')
        .in('status', ['succeeded', 'completed']),
    ]);

  if (completedProjectsError) {
    throw new ApiError(500, `Failed to load completed projects: ${completedProjectsError.message}`);
  }

  if (earningsError) {
    throw new ApiError(500, `Failed to load earnings: ${earningsError.message}`);
  }

  const totalEarnedCents = (earningsData ?? []).reduce((sum, tx) => sum + tx.amount, 0);
  const totalEarnedFormatted = `$${(totalEarnedCents / 100).toFixed(2)}`;

  // Map Supabase data to FreelancerProfileData type
  return {
    id: user.id,
    name: user.full_name,
    title: profile.title || 'AI Expert',
    avatar: user.avatar_url || profile.profile_image || '',
    location: profile.location || '',
    timezone: 'UTC', // TODO: Add to database
    hourlyRate: {
      min: profile.hourly_rate ? Number(profile.hourly_rate) - 10 : 50,
      max: profile.hourly_rate ? Number(profile.hourly_rate) + 10 : 100,
    },
    rating: 5.0,
    reviewCount: 0,
    verified: user.email_verified,
    skills: profile.skills || [],
    bio: profile.bio || '',
    expertise: profile.skills || [],
    certifications: [],
    // Use new portfolio JSONB column, fallback to old single-item columns for backward compatibility
    portfolio: profile.portfolio && Array.isArray(profile.portfolio) && profile.portfolio.length > 0
      ? profile.portfolio.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          tags: item.tags || [],
          imageUrl: item.imageUrl || undefined,
          url: item.url || undefined,
        }))
      : profile.portfolio_title
      ? [
          {
            id: '1',
            title: profile.portfolio_title,
            description: profile.portfolio_description || '',
            tags: profile.portfolio_tags || [],
            imageUrl: profile.portfolio_image || undefined,
          },
        ]
      : [],
    reviews: [],
    experience: (profile.work_experience as any[]) || [],
    stats: {
      projectsCompleted: completedProjects || 0,
      totalEarnings: totalEarnedFormatted,
      repeatClients: '0%',
      onTimeDelivery: '100%',
    },
    availability: {
      status: 'Available',
      responseTime: '< 2 hours',
    },
    languages: [
      {
        language: 'English',
        proficiency: 'Native',
      },
    ],
    topTechnologies: profile.skills
      ? profile.skills.slice(0, 5).map((skill: string) => ({
          name: skill,
          level: 'Expert',
        }))
      : [],
  };
};

/**
 * Update client profile
 * @param userId - The user ID
 * @param data - Partial profile data to update
 * @returns Promise<ClientProfileData>
 */
export const updateClientProfile = async (
  userId: string,
  data: Partial<ClientProfileData>
): Promise<ClientProfileData> => {
  // Update user table if needed
  const userUpdates: Record<string, any> = {};
  if (data.name !== undefined) userUpdates.full_name = data.name;
  if (data.avatar !== undefined) userUpdates.avatar_url = data.avatar;
  if (data.company !== undefined) userUpdates.company_name = data.company;

  if (Object.keys(userUpdates).length > 0) {
    const { error: userError } = await supabase
      .from('users')
      .update(userUpdates)
      .eq('id', userId);

    if (userError) {
      throw new ApiError(500, userError.message);
    }
  }

  // Update client profile table
  const profileUpdates: Record<string, any> = {};
  if (data.location !== undefined) profileUpdates.location = data.location;
  if (data.industries !== undefined && data.industries.length > 0) {
    profileUpdates.industry = data.industries[0];
  }
  if (data.bio !== undefined) profileUpdates.about_company = data.bio;

  if (Object.keys(profileUpdates).length > 0) {
    const { error: profileError } = await supabase
      .from('client_profiles')
      .update(profileUpdates)
      .eq('user_id', userId);

    if (profileError) {
      throw new ApiError(500, profileError.message);
    }
  }

  // Fetch and return updated profile
  return await getClientProfile(userId);
};

/**
 * Update freelancer profile
 * @param userId - The user ID
 * @param data - Partial profile data to update
 * @returns Promise<FreelancerProfileData>
 */
export const updateFreelancerProfile = async (
  userId: string,
  data: Partial<FreelancerProfileData>
): Promise<FreelancerProfileData> => {
  // Update user table if needed
  const userUpdates: Record<string, any> = {};
  if (data.name !== undefined) userUpdates.full_name = data.name;
  if (data.avatar !== undefined) userUpdates.avatar_url = data.avatar;

  if (Object.keys(userUpdates).length > 0) {
    const { error: userError } = await supabase
      .from('users')
      .update(userUpdates)
      .eq('id', userId);

    if (userError) {
      throw new ApiError(500, userError.message);
    }
  }

  // Update freelancer profile table
  const profileUpdates: Record<string, any> = {};
  if (data.title !== undefined) profileUpdates.title = data.title;
  if (data.location !== undefined) profileUpdates.location = data.location;
  if (data.bio !== undefined) profileUpdates.bio = data.bio;
  if (data.hourlyRate !== undefined) {
    // Use the average of min and max for storage
    const avgRate = (data.hourlyRate.min + data.hourlyRate.max) / 2;
    profileUpdates.hourly_rate = avgRate;
  }
  if (data.skills !== undefined) profileUpdates.skills = data.skills;

  if (Object.keys(profileUpdates).length > 0) {
    const { error: profileError } = await supabase
      .from('freelancer_profiles')
      .update(profileUpdates)
      .eq('user_id', userId);

    if (profileError) {
      throw new ApiError(500, profileError.message);
    }
  }

  // Fetch and return updated profile
  return await getFreelancerProfile(userId);
};

/**
 * Update freelancer bio
 * @param userId - The user ID
 * @param bio - New bio text
 * @returns Promise<void>
 */
export const updateFreelancerBio = async (
  userId: string,
  bio: string
): Promise<void> => {
  const { error } = await supabase
    .from('freelancer_profiles')
    .update({ bio, updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  if (error) {
    throw new ApiError(500, `Failed to update bio: ${error.message}`);
  }
};

/**
 * Update freelancer skills
 * @param userId - The user ID
 * @param skills - Array of skill strings
 * @returns Promise<void>
 */
export const updateFreelancerSkills = async (
  userId: string,
  skills: string[]
): Promise<void> => {
  const { error } = await supabase
    .from('freelancer_profiles')
    .update({ skills, updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  if (error) {
    throw new ApiError(500, `Failed to update skills: ${error.message}`);
  }
};

/**
 * Add portfolio item to freelancer's portfolio array
 * @param userId - The user ID
 * @param portfolioItem - Portfolio item data
 * @returns Promise<void>
 */
export const addFreelancerPortfolio = async (
  userId: string,
  portfolioItem: {
    title: string;
    description: string;
    tags: string[];
    imageUrl?: string;
    url?: string;
  }
): Promise<void> => {
  // First, get current portfolio
  const { data: profileData, error: fetchError } = await supabase
    .from('freelancer_profiles')
    .select('portfolio')
    .eq('user_id', userId);

  if (fetchError) {
    throw new ApiError(500, `Failed to fetch profile: ${fetchError.message}`);
  }

  const profile = profileData?.[0] ?? null;

  if (!profile) {
    throw new ApiError(404, 'Failed to fetch profile');
  }

  // Add new portfolio item to the array with a generated ID
  const currentPortfolio = (profile.portfolio as any[]) || [];
  const newPortfolioItem = {
    id: crypto.randomUUID(),
    title: portfolioItem.title,
    description: portfolioItem.description,
    tags: portfolioItem.tags,
    imageUrl: portfolioItem.imageUrl || null,
    url: portfolioItem.url || null,
  };
  const updatedPortfolio = [...currentPortfolio, newPortfolioItem];

  // Update the profile
  const { error: updateError } = await supabase
    .from('freelancer_profiles')
    .update({
      portfolio: updatedPortfolio,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (updateError) {
    throw new ApiError(500, `Failed to add portfolio item: ${updateError.message}`);
  }
};

/**
 * Update existing portfolio item
 * @param userId - The user ID
 * @param portfolioId - ID of the portfolio item to update
 * @param portfolioItem - Updated portfolio item data
 * @returns Promise<void>
 */
export const updateFreelancerPortfolio = async (
  userId: string,
  portfolioId: string,
  portfolioItem: {
    title: string;
    description: string;
    tags: string[];
    imageUrl?: string;
    url?: string;
  }
): Promise<void> => {
  // First, get current portfolio
  const { data: profileData, error: fetchError } = await supabase
    .from('freelancer_profiles')
    .select('portfolio')
    .eq('user_id', userId);

  if (fetchError) {
    throw new ApiError(500, `Failed to fetch profile: ${fetchError.message}`);
  }

  const profile = profileData?.[0] ?? null;

  if (!profile) {
    throw new ApiError(404, 'Failed to fetch profile');
  }

  // Update the specific portfolio item
  const currentPortfolio = (profile.portfolio as any[]) || [];
  const updatedPortfolio = currentPortfolio.map((item: any) =>
    item.id === portfolioId
      ? {
          ...item,
          title: portfolioItem.title,
          description: portfolioItem.description,
          tags: portfolioItem.tags,
          imageUrl: portfolioItem.imageUrl || null,
          url: portfolioItem.url || null,
        }
      : item
  );

  // Update the profile
  const { error: updateError } = await supabase
    .from('freelancer_profiles')
    .update({
      portfolio: updatedPortfolio,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (updateError) {
    throw new ApiError(500, `Failed to update portfolio item: ${updateError.message}`);
  }
};

/**
 * Delete portfolio item
 * @param userId - The user ID
 * @param portfolioId - ID of the portfolio item to delete
 * @returns Promise<void>
 */
export const deleteFreelancerPortfolio = async (
  userId: string,
  portfolioId: string
): Promise<void> => {
  // First, get current portfolio
  const { data: profileData, error: fetchError } = await supabase
    .from('freelancer_profiles')
    .select('portfolio')
    .eq('user_id', userId);

  if (fetchError) {
    throw new ApiError(500, `Failed to fetch profile: ${fetchError.message}`);
  }

  const profile = profileData?.[0] ?? null;

  if (!profile) {
    throw new ApiError(404, 'Failed to fetch profile');
  }

  // Remove the portfolio item
  const currentPortfolio = (profile.portfolio as any[]) || [];
  const updatedPortfolio = currentPortfolio.filter((item: any) => item.id !== portfolioId);

  // Update the profile
  const { error: updateError } = await supabase
    .from('freelancer_profiles')
    .update({
      portfolio: updatedPortfolio,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (updateError) {
    throw new ApiError(500, `Failed to delete portfolio item: ${updateError.message}`);
  }
};

/**
 * Add work experience entry
 * @param userId - The user ID
 * @param experience - Work experience data
 * @returns Promise<void>
 */
export const addFreelancerExperience = async (
  userId: string,
  experience: {
    position: string;
    company: string;
    period: string;
    description: string;
  }
): Promise<void> => {
  // First, get current work experience
  const { data: profileData, error: fetchError } = await supabase
    .from('freelancer_profiles')
    .select('work_experience')
    .eq('user_id', userId);

  if (fetchError) {
    throw new ApiError(500, `Failed to fetch profile: ${fetchError.message}`);
  }

  const profile = profileData?.[0] ?? null;

  if (!profile) {
    throw new ApiError(404, 'Failed to fetch profile');
  }

  // Add new experience to the array
  const currentExperience = (profile.work_experience as any[]) || [];
  const updatedExperience = [...currentExperience, experience];

  // Update the profile
  const { error: updateError } = await supabase
    .from('freelancer_profiles')
    .update({
      work_experience: updatedExperience,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (updateError) {
    throw new ApiError(500, `Failed to add experience: ${updateError.message}`);
  }
};

/**
 * Update client bio
 * @param userId - The user ID
 * @param bio - New bio text (about_company field)
 * @returns Promise<void>
 */
export const updateClientBio = async (
  userId: string,
  bio: string
): Promise<void> => {
  const { error } = await supabase
    .from('client_profiles')
    .update({ about_company: bio, updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  if (error) {
    throw new ApiError(500, `Failed to update bio: ${error.message}`);
  }
};
