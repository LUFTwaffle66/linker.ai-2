export type TransactionType = 'payment' | 'deposit' | 'refund' | 'fee';
export type TransactionStatus = 'completed' | 'pending' | 'failed';
export type ContractStatus = 'active' | 'completed' | 'pending';

export interface FreelancerEarnings {
  totalEarnings: number;
  availableBalance: number;
  pendingClearance: number;
  lifetimeEarnings: number;
}

export interface ClientBalance {
  availableBalance: number;
  escrowBalance: number;
  totalSpent: number;
  pendingPayments: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description: string;
  date: Date;
  projectName?: string;
  clientName?: string;
  freelancerName?: string;
  paymentMethod?: string;
}

export interface ActiveContract {
  id: string;
  projectName: string;
  clientName?: string;
  freelancerName?: string;
  totalBudget: number;
  amountPaid: number;
  amountInEscrow: number;
  status: ContractStatus;
  startDate: Date;
  endDate?: Date;
}

export interface FreelancerStripeAccount {
  hasStripeAccount: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean; // <--- ADD THIS
  onboardingUrl?: string | null;
}
