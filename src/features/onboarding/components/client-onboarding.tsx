'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
  Sparkles, User, Building2, Target, DollarSign, Upload, Globe, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { MultiStepForm, type Step } from '@/components/ui/multi-step-form';
import { toast } from 'sonner';
import { paths } from '@/config/paths';
import {
  clientOnboardingSchema,
  type ClientOnboardingData,
} from '../lib/validations';
import { saveClientOnboarding } from '../api/onboarding';

interface ClientOnboardingProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

const steps: Step[] = [
  { num: 1, label: 'Profile', icon: User },
  { num: 2, label: 'Company', icon: Building2 },
  { num: 3, label: 'Goals', icon: Target },
  { num: 4, label: 'Budget', icon: DollarSign },
];

const aiProjectGoals = [
  'Build AI Chatbot',
  'Automate Workflows',
  'Data Analysis & Insights',
  'Machine Learning Models',
  'Process Automation',
  'API Integration',
  'Computer Vision',
  'Natural Language Processing',
  'Predictive Analytics',
  'Custom AI Solutions'
];

const industries = [
  'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education',
  'Manufacturing', 'Retail', 'Real Estate', 'Marketing', 'Other'
];

const companySizes = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '500+ employees'
];

export function ClientOnboarding({ onComplete, onSkip }: ClientOnboardingProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const form = useForm<ClientOnboardingData>({
    resolver: zodResolver(clientOnboardingSchema),
    defaultValues: {
      profileImage: '',
      fullName: '',
      location: '',
      companyName: '',
      website: '',
      industry: '',
      companySize: '',
      aboutCompany: '',
      projectGoals: [],
      projectDescription: '',
      budgetRange: undefined,
      timeline: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: saveClientOnboarding,
    onSuccess: () => {
      toast.success('Profile created successfully! Welcome to LinkerAI');
      if (onComplete) {
        onComplete();
      } else {
        router.push(paths.app.dashboard.getHref());
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save profile. Please try again.');
    },
  });

  const projectGoals = form.watch('projectGoals') || [];

  const toggleProjectGoal = (goal: string) => {
    const currentGoals = form.getValues('projectGoals') || [];
    if (currentGoals.includes(goal)) {
      form.setValue('projectGoals', currentGoals.filter(g => g !== goal));
    } else {
      if (currentGoals.length < 5) {
        form.setValue('projectGoals', [...currentGoals, goal]);
      } else {
        toast.error('You can select up to 5 project goals');
      }
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof ClientOnboardingData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ['fullName', 'location'];
        break;
      case 2:
        fieldsToValidate = ['companyName', 'industry', 'companySize', 'aboutCompany'];
        break;
      case 3:
        fieldsToValidate = ['projectGoals'];
        break;
      case 4:
        fieldsToValidate = ['budgetRange', 'timeline'];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleComplete = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      router.push(paths.app.dashboard.getHref());
    }
  };

  return (
    <MultiStepForm
      currentStep={currentStep}
      totalSteps={totalSteps}
      steps={steps}
      title="Welcome to LinkerAI"
      subtitle="Let's set up your client profile and find the perfect AI experts"
      onNext={handleNext}
      onBack={handleBack}
      onSkip={handleSkip}
      onComplete={handleComplete}
    >
      <Form {...form}>
        {/* Step 1: Basic Profile */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2">Create Your Profile</h2>
              <p className="text-muted-foreground">
                Tell us about yourself and your organization
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={form.watch('profileImage')} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User className="w-10 h-10" />
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="w-4 h-4" />
                Upload Photo
              </Button>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="City, Country" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {/* Step 2: Company Info */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2">Company Information</h2>
              <p className="text-muted-foreground">
                Help AI experts understand your organization
              </p>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Enter your company name" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Website</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="https://yourcompany.com" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">Select industry</option>
                          {industries.map(ind => (
                            <option key={ind} value={ind}>{ind}</option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companySize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Size</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                          <select
                            {...field}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <option value="">Select size</option>
                            {companySizes.map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="aboutCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Your Company</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your company, mission, and what you do..."
                        rows={5}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 Providing company information helps AI experts understand your needs and submit more relevant proposals.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Project Goals */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2">What Are Your AI Goals?</h2>
              <p className="text-muted-foreground">
                Select up to 5 types of AI projects you're interested in
              </p>
            </div>

            <FormField
              control={form.control}
              name="projectGoals"
              render={() => (
                <FormItem>
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <p className="text-sm font-medium mb-2">
                      {projectGoals.length} of 5 goals selected
                    </p>
                    {projectGoals.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {projectGoals.map(goal => (
                          <Badge
                            key={goal}
                            variant="default"
                            className="cursor-pointer"
                            onClick={() => toggleProjectGoal(goal)}
                          >
                            {goal} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aiProjectGoals.map(goal => (
                <div
                  key={goal}
                  onClick={() => toggleProjectGoal(goal)}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${projectGoals.includes(goal)
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-primary/50 bg-card'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{goal}</span>
                    {projectGoals.includes(goal) && (
                      <Sparkles className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <FormField
              control={form.control}
              name="projectDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tell Us More (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your AI automation needs, challenges you're facing, or specific requirements..."
                      rows={4}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-4 rounded-lg border border-primary/20">
              <h4 className="mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Popular AI Solutions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>• Custom chatbots with GPT-4</div>
                <div>• Business process automation</div>
                <div>• Predictive analytics models</div>
                <div>• Document processing with AI</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Budget & Timeline */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2">Budget & Timeline</h2>
              <p className="text-muted-foreground">
                Help AI experts understand your project scope
              </p>
            </div>

            <FormField
              control={form.control}
              name="budgetRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Budget Range</FormLabel>
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          { value: 'small', label: 'Small Project', range: '$500 - $2,000', desc: 'Quick automations or simple AI integrations' },
                          { value: 'medium', label: 'Medium Project', range: '$2,000 - $10,000', desc: 'Custom chatbots or workflow automation' },
                          { value: 'large', label: 'Large Project', range: '$10,000 - $50,000', desc: 'Complex ML models or enterprise solutions' },
                          { value: 'enterprise', label: 'Enterprise Project', range: '$50,000+', desc: 'Large-scale AI transformation projects' }
                        ].map((option) => (
                          <div
                            key={option.value}
                            className={`
                              p-4 rounded-lg border-2 cursor-pointer transition-all
                              ${field.value === option.value
                                ? 'border-primary bg-primary/5'
                                : 'border-muted hover:border-primary/50 bg-card'
                              }
                            `}
                            onClick={() => field.onChange(option.value)}
                          >
                            <div className="flex items-start gap-3">
                              <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <FormLabel htmlFor={option.value} className="font-medium cursor-pointer">
                                    {option.label}
                                  </FormLabel>
                                  <span className="font-semibold text-primary">{option.range}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{option.desc}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Timeline</FormLabel>
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { value: 'urgent', label: 'Less than 1 month', icon: '⚡' },
                          { value: 'short', label: '1-3 months', icon: '📅' },
                          { value: 'medium', label: '3-6 months', icon: '🗓️' },
                          { value: 'long', label: '6+ months', icon: '📆' }
                        ].map((option) => (
                          <div
                            key={option.value}
                            className={`
                              p-4 rounded-lg border-2 cursor-pointer transition-all
                              ${field.value === option.value
                                ? 'border-primary bg-primary/5'
                                : 'border-muted hover:border-primary/50 bg-card'
                              }
                            `}
                            onClick={() => field.onChange(option.value)}
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value={option.value} id={`timeline-${option.value}`} />
                              <FormLabel htmlFor={`timeline-${option.value}`} className="cursor-pointer flex items-center gap-2 flex-1">
                                <span className="text-xl">{option.icon}</span>
                                <span>{option.label}</span>
                              </FormLabel>
                            </div>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <h4 className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                Budget Tips
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Your budget helps match you with qualified AI experts</li>
                <li>• Consider both development and maintenance costs</li>
                <li>• Milestone-based payments protect your investment</li>
                <li>• You can adjust budgets when posting specific projects</li>
              </ul>
            </div>
          </div>
        )}
      </Form>
    </MultiStepForm>
  );
}
