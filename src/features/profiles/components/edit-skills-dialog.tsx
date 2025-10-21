'use client';

import { useState } from 'react';
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
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const editSkillsSchema = z.object({
  skills: z.array(z.string()).min(1, 'Please add at least one skill'),
});

type EditSkillsFormValues = z.infer<typeof editSkillsSchema>;

interface EditSkillsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSkills: string[];
  onSave: (skills: string[]) => Promise<void>;
}

export function EditSkillsDialog({
  open,
  onOpenChange,
  currentSkills,
  onSave,
}: EditSkillsDialogProps) {
  const [newSkill, setNewSkill] = useState('');

  const form = useForm<EditSkillsFormValues>({
    resolver: zodResolver(editSkillsSchema),
    defaultValues: {
      skills: currentSkills,
    },
  });

  const skills = form.watch('skills');

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      form.setValue('skills', [...skills, trimmedSkill]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    form.setValue('skills', skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (values: EditSkillsFormValues) => {
    try {
      await onSave(values.skills);
      toast.success('Skills updated successfully!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update skills');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Skills & Expertise</DialogTitle>
          <DialogDescription>
            Add or remove skills that best represent your expertise
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-2">
              <FormLabel htmlFor="skill-input">Add Skill</FormLabel>
              <div className="flex gap-2">
                <Input
                  id="skill-input"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g., GPT-4, Python, Machine Learning"
                  maxLength={50}
                />
                <Button onClick={handleAddSkill} variant="outline" type="button">
                  Add
                </Button>
              </div>
            </div>

            <FormField
              control={form.control}
              name="skills"
              render={() => (
                <FormItem>
                  <FormLabel>Current Skills ({skills.length})</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2 min-h-[100px] p-3 border rounded-md">
                      {skills.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No skills added yet
                        </p>
                      ) : (
                        skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="gap-1">
                            {skill}
                            <button
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-1 hover:text-destructive"
                              type="button"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))
                      )}
                    </div>
                  </FormControl>
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
