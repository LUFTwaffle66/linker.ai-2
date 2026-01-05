'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Sparkles, User, Award, Briefcase, DollarSign, MapPin, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  freelancerOnboardingSchema,
  type FreelancerOnboardingData,
} from '../lib/validations';
import { useSaveFreelancerOnboarding } from '../hooks';
import { ProfileImageUploader } from './profile-image-uploader';
import { SkillsSelector } from './skills-selector';
import { PortfolioManager, type PortfolioItem } from './portfolio-manager';

interface FreelancerOnboardingProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

const steps: Step[] = [
  { num: 1, label: 'Profile', icon: User },
  { num: 2, label: 'Expertise', icon: Award },
  { num: 3, label: 'Skills', icon: Sparkles },
  { num: 4, label: 'Portfolio', icon: Briefcase },
  { num: 5, label: 'Rate', icon: DollarSign },
];

const aiSkills = [
  'Python', 'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn',
  'OpenAI API', 'GPT-4', 'ChatGPT', 'Claude API',
  'Natural Language Processing', 'Computer Vision', 'Machine Learning',
  'Deep Learning', 'Neural Networks', 'LangChain',
  'UiPath', 'Automation Anywhere', 'Blue Prism', 'Power Automate', 'n8n',
  'API Integration', 'Data Analysis', 'SQL', 'MongoDB',
  'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes',
  'React', 'Node.js', 'FastAPI', 'Django', 'Flask'
];

export function FreelancerOnboarding({ onComplete, onSkip }: FreelancerOnboardingProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const form = useForm<FreelancerOnboardingData>({
    resolver: zodResolver(freelancerOnboardingSchema) as any,
    defaultValues: {
      profileImage: '',
      fullName: '',
      title: '',
      location: '',
      bio: '',
      experience: '',
      skills: [],
      portfolio: [],
      portfolioTitle: '',
      portfolioDescription: '',
      portfolioTags: [],
      hourlyRate: '',
    },
  });

  const saveMutation = useSaveFreelancerOnboarding({
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

  const skills = form.watch('skills') || [];
  const portfolio = form.watch('portfolio') || [];
  const [currentPortfolioItem, setCurrentPortfolioItem] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    imageUrl: '',
    url: '',
  });

  const toggleSkill = (skill: string) => {
    const currentSkills = form.getValues('skills') || [];
    if (currentSkills.includes(skill)) {
      form.setValue('skills', currentSkills.filter(s => s !== skill));
    } else {
      if (currentSkills.length < 15) {
        form.setValue('skills', [...currentSkills, skill]);
      } else {
        toast.error('You can select up to 15 skills');
      }
    }
  };

  const togglePortfolioTag = (tag: string) => {
    const currentTags = currentPortfolioItem.tags;
    if (currentTags.includes(tag)) {
      setCurrentPortfolioItem({
        ...currentPortfolioItem,
        tags: currentTags.filter(t => t !== tag),
      });
    } else {
      if (currentTags.length < 6) {
        setCurrentPortfolioItem({
          ...currentPortfolioItem,
          tags: [...currentTags, tag],
        });
      }
    }
  };

  const addPortfolioItem = () => {
    if (!currentPortfolioItem.title || !currentPortfolioItem.description) {
      toast.error('Please provide at least a title and description');
      return;
    }

    if (currentPortfolioItem.tags.length === 0) {
      toast.error('Please select at least one technology tag');
      return;
    }

    const currentPortfolio = form.getValues('portfolio') || [];
    form.setValue('portfolio', [...currentPortfolio, currentPortfolioItem]);

    // Reset current item
    setCurrentPortfolioItem({
      title: '',
      description: '',
      tags: [],
      imageUrl: '',
      url: '',
    });

    toast.success('Portfolio item added!');
  };

  const removePortfolioItem = (index: number) => {
    const currentPortfolio = form.getValues('portfolio') || [];
    form.setValue('portfolio', currentPortfolio.filter((_, i) => i !== index));
    toast.success('Portfolio item removed');
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof FreelancerOnboardingData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ['fullName', 'title', 'location'];
        break;
      case 2:
        fieldsToValidate = ['bio', 'experience'];
        break;
      case 3:
        fieldsToValidate = ['skills'];
        break;
      case 4:
        // Portfolio is optional
        fieldsToValidate = [];
        break;
      case 5:
        fieldsToValidate = ['hourlyRate'];
        break;
    }

    const isValid = fieldsToValidate.length === 0 || await form.trigger(fieldsToValidate);

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
    saveMutation.mutate(data);
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
      subtitle="Let's set up your AI Expert profile in just a few steps"
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
                Tell us about yourself and help clients find you
              </p>
            </div>

            <ProfileImageUploader
              imageUrl={form.watch('profileImage')}
              onImageChange={(url) => form.setValue('profileImage', url)}
            />

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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Senior AI Engineer, ML Specialist, Automation Expert" {...field} />
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
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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

        {/* Step 2: Professional Info */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2">Your Expertise</h2>
              <p className="text-muted-foreground">
                Share your experience and what you do best
              </p>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Bio *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your AI/automation expertise, experience, and what makes you unique..."
                        rows={6}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      {field.value?.length || 0}/1000 characters
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="5"
                          className="pl-10"
                          min="0"
                          max="50"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Pro Tips
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Highlight your AI/automation specializations</li>
                  <li>• Mention key projects and their impact</li>
                  <li>• Include relevant certifications</li>
                  <li>• Show your passion for AI technology</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Skills */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2">Your AI Skills</h2>
              <p className="text-muted-foreground">
                Select up to 15 skills that match your expertise
              </p>
            </div>

            <FormField
              control={form.control}
              name="skills"
              render={() => (
                <FormItem>
                  <SkillsSelector
                    availableSkills={aiSkills}
                    selectedSkills={skills}
                    onSkillsChange={(newSkills) => form.setValue('skills', newSkills)}
                    maxSkills={15}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 Choose skills that best represent your expertise. These will help clients find you for relevant projects.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Portfolio */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2">Showcase Your Work</h2>
              <p className="text-muted-foreground">
                Add portfolio items to demonstrate your expertise (optional)
              </p>
            </div>

            <PortfolioManager
              portfolio={portfolio}
              onPortfolioChange={(newPortfolio) => form.setValue('portfolio', newPortfolio)}
            />
          </div>
        )}

        {/* Step 5: Rate */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2">Set Your Rate</h2>
              <p className="text-muted-foreground">
                Define your hourly rate to help clients understand your pricing
              </p>
            </div>

            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hourly Rate (USD) *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="75"
                        className="pl-10"
                        min="5"
                        max="500"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Service fee will be deducted from your earnings
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 rounded-lg border border-primary/20">
              <h4 className="mb-4">Rate Guidelines</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium mb-1">Entry Level</p>
                  <p className="text-2xl font-semibold text-primary mb-1">$25-50</p>
                  <p className="text-muted-foreground">0-2 years experience</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Intermediate</p>
                  <p className="text-2xl font-semibold text-primary mb-1">$50-100</p>
                  <p className="text-muted-foreground">2-5 years experience</p>
                </div>
                <div>
                  <p className="font-medium mb-1">Expert</p>
                  <p className="text-2xl font-semibold text-primary mb-1">$100+</p>
                  <p className="text-muted-foreground">5+ years experience</p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <h4 className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Pricing Tips
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Research market rates for your skill level</li>
                <li>• Consider your experience and certifications</li>
                <li>• Factor in the complexity of AI/ML projects</li>
                <li>• You can adjust your rate anytime</li>
              </ul>
            </div>
          </div>
        )}
      </Form>
    </MultiStepForm>
  );
}
