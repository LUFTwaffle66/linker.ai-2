import { supabase } from '@/lib/supabase';

export type MilestoneType = 'upfront_50' | 'final_50';

export interface CreatePaymentIntentPayload {
  projectId: string;
  clientId: string;
  freelancerId: string;
  milestoneType: MilestoneType;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export const createPaymentIntent = async (
  payload: CreatePaymentIntentPayload
): Promise<CreatePaymentIntentResponse> => {
  const response = await fetch('/api/payments/create-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody?.error || 'Failed to create payment intent';
    throw new Error(message);
  }

  return response.json() as Promise<CreatePaymentIntentResponse>;
};

/**
 * Utility to refetch project payment intent status from Supabase.
 * Keeps queries client-side and RLS-safe.
 */
export const fetchProjectPaymentIntents = async (projectId: string) => {
  const { data, error } = await supabase
    .from('payment_intents')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};
