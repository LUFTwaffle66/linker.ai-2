'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client'; // Ensure this path is correct!
import { useAuth } from '@/features/auth/lib/auth-client';
import { sendMessage as sendMessageApi } from '../api/messaging';
import type { Message } from '../types';

export function useChatMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState<string>('DISCONNECTED');
  const { user } = useAuth();

  // Ref to track processed IDs to prevent duplicates
  const processedIds = useRef(new Set<string>());

  // Debug: Check if the hook is even receiving the ID
  useEffect(() => {
    console.log('🪝 useChatMessages Hook Active. conversationId:', conversationId);
  }, [conversationId]);

  // 1. Initial Load
  useEffect(() => {
    if (!conversationId) return;

    setLoading(true);
    const fetchMessages = async () => {
      console.log('Fetching initial messages for:', conversationId);
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:users(id, full_name, avatar_url)')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Error fetching messages:', error);
      } else {
        console.log(`✅ Fetched ${data?.length || 0} messages`);
        const formatted = (data || []).map((msg: any) => {
          const senderUser = msg.sender
            ? {
                id: msg.sender.id,
                name: msg.sender.full_name,
                avatar: msg.sender.avatar_url,
                isOnline: false, 
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

        setMessages(formatted);
        formatted.forEach((m: any) => processedIds.current.add(m.id));
      }
      setLoading(false);
    };

    fetchMessages();
  }, [conversationId]);

  // 2. Realtime Subscription
  useEffect(() => {
    if (!conversationId) return;

    console.log('🔵 Attempting Realtime Connection for:', conversationId);
    
    // Create a unique channel name to avoid collisions
    const channelName = `chat:${conversationId}`;
    
    const channel = supabase
      .channel(channelName)
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
          const newMsg = payload.new;

          if (processedIds.current.has(newMsg.id)) {
            console.log('⚠️ Duplicate message ignored:', newMsg.id);
            return;
          }
          processedIds.current.add(newMsg.id);

          // Optimistic update
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
              name: 'Loading...', 
              avatar: null,
              isOnline: false,
            },
          };

          setMessages((prev) => [...prev, optimisticMessage]);

          // Fetch sender details
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
        console.log(`📡 Subscription Status [${channelName}]:`, status);
        setRealtimeStatus(status);
        
        if (status === 'CHANNEL_ERROR') {
          console.error('🔴 Realtime Channel Error - Check RLS Policies or Connection');
        }
      });

    return () => {
      console.log('Cleaning up channel:', channelName);
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || !user) return;
      try {
        await sendMessageApi(conversationId, user.id, content);
      } catch (err) {
        console.error('Failed to send:', err);
      }
    },
    [conversationId, user]
  );

  return { messages, loading, sendMessage, realtimeStatus };
}