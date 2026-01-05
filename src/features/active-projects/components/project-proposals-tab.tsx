'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  useProjectProposals,
  useProposalStats,
  useAcceptProposal,
  useRejectProposal,
  useShortlistProposal,
} from '@/features/proposals/hooks/use-proposals';
import {
  Check,
  X,
  Star,
  DollarSign,
  Calendar,
  MessageSquare,
  Eye,
  Paperclip,
  Download,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ProposalWithDetails } from '@/features/proposals/api/proposals';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { calculateTimeLeft } from '@/features/proposals/utils/duration';

interface ProjectProposalsTabProps {
  projectId: string;
  isClient: boolean;
  onProposalAccepted?: () => void;
}

const statusConfig = {
  submitted: { label: 'New', color: 'bg-blue-500' },
  under_review: { label: 'Reviewing', color: 'bg-yellow-500' },
  shortlisted: { label: 'Shortlisted', color: 'bg-purple-500' },
  accepted: { label: 'Accepted', color: 'bg-green-500' },
  rejected: { label: 'Rejected', color: 'bg-red-500' },
  withdrawn: { label: 'Withdrawn', color: 'bg-gray-500' },
} as const;

export function ProjectProposalsTab({
  projectId,
  isClient,
  onProposalAccepted,
}: ProjectProposalsTabProps) {
  const { data: proposals, isLoading, isError, error } = useProjectProposals(projectId);
  const { data: stats } = useProposalStats(projectId);
  const acceptMutation = useAcceptProposal();
  const rejectMutation = useRejectProposal();
  const shortlistMutation = useShortlistProposal();

  const [selectedProposal, setSelectedProposal] = useState<ProposalWithDetails | null>(null);
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);
  const [feedback, setFeedback] = useState('');

  const handleAccept = () => {
    if (!selectedProposal) return;
    acceptMutation.mutate(
      { proposalId: selectedProposal.id, feedback: feedback || undefined },
      {
        onSuccess: () => {
          setSelectedProposal(null);
          setActionType(null);
          setFeedback('');
          onProposalAccepted?.();
        },
      }
    );
  };

  const handleReject = () => {
    if (!selectedProposal) return;
    rejectMutation.mutate(
      { proposalId: selectedProposal.id, feedback: feedback || undefined },
      {
        onSuccess: () => {
          setSelectedProposal(null);
          setActionType(null);
          setFeedback('');
        },
      }
    );
  };

  const handleShortlist = (proposal: ProposalWithDetails) => {
    shortlistMutation.mutate(proposal.id);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48" />)}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load proposals: {(error as Error).message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!isClient) {
    return (
      <Alert>
        <AlertDescription>Only the project owner can view proposals.</AlertDescription>
      </Alert>
    );
  }

  if (!proposals || proposals.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No proposals yet</h3>
            <p className="text-muted-foreground">
              Freelancers will submit their proposals here. You'll be notified when new proposals arrive.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total</CardDescription>
              <CardTitle className="text-2xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>New</CardDescription>
              <CardTitle className="text-2xl">{stats.submitted}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Shortlisted</CardDescription>
              <CardTitle className="text-2xl">{stats.shortlisted}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Accepted</CardDescription>
              <CardTitle className="text-2xl">{stats.accepted}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Proposals List */}
      <div className="space-y-4">
        {proposals.map((proposal) => {
          const status = statusConfig[proposal.status];
          const submittedAt = formatDistanceToNow(new Date(proposal.created_at), { addSuffix: true });
          
          // ✅ FIX: Calculate Time Left and prefer that for display
          const timeLeft = calculateTimeLeft(
            proposal.duration_value,
            proposal.duration_unit,
            proposal.created_at
          );
          
          // If we have a time left calculation, use that. Otherwise fallback to raw timeline string.
          const durationDisplay = timeLeft ? timeLeft.relativeText : proposal.timeline;

          const attachments = (proposal as any).attachments || [];

          return (
            <Card key={proposal.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={proposal.freelancer.avatar_url || undefined} />
                      <AvatarFallback>
                        {proposal.freelancer.full_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{proposal.freelancer.full_name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        Submitted {submittedAt}
                        {!proposal.viewed_by_client && (
                          <Badge variant="secondary" className="ml-2">
                            <Eye className="w-3 h-3 mr-1" />
                            Unread
                          </Badge>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status.color}`} />
                    <Badge variant="secondary">{status.label}</Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Budget and Timeline */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">${proposal.total_budget.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {/* ✅ FIX: Only showing the "in 7 days" style badge now */}
                    <Badge variant="outline">
                      {durationDisplay}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Cover Letter */}
                <div>
                  <h4 className="font-medium mb-2">Cover Letter</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {proposal.cover_letter}
                  </p>
                </div>

                {/* ✅ FIX: Attachments - Enhanced Visibility Logic */}
                {attachments && attachments.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Paperclip className="w-4 h-4" />
                        Attachments
                      </h4>
                      <div className="space-y-2">
                        {attachments.map((file: any, index: number) => {
                          // Defensive check: is file totally empty?
                          if (!file) return null;
                          if (typeof file === 'object' && Object.keys(file).length === 0) return null;

                          let fileUrl = '';
                          let fileName = `Attachment ${index + 1}`;
                          let fileSize: number | string | undefined = undefined;

                          // 1. Handle String (e.g., "folder/file.pdf" or full URL)
                          if (typeof file === 'string') {
                             fileName = file.split('/').pop() || fileName;
                             if (file.startsWith('http')) {
                               fileUrl = file;
                             } else {
                               const supabaseProject = process.env.NEXT_PUBLIC_SUPABASE_URL;
                               fileUrl = `${supabaseProject}/storage/v1/object/public/project-files/${file}`;
                             }
                          } 
                          // 2. Handle Object (e.g. { path: "...", name: "..." })
                          else if (typeof file === 'object') {
                             fileUrl = file.url || file.publicUrl || file.path || file.signedUrl || '';
                             fileName = file.name || file.filename || file.file_name || fileName;
                             fileSize = file.size || file.file_size || file.bytes;
                             
                             // If we have a path but no URL, construct it manually
                             if (!fileUrl && file.path) {
                               const supabaseProject = process.env.NEXT_PUBLIC_SUPABASE_URL;
                               fileUrl = `${supabaseProject}/storage/v1/object/public/project-files/${file.path}`;
                             }
                          }

                          if (!fileUrl) return null;

                          return (
                            <a
                              key={fileName + index}
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <Paperclip className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-sm truncate">{fileName}</span>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                {fileSize && (
                                  <span className="text-xs text-muted-foreground">
                                    {typeof fileSize === 'number'
                                      ? `${(fileSize / 1024).toFixed(1)} KB`
                                      : fileSize}
                                  </span>
                                )}
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* Client Feedback (if any) */}
                {proposal.client_feedback && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Your Feedback</h4>
                      <p className="text-sm text-muted-foreground">{proposal.client_feedback}</p>
                    </div>
                  </>
                )}

                {/* Actions */}
                {proposal.status !== 'accepted' && proposal.status !== 'rejected' && proposal.status !== 'withdrawn' && (
                  <>
                    <Separator />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setSelectedProposal(proposal);
                          setActionType('accept');
                        }}
                        className="flex-1"
                        disabled={acceptMutation.isPending}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Accept & Hire
                      </Button>
                      {proposal.status !== 'shortlisted' && (
                        <Button
                          variant="outline"
                          onClick={() => handleShortlist(proposal)}
                          disabled={shortlistMutation.isPending}
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Shortlist
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedProposal(proposal);
                          setActionType('reject');
                        }}
                        disabled={rejectMutation.isPending}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Accept Dialog */}
      <Dialog open={actionType === 'accept'} onOpenChange={(open) => !open && setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Proposal</DialogTitle>
            <DialogDescription>
              You're about to hire {selectedProposal?.freelancer.full_name} for this project. This will mark other proposals as rejected.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="accept-feedback">Message to Freelancer (Optional)</Label>
              <Textarea
                id="accept-feedback"
                placeholder="Welcome aboard! Looking forward to working with you..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>
              Cancel
            </Button>
            <Button onClick={handleAccept} disabled={acceptMutation.isPending}>
              {acceptMutation.isPending ? 'Processing...' : 'Confirm & Hire'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={actionType === 'reject'} onOpenChange={(open) => !open && setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Proposal</DialogTitle>
            <DialogDescription>
              Let {selectedProposal?.freelancer.full_name} know why their proposal wasn't selected (optional but recommended).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reject-feedback">Feedback (Optional)</Label>
              <Textarea
                id="reject-feedback"
                placeholder="Thank you for your proposal. We decided to go with another candidate..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={rejectMutation.isPending}>
              {rejectMutation.isPending ? 'Processing...' : 'Decline Proposal'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}