import { api } from '@/lib/api-client';
import type {
  ClientOnboardingData,
  FreelancerOnboardingData,
} from '../lib/validations';
import type { ClientProfile, FreelancerProfile } from '../lib/onboarding-utils';

// =============================================
// Client Onboarding API
// =============================================

export const saveClientOnboarding = async (
  data: ClientOnboardingData
): Promise<{ success: boolean; profile: ClientProfile }> => {
  const response = await api.post('/onboarding/client', data);
  return response.data;
};

export const getClientOnboarding = async (): Promise<{ profile: ClientProfile }> => {
  const response = await api.get('/onboarding/client');
  return response.data;
};

// =============================================
// Freelancer Onboarding API
// =============================================

export const saveFreelancerOnboarding = async (
  data: FreelancerOnboardingData
): Promise<{ success: boolean; profile: FreelancerProfile }> => {
  const response = await api.post('/onboarding/freelancer', data);
  return response.data;
};

export const getFreelancerOnboarding = async (): Promise<{ profile: FreelancerProfile }> => {
  const response = await api.get('/onboarding/freelancer');
  return response.data;
};
