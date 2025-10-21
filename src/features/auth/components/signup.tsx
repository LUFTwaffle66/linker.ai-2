'use client';

import { useState } from 'react';
import { useRouter, Link } from '@/i18n/routing';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { Bot, Briefcase, CheckCircle, User, Mail, Lock, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useSignup, type SignupDTO } from '../api/signup';
import { type UserType } from '../types';
import { signupSchema, clientSignupSchema, type SignupFormData, type ClientSignupFormData } from '../lib/validations';
import { toast } from 'sonner';
import { paths } from '@/config/paths';

interface SignupProps {
  onNavigate?: (screen: string) => void;
  onSignup?: (userType: UserType) => void;
}

export function Signup({ onNavigate, onSignup }: SignupProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<UserType>('freelancer');

  // Use appropriate schema based on user type
  const form = useForm<SignupFormData | ClientSignupFormData>({
    resolver: zodResolver(activeTab === 'client' ? clientSignupSchema : signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      agreedToTerms: false,
    },
  });

  const signupMutation = useSignup({
    onSuccess: async (data: any, variables: SignupDTO) => {
      toast.success('Account created successfully!');
      console.log('Signup successful:', data);
      onSignup?.(activeTab);

      // Automatically sign in the user after successful signup
      const signInResult = await signIn('credentials', {
        email: variables.email,
        password: variables.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.error('Account created but login failed. Please login manually.');
        router.push(paths.auth.login.getHref());
        return;
      }

      // Redirect to appropriate onboarding screen
      if (activeTab === 'client') {
        router.push(paths.auth.onboardingClient.getHref());
      } else {
        router.push(paths.auth.onboardingFreelancer.getHref());
      }
    },
    onError: (error) => {
      toast.error('Failed to create account. Please try again.');
      console.error('Signup failed:', error);
    },
  });

  const onSubmit = (data: SignupFormData | ClientSignupFormData) => {
    signupMutation.mutate({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: activeTab,
      companyName: activeTab === 'client' ? (data as ClientSignupFormData).companyName : undefined,
    });
  };

  const handleLoginClick = () => {
    if (onNavigate) {
      onNavigate('login');
    } else {
      router.push(paths.auth.login.getHref());
    }
  };

  const freelancerBenefits = [
    'Connect with global clients seeking AI expertise',
    'Set your own rates and work schedule',
    'Secure payments with escrow protection',
    'Build your portfolio and reputation',
    'Access to exclusive AI automation projects'
  ];

  const clientBenefits = [
    'Access to vetted AI automation experts',
    'Post unlimited projects for free',
    'Secure 50/50 payment with escrow protection',
    'Real-time collaboration tools',
    'Dedicated project management support'
  ];

  // Reset form when switching tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value as UserType);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-cyan-500/5 flex items-center justify-center px-4 py-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <span className="text-white text-2xl font-bold">L</span>
          </div>
          <h1 className="text-3xl mb-2">Join LinkerAI</h1>
          <p className="text-muted-foreground">Start your AI automation journey today</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Benefits Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {activeTab === 'freelancer' ? (
                    <>
                      <Bot className="w-5 h-5 text-primary" />
                      <span>AI Expert Benefits</span>
                    </>
                  ) : (
                    <>
                      <Briefcase className="w-5 h-5 text-primary" />
                      <span>Client Benefits</span>
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(activeTab === 'freelancer' ? freelancerBenefits : clientBenefits).map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{benefit}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary mb-2">10,000+</p>
                  <p className="text-sm text-muted-foreground">
                    {activeTab === 'freelancer'
                      ? 'Active AI automation experts'
                      : 'Projects posted monthly'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Signup Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="freelancer" className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      <span>AI Expert</span>
                    </TabsTrigger>
                    <TabsTrigger value="client" className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>Client</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>

              <CardContent className="space-y-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {activeTab === 'freelancer' ? 'Full Name' : 'Contact Name'} *
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                  type="text"
                                  placeholder="John Doe"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {activeTab === 'client' && (
                        <FormField
                          control={form.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                  <Input
                                    type="text"
                                    placeholder="Your Company Inc."
                                    className="pl-10"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                              <Input
                                type="email"
                                placeholder="your.email@example.com"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                  type="password"
                                  placeholder="Min. 8 characters"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                  type="password"
                                  placeholder="Re-enter password"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="agreedToTerms"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-start gap-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-1"
                              />
                            </FormControl>
                            <div className="flex-1">
                              <FormLabel className="text-sm leading-relaxed font-normal cursor-pointer flex-wrap">
                                I agree to the{' '}
                                <Link href={paths.public.terms.getHref()} className="text-primary hover:underline">
                                  Terms of Service
                                </Link>
                                {' '}and{' '}
                                <Link href={paths.public.privacy.getHref()} className="text-primary hover:underline">
                                  Privacy Policy
                                </Link>
                                . I understand that LinkerAI is not meant for collecting PII or securing sensitive data.
                              </FormLabel>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={signupMutation.isPending}
                    >
                      {signupMutation.isPending ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </Form>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Already have an account? </span>
                  <button
                    type="button"
                    onClick={handleLoginClick}
                    className="text-primary hover:underline font-medium"
                  >
                    Log in
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
