'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, DollarSign, X } from 'lucide-react';
// We use 'any' here temporarily to bypass the type mismatch until you fully sync types
// or import { Project } from '@/features/projects/api/projects';
import { toast } from 'sonner';
import { createPaymentIntent } from '../api/payments';
import { StripePaymentSheet } from '@/features/payment/components/stripe-payment-sheet';
import { useAuth } from '@/features/auth/lib/auth-client';
import { format } from 'date-fns';
import { projectKeys } from '@/features/projects/hooks/use-projects';
import { submitDeliverable } from '../api/deliverables';
import { dashboardKeys } from '@/features/dashboard/hooks/use-dashboard';
import type { MilestoneType } from '../api/payments';

interface ProjectPaymentTabProps {
  project: any; // changing to any to allow direct DB access for now
  isClient: boolean;
  autoPayMilestone?: MilestoneType | null;
  onAutoPayHandled?: () => void;
}

export function ProjectPaymentTab({
  project,
  isClient,
  autoPayMilestone,
  onAutoPayHandled,
}: ProjectPaymentTabProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isSubmittingWork, setIsSubmittingWork] = useState(false);
  const [deliveryFiles, setDeliveryFiles] = useState<File[]>([]);
  const deliveryInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // --- 1. CALCULATE AMOUNTS ---
  const totalBudget =
    project?.proposal?.total_budget ??
    project?.fixed_budget ??
    project?.budget ??
    project?.budgetAmount ??
    0;
  console.log("DEBUG PROJECT DATA:", project); 

  const upfrontAmount = totalBudget / 2;
  const finalAmount = totalBudget / 2;

  // --- 2. MAP DB FIELDS TO UI VARIABLES ---
  // This bridges the gap between DB (snake_case) and UI (camelCase)
  // --- 2. MAP DB FIELDS TO UI VARIABLES ---
  // We check BOTH snake_case (DB) and camelCase (Frontend) to be safe
  const isUpfrontPaid = project.upfront_paid === true || project.upfrontPaid === true;
  const isFinalPaid = project.final_paid === true || project.finalPaid === true;
  const upfrontDate = project.upfront_date || project.upfrontDate;
  const upfrontStatusLabel = isUpfrontPaid
    ? isClient
      ? 'Funded'
      : 'Paid'
    : isClient
    ? 'Awaiting Funding'
    : 'Payment Incoming';
  
  // FIX: Check both naming conventions for the ID
  const freelancerId = project.hired_freelancer_id || project.freelancerId;
  
  const progress = project.progress || 0; 
  const deliverables = project.deliverables || [];

  // Role-based labels for clarity
  const paymentTitle = isClient ? 'Milestone Payments' : 'Milestone Earnings';
  const paymentDescription = isClient
    ? 'Fund each milestone to keep work moving'
    : 'Track funds heading your way for each milestone';
  const totalLabel = isClient ? 'Total Cost' : 'Total Value';
  const fundedLabel = isClient ? 'Funded' : 'Earnings';
  const remainingLabel = isClient ? 'Remaining' : 'Incoming';

  const createIntentMutation = useMutation({
    mutationFn: createPaymentIntent,
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      toast.success('Secure payment form ready');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to start payment');
    },
  });

  const handlePaymentSuccess = useCallback(() => {
    if (project?.id) {
      queryClient.invalidateQueries({ queryKey: ['project', project.id] });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(project.id) });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    }
    router.refresh();
  }, [project?.id, queryClient, router]);

  const handlePayUpfront = useCallback(() => {
    if (!user?.id) return toast.error('Missing user ID');
    if (!freelancerId) return toast.error('Project has no assigned freelancer');

    createIntentMutation.mutate({
      projectId: project.id,
      clientId: project.client_id || user.id, // Fallback if client_id missing
      freelancerId: freelancerId,
      milestoneType: 'upfront_50',
    });
  }, [createIntentMutation, freelancerId, project.client_id, project.id, user?.id]);

  const handlePayFinal = useCallback(() => {
    if (!user?.id) return toast.error('Missing user ID');
    if (!freelancerId) return toast.error('Project has no assigned freelancer');

    createIntentMutation.mutate({
      projectId: project.id,
      clientId: project.client_id || user.id,
      freelancerId: freelancerId,
      milestoneType: 'final_50',
    });
  }, [createIntentMutation, freelancerId, project.client_id, project.id, user?.id]);

  const autoPayTriggered = useRef<MilestoneType | null>(null);

  useEffect(() => {
    if (!isClient) return;
    if (!autoPayMilestone) {
      autoPayTriggered.current = null;
      return;
    }
    if (autoPayTriggered.current === autoPayMilestone) return;

    autoPayTriggered.current = autoPayMilestone;

    if (autoPayMilestone === 'upfront_50') {
      if (!isUpfrontPaid) {
        handlePayUpfront();
      }
    } else if (!isFinalPaid) {
      handlePayFinal();
    }

    onAutoPayHandled?.();
  }, [
    autoPayMilestone,
    handlePayFinal,
    handlePayUpfront,
    isClient,
    isFinalPaid,
    isUpfrontPaid,
    onAutoPayHandled,
  ]);

  const handleSubmitWork = async () => {
    if (!user?.id) return toast.error('Missing user ID');
    if (!freelancerId || user.id !== freelancerId) return toast.error('Only the assigned freelancer can submit work');
    setIsSubmittingWork(true);
    try {
      await submitDeliverable({
        project_id: project.id,
        freelancer_id: freelancerId,
        title: 'Final Submission',
        description: 'Final work submitted for client review.',
        attachments: deliveryFiles,
      });
      toast.success('Work submitted for review');
      if (project?.id) {
        queryClient.invalidateQueries({ queryKey: ['project', project.id] });
        queryClient.invalidateQueries({ queryKey: projectKeys.detail(project.id) });
        queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      }
      setDeliveryFiles([]);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Failed to submit work');
    } finally {
      setIsSubmittingWork(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{paymentTitle}</CardTitle>
        <CardDescription>{paymentDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Payment Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">{totalLabel}</p>
                <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
              </div>
              <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">{fundedLabel}</p>
              <p className="text-2xl font-bold text-green-600">
                ${(isUpfrontPaid ? upfrontAmount : 0).toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">{remainingLabel}</p>
              <p
                className={`text-2xl font-bold ${isUpfrontPaid ? 'text-green-600' : 'text-blue-600'}`}
              >
                ${(!isFinalPaid ? finalAmount : 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Payment Stages */}
          <div className="space-y-4">
            {/* Upfront Payment */}
            <div
              className={`p-4 rounded-lg border ${
                isUpfrontPaid
                  ? 'bg-green-500/5 border-green-500/20'
                  : 'bg-muted/30 border-border'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {isUpfrontPaid ? (
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 border-2 border-muted-foreground rounded-full flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">1</span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium">
                      {isClient ? 'Fund Upfront Milestone (50%)' : 'Receive Upfront (50%)'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {isUpfrontPaid
                        ? `${isClient ? 'Payment sent' : 'Payment received'} on ${
                            upfrontDate ? format(new Date(upfrontDate), 'MMM d, yyyy') : 'Date'
                          }`
                        : isClient
                        ? 'Fund this milestone to kick off the project'
                        : 'Client will fund this milestone to start the project'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge
                    variant="outline"
                    className={
                      isUpfrontPaid
                        ? 'bg-green-500/10 text-green-700 border-green-500/30'
                        : 'bg-blue-500/10 text-blue-700 border-blue-500/30'
                    }
                  >
                    {isUpfrontPaid ? (isClient ? 'Funded' : 'Paid') : isClient ? 'Awaiting Funding' : 'Payment Incoming'}
                  </Badge>
                  <Badge variant="secondary">
                    ${upfrontAmount.toLocaleString()}
                  </Badge>
                </div>
              </div>
              {!isUpfrontPaid && isClient && (
                <Button
                  size="sm"
                  className="w-full"
                  onClick={handlePayUpfront}
                  disabled={createIntentMutation.isPending}
                >
                  {createIntentMutation.isPending ? 'Starting...' : 'Pay 50% Upfront'}
                </Button>
              )}
            </div>

            {/* Final Payment */}
            <div
              className={`p-4 rounded-lg border ${
                isFinalPaid
                  ? 'bg-green-500/5 border-green-500/20'
                  : progress >= 90
                  ? 'bg-amber-500/5 border-amber-500/20'
                  : 'bg-muted/30 border-border'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {isFinalPaid ? (
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  ) : progress >= 90 ? (
                    <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 border-2 border-muted-foreground rounded-full flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">2</span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium">Final Payment (50%)</h4>
                    <p className="text-sm text-muted-foreground">
                      {isFinalPaid
                        ? isClient
                          ? 'Final balance sent'
                          : 'Final balance received'
                        : progress >= 90
                        ? isClient
                          ? 'Approve work to release the final balance'
                          : 'Client will approve and release the final balance'
                        : isClient
                        ? 'Release the final balance once the work is complete'
                        : 'Final balance arrives after the client approves your work'}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="ml-4">
                  ${finalAmount.toLocaleString()}
                </Badge>
              </div>

              {isClient && !isFinalPaid && progress >= 90 && (
                <Button
                  size="sm"
                  className="w-full"
                  onClick={handlePayFinal}
                  disabled={createIntentMutation.isPending}
                >
                  {createIntentMutation.isPending ? 'Starting...' : 'Approve Work & Pay Final Balance'}
                </Button>
              )}
            </div>
          </div>

          {/* Freelancer submit work action */}
          {!isClient && isUpfrontPaid && !isFinalPaid && (
            <div className="p-4 rounded-lg border bg-muted/30 border-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium">Submit Final Work for Review</h4>
                  <p className="text-sm text-muted-foreground">
                    Send your final deliverables to the client so they can approve and release the remaining payment.
                  </p>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => deliveryInputRef.current?.click()}
                  >
                    Add Files
                  </Button>
                  <input
                    ref={deliveryInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setDeliveryFiles((prev) => [...prev, ...files]);
                    }}
                    accept=".pdf,.zip,.rar,.7z,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload your deliverables (zip, pdf, docs, or images)
                  </p>
                </div>
                {deliveryFiles.length > 0 && (
                  <div className="space-y-2">
                    {deliveryFiles.map((file, index) => (
                      <div
                        key={file.name + index}
                        className="flex items-center justify-between rounded-md border p-2 bg-background"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <CheckCircle className="w-4 h-4 text-muted-foreground" />
                          <div className="min-w-0">
                            <p className="text-sm truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setDeliveryFiles((prev) => prev.filter((_, i) => i !== index))
                          }
                          className="h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button
                size="sm"
                className="w-full"
                onClick={handleSubmitWork}
                disabled={isSubmittingWork}
              >
                {isSubmittingWork ? 'Submitting...' : 'Submit Final Work for Review'}
              </Button>
            </div>
          )}

          {/* Deliverables (Only show if array exists) */}
          {deliverables.length > 0 && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Project Deliverables</h4>
                {isFinalPaid && (
                  <Badge variant="outline" className="text-green-700 border-green-500/40 bg-green-500/10">
                    Project Successfully Completed
                  </Badge>
                )}
              </div>
              <div className="space-y-2">
                {deliverables.map((deliverable: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">{deliverable}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <div className="text-sm">
                <p className="font-medium mb-1">Milestone Payments</p>
                <p className="text-muted-foreground">
                  This project uses a Milestone Payment system. You pay 50% to start, and the
                  remaining 50% upon completion. Payments are processed securely via Stripe.
                </p>
              </div>
            </div>
          </div>

          {clientSecret && (
            <StripePaymentSheet
              clientSecret={clientSecret}
              projectId={project.id}
              onSuccess={handlePaymentSuccess}
              onClose={() => setClientSecret(null)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
