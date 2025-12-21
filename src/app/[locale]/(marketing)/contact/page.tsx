'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  HeadphonesIcon,
  Send,
  LifeBuoy,
} from 'lucide-react';

import { Link } from '@/i18n/routing';
import { paths } from '@/config/paths';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  category: z.enum([
    'Technical Support',
    'Payment Question',
    'Dispute Mediation',
    'Feedback',
    'Other',
  ]),
  projectId: z
    .string()
    .trim()
    .max(100, 'Project ID is too long')
    .optional(),
  message: z.string().trim().min(10, 'Please include a few details about your request'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const defaultValues: ContactFormValues = {
  name: '',
  email: '',
  category: 'Technical Support',
  projectId: '',
  message: '',
};

const categories: ContactFormValues['category'][] = [
  'Technical Support',
  'Payment Question',
  'Dispute Mediation',
  'Feedback',
  'Other',
];

export default function ContactPage() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
  });

  const onSubmit = async (values: ContactFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    toast.success('Message sent! Our team will get back to you within 24 hours.');
    form.reset(defaultValues);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-background to-slate-900 text-foreground">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-16 top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-10 left-20 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12">
        <header className="grid gap-6 md:grid-cols-[2fr_1fr] md:items-center">
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80 ring-1 ring-white/10">
              <Sparkles className="w-4 h-4" />
              We&apos;re here to help
            </p>
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
              Contact LinkerAI support and we&apos;ll get back within 24 hours.
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Tell us what you need—technical guidance, billing questions, dispute mediation, or general feedback.
              Our team keeps AI projects moving with fast, transparent responses.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Secure support, 24/7 monitoring
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                <HeadphonesIcon className="w-4 h-4 text-primary" />
                Live humans, AI-augmented responses
              </span>
            </div>
          </div>
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="w-5 h-5 text-primary" />
                Prefer email?
              </CardTitle>
              <CardDescription className="text-foreground">
                Send us a note at{' '}
                <a href="mailto:linkerai@outlook.com" className="text-primary hover:underline">
                  linkerai@outlook.com
                </a>{' '}
                and we&apos;ll reply shortly.
              </CardDescription>
            </CardHeader>
          </Card>
        </header>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-xl shadow-primary/5">
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-primary" />
                Tell us about your request
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Provide context so we can route your inquiry to the right specialist.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inquiry Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="projectId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Project ID <span className="text-muted-foreground text-xs">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="If you have an active project" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder="Share context, timelines, and anything else that helps us assist you."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                      We respond within 24 hours and keep you updated along the way.
                    </p>
                    <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="bg-primary/10 border-primary/20 backdrop-blur-sm">
              <CardHeader className="space-y-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <HeadphonesIcon className="w-5 h-5" />
                  Quick Links
                </CardTitle>
                <CardDescription className="text-foreground">
                  Get instant answers or reach our support team directly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Link
                  href={paths.public.help.getHref()}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <LifeBuoy className="w-4 h-4" />
                    Visit Help Center
                  </span>
                  <Sparkles className="w-4 h-4 opacity-70" />
                </Link>
                <a
                  href="mailto:linkerai@outlook.com"
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    linkerai@outlook.com
                  </span>
                  <Send className="w-4 h-4 opacity-70" />
                </a>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="space-y-2">
                <CardTitle className="text-lg">What happens next?</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Our specialists triage your message, respond within 24 hours, and keep you updated until the issue is resolved.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
