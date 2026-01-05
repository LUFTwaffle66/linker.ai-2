// Client Profile Types
export interface ClientStats {
  memberSince: string;
  projectsPosted: number;
  totalSpent: string;
  avgProjectSize: string;
}

export interface ClientVerification {
  paymentMethodVerified: boolean;
  businessLicenseVerified: boolean;
  taxIdVerified: boolean;
  phoneVerified: boolean;
  emailVerified: boolean;
}

export interface ClientActivity {
  action: string;
  date: string;
}

export interface ClientProject {
  id: string;
  title: string;
  status: 'Completed' | 'In Progress' | 'Cancelled';
  budget: string;
  contractor: string;
  rating?: number;
  completedDate: string;
  description: string;
}

export interface ClientProfileData {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  location: string;
  memberSince: string;
  rating: number;
  reviewCount: number;
  average_rating?: number | null;
  total_reviews?: number | null;
  verified: boolean;
  industries: string[];
  bio: string;
  languages: string[];
  lookingFor: Array<{
    title: string;
    description: string;
  }>;
  reviews: ProfileReview[];
  stats: ClientStats;
  verification: ClientVerification;
  recentActivity: ClientActivity[];
  pastProjects: ClientProject[];
}

// Freelancer Profile Types
export interface FreelancerStats {
  projectsCompleted: number;
  totalEarnings: string;
  onTimeDelivery: string;
}

export interface FreelancerAvailability {
  status: 'Available' | 'Busy' | 'Away';
  responseTime: string;
}

export interface FreelancerCertification {
  name: string;
  issuer: string;
  credentialId?: string;
  status: 'Current' | 'Expired';
  icon?: string;
}

export interface FreelancerPortfolio {
  id: number;
  title: string;
  description: string;
  tags: string[];
  url?: string;
  imageUrl?: string;
}

export interface ProfileReview {
  id: string;
  reviewer_id: string;
  reviewer_name: string;
  reviewer_avatar?: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
  project_id?: string | null;
  project_title?: string | null;
}

export interface FreelancerExperience {
  position: string;
  company: string;
  period: string;
  description: string;
}

export interface FreelancerProfileData {
  id: string;
  name: string;
  title: string;
  avatar: string;
  location: string;
  timezone: string;
  hourlyRate: {
    min: number;
    max: number;
  };
  rating: number;
  reviewCount: number;
  average_rating?: number | null;
  total_reviews?: number | null;
  verified: boolean;
  skills: string[];
  bio: string;
  expertise: string[];
  certifications: FreelancerCertification[];
  portfolio: FreelancerPortfolio[];
  reviews: ProfileReview[];
  experience: FreelancerExperience[];
  stats: FreelancerStats;
  availability: FreelancerAvailability;
  languages: string[];
  topTechnologies: Array<{
    name: string;
    level: string;
  }>;
}

export type ProfileType = 'client' | 'freelancer';
