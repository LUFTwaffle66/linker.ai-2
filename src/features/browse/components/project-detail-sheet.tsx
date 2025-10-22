'use client';

import { useState } from 'react';
import { useAuth } from '@/features/auth/lib/auth-client';import { formatDistanceToNow } from 'date-fns';
import {
  Globe, DollarSign, Clock, User, FileText, CheckCircle, Star, MapPin
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { BrowseProject } from '../types';
import { AuthRequiredDialog } from './auth-required-dialog';

interface ProjectDetailSheetProps {
  project: BrowseProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitProposal?: (project: BrowseProject) => void;
}

export function ProjectDetailSheet({
  project,
  open,
  onOpenChange,
  onSubmitProposal,
}: ProjectDetailSheetProps) {
  const { isAuthenticated, user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  if (!project) return null;

  // Check if current user is the project owner
  const isOwnProject = user?.id === project.client_id;

  const handleSubmitProposal = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }
    onSubmitProposal?.(project);
    onOpenChange(false);
  };

  // Format budget
  const formattedBudget = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(project.fixed_budget);

  // Format posted date
  const postedDate = formatDistanceToNow(new Date(project.created_at), { addSuffix: true });

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <SheetTitle className="text-2xl mb-2">{project.title}</SheetTitle>
                <SheetDescription className="flex items-center gap-2 text-sm">
                  <span>Posted {postedDate}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    Worldwide
                  </span>
                </SheetDescription>
              </div>
              <Badge variant="secondary" className="flex-shrink-0">
                {project.category}
              </Badge>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 px-6 py-6">
            <div className="space-y-6">
              {/* Summary */}
              <div>
                <h3 className="font-medium mb-3">Project Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              <Separator />

              {/* Project Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Budget</span>
                  </div>
                  <p className="text-lg font-medium text-primary">{formattedBudget}</p>
                  <p className="text-xs text-muted-foreground mt-1">Fixed price</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Duration</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{project.timeline}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Experience Level</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Intermediate</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Project Type</span>
                  </div>
                  <p className="text-sm text-muted-foreground">One-time project</p>
                </div>
              </div>

              <Separator />

              {/* Skills and Expertise */}
              <div>
                <h3 className="font-medium mb-3">Required Skills & Technologies</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Core skills</p>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} className="bg-primary/10 text-primary border-primary/20">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {project.skills.length > 3 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Additional skills</p>
                      <div className="flex flex-wrap gap-2">
                        {project.skills.slice(3).map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* About the client */}
              <div>
                <h3 className="font-medium mb-3">About the client</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {project.client.full_name?.substring(0, 2).toUpperCase() ?? ''}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{project.client.full_name ?? ''}</p>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-sm text-muted-foreground">{project.client.company_name ?? ''}</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground mb-1">Member since</p>
                    <p>{formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Activity */}
              <div>
                <h3 className="font-medium mb-3">Activity on this project</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Proposals</span>
                    <span className="font-medium">{project.proposal_count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Posted</span>
                    <span className="font-medium">{postedDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="outline" className="text-green-500 border-green-500/20">
                      {(project?.status === 'open') ? 'Active' : 'Draft'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          {!isOwnProject && (
            <div className="px-6 py-4 border-t bg-background">
              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmitProposal}
              >
                Submit Proposal
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Submit a proposal to apply for this project
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>

      {/* Auth Required Dialog */}
      <AuthRequiredDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        action="proposal"
      />
    </>
  );
}
