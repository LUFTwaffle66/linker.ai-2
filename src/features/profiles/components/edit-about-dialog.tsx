'use client';

import { useEffect, useRef } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const editAboutSchema = z.object({
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(2000, 'Bio must be less than 2000 characters'),
});

type EditAboutFormValues = z.infer<typeof editAboutSchema>;

interface EditAboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBio: string;
  onSave: (bio: string) => Promise<void>;
}

export function EditAboutDialog({
  open,
  onOpenChange,
  currentBio,
  onSave,
}: EditAboutDialogProps) {
  const form = useForm<EditAboutFormValues>({
    resolver: zodResolver(editAboutSchema),
    defaultValues: {
      bio: currentBio,
    },
  });
  const lastSavedBio = useRef(currentBio);

  useEffect(() => {
    form.reset({ bio: currentBio });
    lastSavedBio.current = currentBio;
  }, [currentBio, form]);

  const handleSubmit = async (values: EditAboutFormValues) => {
    try {
      await onSave(values.bio);
      toast.success('Bio updated successfully!');
      onOpenChange(false);
      lastSavedBio.current = values.bio;
    } catch (error) {
      toast.error('Failed to update bio');
    }
  };

  const handleBlur = async () => {
    const value = form.getValues('bio');
    if (value === lastSavedBio.current || form.formState.isSubmitting) return;
    await form.handleSubmit(handleSubmit)();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit About Me</DialogTitle>
          <DialogDescription>
            Tell clients about your experience, skills, and what makes you unique
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Me</FormLabel>
                  <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe your experience, expertise, and what you bring to projects..."
                    className="min-h-[200px]"
                    onBlur={handleBlur}
                  />
                  </FormControl>
                  <FormDescription>
                    {field.value.length}/2000 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
