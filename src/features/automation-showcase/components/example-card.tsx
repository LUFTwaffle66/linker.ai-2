'use client';

import { ArrowRight, ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { AutomationExample } from '../types';

interface ExampleCardProps {
  example: AutomationExample;
  onSelect: (example: AutomationExample) => void;
}

export function ExampleCard({ example, onSelect }: ExampleCardProps) {
  const skills = Array.isArray(example.related_skills)
    ? example.related_skills.slice(0, 3)
    : [];

  return (
    <Card
      className="group overflow-hidden h-full border-muted/40 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer bg-card/80 backdrop-blur"
      onClick={() => onSelect(example)}
      role="button"
      tabIndex={0}
    >
      <div className="aspect-video bg-gradient-to-br from-primary/10 via-muted to-secondary/10 relative overflow-hidden">
        {example.image_url ? (
          <img
            src={example.image_url}
            alt={example.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground/80">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              <span className="text-sm">Preview coming soon</span>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-5 flex flex-col gap-3">
        <div className="space-y-2 flex-1">
          {example.category?.name && (
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {example.category.name}
            </Badge>
          )}
          <h3 className="text-lg font-semibold leading-tight">{example.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {example.short_summary}
          </p>
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="rounded-full border-dashed text-xs"
              >
                {skill}
              </Badge>
            ))}
          </div>
        )}

        <Button
          variant="ghost"
          className="justify-between px-0 text-primary hover:text-primary"
          onClick={(event) => {
            event.stopPropagation();
            onSelect(example);
          }}
        >
          <span className="font-medium">Learn More</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
