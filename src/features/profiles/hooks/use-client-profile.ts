import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClientProfile, updateClientProfile } from '../api/profiles';
import type { ClientProfileData } from '../types';

export const profileKeys = {
  all: ['profiles'] as const,
  clients: () => [...profileKeys.all, 'clients'] as const,
  client: (id: string) => [...profileKeys.clients(), id] as const,
  freelancers: () => [...profileKeys.all, 'freelancers'] as const,
  freelancer: (id: string) => [...profileKeys.freelancers(), id] as const,
};

/**
 * Hook to fetch client profile data
 * @param clientId - The client ID to fetch
 */
export function useClientProfile(clientId: string) {
  return useQuery({
    queryKey: profileKeys.client(clientId),
    queryFn: () => getClientProfile(clientId),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
}

/**
 * Hook to update client profile
 */
export function useUpdateClientProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, data }: { clientId: string; data: Partial<ClientProfileData> }) =>
      updateClientProfile(clientId, data),
    onSuccess: (updatedProfile) => {
      // Update the cache with the new profile data
      queryClient.setQueryData(
        profileKeys.client(updatedProfile.id),
        updatedProfile
      );
    },
  });
}
