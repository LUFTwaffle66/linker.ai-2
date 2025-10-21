export type { BrowseProject, BrowseFreelancer, BrowseFilters, FreelancerFilters } from '../api/browse';

/**
 * Browse tab types
 */
export type BrowseTab = 'projects' | 'freelancers';

/**
 * Sort options for projects
 */
export type ProjectSortOption = 'newest' | 'budget-high' | 'budget-low' | 'most-proposals';

/**
 * Sort options for freelancers
 */
export type FreelancerSortOption = 'experience' | 'rate-high' | 'rate-low' | 'newest';

/**
 * Budget range presets
 */
export interface BudgetRange {
  label: string;
  min?: number;
  max?: number;
}

export const BUDGET_RANGES: BudgetRange[] = [
  { label: 'All Budgets' },
  { label: 'Under $5K', max: 5000 },
  { label: '$5K - $10K', min: 5000, max: 10000 },
  { label: '$10K - $25K', min: 10000, max: 25000 },
  { label: '$25K - $50K', min: 25000, max: 50000 },
  { label: '$50K+', min: 50000 },
];

/**
 * Rate range presets for freelancers
 */
export interface RateRange {
  label: string;
  min?: number;
  max?: number;
}

export const RATE_RANGES: RateRange[] = [
  { label: 'All Rates' },
  { label: 'Under $50/hr', max: 50 },
  { label: '$50 - $75/hr', min: 50, max: 75 },
  { label: '$75 - $100/hr', min: 75, max: 100 },
  { label: '$100+/hr', min: 100 },
];

/**
 * Experience level presets
 */
export interface ExperienceLevel {
  label: string;
  minYears: number;
}

export const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  { label: 'Entry Level (0-2 years)', minYears: 0 },
  { label: 'Intermediate (3-5 years)', minYears: 3 },
  { label: 'Expert (5-10 years)', minYears: 5 },
  { label: 'Senior (10+ years)', minYears: 10 },
];
