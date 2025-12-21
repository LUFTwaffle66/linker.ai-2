'use client';

import { differenceInDays, startOfDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Paperclip, Download } from 'lucide-react';
import type { ProjectInfo } from '../types';

interface ProjectSidebarProps {
  project: ProjectInfo;
}

export function ProjectSidebar({ project }: ProjectSidebarProps) {
  // Calculate budget based on payment status
  const budgetReceived = project.upfrontPaid ? project.upfrontAmount : 0;
  const budgetPending = project.finalPaid ? 0 : project.finalAmount;

  // Calculate days remaining from deadline
  const calculateDaysRemaining = () => {
    const deadlineDate = project.deadline ? startOfDay(new Date(project.deadline)) : null;
    const today = startOfDay(new Date());
    if (!deadlineDate) return 0;

    const diffDays = differenceInDays(deadlineDate, today);
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

      {/* Project Attachments */}
      {(project.attachments?.length ?? 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Paperclip className="w-4 h-4" />
              Project Files
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {project.attachments?.map((file: any, index: number) => {
              const fileName =
                file?.name || file?.file_name || file?.filename || file?.title || `File ${index + 1}`;
              const fileUrl = file?.url || file?.publicUrl || file?.path || file?.signedUrl;
              const fileSize = file?.size || file?.file_size || file?.bytes;

              return (
                <a
                  key={fileName + index}
                  href={fileUrl || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Paperclip className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm truncate">{fileName}</p>
                      {fileSize && (
                        <p className="text-xs text-muted-foreground">
                          {typeof fileSize === 'number'
                            ? `${(fileSize / 1024).toFixed(1)} KB`
                            : fileSize}
                        </p>
                      )}
                    </div>
                  </div>
                  {fileUrl && <Download className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                </a>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
