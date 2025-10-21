import { supabase } from '@/lib/supabase';
import type { Conversation, Message } from '../types';

type UUID = string;

export async function getConversations(userId: string): Promise<Conversation[]> {
  const { data: conversationIds, error: idsError } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', userId);

  if (idsError) throw idsError;

  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      participants: conversation_participants!inner(
        user: users!inner(*)
      ),
      lastMessage: messages!last_message_id(*)
    `)
    .in('id', conversationIds.map((c) => c.conversation_id))
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data as any;
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
  const { data: existingConversations } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .in('user_id', [userId1, userId2]);

  const conversationCounts = existingConversations?.reduce((acc, curr) => {
    if (curr.conversation_id) {
      acc[curr.conversation_id] = (acc[curr.conversation_id] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>) || {};

  const conversationId = conversationCounts && Object.keys(conversationCounts).find((id) => (conversationCounts as any)[id] > 1);

  if (conversationId) {
    return conversationId;
  }

  const { data: newConversation, error } = await supabase
    .from('conversations')
    .insert({})
    .select('id')
    .single();

  if (error) throw error;
  if (!newConversation) throw new Error('Failed to create conversation');

  await supabase
    .from('conversation_participants')
    .insert([
      { conversation_id: newConversation.id, user_id: userId1 },
      { conversation_id: newConversation.id, user_id: userId2 },
    ]);

  return newConversation.id;
}
