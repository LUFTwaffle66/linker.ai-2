'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Download, File } from 'lucide-react';
import { useProjectFiles } from '../api/get-project-files';
import type { ProjectInfo } from '../types';

interface ProjectSidebarProps {
  project: ProjectInfo;
}

export function ProjectSidebar({ project }: ProjectSidebarProps) {
  const { data: files } = useProjectFiles(project.id);

  // Calculate budget based on payment status
  const budgetReceived = project.upfrontPaid ? project.upfrontAmount : 0;
  const budgetPending = project.finalPaid ? 0 : project.finalAmount;

  // Calculate days remaining from deadline
  const calculateDaysRemaining = () => {
    const deadline = new Date(project.deadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = calculateDaysRemaining();

  // Calculate payment completion percentage
  const paymentProgress = project.upfrontPaid && project.finalPaid ? 100 : project.upfrontPaid ? 50 : 0;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Payment Received</span>
              <span className="font-medium">{paymentProgress}%</span>
            </div>
            <Progress value={paymentProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {project.upfrontPaid && !project.finalPaid && 'Upfront payment received'}
              {project.upfrontPaid && project.finalPaid && 'All payments completed'}
              {!project.upfrontPaid && 'Awaiting upfront payment'}
            </p>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Budget Received</span>
              <span className="font-medium text-green-600">${budgetReceived.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Budget Pending</span>
              <span className="font-medium text-blue-600">${budgetPending.toLocaleString()}</span>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Days Remaining</span>
            <span className="font-medium">{daysRemaining} days</span>
          </div>
        </CardContent>
      </Card>

      {/* Project Files */}
      <Card>
        <CardHeader>
          <CardTitle>Project Files</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {files?.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="w-8 h-8 bg-muted rounded flex items-center justify-center flex-shrink-0">
                    <File className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>{file.date}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="flex-shrink-0">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
