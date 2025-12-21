import { ActiveProjectView } from '@/features/active-projects';

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProjectPage({ params, searchParams }: ProjectPageProps) {
  // ⬅️ Next.js 15: BOTH are Promises
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const projectId = resolvedParams.projectId;
  const fromInvitation = resolvedSearchParams.fromInvitation === 'true';

  return (
    <ActiveProjectView 
      projectId={projectId}
      fromInvitation={fromInvitation}
    />
  );
}