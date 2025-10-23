import { useMutation, useQuery } from '@tanstack/react-query';
import {
  resendVerificationEmail,
  checkEmailVerified,
  checkOnboardingStatus,
  type ResendVerificationEmailParams,
} from '../api/email-verification';
import { toast } from 'sonner';

/**
 * Hook to resend verification email
 */
export function useResendVerificationEmail() {
  return useMutation({
    mutationFn: (params: ResendVerificationEmailParams) => resendVerificationEmail(params),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to resend verification email');
    },
  });
}

/**
 * Hook to check if email is verified
 */
export function useCheckEmailVerified() {
  return useQuery({
    queryKey: ['email-verified'],
    queryFn: checkEmailVerified,
    retry: 1,
    refetchInterval: 5000, // Check every 5 seconds
  });
}

/**
 * Hook to check onboarding status
 */
export function useCheckOnboardingStatus(userId?: string) {
  return useQuery({
    queryKey: ['onboarding-status', userId],
    queryFn: () => checkOnboardingStatus(userId!),
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds
  });
}
