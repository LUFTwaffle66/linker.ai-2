'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useParticipantStatus(userId: string | undefined) {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchStatus = async () => {
      // DEBUG: Let's see exactly what we get
      const { data, error } = await supabase
        .from('public_profiles')
        .select('*') // Select ALL columns to see what is actually available
        .eq('id', userId)
        .single();

        console.log('🔍 DEBUG RAW DATA:', data); // <--- LOOK AT THIS IN CONSOLE
        console.log('❌ DEBUG ERROR:', error);

      if (error) {
        console.error('Status Fetch Error:', error);
      } else if (data) {
        console.log('Initial Status for', userId, data); // <--- Check your console!
        //  Map the new column to state
        setIsOnline(data.is_online_for_chat === true); 
        setLastSeen(data.last_login);
      }
    };

    fetchStatus();

    // Subscribe to Realtime
    const channel = supabase
      .channel(`user-status:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          console.log('Realtime Update:', payload); // <--- Check this too!
          const newUser = payload.new;
          //  Map the new column here too
          setIsOnline(newUser.is_online_for_chat === true);
          setLastSeen(newUser.last_login);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { isOnline, lastSeen };
}