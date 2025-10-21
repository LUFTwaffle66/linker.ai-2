'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
  Sparkles, User, Award, Briefcase, DollarSign, Upload, MapPin, Clock, CheckCircle2, Plus, X, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
import { saveFreelancerOnboarding } from '../api/onboarding';

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
  'UiPath', 'Automation Anywhere', 'Blue Prism', 'Power Automate',
  'API Integration', 'Data Analysis', 'SQL', 'MongoDB',
  'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes',
  'React', 'Node.js', 'FastAPI', 'Django', 'Flask'
];

export function FreelancerOnboarding({ onComplete, onSkip }: FreelancerOnboardingProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const form = useForm<FreelancerOnboardingData>({
    resolver: zodResolver(freelancerOnboardingSchema),
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

  const mutation = useMutation({
    mutationFn: saveFreelancerOnboarding,
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
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <p className="text-sm font-medium mb-2">
                      {skills.length} of 15 skills selected
                    </p>
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {skills.map(skill => (
                          <Badge
                            key={skill}
                            variant="default"
                            className="cursor-pointer"
                            onClick={() => toggleSkill(skill)}
                          >
                            {skill} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <h4 className="mb-3">Available Skills</h4>
              <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto p-1">
                {aiSkills.map(skill => (
                  <Badge
                    key={skill}
                    variant={skills.includes(skill) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => toggleSkill(skill)}
                  >
                    {skills.includes(skill) && (
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                    )}
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

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

            {/* Display added portfolio items */}
            {portfolio.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Added Portfolio Items ({portfolio.length})</h3>
                {portfolio.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-card">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        {item.url && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <ExternalLink className="w-3 h-3" />
                            <span className="truncate max-w-xs">{item.url}</span>
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removePortfolioItem(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add new portfolio item form */}
            <div className="border-2 border-dashed rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">
                  {portfolio.length === 0 ? 'Add Your First Portfolio Item' : 'Add Another Portfolio Item'}
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Project Title *</label>
                  <Input
                    placeholder="e.g., AI Chatbot for Customer Support"
                    value={currentPortfolioItem.title}
                    onChange={(e) => setCurrentPortfolioItem({
                      ...currentPortfolioItem,
                      title: e.target.value,
                    })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Project Description *</label>
                  <Textarea
                    placeholder="Describe the project, technologies used, and results achieved..."
                    rows={3}
                    className="resize-none"
                    value={currentPortfolioItem.description}
                    onChange={(e) => setCurrentPortfolioItem({
                      ...currentPortfolioItem,
                      description: e.target.value,
                    })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Project URL (optional)</label>
                  <Input
                    placeholder="https://your-project-demo.com"
                    value={currentPortfolioItem.url}
                    onChange={(e) => setCurrentPortfolioItem({
                      ...currentPortfolioItem,
                      url: e.target.value,
                    })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Technologies Used *</label>
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'TensorFlow', 'OpenAI API', 'React', 'Docker', 'AWS', 'Node.js', 'PyTorch', 'LangChain'].map(tag => (
                      <Badge
                        key={tag}
                        variant={currentPortfolioItem.tags.includes(tag) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => togglePortfolioTag(tag)}
                      >
                        {currentPortfolioItem.tags.includes(tag) && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={addPortfolioItem}
                  className="w-full"
                  variant={portfolio.length > 0 ? 'outline' : 'default'}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Portfolio Item
                </Button>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {portfolio.length === 0
                  ? 'You can skip this step and add portfolio items later from your profile settings.'
                  : 'You can add more portfolio items later from your profile settings.'
                }
              </p>
            </div>
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
