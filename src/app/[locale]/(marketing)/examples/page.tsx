'use client';

import type { ComponentType } from 'react';
import { useMemo, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useAutomationCategories, useAutomationExamples } from '@/features/automation-showcase/api/automation-showcase';
import type { AutomationCategory, AutomationExample } from '@/features/automation-showcase/types';
import { ArrowRight, BarChart3, Database, Headset, LifeBuoy, Settings, ShoppingCart, Users, Wallet } from 'lucide-react';
import { useRouter } from '@/i18n/routing';

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  'life-buoy': LifeBuoy,
  'bar-chart': BarChart3,
  'headset': Headset,
  'shopping-cart': ShoppingCart,
  'users': Users,
  'wallet': Wallet,
  'database': Database,
  'settings': Settings,
};

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
  return categoryDescriptions[normalizeKey(category.name)] ?? 'Ready-made automations tailored for this industry.';
};

const parseSkills = (skills: AutomationExample['related_skills']) => {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills.filter(Boolean);
  return String(skills)
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);
};

export default function AutomationShowcasePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<AutomationCategory | null>(null);

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesErrorData,
  } = useAutomationCategories();

  const {
    data: examples = [],
    isLoading: examplesLoading,
    isError: examplesError,
    error: examplesErrorData,
  } = useAutomationExamples(selectedCategory?.slug, { enabled: !!selectedCategory });

  const iconForCategory = (icon?: string | null) => {
    if (!icon) return LifeBuoy;
    return iconMap[icon] || LifeBuoy;
  };

  const handleWantThis = (example: AutomationExample) => {
    // Map automation example titles to the new project template slugs
    const templateSlugMap: Record<string, string> = {
      '24/7 FAQ Auto-Responder': 'faq-responder',
      'AI Support Triage & Routing': 'support-triage',
      'Executive KPI Command Center': 'kpi-dashboard',
      'Ad Spend & ROI Consolidator': 'ad-spend-consolidator',
      'Content Repurposing Engine': 'content-repurposing',
      'Lead Magnet Delivery System': 'lead-magnet-delivery',
      'Instant Employee Onboarding': 'employee-onboarding',
      'Meeting to Action Items': 'meeting-action-items',
      'Daily Standup Reporter': 'daily-standup-reporter',
      'Instant Contract Generator': 'instant-contract-generator',
      'Auto-Invoice Chaser': 'auto-invoice-chaser',
      'Receipt to Expense Scanner': 'receipt-scanner',
      'LinkedIn Lead Miner': 'linkedin-lead-miner',
      'AI Resume Screener': 'resume-screener',
      'Smart Return & Refund Processor': 'smart-return-processor',
      'Multi-Channel Inventory Sync': 'inventory-sync',
    };

    const templateSlug = templateSlugMap[example.title];

    const href = templateSlug ? `/post-project?template=${templateSlug}` : '/post-project';

    router.push(href);
    setSelectedCategory(null);
  };

  const examplesForCategory = useMemo(() => {
    if (!selectedCategory) return [];
    return (examples || []).filter(
      (example) => example.category?.slug === selectedCategory.slug || example.category_id === selectedCategory.id
    );
  }, [examples, selectedCategory]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-background to-background text-foreground">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-24 top-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
        <header className="space-y-4">
          <Badge
            variant="outline"
            className="bg-white/10 border-white/20 text-white/80 w-fit"
          >
            <div className="flex items-center gap-2">Automation Showcase</div>
          </Badge>
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-semibold">
              Get AI without technical jargon.
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Let us do the work. Choose a category below, and we&apos;ll handle the rest.
            </p>
          </div>
        </header>

        {(categoriesError || examplesError) && (
          <Alert variant="destructive">
            <AlertDescription>
              {(
                (categoriesErrorData as Error | undefined)?.message ||
                (examplesErrorData as Error | undefined)?.message ||
                'Failed to load automation examples.'
              )}
            </AlertDescription>
          </Alert>
        )}

        <section className="space-y-4">
          {categoriesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, idx) => (
                <Skeleton key={idx} className="h-48 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => {
                const Icon = iconForCategory(category.icon);
                const description = getDescription(category);
                return (
                  <button
                    key={category.id}
                    className="group text-left rounded-2xl border border-border/60 bg-card/70 backdrop-blur shadow-sm hover:shadow-lg hover:border-primary/50 transition-all p-5 flex flex-col gap-4"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <span>Browse workflows</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <Dialog open={!!selectedCategory} onOpenChange={(open) => !open && setSelectedCategory(null)}>
        <DialogContent className="sm:max-w-3xl">
          {selectedCategory && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedCategory.name}</DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                  {getDescription(selectedCategory)}
                </DialogDescription>
              </DialogHeader>

              {examplesLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-20 w-full rounded-lg" />
                  ))}
                </div>
              ) : examplesForCategory.length > 0 ? (
                <div className="space-y-4">
                  {examplesForCategory.map((example) => (
                    <div
                      key={example.id}
                      className="border rounded-xl p-4 bg-muted/40 hover:bg-muted/60 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <h4 className="text-base font-semibold">{example.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {example.short_summary}
                          </p>
                        </div>
                        <Button size="sm" onClick={() => handleWantThis(example)}>
                          I Want This
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                  Workflows for this category are coming soon. Tell us what you need and we&apos;ll craft it.
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="mt-12 text-center text-muted-foreground px-4 text-lg leading-relaxed">
        Looking for something else? You can{' '}
        <a
          href="/post-project"
          className="text-primary font-semibold underline underline-offset-4"
        >
          create a custom project
        </a>{' '}
        or{' '}
        <a
          href="/contact"
          className="text-primary font-semibold underline underline-offset-4"
        >
          get in touch
        </a>
        , and we&apos;ll help define your needs.
      </div>
    </div>
  );
}
