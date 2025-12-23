/**
 * Helper functions to create notifications from other features
 * Import these in your feature modules to trigger notifications
 */

import { createNotification } from '../api/notifications';
import type { CreateNotificationRequest } from '../types';

/**
 * PROJECT NOTIFICATIONS
 */

export async function notifyProjectPosted(params: {
  clientId: string;
  projectId: string;
  projectTitle: string;
}) {
  return createNotification({
    user_id: params.clientId,
    category: 'project_opportunity',
    type: 'project_posted',
    title: 'Project posted successfully',
    message: `Your project "${params.projectTitle}" is now live and visible to freelancers.`,
    project_id: params.projectId,
    action_url: `/projects/${params.projectId}`,
  });
}

export async function notifyProjectMatchSkills(params: {
  freelancerId: string;
  projectId: string;
  projectTitle: string;
  skills: string[];
}) {
  return createNotification({
    user_id: params.freelancerId,
    category: 'project_opportunity',
    type: 'project_match_skills',
    title: 'New project matches your skills!',
    message: `A new project "${params.projectTitle}" matches your expertise in ${params.skills.join(', ')}.`,
    project_id: params.projectId,
    action_url: `/browse?tab=projects`,
    metadata: { skills: params.skills },
  });
}

/**
 * PROPOSAL NOTIFICATIONS
 */

export async function notifyProposalSubmitted(params: {
  freelancerId: string;
  projectId: string;
  proposalId: string;
  projectTitle: string;
}) {
  return createNotification({
    user_id: params.freelancerId,
    category: 'proposal',
    type: 'proposal_submitted',
    title: 'Proposal submitted successfully',
    message: `Your proposal for "${params.projectTitle}" has been sent to the client.`,
    project_id: params.projectId,
    proposal_id: params.proposalId,
    action_url: `/proposals/${params.proposalId}`,
  });
}

export async function notifyNewProposal(params: {
  clientId: string;
  freelancerId: string;
  freelancerName: string;
  projectId: string;
  proposalId: string;
  projectTitle: string;
}) {
  return createNotification({
    user_id: params.clientId,
    category: 'proposal',
    type: 'new_proposal_received',
    title: 'New proposal received',
    message: `${params.freelancerName} submitted a proposal for "${params.projectTitle}".`,
    project_id: params.projectId,
    proposal_id: params.proposalId,
    actor_id: params.freelancerId,
    action_url: `/projects/${params.projectId}/proposals`,
  });
}

export async function notifyProposalAccepted(params: {
  freelancerId: string;
  clientId: string;
  clientName: string;
  projectId: string;
  proposalId: string;
  projectTitle: string;
}) {
  return createNotification({
    user_id: params.freelancerId,
    category: 'proposal',
    type: 'proposal_accepted',
    title: 'Congratulations! Your proposal was accepted',
    message: `${params.clientName} has accepted your proposal for "${params.projectTitle}". You can start working once the upfront payment is secured.`,
    project_id: params.projectId,
    proposal_id: params.proposalId,
    actor_id: params.clientId,
    action_url: `/projects/${params.projectId}`,
  });
}

export async function notifyProposalDeclined(params: {
  freelancerId: string;
  projectId: string;
  proposalId: string;
  projectTitle: string;
}) {
  return createNotification({
    user_id: params.freelancerId,
    category: 'proposal',
    type: 'proposal_declined',
    title: 'Proposal not selected',
    message: `Your proposal for "${params.projectTitle}" was not selected. Keep applying to find the perfect match!`,
    project_id: params.projectId,
    proposal_id: params.proposalId,
    action_url: '/browse?tab=projects',
  });
}

/**
 * PAYMENT NOTIFICATIONS
 */

export async function notifyUpfrontPaymentSecured(params: {
  freelancerId: string;
  projectId: string;
  projectTitle: string;
  amount: number;
}) {
  return createNotification({
    user_id: params.freelancerId,
    category: 'payment',
    type: 'upfront_payment_secured',
    title: 'Upfront payment secured',
    message: `The client has paid 50% upfront for "${params.projectTitle}". You can now start working!`,
    project_id: params.projectId,
    action_url: `/projects/${params.projectId}`,
    metadata: { amount: params.amount },
  });
}

export async function notifyFinalPaymentReleased(params: {
  freelancerId: string;
  projectId: string;
  projectTitle: string;
  amount: number;
}) {
  return createNotification({
    user_id: params.freelancerId,
    category: 'payment',
    type: 'final_payment_released',
    title: 'Final payment released!',
    message: `The remaining 50% for "${params.projectTitle}" has been released. Total: $${params.amount.toLocaleString()}`,
    project_id: params.projectId,
    action_url: '/dashboard/earnings',
    metadata: { amount: params.amount },
  });
}

export async function notifyUpfrontPaymentSuccessful(params: {
  clientId: string;
  projectId: string;
  projectTitle: string;
  amount: number;
}) {
  return createNotification({
    user_id: params.clientId,
    category: 'payment',
    type: 'upfront_payment_successful',
    title: 'Upfront payment successful',
    message: `Your 50% upfront payment for "${params.projectTitle}" has been processed. The freelancer can now start working.`,
    project_id: params.projectId,
    action_url: `/projects/${params.projectId}`,
    metadata: { amount: params.amount },
  });
}

/**
 * CONTRACT NOTIFICATIONS
 */

export async function notifyContractStarted(params: {
  userId: string;
  projectId: string;
  projectTitle: string;
}) {
  return createNotification({
    user_id: params.userId,
    category: 'contract',
    type: 'contract_started',
    title: 'Project started!',
    message: `Your contract for "${params.projectTitle}" has officially started. Good luck!`,
    project_id: params.projectId,
    action_url: `/projects/${params.projectId}`,
  });
}

export async function notifyContractEnded(params: {
  userId: string;
  projectId: string;
  projectTitle: string;
}) {
  return createNotification({
    user_id: params.userId,
    category: 'contract',
    type: 'contract_ended',
    title: 'Project completed',
    message: `Your contract for "${params.projectTitle}" has been marked as complete.`,
    project_id: params.projectId,
    action_url: `/projects/${params.projectId}`,
  });
}

/**
 * MESSAGE NOTIFICATIONS
 */

export async function notifyNewMessage(params: {
  recipientId: string;
  senderId: string;
  senderName: string;
  conversationId: string;
  messagePreview: string;
}) {
  return createNotification({
    user_id: params.recipientId,
    category: 'message',
    type: 'client_message', // or 'freelancer_message' depending on context
    title: 'New message',
    message: `${params.senderName}: ${params.messagePreview}`,
    conversation_id: params.conversationId,
    actor_id: params.senderId,
    action_url: `/messages?chat_id=${params.conversationId}`,
  });
}

/**
 * REVIEW NOTIFICATIONS
 */

export async function notifyReviewReceived(params: {
  userId: string;
  reviewerId: string;
  reviewerName: string;
  projectId: string;
  projectTitle: string;
  rating: number;
}) {
  return createNotification({
    user_id: params.userId,
    category: 'review',
    type: 'review_received',
    title: 'New review received',
    message: `${params.reviewerName} left you a review for "${params.projectTitle}". Rating: ${params.rating}/5`,
    project_id: params.projectId,
    actor_id: params.reviewerId,
    action_url: `/profile`,
    metadata: { rating: params.rating },
  });
}
