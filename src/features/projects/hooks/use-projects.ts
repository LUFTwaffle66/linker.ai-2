import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fetchPublishedProjects,
  fetchClientProjects,
  fetchProjectById,
  createProject,
  updateProject,
  deleteProject,
  publishProject,
  closeProject,
  hireFreelancer,
  inviteFreelancers,
  searchProjects,
  type CreateProjectParams,
  type UpdateProjectParams,
} from '../api/projects';

/**
 * Query keys for projects
 */
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  client: (clientId: string) => [...projectKeys.all, 'client', clientId] as const,
  search: (params: Record<string, any>) => [...projectKeys.all, 'search', params] as const,
};

/**
 * Fetch all published projects
 */
export function usePublishedProjects() {
  return useQuery({
    queryKey: projectKeys.list({ published: true }),
    queryFn: fetchPublishedProjects,
  });
}

/**
 * Fetch projects by client ID
 */
export function useClientProjects(clientId: string) {
  return useQuery({
    queryKey: projectKeys.client(clientId),
    queryFn: () => fetchClientProjects(clientId),
    enabled: !!clientId,
  });
}

/**
 * Fetch a single project by ID
 */
export function useProject(projectId: string) {
  return useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => fetchProjectById(projectId),
    enabled: !!projectId,
  });
}

/**
 * Search projects with filters
 */
export function useSearchProjects(params: {
  skills?: string[];
  category?: string;
  minBudget?: number;
  maxBudget?: number;
}) {
  return useQuery({
    queryKey: projectKeys.search(params),
    queryFn: () => searchProjects(params),
    enabled: Object.keys(params).length > 0,
  });
}

/**
 * Create a new project
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateProjectParams) => createProject(params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      if (data.client_id) {
        queryClient.invalidateQueries({ queryKey: projectKeys.client(data.client_id) });
      }
      toast.success('Project created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create project: ${error.message}`);
    },
  });
}

/**
 * Update an existing project
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, params }: { projectId: string; params: UpdateProjectParams }) =>
      updateProject(projectId, params),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      if (data.client_id) {
        queryClient.invalidateQueries({ queryKey: projectKeys.client(data.client_id) });
      }
      toast.success('Project updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update project: ${error.message}`);
    },
  });
}

/**
 * Delete a project
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.removeQueries({ queryKey: projectKeys.detail(projectId) });
      toast.success('Project deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete project: ${error.message}`);
    },
  });
}

/**
 * Publish a draft project
 */
export function usePublishProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => publishProject(projectId),
    onSuccess: (data, projectId) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      if (data.client_id) {
        queryClient.invalidateQueries({ queryKey: projectKeys.client(data.client_id) });
      }
      toast.success('Project published successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to publish project: ${error.message}`);
    },
  });
}

/**
 * Close a project
 */
export function useCloseProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => closeProject(projectId),
    onSuccess: (data, projectId) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      if (data.client_id) {
        queryClient.invalidateQueries({ queryKey: projectKeys.client(data.client_id) });
      }
      toast.success('Project closed successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to close project: ${error.message}`);
    },
  });
}

/**
 * Hire a freelancer for a project
 */
export function useHireFreelancer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, freelancerId }: { projectId: string; freelancerId: string }) =>
      hireFreelancer(projectId, freelancerId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      if (data.client_id) {
        queryClient.invalidateQueries({ queryKey: projectKeys.client(data.client_id) });
      }
      toast.success('Freelancer hired successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to hire freelancer: ${error.message}`);
    },
  });
}

/**
 * Invite freelancers to a project
 */
export function useInviteFreelancers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, freelancerIds }: { projectId: string; freelancerIds: string[] }) =>
      inviteFreelancers(projectId, freelancerIds),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId) });
      toast.success(`Invited ${variables.freelancerIds.length} freelancer(s) successfully!`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to invite freelancers: ${error.message}`);
    },
  });
}
