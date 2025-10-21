import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';

export interface LoginDTO {
  email: string;
  password: string;
}

export const login = async (data: LoginDTO) => {
  const result = await signIn('credentials', {
    email: data.email,
    password: data.password,
    redirect: false,
  });

  if (result?.error) {
    throw new Error(result.error);
  }

  return result;
};

type UseLoginOptions = {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
};

export const useLogin = ({ onSuccess, onError }: UseLoginOptions = {}) => {
  return useMutation({
    mutationFn: login,
    onSuccess,
    onError: (error: Error) => {
      console.error('Login error:', error);
      onError?.(error);
    },
  });
};
