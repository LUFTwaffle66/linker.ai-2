'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { projectPostingSchema, type ProjectPostingFormData } from '../types';
import { paths } from '@/config/paths';
import { useCreateProject } from '../hooks/use-projects';
// 👇 Added Supabase and Icons
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
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

interface ProjectPostingFormProps {
  initialValues?: Partial<ProjectPostingFormData> & { service_category_id?: string; serviceCategoryId?: string; skills?: string[] };
  templateCategoryId?: string;
}

export function ProjectPostingForm({ initialValues, templateCategoryId }: ProjectPostingFormProps = {}) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [freelancerSearch, setFreelancerSearch] = useState('');
  const [selectedFreelancers, setSelectedFreelancers] = useState<string[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  // 👇 Added uploading state
  const [isUploading, setIsUploading] = useState(false);
  const [autoInviteEnabled, setAutoInviteEnabled] = useState(false);

  const form = useForm({
    resolver: zodResolver(projectPostingSchema),
    defaultValues: {
      ...DEFAULT_VALUES,
      ...initialValues,
    },
  });

  useEffect(() => {
    if (initialValues) {
      const targetCategory =
        initialValues.serviceCategoryId ||
        (initialValues as any).service_category_id ||
        initialValues.category;

      console.log('DEBUG: Template Category:', targetCategory);

      form.reset({
        ...DEFAULT_VALUES,
        ...initialValues,
        category: targetCategory ? String(targetCategory) : '',
        skills: initialValues.skills ?? [],
      });

      // Trigger validation to update UI state
      void form.trigger(['title', 'category', 'description', 'skills']);
    }
  }, [initialValues, form]);

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
    // Keep local file state but don't set raw files in form yet
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

    if (currentStep === 1) {
      fieldsToValidate = ['title', 'category', 'description', 'skills'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['budgetAmount', 'timeline'];
    }

    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      setCurrentStep(nextStep);
    }
  };

  // 👇 THE FIXED SUBMIT FUNCTION (Uploads files first)
  const onSubmit = async (data: ProjectPostingFormData) => {
    try {
      setIsUploading(true);

      // 1. Upload files to Supabase Storage
      const uploadedFiles = [];

      if (attachments.length > 0) {
        for (const file of attachments) {
          // Generate unique path
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
          const filePath = `${fileName}`; // Using simple root path for now

          // Upload to 'project-files' bucket
          const { error: uploadError } = await supabase.storage
            .from('project-files') // Make sure this bucket exists!
            .upload(filePath, file);

          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            continue;
          }

          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('project-files')
            .getPublicUrl(filePath);

          uploadedFiles.push({
            name: file.name,
            url: publicUrl,
            size: file.size,
            type: file.type
          });
        }
      }

      // 2. Submit project with the REAL file URLs
      await createProjectMutation.mutateAsync({
        title: data.title,
        category: data.category,
        description: data.description,
        skills: data.skills,
        budgetAmount: data.budgetAmount,
        timeline: data.timeline,
        attachments: uploadedFiles, // 👈 Passing valid objects now
        invitedFreelancers: selectedFreelancers,
        isPublished: true,
      });

      /* TEMPORARILY DISABLED FOR MOCK DATA TESTING
      if (selectedFreelancers.length > 0) {
        const invitations = selectedFreelancers.map((freelancerId) => ({
          freelancer_id: freelancerId,
          status: 'pending',
        }));

        // Intentionally not persisting invitations while using mock data
        // await supabase.from('project_invitations').insert(invitations);
      }
      */

      setAutoInviteEnabled(Boolean(templateCategoryId && data.category === templateCategoryId));
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Check console for details.');
    } finally {
      setIsUploading(false);
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
    <div className="min-h-screen bg-muted/30 relative">
      {/* 👇 Loading Overlay (Fixes the need to edit the other file) */}
      {(isUploading || createProjectMutation.isPending) && (
        <div className="absolute inset-0 z-50 bg-background/80 flex items-center justify-center backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              {isUploading ? 'Uploading files...' : 'Creating project...'}
            </p>
          </div>
        </div>
      )}

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
                projectSkills={form.watch('skills')}
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
                // Removed the prop that caused the error
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
        autoInviteEnabled={autoInviteEnabled}
        onViewProjects={handleSuccessClose}
        onPostAnother={handlePostAnother}
      />
    </div>
  );
}
