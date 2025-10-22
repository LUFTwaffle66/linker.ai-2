'use client';

import { DollarSign, Clock, Calendar, Star, CheckCircle, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import type { BrowseProject } from '../types';

interface ProjectCardProps {
  project: BrowseProject;
  onClick?: (project: BrowseProject) => void;
  className?: string;
}

export function ProjectCard({ project, onClick, className }: ProjectCardProps) {

  // Format budget
  const formattedBudget = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(project.fixed_budget);

  // Format posted date
  const postedDate = formatDistanceToNow(new Date(project.created_at), { addSuffix: true });

  // Format timeline
  const formattedTimeline = project.timeline
    .replace('-', ' to ')
    .replace('less-than-', '< ')
    .replace('more-than-', '> ');

  return (
    <Card
      className={cn(
        'hover:shadow-md transition-shadow cursor-pointer',
        project.is_featured && 'border-primary/50',
        className
      )}
      onClick={() => onClick?.(project)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-medium text-lg">{project.title}</h3>
            {project.is_featured && (
              <Badge className="mt-1 bg-primary/10 text-primary border-primary/20 text-xs">
                Featured
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
          <Badge variant="outline">{project.category}</Badge>
          <span className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            {formattedBudget}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formattedTimeline}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {postedDate}
          </span>
        </div>

        <p className="text-muted-foreground mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.skills.slice(0, 6).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {project.skills.length > 6 && (
            <Badge variant="outline" className="text-xs">
              +{project.skills.length - 6}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                {project.client.avatar_url ? (
                  <img src={project.client.avatar_url} alt={project.client.full_name} />
                ) : (
                  <AvatarFallback className="text-xs">
                    {project.client.full_name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="text-sm font-medium">
                {project.client.company_name || project.client.full_name}
              </span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
          </div>

          <span className="text-sm text-muted-foreground">
            {project.proposal_count} {project.proposal_count === 1 ? 'proposal' : 'proposals'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
