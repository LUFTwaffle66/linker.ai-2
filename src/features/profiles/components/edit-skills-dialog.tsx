'use client';

import { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { SKILLS } from '@/lib/constants';

interface EditSkillsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSkills: string[];
  onToggle: (skill: string) => Promise<void>;
}

const MAX_SKILLS = 15;

export function EditSkillsDialog({
  open,
  onOpenChange,
  selectedSkills,
  onToggle,
}: EditSkillsDialogProps) {
  const selectedSet = useMemo(() => new Set(selectedSkills), [selectedSkills]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Edit Skills & Expertise</DialogTitle>
          <DialogDescription>
            Use the standard skills list to keep your profile consistent across the app.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm font-medium">Your Skills</p>
            <div className="flex flex-wrap gap-2 min-h-[80px] p-3 border rounded-md">
              {selectedSkills.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No skills added yet
                </p>
              ) : (
                selectedSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1">
                    {skill}
                    <button
                      onClick={() => void onToggle(skill)}
                      className="ml-1 hover:text-destructive disabled:opacity-50"
                      type="button"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Available Skills</p>
            <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto p-1">
              {SKILLS.map((skill) => (
                <Badge
                  key={skill}
                  variant={selectedSet.has(skill) ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => void onToggle(skill)}
                >
                  {selectedSet.has(skill) && (
                    <X className="w-3 h-3 mr-1" />
                  )}
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
