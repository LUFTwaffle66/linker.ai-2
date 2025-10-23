'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useReviewDeliverable } from '../hooks/use-deliverables';
import type { Deliverable } from '../api/deliverables';

const reviewWorkSchema = z.object({
  decision: z.enum(['approve', 'request_revisions']),
  feedback: z.string().min(10, 'Feedback must be at least 10 characters').max(1000),
});

type ReviewWorkFormData = z.infer<typeof reviewWorkSchema>;

interface ReviewWorkDialogProps {
  deliverable: Deliverable;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewWorkDialog({ deliverable, open, onOpenChange }: ReviewWorkDialogProps) {
  const [decision, setDecision] = useState<'approve' | 'request_revisions'>('approve');
  const reviewDeliverableMutation = useReviewDeliverable();

  const form = useForm<ReviewWorkFormData>({
    resolver: zodResolver(reviewWorkSchema),
    defaultValues: {
      decision: 'approve',
      feedback: '',
    },
  });

  const onSubmit = async (data: ReviewWorkFormData) => {
    try {
      await reviewDeliverableMutation.mutateAsync({
        deliverableId: deliverable.id,
        status: data.decision === 'approve' ? 'approved' : 'revision_requested',
        feedback: data.feedback,
      });

      // Reset form and close dialog
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error reviewing work:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Work: {deliverable.title}</DialogTitle>
          <DialogDescription>
            Review the submitted work and either approve it or request revisions.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Deliverable Description</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {deliverable.description}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="decision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Decision</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setDecision(value as 'approve' | 'request_revisions');
                      }}
                      className="space-y-3"
                    >
                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="approve" id="approve" />
                        <Label htmlFor="approve" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="font-medium">Approve Work</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Accept the deliverable as complete and satisfactory
                          </p>
                        </Label>
                      </div>

                      <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="request_revisions" id="request_revisions" />
                        <Label htmlFor="request_revisions" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2 mb-1">
                            <XCircle className="w-4 h-4 text-orange-600" />
                            <span className="font-medium">Request Revisions</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Ask the freelancer to make changes or improvements
                          </p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {decision === 'approve' ? 'Feedback (Optional)' : 'Revision Details'}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        decision === 'approve'
                          ? 'Great work! Everything looks good...'
                          : 'Please make the following changes...'
                      }
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={reviewDeliverableMutation.isPending}
                variant={decision === 'approve' ? 'default' : 'secondary'}
              >
                {reviewDeliverableMutation.isPending
                  ? 'Submitting...'
                  : decision === 'approve'
                    ? 'Approve Work'
                    : 'Request Revisions'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
