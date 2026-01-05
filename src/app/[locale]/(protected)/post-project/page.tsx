'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProjectPostingForm, type ProjectPostingFormData } from '@/features/projects';
import { PROJECT_TEMPLATES } from '@/constants/projectTemplates';

// Simplified Type: No more confusing IDs, just standard form data
type TemplateInitialValues = Partial<ProjectPostingFormData> & {
  skills?: string[];
};

export default function PostProjectPage() {
  const searchParams = useSearchParams();
  const [templateValues, setTemplateValues] = useState<TemplateInitialValues | null>(null);
  const [templateCategoryName, setTemplateCategoryName] = useState<string | null>(null);

  useEffect(() => {
    const slug = searchParams.get('template');
    if (!slug) return;

    const template = PROJECT_TEMPLATES[slug as keyof typeof PROJECT_TEMPLATES];
    if (!template) return;

    // 1. Set the form values directly using the strings from the template
    setTemplateValues({
      title: template.title,
      description: template.description,
      skills: template.skills,
      category: template.category, // e.g., "Workflow Automation"
    });

    // 2. Save the category name to enable "Auto-Invite" features later
    setTemplateCategoryName(template.category);
  }, [searchParams]);

  return (
    <ProjectPostingForm
      initialValues={templateValues ?? undefined}
      // We pass the Name into the ID prop so the form can check equality (data.category === templateCategory)
      templateCategoryId={templateCategoryName ?? undefined}
    />
  );
}
