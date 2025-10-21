// Components
export { MessagingView } from './components/messaging-view';
export { ConversationList } from './components/conversation-list';
export { ConversationItem } from './components/conversation-item';
export { ChatHeader } from './components/chat-header';
export { MessageList } from './components/message-list';
export { MessageBubble } from './components/message-bubble';
export { MessageInput } from './components/message-input';
export { FileAttachment } from './components/file-attachment';
export { EmptyState } from './components/empty-state';

// Hooks
export {
  useConversations,
  useConversation,
  useUpdateConversationSettings,
  useDeleteConversation,
  useSearchConversations,
  useMessages,
  useSendMessage,
  useMarkAsRead,
  messagingKeys,
} from './hooks';

// Types
export type {
  User,
  UserType,
  Message,
  Conversation,
  ConversationSettings,
  SendMessageFormData,
  CreateConversationFormData,
} from './types';

// API
export { getConversations, getMessages, sendMessage } from './api/messaging';
