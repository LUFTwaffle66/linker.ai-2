import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFreelancerProfile, updateFreelancerProfile } from '../api/profiles';
import type { FreelancerProfileData } from '../types';
import { profileKeys } from './use-client-profile';

/**
 * Hook to fetch freelancer profile data
 * @param freelancerId - The freelancer ID to fetch
 */
export function useFreelancerProfile(freelancerId: string) {
  return useQuery({
    queryKey: profileKeys.freelancer(freelancerId),
    queryFn: () => getFreelancerProfile(freelancerId),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
}

/**
 * Hook to update freelancer profile
 */
export function useUpdateFreelancerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      freelancerId,
      data,
    }: {
      freelancerId: string;
      data: Partial<FreelancerProfileData>;
    }) => updateFreelancerProfile(freelancerId, data),
    onSuccess: (updatedProfile) => {
      // Update the cache with the new profile data
      queryClient.setQueryData(
        profileKeys.freelancer(updatedProfile.id),
        updatedProfile
      );
    },
  });
}
