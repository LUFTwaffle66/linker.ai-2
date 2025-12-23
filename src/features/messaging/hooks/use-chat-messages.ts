'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth/lib/auth-client';
import { sendMessage as sendMessageApi } from '../api/messaging';
import type { Message } from '../types';

export function useChatMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Ref to track processed IDs to prevent duplicates
  const processedIds = useRef(new Set<string>());

  // 1. Initial Load
  useEffect(() => {
    if (!conversationId) return;

    setLoading(true);
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:users(id, full_name, avatar_url)')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        const formatted = (data || []).map((msg: any) => {
          const senderUser = msg.sender
            ? {
                id: msg.sender.id,
                name: msg.sender.full_name,
                avatar: msg.sender.avatar_url,
                isOnline: false, // Assuming not online unless presence is tracked
              }
            : {
                id: msg.sender_id,
                name: 'Unknown User',
                avatar: null,
                isOnline: false,
              };

          return {
            id: msg.id,
            conversationId: msg.conversation_id,
            senderId: msg.sender_id,
            content: msg.content,
            created_at: msg.created_at,
            read: msg.read || false,
            attachments: msg.attachments || [],
            sender: senderUser,
          };
        });

        // Update state and cache IDs
        setMessages(formatted);
        formatted.forEach((m: any) => processedIds.current.add(m.id));
      }
      setLoading(false);
    };

    fetchMessages();
  }, [conversationId]);

  // 2. Realtime Subscription (The Fix)
  useEffect(() => {
    if (!conversationId) return;

    console.log('🔵 Setting up Realtime for:', conversationId);

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          console.log('🟢 REALTIME EVENT:', payload);
          const newMsg = payload.new;

          // Prevent duplicate events
          if (processedIds.current.has(newMsg.id)) return;
          processedIds.current.add(newMsg.id);

          // A. IMMEDIATE UPDATE (Optimistic)
          // We show the message instantly with a placeholder sender
          const optimisticMessage: Message = {
            id: newMsg.id,
            conversationId: newMsg.conversation_id,
            senderId: newMsg.sender_id,
            content: newMsg.content,
            created_at: newMsg.created_at,
            read: false,
            attachments: [],
            sender: {
              id: newMsg.sender_id,
              name: 'Loading...', // Temporary name
              avatar: null,
              isOnline: false,
            },
          };

          setMessages((prev) => [...prev, optimisticMessage]);

          // B. FETCH REAL SENDER (Background)
          const { data: userData } = await supabase
            .from('users')
            .select('full_name, avatar_url')
            .eq('id', newMsg.sender_id)
            .single();

          if (userData) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === newMsg.id
                  ? { ...m, sender: { ...m.sender, name: userData.full_name, avatar: userData.avatar_url } }
                  : m
              )
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('DATA STREAM STATUS:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || !user) return;
      try {
        await sendMessageApi(conversationId, user.id, content);
        // We don't manually append here because the Realtime subscription will catch our own message too!
      } catch (err) {
        console.error('Failed to send:', err);
      }
    },
    [conversationId, user]
  );

  return { messages, loading, sendMessage };
}
