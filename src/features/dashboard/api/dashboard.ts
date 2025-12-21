// src/features/dashboard/api/dashboard.ts

import { supabase } from '@/lib/supabase';
import { deriveProjectSnapshot } from '@/features/projects/utils/derive-project-status';
import type { DerivedProjectSnapshot } from '@/features/projects/utils/derive-project-status'; // Import the correct type
import type { ProjectStatus } from '@/features/active-projects/types';
import type { FreelancerDashboardData } from '../components/freelancer-dashboard';
import type { ClientDashboardData } from '../components/client-dashboard';
import type { ActivityItem } from '../components/recent-activity-card';

const isSuccessfulPayment = (tx: any) =>
  tx?.type === 'payment' && (tx?.status === 'succeeded' || tx?.status === 'completed');

/**
 * Fetch freelancer dashboard data
 */
export async function getFreelancerDashboard(userId: string): Promise<FreelancerDashboardData> {
  // Fetch proposals
  const { data: proposals, error: proposalsError } = await supabase
    .from('proposals')
    .select(`
      *,
      project:projects(*)
    `)
    .eq('freelancer_id', userId)
    .order('created_at', { ascending: false });

  if (proposalsError) {
    throw proposalsError;
  }

  // Fetch hired projects with payment + deliverable info for status parity
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select(
      `
        *,
        client:users!projects_client_id_fkey(id, full_name, company_name),
        proposals:proposals!proposals_project_id_fkey(total_budget,status,freelancer_id),
        payment_intents:payment_intents(*),
        payment_transactions:payment_transactions!payment_transactions_project_id_fkey(status,type,description,created_at,amount),
        project_deliverables:project_deliverables(status)
      `
    )
    .eq('hired_freelancer_id', userId)
    .order('created_at', { ascending: false });

  if (projectsError) {
    throw projectsError;
  }

  const derivedProjects =
    projects?.map((project: any) => ({
      project,
      derived: deriveProjectSnapshot({
        project,
        paymentIntents: project.payment_intents,
        paymentTransactions: project.payment_transactions,
        deliverables: project.project_deliverables,
        proposals: project.proposals,
      }),
    })) ?? [];

  const activeProjects = derivedProjects.filter(({ derived }) => derived.status !== 'completed').length;
  const completedProjects = derivedProjects.filter(({ derived }) => derived.status === 'completed').length;

  const totalEarnings =
    derivedProjects.reduce((sum, { project }) => {
      const payments = (project.payment_transactions ?? []).filter(isSuccessfulPayment);
      return sum + payments.reduce((acc: number, tx: any) => acc + Number(tx.amount || 0), 0);
    }, 0) / 100;

  // Calculate metrics
  const totalProposals = proposals?.length || 0;
  const acceptedProposals = proposals?.filter((p) => p.status === 'accepted').length || 0;
  const pendingProposals = proposals?.filter((p) => p.status === 'submitted' || p.status === 'under_review').length || 0;
  const successRate = totalProposals > 0 ? Math.round((acceptedProposals / totalProposals) * 100) : 0;

  // Recent proposals
  const recentProposals = (proposals || []).slice(0, 5).map((p: any) => ({
    id: p.id,
    projectTitle: p.project?.title || 'Unknown Project',
    amount: p.total_budget,
    status: p.status,
    submittedAt: new Date(p.created_at),
  }));

  // Recent activities
  const recentActivities: ActivityItem[] = (proposals || []).slice(0, 10).map((p: any) => ({
    id: p.id,
    title: `Proposal ${p.status}`,
    description: `Your proposal for "${p.project?.title}" was ${p.status}`,
    timestamp: new Date(p.created_at),
    type: 'proposal' as const,
    status: p.status,
  }));

  // Active projects list using shared project state
  const activeProjectsList = derivedProjects
    .filter(({ derived }) => derived.status !== 'completed') // Removed 'cancelled' check as it doesn't exist in derived types
    .slice(0, 3)
    // Removed explicit type annotation here to allow inference
    .map(({ project, derived }) => ({
      id: project.id,
      title: project.title || 'Unknown Project',
      client: project.client?.company_name || project.client?.full_name || 'Client',
      budget: derived.budget,
      deadline: project.timeline || 'No deadline set',
      progress: derived.progress,
      status: derived.status as unknown as ProjectStatus, // Force cast if UI expects different union type
    }));

  return {
    totalEarnings,
    activeProjects,
    proposalsSent: totalProposals,
    successRate,
    pendingProposals,
    completedProjects,
    recentActivities,
    recentProposals,
    activeProjectsList,
  };
}

/**
 * Fetch client dashboard data
 */
export async function getClientDashboard(userId: string): Promise<ClientDashboardData> {
  // Fetch projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select(
      `
        *,
        proposals:proposals(
          *,
          freelancer:users!freelancer_id(*)
        ),
        payment_intents:payment_intents(*),
        payment_transactions:payment_transactions!payment_transactions_project_id_fkey(status,type,description,created_at,amount),
        project_deliverables:project_deliverables(status)
      `
    )
    .eq('client_id', userId)
    .order('created_at', { ascending: false });

  if (projectsError) {
    throw projectsError;
  }

  const derivedProjects =
    projects?.map((project: any) => ({
      project,
      derived: deriveProjectSnapshot({
        project,
        paymentIntents: project.payment_intents,
        paymentTransactions: project.payment_transactions,
        deliverables: project.project_deliverables,
        proposals: project.proposals,
      }),
    })) ?? [];

  const allProposals = projects?.flatMap((p: any) => p.proposals || []) || [];

  // Calculate metrics
  // Fixed logic: 'pending' and 'in-progress' do not exist exactly like that in derived status
  // We treat anything NOT completed as "Active"
  const activeProjects = derivedProjects.filter(({ derived }) => derived.status !== 'completed').length;
  
  const completedProjects = derivedProjects.filter(({ derived }) => derived.status === 'completed').length;
  const proposalsReceived = allProposals.length;
  const pendingProposals = allProposals.filter((p: any) => p.status === 'submitted' || p.status === 'under_review').length;

  const totalSpent =
    derivedProjects.reduce((sum, { project }) => {
      const payments = (project.payment_transactions ?? []).filter(isSuccessfulPayment);
      return sum + payments.reduce((acc: number, tx: any) => acc + Number(tx.amount || 0), 0);
    }, 0) / 100;

  const totalFreelancersHired = derivedProjects.filter(({ project }) => !!project.hired_freelancer_id).length;

  // Active projects list
  const activeProjectsList = derivedProjects
    .filter(({ derived }) => derived.status !== 'completed') // Removed 'cancelled' check
    .slice(0, 3)
    // Removed explicit type annotation here to allow inference
    .map(({ project, derived }) => ({
      id: project.id,
      title: project.title,
      budget: derived.budget,
      proposalCount: project.proposals?.length || 0,
      status: derived.status as unknown as ProjectStatus, // Force cast if UI expects different union type
      paymentProgress: derived.progress,
      postedAt: new Date(project.created_at),
    }));

  // Recent proposals
  const recentProposalsList = allProposals
    .slice(0, 5)
    .map((p: any) => ({
      id: p.id,
      projectId: p.project_id,
      projectTitle: projects?.find((proj: any) => proj.id === p.project_id)?.title || 'Unknown Project',
      freelancerName: p.freelancer?.full_name || 'Unknown Freelancer',
      freelancerAvatar: p.freelancer?.avatar_url,
      amount: p.total_budget,
      status: p.status,
      submittedAt: new Date(p.created_at),
    }));

  // Recent activities
  const recentActivities: ActivityItem[] = [
    ...allProposals.slice(0, 5).map((p: any) => ({
      id: p.id,
      title: 'New Proposal Received',
      description: `${p.freelancer?.full_name || 'A freelancer'} submitted a proposal`,
      timestamp: new Date(p.created_at),
      type: 'proposal' as const,
      status: p.status,
    })),
    ...derivedProjects.slice(0, 5).map(({ project, derived }) => ({
      id: project.id,
      title: 'Project Updated',
      description: `Your project "${project.title}" is now ${derived.status.replace('_', ' ')}`, // Fixed replace '-' with '_'
      timestamp: new Date(project.created_at),
      type: 'project' as const,
      status: derived.status as string,
    })),
  ]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);

  return {
    totalSpent,
    activeProjects,
    totalFreelancersHired,
    projectsCompleted: completedProjects,
    proposalsReceived,
    pendingProposals,
    recentActivities,
    activeProjectsList,
    recentProposalsList,
  };
}