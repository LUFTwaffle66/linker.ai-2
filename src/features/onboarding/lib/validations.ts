import { z } from 'zod';

// Client Onboarding Schemas
export const clientProfileSchema = z.object({
  profileImage: z.string().optional(),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  location: z.string().min(2, 'Location is required'),
});

export const clientCompanySchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  industry: z.string().min(1, 'Please select an industry'),
  companySize: z.string().min(1, 'Please select company size'),
  aboutCompany: z.string().min(20, 'Please provide at least 20 characters').max(1000),
});

export const clientGoalsSchema = z.object({
  projectGoals: z.array(z.string()).min(1, 'Please select at least one goal').max(5, 'Maximum 5 goals'),
  projectDescription: z.string().max(500).optional(),
});

export const clientBudgetSchema = z.object({
  budgetRange: z.enum(['small', 'medium', 'large', 'enterprise'], {
    required_error: 'Please select a budget range',
  }),
  timeline: z.enum(['urgent', 'short', 'medium', 'long'], {
    required_error: 'Please select a timeline',
  }),
});

export const clientOnboardingSchema = z.object({
  ...clientProfileSchema.shape,
  ...clientCompanySchema.shape,
  ...clientGoalsSchema.shape,
  ...clientBudgetSchema.shape,
});

// Freelancer Onboarding Schemas
export const freelancerProfileSchema = z.object({
  profileImage: z.string().optional(),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  title: z.string().min(5, 'Professional title must be at least 5 characters'),
  location: z.string().min(2, 'Location is required'),
});

export const freelancerExpertiseSchema = z.object({
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(1000),
  experience: z.string().min(1, 'Experience is required'),
});

export const freelancerSkillsSchema = z.object({
  skills: z.array(z.string()).min(3, 'Please select at least 3 skills').max(15, 'Maximum 15 skills'),
});

// Portfolio item schema
export const portfolioItemSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  tags: z.array(z.string()).min(1, 'Please select at least one tag'),
  imageUrl: z.string().optional(),
  url: z.string().optional(),
});

export const freelancerPortfolioSchema = z.object({
  portfolio: z.array(portfolioItemSchema).optional().default([]),
  // Keep old fields for backward compatibility during migration
  portfolioTitle: z.string().optional(),
  portfolioDescription: z.string().optional(),
  portfolioTags: z.array(z.string()).optional(),
});

export const freelancerRateSchema = z.object({
  hourlyRate: z.string()
    .min(1, 'Hourly rate is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 5, 'Minimum rate is $5/hour')
    .refine((val) => !isNaN(Number(val)) && Number(val) <= 500, 'Maximum rate is $500/hour'),
});

export const freelancerOnboardingSchema = z.object({
  ...freelancerProfileSchema.shape,
  ...freelancerExpertiseSchema.shape,
  ...freelancerSkillsSchema.shape,
  ...freelancerPortfolioSchema.shape,
  ...freelancerRateSchema.shape,
});

// Type exports
export type ClientProfileData = z.infer<typeof clientProfileSchema>;
export type ClientCompanyData = z.infer<typeof clientCompanySchema>;
export type ClientGoalsData = z.infer<typeof clientGoalsSchema>;
export type ClientBudgetData = z.infer<typeof clientBudgetSchema>;
export type ClientOnboardingData = z.infer<typeof clientOnboardingSchema>;

export type FreelancerProfileData = z.infer<typeof freelancerProfileSchema>;
export type FreelancerExpertiseData = z.infer<typeof freelancerExpertiseSchema>;
export type FreelancerSkillsData = z.infer<typeof freelancerSkillsSchema>;
export type FreelancerPortfolioData = z.infer<typeof freelancerPortfolioSchema>;
export type FreelancerRateData = z.infer<typeof freelancerRateSchema>;
export type FreelancerOnboardingData = z.infer<typeof freelancerOnboardingSchema>;
