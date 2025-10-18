import { ClientProfileData, FreelancerProfileData } from '../types';
import { MOCK_CLIENT_PROFILE, MOCK_FREELANCER_PROFILE } from './mock-data';

// Simulate API delay
const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// API Error class
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Fetch client profile by ID
 * @param clientId - The client ID to fetch
 * @returns Promise<ClientProfileData>
 */
export const getClientProfile = async (clientId: string): Promise<ClientProfileData> => {
  await simulateDelay();

  // Simulate API call
  if (clientId === 'client-1') {
    return MOCK_CLIENT_PROFILE;
  }

  throw new ApiError(404, 'Client profile not found');
};

/**
 * Fetch freelancer profile by ID
 * @param freelancerId - The freelancer ID to fetch
 * @returns Promise<FreelancerProfileData>
 */
export const getFreelancerProfile = async (freelancerId: string): Promise<FreelancerProfileData> => {
  await simulateDelay();

  // Simulate API call
  if (freelancerId === 'freelancer-1') {
    return MOCK_FREELANCER_PROFILE;
  }

  throw new ApiError(404, 'Freelancer profile not found');
};

/**
 * Update client profile
 * @param clientId - The client ID
 * @param data - Partial profile data to update
 * @returns Promise<ClientProfileData>
 */
export const updateClientProfile = async (
  clientId: string,
  data: Partial<ClientProfileData>
): Promise<ClientProfileData> => {
  await simulateDelay(800);

  // Simulate API call
  if (clientId === 'client-1') {
    return {
      ...MOCK_CLIENT_PROFILE,
      ...data,
    };
  }

  throw new ApiError(404, 'Client profile not found');
};

/**
 * Update freelancer profile
 * @param freelancerId - The freelancer ID
 * @param data - Partial profile data to update
 * @returns Promise<FreelancerProfileData>
 */
export const updateFreelancerProfile = async (
  freelancerId: string,
  data: Partial<FreelancerProfileData>
): Promise<FreelancerProfileData> => {
  await simulateDelay(800);

  // Simulate API call
  if (freelancerId === 'freelancer-1') {
    return {
      ...MOCK_FREELANCER_PROFILE,
      ...data,
    };
  }

  throw new ApiError(404, 'Freelancer profile not found');
};
