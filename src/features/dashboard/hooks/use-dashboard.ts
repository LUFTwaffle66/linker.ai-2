import { useQuery } from '@tanstack/react-query';
import { getFreelancerDashboard, getClientDashboard } from '../api/dashboard';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  freelancer: (userId: string) => [...dashboardKeys.all, 'freelancer', userId] as const,
  client: (userId: string) => [...dashboardKeys.all, 'client', userId] as const,
};

/**
 * Hook to fetch freelancer dashboard data
 */
export function useFreelancerDashboard(userId: string | undefined) {
  return useQuery({
    queryKey: dashboardKeys.freelancer(userId || ''),
    queryFn: () => {
      if (!userId) throw new Error('User ID is required');
      return getFreelancerDashboard(userId);
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch client dashboard data
 */
export function useClientDashboard(userId: string | undefined) {
  return useQuery({
    queryKey: dashboardKeys.client(userId || ''),
    queryFn: () => {
      if (!userId) throw new Error('User ID is required');
      return getClientDashboard(userId);
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
