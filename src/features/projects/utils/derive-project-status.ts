import type { ProjectStatus } from '@/features/active-projects/types';

type PaymentIntent = {
  milestone_type?: string | null;
  status?: string | null;
  created_at?: string | null;
};

type PaymentTransaction = {
  status?: string | null;
  type?: string | null;
  description?: string | null;
  created_at?: string | null;
  amount?: number | null;
};

type Deliverable = {
  status?: string | null;
};

type Proposal = {
  total_budget?: number | null;
  status?: string | null;
  freelancer_id?: string | null;
};

type ProjectRecord = {
  id: string;
  status?: string | null;
  fixed_budget?: number | null;
  timeline?: string | null;
  created_at?: string | null;
  closed_at?: string | null;
  upfront_date?: string | null;
  final_date?: string | null;
  hired_freelancer_id?: string | null;
};

export interface DerivedProjectSnapshot {
  budget: number;
  upfrontPaid: boolean;
  upfrontDate?: string;
  finalPaid: boolean;
  finalDate?: string;
  progress: number;
  status: ProjectStatus;
  hasSubmission: boolean;
}

interface DeriveProjectParams {
  project: ProjectRecord;
  paymentIntents?: PaymentIntent[] | null;
  paymentTransactions?: PaymentTransaction[] | null;
  deliverables?: Deliverable[] | null;
  proposals?: Proposal[] | null;
  agreedBudgetOverride?: number | null;
}

const isSuccessfulPayment = (tx: PaymentTransaction) =>
  tx.type === 'payment' && (tx.status === 'succeeded' || tx.status === 'completed');

/**
 * Derive a normalized view of project payment + status state.
 * This keeps dashboards and project detail views in sync.
 */
export const deriveProjectSnapshot = ({
  project,
  paymentIntents = [],
  paymentTransactions = [],
  deliverables = [],
  proposals = [],
  agreedBudgetOverride,
}: DeriveProjectParams): DerivedProjectSnapshot => {
  const acceptedProposal = proposals.find(
    (proposal) =>
      proposal.status === 'accepted' ||
      (!!project.hired_freelancer_id && proposal.freelancer_id === project.hired_freelancer_id)
  );

  const budget = Number(
    agreedBudgetOverride ??
      acceptedProposal?.total_budget ??
      project.fixed_budget ??
      0
  );

  const successfulTransactions = paymentTransactions.filter(isSuccessfulPayment);
  const upfrontTransaction = successfulTransactions.find((tx) =>
    tx.description?.includes('upfront_50')
  );
  const finalTransaction = successfulTransactions.find((tx) =>
    tx.description?.includes('final_50')
  );

  const upfrontIntent =
    paymentIntents.find((pi) => pi.milestone_type === 'upfront_50') ?? null;
  const finalIntent =
    paymentIntents.find((pi) => pi.milestone_type === 'final_50') ?? null;

  const upfrontPaid = Boolean(upfrontTransaction || finalTransaction) || upfrontIntent?.status === 'succeeded';
  const finalPaid =
    Boolean(finalTransaction) || finalIntent?.status === 'succeeded' || project.status === 'completed';

  const hasSubmission = (deliverables?.length ?? 0) > 0;

  const progress =
    project.status === 'completed' || finalPaid
      ? 100
      : project.status === 'in_progress' && hasSubmission
      ? 90
      : upfrontPaid
      ? 50
      : 0;

  let status: ProjectStatus = 'pending';
  if (project.status === 'completed') {
    status = 'completed';
  } else if (project.status === 'in_progress') {
    status = 'in-progress';
  } else if (project.status === 'cancelled') {
    status = 'cancelled';
  }

  return {
    budget,
    upfrontPaid,
    upfrontDate:
      upfrontTransaction?.created_at ||
      upfrontIntent?.created_at ||
      project.upfront_date ||
      project.created_at ||
      undefined,
    finalPaid,
    finalDate:
      finalTransaction?.created_at ||
      finalIntent?.created_at ||
      project.final_date ||
      project.closed_at ||
      undefined,
    progress,
    status,
    hasSubmission,
  };
};
