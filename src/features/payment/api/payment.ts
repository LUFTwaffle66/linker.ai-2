import { supabase } from '@/lib/supabase';
import type {
  ActiveContract,
  ClientBalance,
  FreelancerEarnings,
  FreelancerStripeAccount,
  Transaction,
} from '../types';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new ApiError(401, 'Not authenticated');
  }
  return user;
};

/**
 * Freelancer earnings and transactions
 */
export const getFreelancerEarnings = async (): Promise<FreelancerEarnings> => {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('user_id', user.id)
    .in('status', ['succeeded', 'completed'])
    .eq('type', 'payment')
    .order('created_at', { ascending: false });

  if (error) {
    throw new ApiError(500, 'Failed to load earnings');
  }

  const totalEarnings = (data ?? []).reduce((sum, tx) => sum + tx.amount, 0) / 100;

  return {
    totalEarnings,
    availableBalance: totalEarnings,
    pendingClearance: 0,
    lifetimeEarnings: totalEarnings,
  };
};

export const getFreelancerContracts = async (): Promise<ActiveContract[]> => {
  const user = await getCurrentUser();

  const { data: projects, error: projectError } = await supabase
    .from('projects')
    .select(
      `*,
       proposals:proposals!proposals_project_id_fkey(status,total_budget,freelancer_id),
       payment_transactions:payment_transactions!payment_transactions_project_id_fkey(amount,status,type)`
    )
    .eq('hired_freelancer_id', user.id);

  if (projectError) {
    throw new ApiError(500, 'Failed to load contracts');
  }

  return (
    projects?.map((project) => {
      const projectPayments =
        (project as any).payment_transactions?.filter(
          (tx: any) => tx.status === 'succeeded' || tx.status === 'completed'
        ) ?? [];
      const amountPaid =
        projectPayments.reduce((sum: number, tx: any) => sum + Number(tx.amount || 0), 0) / 100;
      const acceptedProposal =
        project.proposals?.find(
          (proposal: any) =>
            proposal.status === 'accepted' &&
            (!project.hired_freelancer_id || proposal.freelancer_id === project.hired_freelancer_id)
        ) ??
        // If the status was not updated, still prefer the hired freelancer's bid
        project.proposals?.find(
          (proposal: any) => project.hired_freelancer_id && proposal.freelancer_id === project.hired_freelancer_id
        );
      const agreedBudget =
        acceptedProposal?.total_budget != null
          ? Number(acceptedProposal.total_budget)
          : amountPaid > 0
          ? amountPaid
          : Number(project.fixed_budget ?? 0);

      return {
        id: project.id,
        projectName: project.title,
        clientName: '',
        totalBudget: agreedBudget,
        amountPaid,
        amountInEscrow: amountPaid,
        status: project.status === 'completed' ? 'completed' : 'active',
        startDate: new Date(project.created_at),
        endDate: project.closed_at ? new Date(project.closed_at) : undefined,
      };
    }) ?? []
  );
};

export const getFreelancerTransactions = async (): Promise<Transaction[]> => {
  const user = await getCurrentUser();
  const { data, error } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new ApiError(500, 'Failed to load transactions');
  }

  return (
    data?.map((tx) => ({
      id: tx.id,
      type: (tx.type as Transaction['type']) || 'payment',
      amount: tx.amount / 100,
      status: tx.status as Transaction['status'],
      description: tx.description || 'Payment',
      date: new Date(tx.created_at),
      projectName: undefined,
      clientName: undefined,
      freelancerName: undefined,
      paymentMethod: undefined,
    })) ?? []
  );
};

// --- UPDATED FUNCTION ---
export const getFreelancerStripeAccount = async (): Promise<FreelancerStripeAccount> => {
  const user = await getCurrentUser();

  // 1. Fetch all necessary status fields
  const { data, error } = await supabase
    .from('stripe_accounts')
    .select('stripe_account_id, payouts_enabled, charges_enabled, details_submitted')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw new ApiError(500, 'Failed to load Stripe account');
  }

  if (!data) {
    return {
      hasStripeAccount: false,
      chargesEnabled: false,
      payoutsEnabled: false,
      detailsSubmitted: false,
      onboardingUrl: null,
    };
  }

  // 2. Map snake_case to camelCase
  return {
    hasStripeAccount: Boolean(data.stripe_account_id),
    chargesEnabled: Boolean(data.charges_enabled),
    payoutsEnabled: Boolean(data.payouts_enabled),
    detailsSubmitted: Boolean(data.details_submitted),
    onboardingUrl: null, // We intentionally return null here. The button generates the link.
  };
};

/**
 * Client balances and transactions
 */
export const getClientBalance = async (): Promise<ClientBalance> => {
  const user = await getCurrentUser();
  const { data: projects, error: projectError } = await supabase
    .from('projects')
    .select(
      `*,
       proposals:proposals!proposals_project_id_fkey(status,total_budget,freelancer_id),
       payment_transactions:payment_transactions!payment_transactions_project_id_fkey(amount,status,type)`
    )
    .eq('client_id', user.id);

  if (projectError) {
    throw new ApiError(500, 'Failed to load balance');
  }

  const withPayments =
    projects?.map((project) => {
      const projectPayments =
        (project as any).payment_transactions?.filter(
          (tx: any) => tx.status === 'succeeded' || tx.status === 'completed'
        ) ?? [];
      const pendingPayments =
        (project as any).payment_transactions?.filter(
          (tx: any) => tx.status !== 'succeeded' && tx.status !== 'completed'
        ) ?? [];
      const amountPaid = projectPayments.reduce((sum: number, tx: any) => sum + Number(tx.amount || 0), 0) / 100;
      const pendingAmount = pendingPayments.reduce((sum: number, tx: any) => sum + Number(tx.amount || 0), 0) / 100;
      const derivedStatus = project.status === 'completed' ? 'completed' : 'active';

      return { amountPaid, pendingAmount, status: derivedStatus };
    }) ?? [];

  const totalSpent = withPayments
    .filter((p) => p.status === 'completed' || p.status === 'active')
    .reduce((sum, p) => sum + p.amountPaid, 0);
  const pendingPayments = withPayments.reduce((sum, p) => sum + p.pendingAmount, 0);

  return {
    availableBalance: 0,
    escrowBalance: totalSpent,
    totalSpent,
    pendingPayments,
  };
};

export const getClientProjects = async (): Promise<ActiveContract[]> => {
  const user = await getCurrentUser();

  const { data: projects, error: projectError } = await supabase
    .from('projects')
    .select(
      `*,
       proposals:proposals!proposals_project_id_fkey(status,total_budget,freelancer_id),
       payment_transactions:payment_transactions!payment_transactions_project_id_fkey(amount,status,type)`
    )
    .eq('client_id', user.id);

  if (projectError) {
    throw new ApiError(500, 'Failed to load projects');
  }

  return (
    projects?.map((project) => {
      const projectPayments =
        (project as any).payment_transactions?.filter(
          (tx: any) => tx.status === 'succeeded' || tx.status === 'completed'
        ) ?? [];
      const amountPaid =
        projectPayments.reduce((sum: number, tx: any) => sum + Number(tx.amount || 0), 0) / 100;
      const acceptedProposal =
        project.proposals?.find(
          (proposal: any) =>
            proposal.status === 'accepted' &&
            (!project.hired_freelancer_id || proposal.freelancer_id === project.hired_freelancer_id)
        ) ??
        project.proposals?.find(
          (proposal: any) => project.hired_freelancer_id && proposal.freelancer_id === project.hired_freelancer_id
        );
      const agreedBudget =
        acceptedProposal?.total_budget != null
          ? Number(acceptedProposal.total_budget)
          : amountPaid > 0
          ? amountPaid
          : Number(project.fixed_budget ?? 0);

      return {
        id: project.id,
        projectName: project.title,
        freelancerName: '',
        totalBudget: agreedBudget,
        amountPaid,
        amountInEscrow: amountPaid,
        status: project.status === 'completed' ? 'completed' : 'active',
        startDate: new Date(project.created_at),
        endDate: project.closed_at ? new Date(project.closed_at) : undefined,
      };
    }) ?? []
  );
};

export const getClientTransactions = async (): Promise<Transaction[]> => {
  const user = await getCurrentUser();
  const { data, error } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new ApiError(500, 'Failed to load transactions');
  }

  return (
    data?.map((tx) => {
      let description = tx.description || 'Payment';
      if (tx.description?.includes('upfront_50')) {
        description = 'Upfront Payment (50%)';
      } else if (tx.description?.includes('final_50')) {
        description = 'Final Payment (50%)';
      }

      return {
        id: tx.id,
        type: (tx.type as Transaction['type']) || 'payment',
        amount: tx.amount / 100,
        status: tx.status as Transaction['status'],
        description,
        date: new Date(tx.created_at),
        projectName: undefined,
        clientName: undefined,
        freelancerName: undefined,
        paymentMethod: undefined,
      };
    }) ?? []
  );
};

export interface CreatePaymentIntentParams {
  projectId: string;
  clientId: string;
  freelancerId: string;
  milestoneType: 'upfront_50' | 'final_50';
}

export const createPaymentIntent = async (params: CreatePaymentIntentParams) => {
  // This calls the Backend Route we set up earlier
  const response = await fetch('/api/payments/create-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data.error || 'Failed to initialize payment');
  }

  return data; // Returns { clientSecret: '...' }
};
