import { queryOptions, useQuery } from '@tanstack/react-query';
import { getProjectUpdates } from './projects';

export const getProjectUpdatesQueryOptions = (projectId: string) => {
  return queryOptions({
    queryKey: ['project-updates', projectId] as const,
    queryFn: () => getProjectUpdates(projectId),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export function useProjectUpdates(projectId: string) {
  return useQuery(getProjectUpdatesQueryOptions(projectId));
}
