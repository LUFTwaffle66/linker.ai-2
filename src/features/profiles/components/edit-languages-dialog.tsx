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
import { LANGUAGES } from '@/lib/constants';

interface EditLanguagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  languages: string[];
  onToggle: (language: string) => Promise<void>;
}

export function EditLanguagesDialog({
  open,
  onOpenChange,
  languages,
  onToggle,
}: EditLanguagesDialogProps) {
  const languageSet = useMemo(() => new Set(languages), [languages]);

  const handleRemoveLanguage = async (language: string) => {
    await onToggle(language);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Languages</DialogTitle>
          <DialogDescription>
            Add the languages you speak so clients can find the best match.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm font-medium">Available Languages</p>
            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-1">
              {LANGUAGES.map((language) => (
                <Badge
                  key={language}
                  variant={languageSet.has(language) ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => void onToggle(language)}
                >
                  {language}
                </Badge>
              ))}
            </div>
          </div>

          <div className="min-h-[120px] border rounded-md p-3 flex flex-wrap gap-2">
            {languages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No languages added yet</p>
            ) : (
              languages.map((language) => (
                <Badge key={language} variant="secondary" className="gap-1">
                  {language}
                  <button
                    type="button"
                    onClick={() => void handleRemoveLanguage(language)}
                    className="ml-1 hover:text-destructive disabled:opacity-50"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))
            )}
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
