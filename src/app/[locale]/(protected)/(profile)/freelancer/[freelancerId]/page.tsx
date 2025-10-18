'use client';

import { useParams } from 'next/navigation';
import { FreelancerProfile, useFreelancerProfile } from '@/features/profiles';

export default function FreelancerProfilePage() {
  const params = useParams();
  const freelancerId = params.freelancerId as string;

  const { data, isLoading, error } = useFreelancerProfile(freelancerId);

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
            {error instanceof Error ? error.message : 'Failed to load freelancer profile'}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return <FreelancerProfile />;
}
