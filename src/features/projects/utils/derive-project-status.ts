// src/features/projects/utils/derive-project-status.ts

export type ProposalRow = {
  id: string;
  freelancer_id: string;
  status: 'pending' | 'accepted' | 'rejected' | string;
  budget?: number | null;
};

export type ProjectRow = {
  id: string;

  // DB columns you mentioned you added
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

export type DerivedProjectSnapshot = {
  // money (display in dollars)
  totalBudget: number;
  upfrontAmount: number;
  finalAmount: number;

  // state
  upfrontPaid: boolean;
  finalPaid: boolean;

  // optional dates for UI
  upfrontDate?: string | null;
  finalDate?: string | null;

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
  agreedBudgetOverride?: number | null;
};

/**
 * Derives a stable snapshot used by UI, without relying on "escrow language".
 * - Null-safe
 * - No implicit any
 * - Always returns a value
 */
export function deriveProjectStatus({
  project,
  proposals,
  paymentIntents,
  agreedBudgetOverride,
}: DeriveProjectParams): DerivedProjectSnapshot {
  const safeProposals: ProposalRow[] = proposals ?? [];
  const safePaymentIntents: PaymentIntentRow[] = paymentIntents ?? [];

  const acceptedProposal = safeProposals.find(
    (p: ProposalRow) =>
      p.status === 'accepted' ||
      (!!project.hired_freelancer_id && p.freelancer_id === project.hired_freelancer_id)
  );

  // Budget resolution priority:
  // 1) agreedBudgetOverride (explicit)
  // 2) accepted proposal budget
  // 3) project.fixed_budget / project.budget
  const totalBudget =
    Number(agreedBudgetOverride ?? acceptedProposal?.budget ?? project.fixed_budget ?? project.budget ?? 0) || 0;

  // 50/50 split with rounding safety
  const upfrontAmount = Math.round(totalBudget * 0.5 * 100) / 100;
  const finalAmount = Math.round((totalBudget - upfrontAmount) * 100) / 100;

  const upfrontPaid = Boolean(project.upfront_paid);
  const finalPaid = Boolean(project.final_paid);

  // Derive received/pending in milestone model (not escrow)
  const received = (upfrontPaid ? upfrontAmount : 0) + (finalPaid ? finalAmount : 0);
  const pending = Math.max(totalBudget - received, 0);

  // Optional: last PI status for debugging/labels
  const lastPi = safePaymentIntents
    .slice()
    .sort((a: PaymentIntentRow, b: PaymentIntentRow) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
      return tb - ta;
    })[0];

  return {
    totalBudget,
    upfrontAmount,
    finalAmount,

    upfrontPaid,
    finalPaid,

    upfrontDate: project.upfront_paid_date ?? null,
    finalDate: project.final_paid_date ?? null,

    received,
    pending,

    acceptedProposalId: acceptedProposal?.id ?? null,
    lastPaymentIntentStatus: lastPi?.status ?? null,
  };
}

export const deriveProjectSnapshot = deriveProjectStatus;