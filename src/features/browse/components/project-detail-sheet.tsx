'use client';

import { useMemo, useState } from 'react';
import { add, differenceInCalendarDays, formatDistanceToNow } from 'date-fns';
import { Globe, DollarSign, Clock, CheckCircle, Paperclip } from 'lucide-react';
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
// 👇 Updated Import to use the rich type we defined in api/projects
import type { ProjectWithClient } from '@/features/projects/api/projects';
import type { BrowseProject } from '@/features/browse/api/browse';
import { AuthRequiredDialog } from './auth-required-dialog';
import { useAuth } from '@/features/auth/lib/auth-client';
import { useUserProposalForProject } from '@/features/proposals/api/use-user-proposal';

type SupportedProject = ProjectWithClient | BrowseProject | null;

interface ProjectDetailSheetProps {
  // 👇 Updated type here
  project: SupportedProject;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Note: Updated argument type to match
  onSubmitProposal?: (project: Exclude<SupportedProject, null>) => void;
}

export function ProjectDetailSheet({
  project,
  open,
  onOpenChange,
  onSubmitProposal,
}: ProjectDetailSheetProps) {
  const { isAuthenticated, user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // 1. Hook: Fetch Proposal (Always runs)
  const { data: existingProposal } = useUserProposalForProject(project?.id);

  // 2. Hook: Calculate Time Left (Always runs)
  const timeLeftLabel = useMemo(() => {
    if (!project) return null;

    const startDate = project.published_at ? new Date(project.published_at) : new Date(project.created_at);
    if (isNaN(startDate.getTime())) return null;

    // Use default values if duration is missing
    // Note: Assuming duration_value/unit might not be in ProjectWithClient yet, defaulting safely
    const durationValue = (project as any).duration_value ?? 30; 
    const durationUnit = (project as any).duration_unit ?? 'days';
    
    const multiplier = durationUnit === 'months' ? 30 : durationUnit === 'weeks' ? 7 : 1;
    const endDate = add(startDate, { days: durationValue * multiplier });
    const daysLeft = differenceInCalendarDays(endDate, new Date());

    if (isNaN(daysLeft)) return null;
    if (daysLeft < 0) return 'Ended';
    if (daysLeft === 0) return 'Ending today';
    return `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`;
  }, [
    project?.created_at, 
    project?.published_at, 
    // Using explicit optional chaining for safety if these fields aren't in the type yet
    (project as any)?.duration_value, 
    (project as any)?.duration_unit
  ]);

  // ✅ 3. NOW it is safe to return early
  if (!project) return null;

  // --- Logic that only runs when project exists ---

  const isOwnProject = user?.id === project.client_id;

  const handleSubmitProposal = () => {
    if (existingProposal) return;
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
  const postedAt = project.published_at ?? project.created_at;
  const postedDate = formatDistanceToNow(new Date(postedAt), { addSuffix: true });

  // 👇 Robust "Member Since" Calculation
  const clientCreatedAt =
    'created_at' in project.client ? (project.client as { created_at?: string }).created_at : undefined;
  const memberSinceDate = clientCreatedAt
    ? formatDistanceToNow(new Date(clientCreatedAt), { addSuffix: true })
    : 'Unknown';

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
                    {timeLeftLabel && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeLeftLabel}
                        </span>
                      </>
                    )}
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

                {project.attachments && 
                 project.attachments.length > 0 && 
                 // Filter out empty objects like {}
                 project.attachments.filter((f: any) => typeof f === 'string' || (typeof f === 'object' && Object.keys(f).length > 0)).length > 0 && (
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Paperclip className="w-4 h-4" />
                      Attachments
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {project.attachments.map((file: any, index: number) => {
                        // 1. Skip if file is literally just {}
                        if (typeof file === 'object' && Object.keys(file).length === 0) return null;

                        let fileUrl = '';
                        let fileName = `Attachment ${index + 1}`;

                        // Handle string format
                        if (typeof file === 'string') {
                           fileName = file.split('/').pop() || fileName;
                           if (file.startsWith('http')) {
                             fileUrl = file;
                           } else {
                             const supabaseProject = process.env.NEXT_PUBLIC_SUPABASE_URL;
                             fileUrl = `${supabaseProject}/storage/v1/object/public/project-files/${file}`;
                           }
                        } 
                        // Handle object format
                        else if (file) {
                           fileUrl = file.url || file.path || '';
                           fileName = file.name || fileName;
                        }

                        // Don't render if we still don't have a URL
                        if (!fileUrl) return null;

                        return (
                          <a
                            key={index}
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-md border bg-muted/30 hover:bg-muted transition-colors group"
                          >
                            <div className="p-2 bg-background rounded border group-hover:border-primary/50 transition-colors">
                              <Paperclip className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{fileName}</p>
                              <p className="text-xs text-muted-foreground">Click to view</p>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
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
                </div>
              </div>

              <Separator />

                {/* Activity */}
                <div>
                  <h3 className="font-medium mb-3">Activity on this project</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Proposals</span>
                      {/* 👇 This will now auto-update if you added the SQL trigger */}
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
                  variant={existingProposal ? 'outline' : 'default'}
                  size="lg"
                  onClick={handleSubmitProposal}
                  disabled={!!existingProposal}
                >
                  {existingProposal ? 'Applied ✅' : 'Submit Proposal'}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Submit a proposal to apply for this project
                </p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AuthRequiredDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        action="proposal"
      />
    </>
  );
}
