'use client';

import { ArrowRight, ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from '@/i18n/routing';
import type { AutomationExample } from '../types';

interface ExampleDetailDialogProps {
  example: AutomationExample | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const parseSkills = (skills: AutomationExample['related_skills']) => {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills.filter(Boolean);
  return String(skills)
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);
};

export function ExampleDetailDialog({
  example,
  open,
  onOpenChange,
}: ExampleDetailDialogProps) {
  const router = useRouter();
  const relatedSkills = parseSkills(example?.related_skills ?? null);

  const handleHireClick = () => {
    if (!example) return;
    const params = new URLSearchParams();
    params.set('templateTitle', example.title);
    const description = example.full_description || example.short_summary;
    if (description) {
      params.set('templateDesc', description);
    }
    if (relatedSkills.length > 0) {
      params.set('templateSkills', relatedSkills.join(','));
    }
    const query = params.toString();
    router.push(`/client/projects/create${query ? `?${query}` : ''}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open && !!example} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl overflow-hidden">
        {example && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="aspect-video rounded-xl overflow-hidden bg-muted relative">
                {example.image_url ? (
                  <img
                    src={example.image_url}
                    alt={example.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/80">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      <span className="text-sm">Visual coming soon</span>
                    </div>
                  </div>
                )}
              </div>

              {relatedSkills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {relatedSkills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="rounded-full border-dashed"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle className="text-2xl leading-tight">{example.title}</DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                  {example.short_summary}
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="flex-1 pr-2">
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {example.full_description}
                </p>
              </ScrollArea>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1" size="lg" onClick={handleHireClick}>
                  I Want This
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  size="lg"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
