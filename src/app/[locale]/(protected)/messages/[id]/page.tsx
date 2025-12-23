'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function MessageRedirect() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    // 1. Grab the ID from the URL path (e.g. "78ed0013...")
    const conversationId = params?.id;

    if (conversationId) {
      console.log('🔄 Redirecting legacy link to new format...');
      // 2. Redirect to the working Query Param format
      router.replace(`/en/messages?chat_id=${conversationId}`);
    } else {
      // Fallback if something is weird
      router.replace('/en/messages');
    }
  }, [params, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-muted-foreground">Opening chat...</p>
      </div>
    </div>
  );
}