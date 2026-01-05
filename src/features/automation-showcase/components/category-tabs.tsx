'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { AutomationCategory } from '../types';

const categoryDescriptions: Record<string, string> = {
  'sales-crm': 'Close deals faster and automate follow-ups.',
  'marketing-content': 'Scale your brand presence without a huge team.',
  'customer-support': '24/7 availability and instant ticket triangulation.',
  'e-commerce-logistics': 'Sync inventory, shipping, and returns automatically.',
  'hr-recruitment': 'Streamline hiring, onboarding, and payroll.',
  'finance-accounting': 'Automated invoicing, expense tracking, and cash flow.',
  'data-analytics': 'Turn messy spreadsheets into live dashboards.',
  'it-internal-ops': 'Connect your tools and automate daily admin tasks.',
};

const normalizeKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const getDescription = (category: AutomationCategory) => {
  const slugKey = categoryDescriptions[normalizeKey(category.slug)];
  if (slugKey) return slugKey;
  return categoryDescriptions[normalizeKey(category.name)] ?? undefined;
};

interface CategoryTabsProps {
  categories: AutomationCategory[];
  activeCategory: string;
  onSelect: (slug: string) => void;
  isLoading?: boolean;
}

export function CategoryTabs({
  categories,
  activeCategory,
  onSelect,
  isLoading,
}: CategoryTabsProps) {
  if (isLoading) {
    return (
      <div className="flex gap-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="h-10 w-24 rounded-full" />
        ))}
      </div>
    );
  }

  const items: (AutomationCategory & { slug: string; name: string; icon?: string | null })[] = [
    {
      id: 0,
      name: 'All',
      slug: 'all',
      icon: '✨',
    },
    ...categories,
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-2">
          {items.map((category) => {
            const description = getDescription(category);
            const content = (
              <Button
                key={category.slug}
                variant={activeCategory === category.slug ? 'default' : 'outline'}
                className={cn(
                  'rounded-full h-auto py-2 px-4 transition-all',
                  activeCategory === category.slug
                    ? 'shadow-md shadow-primary/20'
                    : 'bg-card/60 hover:border-primary/30'
                )}
                onClick={() => onSelect(category.slug)}
              >
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="rounded-full px-2 py-1 text-xs bg-primary/10 text-primary border-primary/20"
                  >
                    {category.icon || '•'}
                  </Badge>
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
              </Button>
            );

            if (!description) {
              return content;
            }

            return (
              <Tooltip key={category.slug}>
                <TooltipTrigger asChild>{content}</TooltipTrigger>
                <TooltipContent className="max-w-xs text-sm">
                  {description}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </ScrollArea>
    </TooltipProvider>
  );
}
