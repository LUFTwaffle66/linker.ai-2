import { useQuery } from '@tanstack/react-query';
import {
  getFreelancerEarnings,
  getFreelancerContracts,
  getFreelancerTransactions,
} from '../api/payment';
import type { ActiveContract, FreelancerEarnings, Transaction } from '../types';
import { paymentKeys } from './use-shared-payments';

export function useFreelancerEarnings() {
  return useQuery<FreelancerEarnings>({
    queryKey: paymentKeys.freelancerEarnings(),
    queryFn: getFreelancerEarnings,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useFreelancerContracts() {
  return useQuery<ActiveContract[]>({
    queryKey: paymentKeys.freelancerContracts(),
    queryFn: getFreelancerContracts,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useFreelancerTransactions() {
  return useQuery<Transaction[]>({
    queryKey: paymentKeys.freelancerTransactions(),
    queryFn: getFreelancerTransactions,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
