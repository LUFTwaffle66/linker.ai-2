import { ActiveProjectView } from '@/features/active-projects';

interface ProjectPageProps {
  params: {
    projectId: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return <ActiveProjectView projectId={params.projectId} />;
}
