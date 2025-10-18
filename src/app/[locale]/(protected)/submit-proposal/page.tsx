'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SubmitProposalForm } from '@/features/proposals/components/submit-proposal-form';
import { paths } from '@/config/paths';

export default function SubmitProposalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // TODO: Replace with actual authentication check
  // For now, set to false to redirect to login
  const isAuthenticated = true;

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      // Get the current URL to redirect back after login
      const currentPath = `/submit-proposal${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      router.push(paths.auth.login.getHref(currentPath));
    }
  }, [isAuthenticated, router, searchParams]);

  // Don't render the component if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <SubmitProposalForm />;
}
