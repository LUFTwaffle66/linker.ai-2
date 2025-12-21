import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useUserProposalForProject(projectId: string) {
  return useQuery({
    queryKey: ['user-proposal', projectId],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('project_id', projectId)
        .eq('freelancer_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Failed to load user proposal', error);
        return null;
      }

      return data;
    },
  });
}