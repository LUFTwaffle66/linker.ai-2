import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { UserRole } from '../types/auth';

export interface SignupDTO {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  companyName?: string;
}

export const signup = async (data: SignupDTO) => {
  return api.post('/auth/signup', data);
};

type UseSignupOptions = {
  onSuccess?: (data: any, variables: SignupDTO) => void | Promise<void>;
  onError?: (error: Error) => void;
};

export const useSignup = ({ onSuccess, onError }: UseSignupOptions = {}) => {
  return useMutation({
    mutationFn: signup,
    onSuccess,
    onError: (error: Error) => {
      console.error('Signup error:', error);
      onError?.(error);
    },
  });
};
