import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export function useUserProposalForProject(projectId: string | undefined | null) {
  return useQuery({
    queryKey: ['user-proposal', projectId],
    queryFn: async () => {
      // 1. Safety check: No project, no proposal
      if (!projectId) return null;

      // 2. Get current user safely
      const { data: { user } } = await supabase.auth.getUser();
      
      // If user isn't logged in, they can't have a proposal
      if (!user) return null;

      // 3. Fetch proposal
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('project_id', projectId)
        .eq('freelancer_id', user.id) 
        .maybeSingle();

      // Ignore "No rows found" error (PGRST116), just return null
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching proposal:', error);
        throw error;
      }
      
      return data;
    },
    // Only run query if projectId exists
    enabled: !!projectId, 
  });
}