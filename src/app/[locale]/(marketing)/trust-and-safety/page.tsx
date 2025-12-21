import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/routing';
import { paths } from '@/config/paths';
import { CreditCard, Gavel, LifeBuoy, MessageSquareLock, ShieldCheck } from 'lucide-react';

const safetyPillars = [
  {
    title: 'Milestone Protection',
    description:
      'We replaced complex escrow with a streamlined Milestone Model. Experts get upfront capital while clients’ final payments stay protected until work meets their standards.',
    icon: ShieldCheck,
  },
  {
    title: 'Transparent 15% Service Fee',
    description:
      'Our 15% fee covers AI-expert vetting, Stripe-powered secure payments, and responsive support so collaboration stays smooth from kickoff to completion.',
    icon: CreditCard,
  },
  {
    title: 'Secure On-Platform Communication',
    description:
      'Stay inside LinkerAI for all discussions and deliveries. Keeping communication on-platform preserves protections, clear records, and faster dispute resolution.',
    icon: MessageSquareLock,
  },
];

export default function TrustAndSafetyPage() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-background to-slate-900 text-foreground">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12">
        <header className="space-y-4 text-center md:text-left">
          <Badge variant="outline" className="bg-white/5 border-white/10 text-white/80">
            Built for Peace of Mind
          </Badge>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
                Trust & Safety at the core of every LinkerAI collaboration.
              </h1>
              <p className="text-lg text-muted-foreground">
                Our milestone model, secure payments, and AI-expert vetting keep both sides protected — so projects launch faster and finish with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href={paths.app.postProject.getHref()}>Post a Project</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <Link href={paths.public.findWork.getHref()}>Find Work</Link>
                </Button>
              </div>
            </div>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="flex items-center gap-3 space-y-0">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <Badge variant="secondary" className="bg-primary/15 border-primary/20 text-primary">
                    Milestone Protection
                  </Badge>
                  <CardTitle className="text-lg mt-2">Aligned incentives, secured delivery</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  50% is released upfront to empower experts, and 50% is held as a final milestone until the work meets client standards. Both sides stay aligned on quality and timelines.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-primary/10 border border-primary/20 p-3">
                    <p className="text-xs uppercase tracking-wide text-primary/80">Upfront 50%</p>
                    <p className="text-foreground font-medium">Motivates rapid kickoff</p>
                  </div>
                  <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 p-3">
                    <p className="text-xs uppercase tracking-wide text-cyan-300/80">Protected 50%</p>
                    <p className="text-foreground font-medium">Released on approval</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {safetyPillars.map((pillar) => (
            <Card key={pillar.title} className="bg-white/5 border-white/10 backdrop-blur-sm h-full">
              <CardHeader className="flex items-center gap-3 space-y-0">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <pillar.icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg">{pillar.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{pillar.description}</CardContent>
            </Card>
          ))}
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <Card className="bg-primary/10 border-primary/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <LifeBuoy className="w-5 h-5" />
                Dispute resolution, on standby
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground space-y-3">
              <p>
                If a project hits a snag, our team mediates quickly based on the initial project scope and communication history. Your work and messages stay protected within LinkerAI.
              </p>
              <div className="rounded-lg bg-background/60 border border-white/10 p-4">
                <p className="font-semibold">What the 15% covers</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Global, encrypted transactions via Stripe</li>
                  <li>Vetted AI experts and project oversight</li>
                  <li>Fast support if expectations drift</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Gavel className="w-5 h-5 text-primary" />
                Safe, on-platform communication
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground space-y-3">
              <p className="text-foreground">
                To stay protected by our terms and guarantees, keep every message, file, and payment inside LinkerAI. This keeps records clear and ensures your milestones remain enforceable.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild variant="secondary" className="w-full sm:w-auto">
                  <Link href={paths.public.browse.getHref()}>Explore Projects</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
