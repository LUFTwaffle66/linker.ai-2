'use client';

import { useSearchParams } from 'next/navigation';
import { SubmitProposalForm } from '@/features/proposals/components/submit-proposal-form';
import { useProject } from '@/features/projects/hooks/use-projects';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/routing';
import { paths } from '@/config/paths';

export default function SubmitProposalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');

  const { data: project, isLoading, error } = useProject(projectId || '');

  // No project ID in URL
  if (!projectId) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No project selected. Please select a project to submit a proposal.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => router.push(paths.public.browse.getHref({ tab: 'projects' }))}>
            Browse Projects
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading project details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || 'Failed to load project. The project may not exist or has been removed.'}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => router.push(paths.public.browse.getHref({ tab: 'projects' }))}>
            Browse Projects
          </Button>
        </div>
      </div>
    );
  }

  return <SubmitProposalForm project={project} />;
}
