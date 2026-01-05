import { supabase } from '@/lib/supabase';
import type { Conversation, Message } from '../types';

type UUID = string;

export async function getConversations(userId: string): Promise<Conversation[]> {
  const { data: participantRows, error: idsError } = await supabase
    .from('conversation_participants')
    .select('conversation_id, unread_count, has_new_messages, user_id')
    .eq('user_id', userId);

  if (idsError) throw idsError;
  if (!participantRows || participantRows.length === 0) return [];

  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      participants: conversation_participants!inner(
        user: users!inner(*)
      ),
      lastMessage: messages!last_message_id(*)
    `)
    .in('id', participantRows.map((c) => c.conversation_id))
    .order('updated_at', { ascending: false });

  if (error) throw error;
  const participantMap = participantRows.reduce<Record<string, any[]>>((acc, row) => {
    const list = acc[row.conversation_id] || [];
    list.push(row);
    acc[row.conversation_id] = list;
    return acc;
  }, {});

  return (data || []).map((conversation: any) => ({
    ...conversation,
    conversation_participants: participantMap[conversation.id] || [],
  })) as any;
}

export async function getMessages(conversationId: string, userId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*, sender: users(*)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as any;
}

export async function sendMessage(conversationId: string, senderId: string, content: string): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, content })
    .select('*, sender: users(*)')
    .single();

  if (error) throw error;

  await supabase
    .from('conversations')
    .update({ last_message_id: data.id, updated_at: new Date().toISOString() })
    .eq('id', conversationId);

  return data as any;
}

export async function createOrGetConversation(userId1: string, userId2: string): Promise<UUID> {
  const { data, error } = await supabase.rpc('create_and_get_conversation', {
    user_id_1: userId1,
    user_id_2: userId2,
  });

  if (error) throw error;
  return data;
}

export async function getConversation(conversationId: string): Promise<Conversation> {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      participants: conversation_participants!inner(
        user: users!inner(*)
      ),
      lastMessage: messages!last_message_id(*)
    `)
    .eq('id', conversationId)
    .single();

  if (error) throw error;
  return data as any;
}

export async function updateConversationSettings(
  conversationId: string,
  settings: Record<string, any>
): Promise<Conversation> {
  const { data, error } = await supabase
    .from('conversations')
    .update(settings)
    .eq('id', conversationId)
    .select(`
      *,
      participants: conversation_participants!inner(
        user: users!inner(*)
      ),
      lastMessage: messages!last_message_id(*)
    `)
    .single();

  if (error) throw error;
  return data as any;
}

export async function deleteConversation(conversationId: string): Promise<void> {
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId);

  if (error) throw error;
}

export async function searchConversations(query: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      participants: conversation_participants!inner(
        user: users!inner(*)
      ),
      lastMessage: messages!last_message_id(*)
    `)
    .or(`participants.user.full_name.ilike.%${query}%`)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data as any;
}

export async function markAsRead(conversationId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('conversation_participants')
    .update({ unread_count: 0, has_new_messages: false })
    .eq('conversation_id', conversationId)
    .eq('user_id', userId);

  if (error) throw error;
}
