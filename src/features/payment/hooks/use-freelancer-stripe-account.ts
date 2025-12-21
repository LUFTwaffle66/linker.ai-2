import { useQuery } from '@tanstack/react-query';
import { getFreelancerStripeAccount } from '../api/payment';
import { paymentKeys } from './use-shared-payments';
import type { FreelancerStripeAccount } from '../types';

export function useFreelancerStripeAccount() {
  return useQuery<FreelancerStripeAccount>({
    queryKey: paymentKeys.freelancerStripeAccount(),
    queryFn: getFreelancerStripeAccount,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}
