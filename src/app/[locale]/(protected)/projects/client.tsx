'use client';

import { useAuth } from '@/features/auth/lib/auth-client';
import { useFreelancerProjects, useClientProjects } from '@/features/projects/hooks/use-projects';
import { ProjectsList } from '@/features/projects/components/projects-list';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { paths } from '@/config/paths';

export function ProjectsClient() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const isFreelancer = user?.role === 'freelancer';
  const isClient = user?.role === 'client';

  // Fetch projects based on user role
  const { data: freelancerProjects, isLoading: isFreelancerLoading, error: freelancerError } =
    useFreelancerProjects(isFreelancer ? user?.id : undefined);

  const { data: clientProjects, isLoading: isClientLoading, error: clientError } =
    useClientProjects(isClient ? user?.id || '' : '');

  const projects = isFreelancer ? freelancerProjects : clientProjects;
  const isLoading = isFreelancer ? isFreelancerLoading : isClientLoading;
  const error = isFreelancer ? freelancerError : clientError;

  if (isAuthLoading || isLoading) {
    return (
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-12 w-full" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load projects. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Get role-specific content
  const getHeaderContent = () => {
    if (isFreelancer) {
      return {
        title: 'My Projects',
        description: 'Manage your active and completed projects',
        ctaText: 'Find New Projects',
        ctaAction: () => router.push(paths.public.findWork.getHref()),
        emptyTitle: 'No projects yet',
        emptyDescription: 'Start browsing available projects and submit proposals to get hired.',
        emptyCtaText: 'Browse Projects',
        emptyCtaAction: () => router.push(paths.public.findWork.getHref()),
      };
    }

    return {
      title: 'My Projects',
      description: 'Manage projects you have posted',
      ctaText: 'Post New Project',
      ctaAction: () => router.push(paths.app.postProject.getHref()),
      emptyTitle: 'No projects posted yet',
      emptyDescription: 'Start by posting your first project and find the perfect AI expert for your needs.',
      emptyCtaText: 'Post a Project',
      emptyCtaAction: () => router.push(paths.app.postProject.getHref()),
    };
  };

  const content = getHeaderContent();

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Briefcase className="w-8 h-8" />
              {content.title}
            </h1>
            <p className="text-muted-foreground mt-2">
              {content.description}
            </p>
          </div>
          <Button onClick={content.ctaAction}>
            {content.ctaText}
          </Button>
        </div>

        {/* Projects List */}
        {projects && projects.length > 0 ? (
          <ProjectsList projects={projects} currentUserId={user?.id} />
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{content.emptyTitle}</h3>
            <p className="text-muted-foreground mb-6">
              {content.emptyDescription}
            </p>
            <Button onClick={content.emptyCtaAction}>
              {content.emptyCtaText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
