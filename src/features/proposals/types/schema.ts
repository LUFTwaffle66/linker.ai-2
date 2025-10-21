import { z } from 'zod';

/**
 * Cover letter validation
 * Requires meaningful content between 100-5000 characters
 */
const coverLetterSchema = z
  .string()
  .min(100, 'Cover letter must be at least 100 characters')
  .max(5000, 'Cover letter must not exceed 5000 characters')
  .refine(
    (value) => value.trim().length >= 100,
    'Cover letter must contain at least 100 non-whitespace characters'
  );

/**
 * Budget validation for fixed-price projects
 * Must be a positive number greater than or equal to $50
 */
const totalBudgetSchema = z
  .string()
  .min(1, 'Budget is required')
  .refine(
    (value) => !isNaN(Number(value)) && Number(value) >= 50,
    'Budget must be at least $50'
  )
  .refine(
    (value) => !isNaN(Number(value)) && Number(value) <= 1000000,
    'Budget must be less than $1,000,000'
  );

/**
 * Timeline validation
 * Accepts formats like "2 weeks", "1 month", "3-4 weeks"
 */
const timelineSchema = z
  .string()
  .min(1, 'Timeline is required')
  .max(100, 'Timeline must be less than 100 characters')
  .refine(
    (value) => value.trim().length > 0,
    'Timeline cannot be empty'
  );

/**
 * File attachment validation
 * Maximum 5 files, each up to 10MB
 */
const attachmentsSchema = z
  .array(z.any())
  .max(5, 'Maximum 5 attachments allowed')
  .default([]);

/**
 * Main proposal form schema
 * All projects use fixed-price budgeting
 */
export const proposalSchema = z.object({
  coverLetter: coverLetterSchema,
  totalBudget: totalBudgetSchema,
  timeline: timelineSchema,
  attachments: attachmentsSchema,
});

/**
 * Inferred TypeScript type from proposal schema
 */
export type ProposalFormData = z.infer<typeof proposalSchema>;

/**
 * Proposal submission payload - includes project and freelancer IDs
 * Used when submitting to the API
 */
export interface ProposalSubmission extends ProposalFormData {
  projectId: number | string;
  freelancerId?: string;
}

/**
 * Proposal status enum
 */
export const proposalStatusEnum = z.enum([
  'draft',
  'submitted',
  'under_review',
  'shortlisted',
  'accepted',
  'rejected',
  'withdrawn',
]);

export type ProposalStatus = z.infer<typeof proposalStatusEnum>;

/**
 * Full proposal data structure (from database)
 */
export interface Proposal extends ProposalSubmission {
  id: string;
  status: ProposalStatus;
  submittedAt: Date;
  updatedAt: Date;
  viewedByClient: boolean;
  clientFeedback?: string;
}

/**
 * Proposal list item (for displaying in lists)
 */
export interface ProposalListItem {
  id: string;
  projectId: string;
  projectTitle: string;
  clientName: string;
  status: ProposalStatus;
  amount: string; // Fixed-price budget amount
  submittedAt: Date;
  viewedByClient: boolean;
}
