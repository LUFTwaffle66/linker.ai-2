import { useQuery } from '@tanstack/react-query';
import {
  fetchBrowseProjects,
  fetchFeaturedProjects,
  fetchBrowseFreelancers,
  fetchTopFreelancers,
  fetchProjectCategories,
  fetchFreelancerSkills,
  fetchBrowseStats,
  type BrowseFilters,
  type FreelancerFilters,
} from '../api/browse';

/**
 * Query keys for browse
 */
export const browseKeys = {
  all: ['browse'] as const,
  projects: () => [...browseKeys.all, 'projects'] as const,
  projectsList: (filters?: BrowseFilters) =>
    [...browseKeys.projects(), 'list', filters] as const,
  featuredProjects: (limit?: number) =>
    [...browseKeys.projects(), 'featured', limit] as const,
  freelancers: () => [...browseKeys.all, 'freelancers'] as const,
  freelancersList: (filters?: FreelancerFilters) =>
    [...browseKeys.freelancers(), 'list', filters] as const,
  topFreelancers: (limit?: number) =>
    [...browseKeys.freelancers(), 'top', limit] as const,
  categories: () => [...browseKeys.all, 'categories'] as const,
  skills: () => [...browseKeys.all, 'skills'] as const,
  stats: () => [...browseKeys.all, 'stats'] as const,
};

/**
 * Fetch all published projects with optional filters
 */
export function useBrowseProjects(filters?: BrowseFilters) {
  return useQuery({
    queryKey: browseKeys.projectsList(filters),
    queryFn: () => fetchBrowseProjects(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch featured projects
 */
export function useFeaturedProjects(limit: number = 6) {
  return useQuery({
    queryKey: browseKeys.featuredProjects(limit),
    queryFn: () => fetchFeaturedProjects(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch all freelancers with optional filters
 */
export function useBrowseFreelancers(filters?: FreelancerFilters) {
  return useQuery({
    queryKey: browseKeys.freelancersList(filters),
    queryFn: () => fetchBrowseFreelancers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch top-rated freelancers
 */
export function useTopFreelancers(limit: number = 8) {
  return useQuery({
    queryKey: browseKeys.topFreelancers(limit),
    queryFn: () => fetchTopFreelancers(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch all unique project categories
 */
export function useProjectCategories() {
  return useQuery({
    queryKey: browseKeys.categories(),
    queryFn: fetchProjectCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes (categories don't change often)
  });
}

/**
 * Fetch all unique freelancer skills
 */
export function useFreelancerSkills() {
  return useQuery({
    queryKey: browseKeys.skills(),
    queryFn: fetchFreelancerSkills,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Fetch browse page statistics
 */
export function useBrowseStats() {
  return useQuery({
    queryKey: browseKeys.stats(),
    queryFn: fetchBrowseStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
