// Re-export auth types
export * from './auth';

// Legacy type alias for compatibility
export type UserType = 'freelancer' | 'client';

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName?: string;
  userType: UserType;
}
