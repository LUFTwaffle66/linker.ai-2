import { useQuery } from '@tanstack/react-query';
import { getClientBalance, getClientProjects, getClientTransactions } from '../api/payment';
import { paymentKeys } from './use-shared-payments';

export function useClientBalance() {
  return useQuery({
    queryKey: paymentKeys.clientBalance(),
    queryFn: getClientBalance,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useClientProjects() {
  return useQuery({
    queryKey: paymentKeys.clientProjects(),
    queryFn: getClientProjects,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useClientTransactions() {
  return useQuery({
    queryKey: paymentKeys.clientTransactions(),
    queryFn: getClientTransactions,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
