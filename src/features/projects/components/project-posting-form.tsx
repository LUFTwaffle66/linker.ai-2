'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { projectPostingSchema, type ProjectPostingFormData } from '../types';
import { paths } from '@/config/paths';
import { useCreateProject } from '../hooks/use-projects';
import {
  ProgressHeader,
  ProjectDetailsStep,
  BudgetTimelineStep,
  InviteExpertsStep,
  ReviewStep,
  SuccessDialog,
} from './project-posting';

const TOTAL_STEPS = 4;

const DEFAULT_VALUES: ProjectPostingFormData = {
  title: '',
  category: '',
  description: '',
  skills: [],
  budgetAmount: '',
  timeline: '',
  attachments: [],
  invitedFreelancers: [],
};

export function ProjectPostingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [freelancerSearch, setFreelancerSearch] = useState('');
  const [selectedFreelancers, setSelectedFreelancers] = useState<string[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const form = useForm({
    resolver: zodResolver(projectPostingSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const createProjectMutation = useCreateProject();
  const skills = form.watch('skills');

  // Skill toggle handler
  const toggleSkill = (skill: string) => {
    const currentSkills = form.getValues('skills');
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter((s) => s !== skill)
      : [...currentSkills, skill];
    form.setValue('skills', newSkills);
  };

  // File upload handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAttachments = [...attachments, ...files];
    setAttachments(newAttachments);
    form.setValue('attachments', newAttachments);
  };

  const removeFile = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
    form.setValue('attachments', newAttachments);
  };

  // Freelancer invitation handlers
  const toggleFreelancerInvite = (freelancerId: string) => {
    setSelectedFreelancers((prev) =>
      prev.includes(freelancerId)
        ? prev.filter((id) => id !== freelancerId)
        : [...prev, freelancerId]
    );
  };

  // Step validation and navigation
  const validateAndGoToStep = async (nextStep: number) => {
    let fieldsToValidate: Array<keyof ProjectPostingFormData> = [];

    // Define which fields to validate for each step
    if (currentStep === 1) {
      fieldsToValidate = ['title', 'category', 'description', 'skills'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['budgetAmount', 'timeline'];
    }

    // Trigger validation for the current step's fields
    const isValid = await form.trigger(fieldsToValidate);

    // Only proceed to next step if validation passes
    if (isValid) {
      setCurrentStep(nextStep);
    }
  };

  // Form submission
  const onSubmit = async (data: ProjectPostingFormData) => {
    try {
      await createProjectMutation.mutateAsync({
        title: data.title,
        category: data.category,
        description: data.description,
        skills: data.skills,
        budgetAmount: data.budgetAmount,
        timeline: data.timeline,
        attachments: data.attachments || [],
        invitedFreelancers: selectedFreelancers,
        isPublished: true,
      });
      setShowSuccessDialog(true);
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Failed to create project:', error);
    }
  };

  // Success dialog handlers
  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    router.push(paths.public.browse.getHref({ tab: 'projects' }));
  };

  const handlePostAnother = () => {
    setShowSuccessDialog(false);
    form.reset(DEFAULT_VALUES);
    setAttachments([]);
    setSelectedFreelancers([]);
    setCurrentStep(1);
  };

  const formData = {
    title: form.getValues('title'),
    category: form.getValues('category'),
    description: form.getValues('description'),
    skills: form.getValues('skills'),
    budgetAmount: form.getValues('budgetAmount'),
    timeline: form.getValues('timeline'),
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl mb-2">
            Post a New AI Automation Project
          </h1>
          <p className="text-muted-foreground">
            Tell us about your automation needs and find the perfect AI expert
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressHeader currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Step 1: Project Details */}
            {currentStep === 1 && (
              <ProjectDetailsStep
                control={form.control}
                skills={skills}
                attachments={attachments}
                onToggleSkill={toggleSkill}
                onFileUpload={handleFileUpload}
                onRemoveFile={removeFile}
                onNext={() => validateAndGoToStep(2)}
              />
            )}

            {/* Step 2: Budget & Timeline */}
            {currentStep === 2 && (
              <BudgetTimelineStep
                control={form.control}
                onBack={() => setCurrentStep(1)}
                onNext={() => validateAndGoToStep(3)}
              />
            )}

            {/* Step 3: Invite AI Experts */}
            {currentStep === 3 && (
              <InviteExpertsStep
                searchQuery={freelancerSearch}
                selectedFreelancers={selectedFreelancers}
                onSearchChange={setFreelancerSearch}
                onToggleFreelancer={toggleFreelancerInvite}
                onBack={() => setCurrentStep(2)}
                onNext={() => setCurrentStep(4)}
              />
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <ReviewStep
                formData={formData}
                selectedFreelancers={selectedFreelancers}
                attachments={attachments}
                onBack={() => setCurrentStep(3)}
              />
            )}
          </form>
        </Form>
      </div>

      {/* Success Dialog */}
      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        selectedFreelancersCount={selectedFreelancers.length}
        onViewProjects={handleSuccessClose}
        onPostAnother={handlePostAnother}
      />
    </div>
  );
}
