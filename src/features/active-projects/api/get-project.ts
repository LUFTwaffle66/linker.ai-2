import { queryOptions, useQuery } from '@tanstack/react-query';
import { getProject } from './projects';

export const getProjectQueryOptions = (projectId: string) => {
  return queryOptions({
    queryKey: ['project', projectId] as const,
    queryFn: () => getProject(projectId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export function useProject(projectId: string) {
  return useQuery(getProjectQueryOptions(projectId));
}
