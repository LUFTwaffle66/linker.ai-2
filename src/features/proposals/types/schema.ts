import { z } from 'zod';

/**
 * Proposal budget type - determines payment structure
 * - fixed: One-time payment for entire project
 * - hourly: Payment based on hours worked
 */
export const budgetTypeEnum = z.enum(['fixed', 'hourly'], {
  errorMap: () => ({ message: 'Please select a payment type' }),
});

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
const fixedBudgetSchema = z
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
 * Hourly rate validation
 * Must be between $5/hr and $500/hr
 */
const hourlyRateSchema = z
  .string()
  .min(1, 'Hourly rate is required')
  .refine(
    (value) => !isNaN(Number(value)) && Number(value) >= 5,
    'Hourly rate must be at least $5'
  )
  .refine(
    (value) => !isNaN(Number(value)) && Number(value) <= 500,
    'Hourly rate must be less than $500'
  );

/**
 * Estimated hours validation (optional for hourly projects)
 * If provided, must be a positive number
 */
const estimatedHoursSchema = z
  .string()
  .optional()
  .refine(
    (value) => !value || (!isNaN(Number(value)) && Number(value) > 0),
    'Estimated hours must be a positive number'
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
 * Main proposal form schema with conditional validation
 * based on budget type (fixed vs hourly)
 */
export const proposalSchema = z
  .object({
    coverLetter: coverLetterSchema,
    budgetType: budgetTypeEnum,
    totalBudget: z.string().optional(),
    hourlyRate: z.string().optional(),
    estimatedHours: estimatedHoursSchema,
    timeline: timelineSchema,
    attachments: attachmentsSchema,
  })
  .refine(
    (data) => {
      // If budgetType is 'fixed', totalBudget must be valid
      if (data.budgetType === 'fixed') {
        return data.totalBudget && fixedBudgetSchema.safeParse(data.totalBudget).success;
      }
      return true;
    },
    {
      message: 'Total budget is required and must be at least $50 for fixed price projects',
      path: ['totalBudget'],
    }
  )
  .refine(
    (data) => {
      // If budgetType is 'hourly', hourlyRate must be valid
      if (data.budgetType === 'hourly') {
        return data.hourlyRate && hourlyRateSchema.safeParse(data.hourlyRate).success;
      }
      return true;
    },
    {
      message: 'Hourly rate is required and must be between $5-$500 for hourly projects',
      path: ['hourlyRate'],
    }
  );

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
  budgetType: 'fixed' | 'hourly';
  amount: string; // Display amount based on budget type
  submittedAt: Date;
  viewedByClient: boolean;
}
