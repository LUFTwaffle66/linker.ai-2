'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { paths } from '@/config/paths';
import { proposalSchema, type ProposalFormData } from '../types';
import { useCreateProposal } from '../hooks/use-proposals';
import type { Project } from '@/types/browse';
import {
  CoverLetterSection,
  BudgetTimelineSection,
  PaymentStructureCard,
  AttachmentsSection,
  ProjectOverviewCard,
  ClientInfoCard,
  TipsCard,
  SuccessDialog,
} from './submit-proposal';

interface SubmitProposalFormProps {
  project?: Project;
  onProposalSubmitted?: () => void;
}

// Default mock project data - used when no project prop is provided
const DEFAULT_PROJECT: Project = {
  id: 1,
  title: 'AI Chatbot for E-commerce Support',
  category: 'AI Chatbot',
  budget: '$8,000 - $12,000',
  timeline: '3-4 weeks',
  description: 'Need an AI-powered chatbot using GPT-4 to handle customer support inquiries for our e-commerce platform. Must integrate with our existing CRM and handle 1000+ daily queries.',
  skills: ['GPT-4', 'Python', 'API Integration', 'Natural Language Processing'],
  postedDate: '2 days ago',
  proposals: 12,
  client: {
    name: 'ShopHub Inc',
    rating: 4.9,
    verified: true,
    spent: '$45K+',
  },
};

const FORM_DEFAULT_VALUES: ProposalFormData = {
  coverLetter: '',
  totalBudget: '',
  timeline: '',
  attachments: [],
};

export function SubmitProposalForm({ project: propProject, onProposalSubmitted }: SubmitProposalFormProps) {
  const router = useRouter();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const project = propProject || DEFAULT_PROJECT;

  const form = useForm({
    resolver: zodResolver(proposalSchema),
    defaultValues: FORM_DEFAULT_VALUES,
  });

  const createProposalMutation = useCreateProposal();
  const totalBudget = form.watch('totalBudget');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const updatedAttachments = [...attachments, ...files];
    setAttachments(updatedAttachments);
    form.setValue('attachments', updatedAttachments);
  };

  const removeFile = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
    form.setValue('attachments', newAttachments);
  };

  const onSubmit = async (data: ProposalFormData) => {
    try {
      // Convert project.id to string if it's a number
      const projectId = typeof project.id === 'number' ? String(project.id) : project.id;

      await createProposalMutation.mutateAsync({
        projectId,
        coverLetter: data.coverLetter,
        totalBudget: data.totalBudget,
        timeline: data.timeline,
        attachments: data.attachments || [],
      });

      setShowSuccessDialog(true);
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Failed to submit proposal:', error);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    if (onProposalSubmitted) {
      onProposalSubmitted();
    } else {
      router.push(paths.public.browse.getHref({ tab: 'projects' }));
    }
  };

  const handleViewProposals = () => {
    setShowSuccessDialog(false);
    // TODO: Navigate to proposals page
  };

  const showPaymentStructure = totalBudget && !isNaN(parseFloat(totalBudget));

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl mb-2">Submit Proposal</h1>
          <p className="text-muted-foreground">
            Submit your proposal to work on this project
          </p>
        </header>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form Column */}
              <div className="lg:col-span-2 space-y-6">
                <CoverLetterSection control={form.control} />

                <BudgetTimelineSection
                  control={form.control}
                  projectBudget={project.budget}
                  projectTimeline={project.timeline}
                />

                {showPaymentStructure && (
                  <PaymentStructureCard totalBudget={totalBudget} />
                )}

                <AttachmentsSection
                  attachments={attachments}
                  onFileUpload={handleFileUpload}
                  onRemoveFile={removeFile}
                />

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  <Button type="submit" size="lg" className="flex-1">
                    Submit Proposal
                  </Button>
                </div>
              </div>

              {/* Sidebar Column */}
              <aside className="space-y-6">
                <ProjectOverviewCard project={project} />
                <ClientInfoCard
                  client={project.client}
                  proposalCount={project.proposals}
                />
                <TipsCard />
              </aside>
            </div>
          </form>
        </Form>
      </div>

      {/* Success Dialog */}
      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        projectTitle={project.title}
        clientName={project.client.name}
        onBrowseMore={handleSuccessClose}
        onViewProposals={handleViewProposals}
      />
    </div>
  );
}
