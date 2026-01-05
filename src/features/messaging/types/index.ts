import { z } from 'zod';

export type UserType = 'client' | 'freelancer';

export interface User {
  id: string;
  name: string;
  avatar: string | null;
  type?: UserType;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  created_at: string;
  read: boolean;
  attachments?: FileAttachment[];
  sender: User;
}

export interface Conversation {
  id: string;
  last_message_id: string;
  last_message_content: string;
  last_message_sender_id: string;
  last_message_created_at: string;
  other_participant_id: string;
  other_participant_name: string;
  other_participant_avatar: string;
  unread_count: number;
  participants: any[];
  lastMessage: any;
  isMuted: boolean;
  isStarred: boolean;
  conversation_participants?: {
    unread_count: number;
    has_new_messages: boolean;
    user_id: string;
  }[];
}

export interface ConversationSettings {
  isMuted: boolean;
  isStarred: boolean;
  isBlocked: boolean;
}

// Zod Schemas
export const sendMessageSchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().min(1).max(5000),
  attachments: z.array(z.any()).optional(),
});

export type SendMessageFormData = z.infer<typeof sendMessageSchema>;

export const createConversationSchema = z.object({
  participantId: z.string().min(1),
  message: z.string().min(1).max(5000),
});

export type CreateConversationFormData = z.infer<typeof createConversationSchema>;
