'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { User, DollarSign, Calendar } from 'lucide-react';
import type { ProjectInfo } from '../types';

interface ProjectHeaderProps {
  project: ProjectInfo;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  // Calculate payment progress (50% per payment stage)
  const paymentProgress = project.upfrontPaid && project.finalPaid ? 100 : project.upfrontPaid ? 50 : 0;

  // Status text based on payment
  const getProgressStatus = () => {
    if (project.upfrontPaid && project.finalPaid) return 'Both payments completed';
    if (project.upfrontPaid) return 'Upfront payment received';
    return 'Awaiting upfront payment';
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{project.title}</h1>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                    Active
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Client:</span>
                    <span>{project.client}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Freelancer:</span>
                    <span>{project.freelancer}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>${project.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Payment Progress</span>
                <span className="font-medium">{paymentProgress}% Complete</span>
              </div>
              <Progress value={paymentProgress} className="h-2" />
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span>{getProgressStatus()}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Started: {project.startDate}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Deadline: {project.deadline}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center">
              <Avatar className="w-12 h-12 mb-1">
                <AvatarFallback>{project.clientAvatar}</AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground">Client</p>
            </div>
            <div className="text-center">
              <Avatar className="w-12 h-12 mb-1">
                <AvatarFallback>{project.freelancerAvatar}</AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground">Freelancer</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
