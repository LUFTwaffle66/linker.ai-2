'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth/lib/auth-client';
import { sendMessage as sendMessageApi } from '../api/messaging';
import type { Message } from '../types';

type SupabaseMessageRow = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read?: boolean;
  attachments?: any[];
};

type SupabaseUserRow = {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
};

const mapMessage = (message: SupabaseMessageRow, sender: SupabaseUserRow): Message => ({
  id: message.id,
  conversationId: message.conversation_id,
  senderId: message.sender_id,
  content: message.content,
  created_at: message.created_at,
  read: message.read ?? false,
  attachments: message.attachments ?? [],
  sender: {
    id: sender?.id ?? message.sender_id,
    name: sender?.full_name ?? '',
    avatar: sender?.avatar_url ?? '',
    isOnline: false,
  },
});

export function useChatMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('id, conversation_id, sender_id, content, created_at, sender:users(id, full_name, avatar_url)')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Failed to load messages', error);
        if (isMounted) setLoading(false);
        return;
      }

      if (!isMounted) return;
      const formatted = (data || []).map((row: any) => mapMessage(row, row.sender));
      setMessages(formatted);
      setLoading(false);
    };

    loadMessages();

    const channel = supabase
      .channel(`messages-conversation-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const newMessage = payload.new as SupabaseMessageRow;

          const { data: sender, error: senderError } = await supabase
            .from('users')
            .select('id, full_name, avatar_url')
            .eq('id', newMessage.sender_id)
            .single();

          if (senderError || !sender) {
            console.error('Failed to fetch sender details for new message', senderError);
            return;
          }

          const formatted = mapMessage(newMessage, sender);

          setMessages((prev) => {
            if (prev.some((message) => message.id === formatted.id)) return prev;
            return [...prev, formatted];
          });
        }
      );

    channel.subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId) throw new Error('Missing conversation ID');
      if (!user?.id) throw new Error('User not authenticated');

      const newMessage = await sendMessageApi(conversationId, user.id, content);
      const formatted = mapMessage(newMessage as any, (newMessage as any).sender);

      setMessages((prev) => {
        if (prev.some((message) => message.id === formatted.id)) return prev;
        return [...prev, formatted];
      });
    },
    [conversationId, user?.id]
  );

  return { messages, loading, sendMessage };
}
