'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectPostingForm } from '@/features/projects';
import { paths } from '@/config/paths';

export default function PostProjectPage() {
  const router = useRouter();

  return <ProjectPostingForm />;
}
