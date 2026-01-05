import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { AutomationCategory, AutomationExample } from '../types';

export const automationShowcaseKeys = {
  categories: () => ['automation-showcase', 'categories'] as const,
  examples: (categorySlug?: string) =>
    ['automation-showcase', 'examples', categorySlug || 'all'] as const,
};

export async function fetchAutomationCategories() {
  const { data, error } = await supabase
    .from('automation_categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data as AutomationCategory[];
}

export async function fetchAutomationExamples(categorySlug?: string) {
  let query = supabase
    .from('automation_examples')
    .select(
      `
        *,
        category:automation_categories(
          id,
          name,
          slug,
          icon
        )
      `
    )
    .order('title', { ascending: true });

  if (categorySlug && categorySlug !== 'all') {
    query = query.eq('category.slug', categorySlug);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as AutomationExample[];
}

export function useAutomationCategories() {
  return useQuery({
    queryKey: automationShowcaseKeys.categories(),
    queryFn: fetchAutomationCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useAutomationExamples(
  categorySlug?: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: automationShowcaseKeys.examples(categorySlug),
    queryFn: () => fetchAutomationExamples(categorySlug),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled ?? true,
  });
}
