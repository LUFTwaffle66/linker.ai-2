'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, DollarSign } from 'lucide-react';
import type { ProjectInfo } from '../types';
import { useRequestFinalPayment } from '../api/request-final-payment';
import { toast } from 'sonner';

interface ProjectPaymentTabProps {
  project: ProjectInfo;
}

export function ProjectPaymentTab({ project }: ProjectPaymentTabProps) {
  const requestPayment = useRequestFinalPayment();

  const handleRequestPayment = () => {
    requestPayment.mutate(project.id, {
      onSuccess: () => {
        toast.success('Final payment request sent!');
      },
      onError: () => {
        toast.error('Failed to request payment');
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Structure</CardTitle>
        <CardDescription>
          Track project payments with 50% upfront + 50% on completion model
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Payment Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
              <p className="text-2xl font-bold">${project.budget.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Received</p>
              <p className="text-2xl font-bold text-green-600">
                ${(project.upfrontPaid ? project.upfrontAmount : 0).toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-2xl font-bold text-blue-600">
                ${(!project.finalPaid ? project.finalAmount : 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Payment Stages */}
          <div className="space-y-4">
            {/* Upfront Payment */}
            <div
              className={`p-4 rounded-lg border ${
                project.upfrontPaid
                  ? 'bg-green-500/5 border-green-500/20'
                  : 'bg-muted/30 border-border'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {project.upfrontPaid ? (
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 border-2 border-muted-foreground rounded-full flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">1</span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium">Upfront Payment (50%)</h4>
                    <p className="text-sm text-muted-foreground">
                      {project.upfrontPaid
                        ? `Received on ${project.upfrontDate}`
                        : 'Paid when client hires you'}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="ml-4">
                  ${project.upfrontAmount.toLocaleString()}
                </Badge>
              </div>
            </div>

            {/* Final Payment */}
            <div
              className={`p-4 rounded-lg border ${
                project.finalPaid
                  ? 'bg-green-500/5 border-green-500/20'
                  : project.progress >= 90
                  ? 'bg-amber-500/5 border-amber-500/20'
                  : 'bg-muted/30 border-border'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {project.finalPaid ? (
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  ) : project.progress >= 90 ? (
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
                      {project.finalPaid
                        ? 'Payment received'
                        : project.progress >= 90
                        ? 'Ready for client review'
                        : 'Released upon project completion'}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="ml-4">
                  ${project.finalAmount.toLocaleString()}
                </Badge>
              </div>

              {!project.finalPaid && project.progress >= 90 && (
                <Button
                  size="sm"
                  className="w-full"
                  onClick={handleRequestPayment}
                  disabled={requestPayment.isPending}
                >
                  {requestPayment.isPending ? 'Requesting...' : 'Request Final Payment Release'}
                </Button>
              )}
            </div>
          </div>

          {/* Deliverables */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-3">Project Deliverables</h4>
            <div className="space-y-2">
              {project.deliverables.map((deliverable, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm">{deliverable}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <div className="text-sm">
                <p className="font-medium mb-1">Secure Payment Protection</p>
                <p className="text-muted-foreground">
                  All payments are held securely in escrow. The client paid 50% upfront when the
                  project started, and will release the final 50% upon successful completion and
                  validation of your work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
