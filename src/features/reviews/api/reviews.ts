import { supabase } from '@/lib/supabase';

export interface Review {
  id: string;
  project_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export const getReviewByReviewer = async (
  projectId: string,
  reviewerId: string
): Promise<Review | null> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('project_id', projectId)
    .eq('reviewer_id', reviewerId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as Review | null;
};

export const createReview = async (params: {
  projectId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
}): Promise<Review> => {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      project_id: params.projectId,
      reviewer_id: params.reviewerId,
      reviewee_id: params.revieweeId,
      rating: params.rating,
      comment: params.comment,
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data as Review;
};
