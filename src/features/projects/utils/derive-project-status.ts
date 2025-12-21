// src/features/projects/utils/derive-project-status.ts

// 1. Defined a basic type for Deliverables to avoid "implicit any"
export type DeliverableRow = {
  id: string;
  status?: string;
  [key: string]: unknown;
};

export type ProposalRow = {
  id: string;
  freelancer_id: string;
  status: 'pending' | 'accepted' | 'rejected' | string;
  budget?: number | null;
};

export type ProjectRow = {
  id: string;

  // DB columns
  upfront_paid?: boolean | null;
  final_paid?: boolean | null;
  upfront_paid_date?: string | null;
  final_paid_date?: string | null;

  // optional fields used in matching logic
  hired_freelancer_id?: string | null;

  // budgeting
  fixed_budget?: number | null;
  budget?: number | null;

  // progress is used in UI gating
  progress?: number | null;

  // optional status from DB (if present)
  status?: string | null;
};

export type PaymentIntentRow = {
  id: string;
  stripe_payment_intent_id: string;
  status: string;
  milestone_type: 'upfront_50' | 'final_50' | string;
  amount: number; // cents
  platform_fee?: number | null; // cents
  created_at?: string | null;
};

export type PaymentTransactionRow = {
  id: string;
  type?: string | null;
  amount?: number | null;
  currency?: string | null;
  status?: string | null;
  created_at?: string | null;
  [key: string]: unknown;
};

export type DerivedProjectSnapshot = {
  // money (display in dollars)
  budget: number;
  progress: number;
  status: 'needs_upfront' | 'in_progress' | 'needs_final' | 'completed';

  totalBudget: number;
  upfrontAmount: number;
  finalAmount: number;

  // state
  upfrontPaid: boolean;
  finalPaid: boolean;

  // optional dates for UI
  upfrontDate?: string;
  finalDate?: string;

  // derived totals (in dollars)
  received: number;
  pending: number;

  // helpful ids
  acceptedProposalId?: string | null;

  // for debugging / UI badges if needed
  lastPaymentIntentStatus?: string | null;
};

export type DeriveProjectParams = {
  project: ProjectRow;
  proposals?: ProposalRow[] | null;
  paymentIntents?: PaymentIntentRow[] | null;
  paymentTransactions?: PaymentTransactionRow[] | null;
  deliverables?: DeliverableRow[] | null; // <--- ADDED THIS (Fixed the build error)
  agreedBudgetOverride?: number | null;
};

/**
 * Derives a stable snapshot used by UI.
 */
export function deriveProjectStatus({
  project,
  proposals,
  paymentIntents,
  paymentTransactions,
  deliverables, // <--- ADDED THIS to destructuring
  agreedBudgetOverride,
}: DeriveProjectParams): DerivedProjectSnapshot {
  const safeProposals: ProposalRow[] = proposals ?? [];
  const safePaymentIntents: PaymentIntentRow[] = paymentIntents ?? [];
  
  // These are available for future logic if you need them:
  const _safePaymentTransactions = paymentTransactions ?? [];
  const _safeDeliverables = deliverables ?? [];
  
  // We explicitly "void" them to tell the linter "we know they are unused, it's okay"
  void _safePaymentTransactions; 
  void _safeDeliverables; 

  const acceptedProposal = safeProposals.find(
    (p: ProposalRow) =>
      p.status === 'accepted' ||
      (!!project.hired_freelancer_id && p.freelancer_id === project.hired_freelancer_id)
  );

  // Budget resolution priority
  const totalBudget =
    Number(agreedBudgetOverride ?? acceptedProposal?.budget ?? project.fixed_budget ?? project.budget ?? 0) || 0;

  // 50/50 split with rounding safety
  const upfrontAmount = Math.round(totalBudget * 0.5 * 100) / 100;
  const finalAmount = Math.round((totalBudget - upfrontAmount) * 100) / 100;

  const upfrontPaid = Boolean(project.upfront_paid);
  const finalPaid = Boolean(project.final_paid);

  const progress = Number(project.progress ?? 0) || 0;

  const status: DerivedProjectSnapshot['status'] = finalPaid
    ? 'completed'
    : upfrontPaid
      ? (progress >= 90 ? 'needs_final' : 'in_progress')
      : 'needs_upfront';

  const received = (upfrontPaid ? upfrontAmount : 0) + (finalPaid ? finalAmount : 0);
  const pending = Math.max(totalBudget - received, 0);

  const lastPi = safePaymentIntents
    .slice()
    .sort((a: PaymentIntentRow, b: PaymentIntentRow) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
      return tb - ta;
    })[0];

  return {
    budget: totalBudget,
    progress,
    status,

    totalBudget,
    upfrontAmount,
    finalAmount,

    upfrontPaid,
    finalPaid,

    upfrontDate: project.upfront_paid_date ?? undefined,
    finalDate: project.final_paid_date ?? undefined,

    received,
    pending,

    acceptedProposalId: acceptedProposal?.id ?? null,
    lastPaymentIntentStatus: lastPi?.status ?? null,
  };
}

export const deriveProjectSnapshot = deriveProjectStatus;