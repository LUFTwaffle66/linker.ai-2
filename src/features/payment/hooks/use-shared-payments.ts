export const paymentKeys = {
  all: ['payment'] as const,
  freelancerEarnings: () => [...paymentKeys.all, 'freelancer', 'earnings'] as const,
  freelancerContracts: () => [...paymentKeys.all, 'freelancer', 'contracts'] as const,
  freelancerTransactions: () => [...paymentKeys.all, 'freelancer', 'transactions'] as const,
  freelancerStripeAccount: () => [...paymentKeys.all, 'freelancer', 'stripe-account'] as const,
  clientBalance: () => [...paymentKeys.all, 'client', 'balance'] as const,
  clientProjects: () => [...paymentKeys.all, 'client', 'projects'] as const,
  clientTransactions: () => [...paymentKeys.all, 'client', 'transactions'] as const,
};
