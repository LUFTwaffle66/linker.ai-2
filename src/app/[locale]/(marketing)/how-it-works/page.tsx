import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@/i18n/routing';
import { paths } from '@/config/paths';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Coins,
  FileSearch,
  Handshake,
  ShieldCheck,
  Sparkles,
  Wallet,
} from 'lucide-react';

const clientSteps = [
  {
    title: 'Post Your Project',
    description: 'Describe your AI needs—from LLM integration to custom automation.',
    icon: FileSearch,
  },
  {
    title: 'Review Proposals',
    description: 'AI experts submit tailored bids. You choose the one that fits your vision and budget.',
    icon: ClipboardCheck,
  },
  {
    title: 'Fund the Milestone',
    description: '50% is released immediately to the expert, and 50% is secured by LinkerAI as a final milestone.',
    icon: Coins,
  },
  {
    title: 'Approve & Release',
    description: 'Once delivery meets your standards, approve to release the final 50%.',
    icon: CheckCircle2,
  },
];

const expertSteps = [
  {
    title: 'Find Opportunities',
    description: 'Browse high-value projects looking for specific AI expertise.',
    icon: Sparkles,
  },
  {
    title: 'Submit a Proposal',
    description: 'Pitch your solution, scope, and pricing with confidence.',
    icon: Handshake,
  },
  {
    title: 'Get Paid Upfront',
    description: 'Receive 50% of the project fee immediately once hired to begin work.',
    icon: Wallet,
  },
  {
    title: 'Deliver & Complete',
    description: 'Submit work securely. When the client approves, the remaining 50% (minus our 15% service fee) is released.',
    icon: ShieldCheck,
  },
];

export default function HowItWorksPage() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-background to-slate-900 text-foreground">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 left-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12">
        <header className="space-y-4 text-center md:text-left">
          <Badge variant="outline" className="bg-white/5 border-white/10 text-white/80">
            Simple, Trusted Delivery
          </Badge>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
                How LinkerAI keeps every AI project moving with 50/50 milestone clarity.
              </h1>
              <p className="text-lg text-muted-foreground">
                Whether you are hiring or building, our milestone model motivates experts with upfront capital while securing final deliverables for clients.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href={paths.app.postProject.getHref()}>
                    Post a Project
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <Link href={paths.public.findWork.getHref()}>
                    Find Work
                    <Sparkles className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="space-y-3">
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Milestone Protection
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  We&apos;ve replaced complex escrow with a streamlined milestone flow. 50% is paid upfront to kickstart delivery, and 50% stays protected until the work is approved.
                </p>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div className="rounded-lg bg-primary/10 border border-primary/20 p-4">
                  <p className="text-xs uppercase tracking-wide text-primary/80">Upfront</p>
                  <p className="text-foreground font-semibold mt-1">50% released</p>
                  <p>Experts stay motivated with immediate liquidity.</p>
                </div>
                <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 p-4">
                  <p className="text-xs uppercase tracking-wide text-cyan-300/80">Protected</p>
                  <p className="text-foreground font-semibold mt-1">50% secured</p>
                  <p>Clients release the final milestone only when satisfied.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        <Tabs defaultValue="clients" className="w-full">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="experts">Experts</TabsTrigger>
          </TabsList>
          <TabsContent value="clients" className="space-y-6 pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {clientSteps.map((step, idx) => (
                <Card key={step.title} className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader className="flex items-center gap-3 space-y-0">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <Badge variant="secondary" className="bg-primary/15 border-primary/20 text-primary">
                        Step {idx + 1}
                      </Badge>
                      <CardTitle className="text-lg mt-2">{step.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {step.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="experts" className="space-y-6 pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {expertSteps.map((step, idx) => (
                <Card key={step.title} className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader className="flex items-center gap-3 space-y-0">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-200">
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <Badge variant="secondary" className="bg-cyan-500/15 border-cyan-500/20 text-cyan-100">
                        Step {idx + 1}
                      </Badge>
                      <CardTitle className="text-lg mt-2">{step.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {step.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <section className="grid md:grid-cols-2 gap-6">
          <Card className="bg-primary/10 border-primary/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Handshake className="w-5 h-5" />
                Collaboration stays on-platform
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground space-y-3">
              <p className="text-foreground">
                Keep all communication and delivery on LinkerAI for full protection. Our secure messaging and file exchange ensure clarity and safety at each milestone.
              </p>
              <div className="rounded-lg bg-background/60 border border-white/10 p-4">
                <p className="font-semibold">Service Fee Transparency</p>
                <p className="text-muted-foreground">
                  Upon completion, the final 50% is released to the expert minus our 15% service fee — covering vetting, Stripe-powered payments, and support.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClipboardCheck className="w-5 h-5 text-primary" />
                Ready to start your build?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-4">
              <p>
                Outline your scope, set your milestone value, and let vetted AI experts pitch with clear deliverables. LinkerAI keeps both sides aligned from day one.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="w-full sm:w-auto">
                  <Link href={paths.app.postProject.getHref()}>
                    Post Your Project
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="w-full sm:w-auto">
                  <Link href={paths.public.findWork.getHref()}>
                    Browse Projects
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
