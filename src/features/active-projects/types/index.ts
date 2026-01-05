import { z } from 'zod';

export type ProjectStatus = 'in-progress' | 'completed' | 'pending' | 'cancelled';
export type MessageType = 'text' | 'file';
export type UpdateType =
  | 'milestone_completed'
  | 'milestone_started'
  | 'payment_released'
  | 'file_uploaded'
  | 'message'
  | 'deliverable_submitted'
  | 'deliverable_approved'
  | 'deliverable_revision_requested';

export interface ProjectInfo {
  id: string;
  clientId: string;
  freelancerId?: string | null;
  title: string;
  client: string;
  clientAvatar: string;
  freelancer: string;
  freelancerAvatar: string;
  budget: number;
  upfrontAmount: number;
  finalAmount: number;
  upfrontPaid: boolean;
  upfrontDate?: string;
  finalPaid: boolean;
  finalDate?: string;
  startDate: string;
  startedAt?: string | null;
  durationValue?: number | null;
  durationUnit?: 'days' | 'weeks' | 'months' | null;
  deadline: string;
  deadlineDate?: string | null;
  progress: number;
  status: ProjectStatus;
  attachments?: any[];
  deliverables: string[];
}

export interface ProjectMessage {
  id: string;
  sender: 'client' | 'freelancer';
  senderName: string;
  senderRole: string;
  avatar: string;
  content: string;
  timestamp: string;
  date: string;
  type: MessageType;
  fileName?: string;
  fileSize?: string;
}

export interface ProjectUpdate {
  id: string;
  type: UpdateType;
  title: string;
  description: string;
  user: string;
  avatar: string;
  timestamp: string;
  date: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  size: string;
  uploadedBy: string;
  date: string;
  url?: string;
}

// Zod Schemas
export const sendProjectMessageSchema = z.object({
  projectId: z.string().min(1),
  content: z.string().min(1).max(5000),
  attachments: z.array(z.any()).optional(),
});

export type SendProjectMessageFormData = z.infer<typeof sendProjectMessageSchema>;

export const uploadFileSchema = z.object({
  projectId: z.string().min(1),
  file: z.any(),
});

export type UploadFileFormData = z.infer<typeof uploadFileSchema>;
