import { queryOptions, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjectFiles, uploadProjectFile } from './projects';

export const getProjectFilesQueryOptions = (projectId: string) => {
  return queryOptions({
    queryKey: ['project-files', projectId] as const,
    queryFn: () => getProjectFiles(projectId),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export function useProjectFiles(projectId: string) {
  return useQuery(getProjectFilesQueryOptions(projectId));
}

export function useUploadProjectFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, file }: { projectId: string; file: File }) =>
      uploadProjectFile(projectId, file),
    onSuccess: (_, variables) => {
      // Invalidate project files to refetch
      queryClient.invalidateQueries({
        queryKey: ['project-files', variables.projectId],
      });
    },
  });
}
