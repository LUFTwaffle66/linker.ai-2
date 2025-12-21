import { supabase } from '@/lib/supabase';
import { createNotification } from '@/features/notifications/api/notifications';
import { paths } from '@/config/paths';

export interface Deliverable {
  id: string;
  project_id: string;
  freelancer_id: string;
  title: string;
  description: string;
  status: 'submitted' | 'approved' | 'revision_requested';
   delivery_attachments?: DeliverableAttachment[];
  submitted_at: string;
  reviewed_at: string | null;
  review_feedback: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubmitDeliverableParams {
  project_id: string;
  freelancer_id?: string | null;
  title: string;
  description: string;
  attachments?: File[];
}

export interface ReviewDeliverableParams {
  deliverableId: string;
  status: 'approved' | 'revision_requested';
  feedback?: string;
}

export interface DeliverableAttachment {
  name: string;
  url?: string | null;
  path?: string;
  bucket?: string;
  size?: number;
  type?: string;
}

const DELIVERABLE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_DELIVERABLES_BUCKET || 'project-files';

async function uploadDeliverableFiles(
  projectId: string,
  files?: File[]
): Promise<DeliverableAttachment[]> {
  if (!files || files.length === 0) return [];

  const uploads = await Promise.all(
    files.map(async (file) => {
      const extension = file.name.includes('.') ? file.name.split('.').pop() : 'bin';
      const path = `deliverables/${projectId}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${extension}`;

      const { data, error } = await supabase.storage
        .from(DELIVERABLE_BUCKET)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw new Error(error.message || `Failed to upload ${file.name}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from(DELIVERABLE_BUCKET)
        .getPublicUrl(path);

      return {
        name: file.name,
        path: data?.path || path,
        bucket: DELIVERABLE_BUCKET,
        url: publicUrlData?.publicUrl || null,
        size: file.size,
        type: file.type,
      };
    })
  );

  return uploads;
}

/**
 * Get deliverables for a project
 */
export async function fetchProjectDeliverables(projectId: string): Promise<Deliverable[]> {
  const { data, error } = await supabase
    .from('project_deliverables')
    .select('*')
    .eq('project_id', projectId)
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return data as Deliverable[];
}

/**
 * Submit a deliverable (freelancer)
 */
export async function submitDeliverable(params: SubmitDeliverableParams): Promise<Deliverable> {
  const { project_id, freelancer_id, title, description, attachments } = params;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const role =
    (user as any).role || user.app_metadata?.role || (user as any)?.user_metadata?.role || 'freelancer';
  const resolvedFreelancerId = role === 'freelancer' ? user.id : freelancer_id;

  if (!resolvedFreelancerId) {
    throw new Error('Missing freelancer ID');
  }

  const uploadedAttachments = await uploadDeliverableFiles(project_id, attachments);

  // Get project details for notification
  const { data: project } = await supabase
    .from('projects')
    .select(`
      *,
      client:users!projects_client_id_fkey(
        id,
        full_name,
        company_name
      ),
      freelancer:users!projects_hired_freelancer_id_fkey(
        id,
        full_name
      )
    `)
    .eq('id', project_id)
    .single();

  if (!project) throw new Error('Project not found');

  // Insert deliverable
  const { data, error } = await supabase
    .from('project_deliverables')
    .insert({
      project_id,
      freelancer_id: resolvedFreelancerId,
      title,
      description,
      status: 'submitted',
      ...(uploadedAttachments.length > 0 && { delivery_attachments: uploadedAttachments }),
    })
    .select()
    .single();

  if (error) throw error;

  // Send notification to client
  try {
    await createNotification({
      user_id: project.client_id,
      category: 'contract',
      type: 'contract_started', // Using closest available type
      title: 'Work Submitted for Review',
      message: `${project.freelancer.full_name} submitted work for "${project.title}"`,
      project_id: project_id,
      actor_id: resolvedFreelancerId,
      metadata: {
        deliverable_title: title,
        deliverable_description: description,
        project_title: project.title,
        freelancer_name: project.freelancer.full_name,
      },
      action_url: paths.app.projectDetail.getHref(project_id),
    });
  } catch (notificationError) {
    console.error('Failed to send notification:', notificationError);
  }

  return data as Deliverable;
}

/**
 * Review a deliverable (client)
 */
export async function reviewDeliverable(params: ReviewDeliverableParams): Promise<Deliverable> {
  const { deliverableId, status, feedback } = params;

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Get deliverable with project info
  const { data: deliverable } = await supabase
    .from('project_deliverables')
    .select(`
      *,
      project:projects(
        *,
        client:users!projects_client_id_fkey(
          id,
          full_name,
          company_name
        )
      )
    `)
    .eq('id', deliverableId)
    .single();

  if (!deliverable) throw new Error('Deliverable not found');

  // Update deliverable
  const { data, error } = await supabase
    .from('project_deliverables')
    .update({
      status,
      review_feedback: feedback,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', deliverableId)
    .select()
    .single();

  if (error) throw error;

  // Send notification to freelancer
  try {
    const clientName = deliverable.project.client.company_name || deliverable.project.client.full_name;

    await createNotification({
      user_id: deliverable.freelancer_id,
      category: 'contract',
      type: status === 'approved' ? 'contract_ended' : 'project_requirements_updated',
      title: status === 'approved' ? 'Work Approved!' : 'Revisions Requested',
      message:
        status === 'approved'
          ? `${clientName} approved your work for "${deliverable.project.title}"`
          : `${clientName} requested revisions for "${deliverable.project.title}"`,
      project_id: deliverable.project_id,
      actor_id: user.id,
      metadata: {
        deliverable_title: deliverable.title,
        review_feedback: feedback,
        project_title: deliverable.project.title,
        client_name: clientName,
      },
      action_url: paths.app.projectDetail.getHref(deliverable.project_id),
    });
  } catch (notificationError) {
    console.error('Failed to send notification:', notificationError);
  }

  return data as Deliverable;
}
