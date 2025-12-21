import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/routing';
import { paths } from '@/config/paths';
import { ArrowUpRight, Bot, LineChart, Rocket, ShieldCheck, Workflow } from 'lucide-react';

const differentiators = [
  {
    title: 'AI-First, Always',
    description:
      'We are the AI-first, specialized marketplace built for the unique lifecycle of AI development and consulting — from prompt engineering to custom model deployment.',
    icon: Bot,
  },
  {
    title: 'Specialized Talent, Zero Guesswork',
    description:
      'Every expert is vetted for AI-specific skills so visionary companies can bridge ideas to production without sifting through generic freelance marketplaces.',
    icon: ShieldCheck,
  },
  {
    title: 'Seamless Collaboration Infrastructure',
    description:
      'Messaging, milestones, and payment rails are tuned for AI workstreams, letting teams move from scope to deployment with clarity and speed.',
    icon: Workflow,
  },
];

const impactHighlights = [
  {
    label: 'Mission',
    title: 'Democratize access to top-tier AI expertise',
    copy:
      'Startups and enterprises alike can tap into specialized AI practitioners without friction, unlocking automation, intelligence, and innovation faster.',
  },
  {
    label: 'Promise',
    title: 'The bridge to the AI revolution',
    copy:
      'We connect bold ideas with the specialists who can realize them — safely, transparently, and with milestone protection that keeps both sides aligned.',
  },
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-background to-slate-900 text-foreground">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-60 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16">
        <section className="space-y-6 text-center md:text-left">
          <Badge variant="outline" className="bg-white/5 border-white/10 text-white/80">
            The Bridge to the AI Revolution
          </Badge>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
                Connecting visionary companies with the specialized AI talent building what&apos;s next.
              </h1>
              <p className="text-lg text-muted-foreground">
                At LinkerAI, we believe the gap between a business and its AI potential shouldn&apos;t be bridged by guesswork.
                We provide the marketplace, tools, and trust layer to make AI collaboration seamless, secure, and fast.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href={paths.public.browse.getHref()}>
                    Browse Projects
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <Link href={paths.public.signup.getHref()}>
                    Join as an Expert
                    <Rocket className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <LineChart className="w-5 h-5 text-primary" />
                  AI-first collaboration, end-to-end
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  The LinkerAI platform is engineered for AI and automation delivery — from scope definition to deployment and iteration.
                  We streamline every interaction between clients and experts so teams can focus on shipping transformational work.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
                    <p className="text-xs uppercase tracking-wide text-primary/80">Built for AI</p>
                    <p className="text-foreground font-medium mt-1">Model ops, prompt ops, automation ops</p>
                  </div>
                  <div className="rounded-lg bg-cyan-500/5 border border-cyan-500/10 p-4">
                    <p className="text-xs uppercase tracking-wide text-cyan-300/80">Trust Layer</p>
                    <p className="text-foreground font-medium mt-1">Protected milestones and clear communication</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-10">
          {impactHighlights.map((item) => (
            <Card key={item.title} className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="space-y-2">
                <Badge variant="secondary" className="w-fit bg-primary/15 border-primary/20 text-primary">
                  {item.label}
                </Badge>
                <CardTitle className="text-2xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-base">
                {item.copy}
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-semibold">Why LinkerAI?</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {differentiators.map((item) => (
              <Card key={item.title} className="bg-white/5 border-white/10 backdrop-blur-sm h-full">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {item.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-cyan-500/10 border border-primary/15 rounded-2xl p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <Badge variant="outline" className="bg-white/10 border-white/20 text-white/80">
              AI-First Specialized Marketplace
            </Badge>
            <h3 className="text-2xl font-semibold">Ready to build what&apos;s next?</h3>
            <p className="text-muted-foreground max-w-2xl">
              Post your AI initiative or pitch your expertise. LinkerAI is the trusted bridge between bold ideas and the specialists who can deliver them with speed, security, and 50/50 milestone clarity.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="w-full sm:w-auto">
              <Link href={paths.app.postProject.getHref()}>
                Post a Project
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full sm:w-auto">
              <Link href={paths.public.findWork.getHref()}>
                Find Work
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
