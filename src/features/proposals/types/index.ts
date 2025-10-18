import { z } from 'zod';

export const proposalSchema = z.object({
  coverLetter: z
    .string()
    .min(100, 'Cover letter must be at least 100 characters')
    .max(5000, 'Cover letter must not exceed 5000 characters'),
  budgetType: z.enum(['fixed', 'hourly']),
  totalBudget: z.string().optional(),
  hourlyRate: z.string().optional(),
  estimatedHours: z.string().optional(),
  timeline: z
    .string()
    .min(1, 'Timeline is required'),
  attachments: z.array(z.any()).optional(),
}).refine(
  (data) => {
    // If budgetType is 'fixed', totalBudget is required
    if (data.budgetType === 'fixed') {
      return data.totalBudget && data.totalBudget.length > 0;
    }
    return true;
  },
  {
    message: 'Total budget is required for fixed price projects',
    path: ['totalBudget'],
  }
).refine(
  (data) => {
    // If budgetType is 'hourly', hourlyRate is required
    if (data.budgetType === 'hourly') {
      return data.hourlyRate && data.hourlyRate.length > 0;
    }
    return true;
  },
  {
    message: 'Hourly rate is required for hourly projects',
    path: ['hourlyRate'],
  }
);

export type ProposalFormData = z.infer<typeof proposalSchema>;

export interface ProposalSubmission extends ProposalFormData {
  projectId: number | string;
  freelancerId?: string;
}
