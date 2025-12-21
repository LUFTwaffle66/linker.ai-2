import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Link } from '@/i18n/routing';
import { paths } from '@/config/paths';
import { CreditCard, LifeBuoy, RefreshCw, Search, ShieldCheck, Sparkles } from 'lucide-react';

const categories = [
  {
    title: 'Payments & Fees',
    description: 'Understand how milestone funding, payouts, and fees work across your projects.',
    icon: CreditCard,
    items: ['50/50 milestone funding flow', 'Service fees and receipts', 'Payment timelines via Stripe'],
  },
  {
    title: 'Project Lifecycle',
    description: 'Keep every milestone on track—from kickoff to final approval.',
    icon: RefreshCw,
    items: ['Posting a new project', 'Managing milestones and scope', 'Requesting revisions and updates'],
  },
  {
    title: 'Safety & Disputes',
    description: 'Stay protected with clear policies and fast dispute resolution when you need it.',
    icon: ShieldCheck,
    items: ['Protected milestone release', 'Dispute resolution steps', 'Platform communication guidelines'],
  },
  {
    title: 'Expert Resources',
    description: 'Tips for experts to deliver faster, get approved, and maintain great client relationships.',
    icon: LifeBuoy,
    items: ['Winning proposals', 'Milestone delivery best practices', 'Profile and portfolio essentials'],
  },
];

const faqs = [
  {
    value: 'item-1',
    question: 'Why was 50% of my budget charged immediately?',
    answer: "This funds the project's upfront milestone, allowing the expert to begin work immediately.",
  },
  {
    value: 'item-2',
    question: 'What does the 15% service fee cover?',
    answer:
      'This fee supports our secure payment infrastructure via Stripe, expert vetting process, and dedicated dispute resolution.',
  },
  {
    value: 'item-3',
    question: 'How do I request revisions?',
    answer:
      "Use the 'Request Revisions' button in your project dashboard. Experts provide updates until the milestone meets the agreed-upon scope.",
  },
  {
    value: 'item-4',
    question: 'Is my final payment protected?',
    answer:
      'Yes. The final 50% is held by LinkerAI and only released when you explicitly approve the final delivery.',
  },
];

export default function HelpPage() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-background to-slate-900 text-foreground">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-24 top-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-14">
        <section className="space-y-8 text-center md:text-left">
          <Badge variant="outline" className="bg-white/5 border-white/10 text-white/80">
            Help Center
          </Badge>
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <h1 className="text-3xl md:text-5xl font-semibold leading-tight">How can we help?</h1>
              <p className="text-lg text-muted-foreground">
                Find guidance on milestone payments, collaboration, and safety. Search the help center or jump into a
                category to get moving fast.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-stretch">
                <div className="relative w-full sm:w-[420px]">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Search the help center"
                    className="pl-10 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Button className="w-full sm:w-auto">Search</Button>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <Link
                  href={paths.public.contact.getHref()}
                  className="px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:border-primary/40 hover:text-primary transition-colors"
                >
                  Contact Support
                </Link>
                <Link
                  href={paths.app.postProject.getHref()}
                  className="px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:border-primary/40 hover:text-primary transition-colors"
                >
                  Post a Project
                </Link>
                <Link
                  href={paths.public.howItWorks.getHref()}
                  className="px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:border-primary/40 hover:text-primary transition-colors"
                >
                  View Milestone Flow
                </Link>
              </div>
            </div>
            <Card className="md:col-span-5 bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="space-y-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Protected Milestones
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Every project follows a clear 50/50 milestone model. Upfront funding unlocks immediate work, while the
                  final milestone stays protected until you approve delivery.
                </p>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div className="rounded-lg bg-primary/10 border border-primary/20 p-4">
                  <p className="text-xs uppercase tracking-wide text-primary/80">Upfront</p>
                  <p className="text-foreground font-semibold mt-1">50% funded</p>
                  <p>Experts start fast with initial liquidity.</p>
                </div>
                <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 p-4">
                  <p className="text-xs uppercase tracking-wide text-cyan-300/80">Protected</p>
                  <p className="text-foreground font-semibold mt-1">50% held</p>
                  <p>Released only when the milestone meets scope.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-primary/15 border-primary/20 text-primary">
              Browse Topics
            </Badge>
            <p className="text-muted-foreground">Choose a category to get answers faster.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {categories.map((category) => (
              <Card key={category.title} className="bg-white/5 border-white/10 backdrop-blur-sm h-full">
                <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <category.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  {category.items.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      <span>{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-white/10 border-white/20 text-white/80">
                FAQ
              </Badge>
              <h2 className="text-2xl font-semibold">Milestone clarity, step-by-step</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Answers to the most common questions about milestone funding, approvals, and fees.
            </p>
          </div>
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="divide-y divide-white/5">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.value} value={faq.value} className="border-none px-6">
                    <AccordionTrigger className="text-left py-4 text-base font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <div className="flex justify-end">
          <div className="flex items-center gap-2 rounded-full bg-white/5 border border-dashed border-white/20 px-4 py-2 text-xs text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            AI Support Assistant: Coming Soon.
          </div>
        </div>
      </div>
    </div>
  );
}
