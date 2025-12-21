'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/features/auth/lib/auth-client';
import { useCheckOnboardingStatus } from '@/features/auth/hooks/use-email-verification';
import { paths } from '@/config/paths';

type Audience = 'company' | 'expert';

function CTAButtons() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { data: onboardingStatus } = useCheckOnboardingStatus(user?.id);

  const handleCtaClick = (audience: Audience) => {
    if (isAuthenticated) {
      const onboardingIncomplete = onboardingStatus && !onboardingStatus.hasCompletedOnboarding;
      const isClient = user?.role === 'client';
      const onboardingTarget = isClient
        ? paths.auth.onboardingClient.getHref()
        : paths.auth.onboardingFreelancer.getHref();

      if (onboardingIncomplete) {
        router.push(onboardingTarget);
        return;
      }

      router.push(paths.app.dashboard.getHref());
      return;
    }

    const destination = audience === 'company' ? '/signup?role=company' : '/signup?role=expert';
    router.push(destination);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button size="lg" onClick={() => handleCtaClick('company')}>
        I Need AI Experts
      </Button>
      <Button size="lg" variant="outline" onClick={() => handleCtaClick('expert')}>
        I Am an AI Expert
      </Button>
    </div>
  );
}

export function MarketingLandingPage() {
  return (
    <div className="bg-background">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_45%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-xl space-y-6">
            <Badge variant="outline" className="border-white/20 text-white bg-white/5">
              AI marketplace for real outcomes
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
              Bridge the AI Gap. Scale Your Revenue.
            </h1>
            <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
              We connect companies ready to evolve with elite AI experts ready to build.
              Whether you are looking to implement cutting-edge tech or looking for your next high-ticket client, we make the connection seamless.
            </p>
            <CTAButtons />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-white/70">Vetted experts</div>
                <div className="mt-2 text-base font-semibold">Specialists matched to your use case.</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-white/70">Outcome-first scoping</div>
                <div className="mt-2 text-base font-semibold">Projects framed around measurable ROI.</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-white/70">Payment confidence</div>
                <div className="mt-2 text-base font-semibold">Structured milestones to protect both sides.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <p className="text-sm font-semibold text-primary uppercase tracking-[0.14em]">
              For Companies
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Stop Guessing, Start Growing.</h2>
            <p className="mt-3 text-muted-foreground">
              Don't get left behind. We match you with vetted specialists who turn complex AI into measurable ROI.
            </p>
            <div className="mt-5 flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <div>
                <p className="font-semibold">The Result: Faster implementation and increased profit margins.</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <p className="text-sm font-semibold text-primary uppercase tracking-[0.14em]">
              For AI Experts
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Code More, Hunt Less.</h2>
            <p className="mt-3 text-muted-foreground">
              Skip the cold emails. Get matched with high-budget companies that already understand the value of your work.
            </p>
            <div className="mt-5 flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <div>
                <p className="font-semibold">The Result: Higher earnings with less administrative overhead.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary uppercase tracking-[0.14em]">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-semibold">Direct, decisive delivery.</h2>
            <p className="mt-3 text-muted-foreground">
              Simple milestones that keep teams aligned on value and velocity.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  1
                </span>
                <div>
                  <h3 className="text-xl font-semibold">Implement</h3>
                  <p className="text-muted-foreground">
                    Experts integrate AI solutions directly into existing workflows.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  2
                </span>
                <div>
                  <h3 className="text-xl font-semibold">Optimize</h3>
                  <p className="text-muted-foreground">
                    Efficiency increases, revenue compounds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <p className="text-sm font-semibold text-primary uppercase tracking-[0.14em]">
              Why this platform
            </p>
            <h2 className="mt-3 text-3xl font-semibold">Serious work, serious outcomes.</h2>
            <p className="mt-3 text-muted-foreground">
              Built for teams that demand clear ROI and experts that deliver it.
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div>
                  <h3 className="text-lg font-semibold">ROI-Focused</h3>
                  <p className="text-muted-foreground">
                    We don't build \"cool tech.\" We build tools that move the bottom line.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Secure &amp; Fast</h3>
                  <p className="text-muted-foreground">
                    Projects start in days, not months.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-primary/40 text-primary bg-primary/10">
                Built for B2B
              </Badge>
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
            <h3 className="mt-4 text-2xl font-semibold">Protecting momentum on both sides.</h3>
            <p className="mt-3 text-muted-foreground">
              Clear scopes, milestone clarity, and vetted talent keep initiatives moving without costly restarts.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-primary/20 bg-white/40 p-4 dark:bg-background">
                <p className="text-sm font-semibold text-primary">For leadership</p>
                <p className="mt-1 text-muted-foreground">
                  Visibility into progress and impact without drowning in details.
                </p>
              </div>
              <div className="rounded-xl border border-primary/20 bg-white/40 p-4 dark:bg-background">
                <p className="text-sm font-semibold text-primary">For experts</p>
                <p className="mt-1 text-muted-foreground">
                  Clear briefs, rapid approvals, and predictable payments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-semibold">Start building real AI impact today.</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Match with teams and specialists who treat AI as a revenue engine, not a side project.
            </p>
            <div className="justify-center flex">
              <CTAButtons />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
