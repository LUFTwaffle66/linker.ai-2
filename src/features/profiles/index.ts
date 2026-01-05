// Components
export { ClientProfile } from './components/client-profile';
export { FreelancerProfile } from './components/freelancer-profile';

// Hooks
export {
  useClientProfile,
  useUpdateClientProfile,
  useFreelancerProfile,
  useUpdateFreelancerProfile,
  profileKeys,
} from './hooks';

// Types
export type {
  ClientProfileData,
  FreelancerProfileData,
  ClientStats,
  FreelancerStats,
  ClientProject,
  FreelancerPortfolio,
  ProfileReview,
  ProfileType,
} from './types';

// API
export { getClientProfile, getFreelancerProfile } from './api/profiles';
