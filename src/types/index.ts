export interface Notification {
  id: string;
  user_id: string;
  category: string;
  type: string;
  title: string;
  message: string;
  project_id?: string | null;
  payment_intent_id?: string | null;
  actor_id?: string | null;
  actor_name?: string | null;
  action_url?: string | null;
  metadata?: Record<string, any> | null;
  is_read: boolean;
  created_at: string;
}
