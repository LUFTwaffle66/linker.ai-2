'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Calendar, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { paths } from '@/config/paths';
import type { ProjectWithClient } from '../../api/projects';
import { formatDurationLabel } from '@/features/proposals/utils/duration';

interface ProjectCardProps {
  project: ProjectWithClient;
}

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-500', badgeClass: '' },
  open: { label: 'Open', color: 'bg-blue-500', badgeClass: '' },
  in_progress: { label: 'In Progress', color: 'bg-green-500', badgeClass: '' },
  completed: {
    label: 'Completed',
    color: 'bg-green-600',
    badgeClass: 'bg-green-100 text-green-800 border-transparent',
  },
  cancelled: { label: 'Cancelled', color: 'bg-red-500', badgeClass: '' },
} as const;

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const status = statusConfig[project.status];
  const acceptedProposal = project.proposals?.find((proposal) => proposal.status === 'accepted');
  const displayPrice = acceptedProposal?.total_budget ?? project.fixed_budget;
  const displayDuration =
    acceptedProposal?.timeline ||
    (acceptedProposal?.duration_value && acceptedProposal.duration_unit
      ? formatDurationLabel(acceptedProposal.duration_value, acceptedProposal.duration_unit)
      : project.timeline);

  // Calculate progress (for now, use a simple logic based on status)
  const getProgress = () => {
    if (project.status === 'completed') return 100;
    if (project.status === 'in_progress') return 50; // TODO: Calculate from milestones
    return 0;
  };

  const progress = getProgress();
  const fundedAmount =
    progress === 100 ? displayPrice : progress === 50 ? displayPrice * 0.5 : 0;
  const progressLabel =
    progress > 0 ? `${progress}% Paid ($${fundedAmount.toLocaleString()})` : `${progress}%`;
  const startedDate = formatDistanceToNow(new Date(project.created_at), { addSuffix: true });

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${status.color}`} />
              <Badge variant="secondary" className={status.badgeClass}>
                {status.label}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="w-5 h-5">
                <AvatarImage src={project.client.avatar_url || undefined} />
                <AvatarFallback>
                  {(project.client.company_name || project.client.full_name).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{project.client.company_name || project.client.full_name}</span>
              <span>•</span>
              <span>Started: {startedDate}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">
              ${displayPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{displayDuration}</span>
          </div>
        </div>

        {project.status === 'in_progress' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progressLabel}</span>
            </div>
            <Progress value={progress} className="h-2" />
            {/* TODO: Add next milestone info when milestones table is ready */}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {project.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {project.skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{project.skills.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          className="flex-1"
          onClick={() => router.push(paths.app.projectDetail.getHref(project.id))}
        >
          View Project
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(paths.app.messages.getHref())}
        >
          <MessageSquare className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
