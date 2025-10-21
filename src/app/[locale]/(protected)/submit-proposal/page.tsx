'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SubmitProposalForm } from '@/features/proposals/components/submit-proposal-form';
import { paths } from '@/config/paths';

export default function SubmitProposalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return <SubmitProposalForm />;
}
