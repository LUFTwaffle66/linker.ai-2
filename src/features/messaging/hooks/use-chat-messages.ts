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
          console.log('🟢 REALTIME EVENT RECEIVED:', payload);
          const newMessage = payload.new as SupabaseMessageRow;

          // Start with a safe fallback sender to avoid blocking UI updates.
          let senderDetails: SupabaseUserRow = {
            id: newMessage.sender_id,
            full_name: 'Loading...',
            avatar_url: null,
          };

          try {
            const { data: userProfile, error: profileError } = await supabase
              .from('users')
              .select('id, full_name, avatar_url')
              .eq('id', newMessage.sender_id)
              .single();

            if (profileError) {
              console.warn('⚠️ Could not fetch sender profile, using fallback.', profileError);
            }

            if (userProfile) {
              senderDetails = userProfile;
            }
          } catch (err) {
            console.warn('⚠️ Unexpected error fetching sender profile, using fallback.', err);
          }

          const formattedMessage = mapMessage(newMessage, senderDetails);

          setMessages((prev) => {
            if (prev.some((message) => message.id === formattedMessage.id)) return prev;
            return [...prev, formattedMessage];
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
