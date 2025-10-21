'use client';

import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ClientProfile, useClientProfile } from '@/features/profiles';

export default function ClientProfilePage() {
  const params = useParams();
  const clientId = params.clientId as string;
  const { data: session } = useSession();

  const { data, isLoading, error } = useClientProfile(clientId);

  // Check if the logged-in user is viewing their own profile
  const isOwnProfile = session?.user?.id === clientId;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : 'Failed to load client profile'}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return <ClientProfile profile={data} clientId={clientId} isOwnProfile={isOwnProfile} />;
}
