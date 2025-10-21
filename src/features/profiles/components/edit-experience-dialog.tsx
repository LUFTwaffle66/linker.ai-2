'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const editExperienceSchema = z.object({
  position: z.string().min(2, 'Position title is required'),
  company: z.string().min(2, 'Company name is required'),
  period: z.string().min(2, 'Period is required (e.g., "2020 - 2023" or "2020 - Present")'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(500, 'Description must be less than 500 characters'),
});

type EditExperienceFormValues = z.infer<typeof editExperienceSchema>;

interface Experience {
  position: string;
  company: string;
  period: string;
  description: string;
}

interface EditExperienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience?: Experience;
  onSave: (exp: Experience) => Promise<void>;
}

export function EditExperienceDialog({
  open,
  onOpenChange,
  experience,
  onSave,
}: EditExperienceDialogProps) {
  const form = useForm<EditExperienceFormValues>({
    resolver: zodResolver(editExperienceSchema),
    defaultValues: {
      position: experience?.position || '',
      company: experience?.company || '',
      period: experience?.period || '',
      description: experience?.description || '',
    },
  });

  const handleSubmit = async (values: EditExperienceFormValues) => {
    try {
      await onSave(values);
      toast.success(experience ? 'Experience updated!' : 'Experience added!');
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error('Failed to save experience');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {experience ? 'Edit Experience' : 'Add Work Experience'}
          </DialogTitle>
          <DialogDescription>
            Add details about your professional experience
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Senior AI Engineer"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Tech Company Inc."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Period</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., 2020 - Present or Jan 2020 - Dec 2023"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the time period you worked at this position
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe your responsibilities, achievements, and technologies used..."
                      className="min-h-[120px]"
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value.length}/500 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                }}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {experience ? 'Update' : 'Add'} Experience
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
