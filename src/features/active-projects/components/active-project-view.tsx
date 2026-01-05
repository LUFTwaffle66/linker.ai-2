'use client';

import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, DollarSign, TrendingUp, FileText, Upload } from 'lucide-react';
import { useAuth } from '@/features/auth/lib/auth-client';
import { ProjectHeader } from './project-header';
import { ProjectMessagesTab } from './project-messages-tab';
import { ProjectPaymentTab } from './project-payment-tab';
import { ProjectUpdatesTab } from './project-updates-tab';
import { ProjectProposalsTab } from './project-proposals-tab';
import { ProjectDeliverablesTab } from './project-deliverables-tab';
import { ProjectSidebar } from './project-sidebar';
import { useProject } from '../api/get-project';
import { useProject as useProjectDetails } from '@/features/projects/hooks/use-projects';
import { SubmitProposalForm } from '@/features/proposals/components/submit-proposal-form';
import { useUserProposalForProject } from '@/features/proposals/api/use-user-proposal';
import type { MilestoneType } from '../api/payments';
import { ReviewModal } from '@/features/reviews/components/review-modal';
import { useCreateReview, useProjectReview } from '@/features/reviews/hooks/use-reviews';

interface ActiveProjectViewProps {
  projectId: string;
  fromInvitation?: boolean;
}

export function ActiveProjectView({ projectId, fromInvitation }: ActiveProjectViewProps) {
  // 1. ALL STATE HOOKS
  const [activeTab, setActiveTab] = useState('messages');
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [autoPayMilestone, setAutoPayMilestone] = useState<MilestoneType | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // 2. ALL DATA FETCHING HOOKS
  const { data: project, isLoading: isProjectLoading } = useProject(projectId);
  const { data: projectDetails, isLoading: isDetailsLoading } = useProjectDetails(projectId);
  const { data: existingProposal, isLoading: isProposalLoading } = useUserProposalForProject(projectId);

  // 3. DERIVED DATA (Calculated every render)
  const isLoading = isProjectLoading || isDetailsLoading || isProposalLoading;
  const isClient = projectDetails?.client_id === user?.id;
  const isFreelancer = projectDetails?.hired_freelancer_id === user?.id;
  const projectStatus = projectDetails?.status || 'open';
  
  const canSubmitProposal =
    !isClient &&
    !isFreelancer &&
    fromInvitation &&
    !existingProposal &&
    projectStatus === 'open';

  const showProposals = isClient && (projectStatus === 'open' || projectStatus === 'draft');
  const showWorkTabs = projectStatus === 'in_progress' || projectStatus === 'completed';
  const revieweeId = isClient ? projectDetails?.hired_freelancer_id : isFreelancer ? projectDetails?.client_id : null;
  const isProjectCompleted = projectStatus === 'completed' || project?.status === 'completed';
  const shouldCheckReview =
    isProjectCompleted && Boolean(revieweeId) && (isClient || isFreelancer) && Boolean(user?.id);

  const { data: existingReview, isLoading: isReviewLoading } = useProjectReview(
    projectId,
    user?.id,
    shouldCheckReview
  );

  const createReviewMutation = useCreateReview();

  // 4. ALL EFFECT HOOKS (Must stay above early returns)
  useEffect(() => {
    const tabParam = searchParams?.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }

    const payParam = searchParams?.get('pay');
    if (payParam === 'upfront_50' || payParam === 'final_50') {
      setPendingTab('payment');
      setAutoPayMilestone(payParam as MilestoneType);
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    }
  }, [searchParams, queryClient, projectId]);

  useEffect(() => {
    // We wrap logic in checks to ensure we don't act before data is ready
    if (!isLoading && projectDetails) {
      if (showProposals && !showWorkTabs && activeTab !== 'proposals') {
        setActiveTab('proposals');
      }

      if (!showProposals && activeTab === 'proposals') {
        setActiveTab(pendingTab ?? 'messages');
      }

      if (pendingTab && showWorkTabs && activeTab !== pendingTab) {
        setActiveTab(pendingTab);
        setPendingTab(null);
      }
    }
  }, [activeTab, pendingTab, showProposals, showWorkTabs, isLoading, projectDetails]);

  // 5. HELPER FUNCTIONS
  const triggerUpfrontPayment = () => {
    setPendingTab('payment');
    setAutoPayMilestone('upfront_50');
  };

  const triggerFinalPayment = () => {
    setPendingTab('payment');
    setAutoPayMilestone('final_50');
  };

  const shouldShowReviewCta =
    isProjectCompleted &&
    (isClient || isFreelancer) &&
    Boolean(revieweeId) &&
    !isReviewLoading &&
    !existingReview;

  const handleSubmitReview = async (values: { rating: number; comment: string }) => {
    if (!user?.id || !revieweeId) return;

    try {
      await createReviewMutation.mutateAsync({
        projectId,
        reviewerId: user.id,
        revieweeId,
        rating: values.rating,
        comment: values.comment,
      });
      setReviewModalOpen(false);
    } catch (error) {
      console.error('Failed to submit review', error);
    }
  };

  // 6. CONDITIONAL RETURNS (Now safe to use)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  if (!project || !projectDetails) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  if (canSubmitProposal) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SubmitProposalForm
            project={projectDetails}
            onProposalSubmitted={() => {
              toast.success('Proposal submitted successfully');
              router.refresh(); // Refresh to update counts
              router.push('/browse?tab=projects');
            }}
          />
        </div>
      </div>
    );
  }

  // 7. MAIN RENDER
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectHeader project={project} />

        {shouldShowReviewCta && (
          <div className="mb-4">
            <div className="p-4 border rounded-lg bg-primary/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-medium">Share your experience</p>
                <p className="text-sm text-muted-foreground">
                  Leave a review to help the community and update ratings.
                </p>
              </div>
              <Button onClick={() => setReviewModalOpen(true)}>Leave a Review</Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={`grid w-full ${showProposals ? 'grid-cols-1' : 'grid-cols-4'} mb-6`}>
                {showProposals && (
                  <TabsTrigger value="proposals" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Proposals ({projectDetails.proposal_count || 0})</span>
                  </TabsTrigger>
                )}
                {showWorkTabs && (
                  <>
                    <TabsTrigger value="messages" className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span className="hidden sm:inline">Messages</span>
                    </TabsTrigger>
                    <TabsTrigger value="deliverables" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      <span className="hidden sm:inline">Deliverables</span>
                    </TabsTrigger>
                    {project.freelancerId && (
                      <TabsTrigger value="payment" className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span className="hidden sm:inline">Payment</span>
                      </TabsTrigger>
                    )}
                    <TabsTrigger value="updates" className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="hidden sm:inline">Updates</span>
                    </TabsTrigger>
                  </>
                )}
              </TabsList>

              {showProposals && (
                <TabsContent value="proposals">
                  <ProjectProposalsTab
                    projectId={projectId}
                    isClient={isClient}
                    onProposalAccepted={triggerUpfrontPayment}
                  />
                </TabsContent>
              )}

              {showWorkTabs && (
                <>
                  <TabsContent value="messages">
                    <ProjectMessagesTab projectId={projectId} />
                  </TabsContent>

                  <TabsContent value="deliverables">
                    <ProjectDeliverablesTab
                      projectId={projectId}
                      isClient={isClient}
                      isFreelancer={isFreelancer}
                      freelancerId={isFreelancer ? user?.id : undefined}
                      onDeliverableApproved={triggerFinalPayment}
                    />
                  </TabsContent>

                  {project.freelancerId && (
                    <TabsContent value="payment">
                      <ProjectPaymentTab
                        project={project}
                        isClient={isClient}
                        autoPayMilestone={autoPayMilestone}
                        onAutoPayHandled={() => setAutoPayMilestone(null)}
                      />
                    </TabsContent>
                  )}

                  <TabsContent value="updates">
                    <ProjectUpdatesTab projectId={projectId} />
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>

          <ProjectSidebar project={project} />
        </div>
      </div>

      <ReviewModal
        open={reviewModalOpen}
        onOpenChange={setReviewModalOpen}
        reviewTargetName={isClient ? project.freelancer : project.client}
        projectTitle={project.title}
        onSubmit={handleSubmitReview}
        isSubmitting={createReviewMutation.isPending}
      />
    </div>
  );
}
