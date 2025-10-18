import type {
  ProjectInfo,
  ProjectMessage,
  ProjectUpdate,
  ProjectFile,
  SendProjectMessageFormData,
} from '../types';
import {
  MOCK_PROJECT,
  MOCK_MESSAGES,
  MOCK_UPDATES,
  MOCK_FILES,
} from './mock-data';

// Simulate API delay
const simulateDelay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// API Error class
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// In-memory storage for mock data
let project = { ...MOCK_PROJECT };
let messages = [...MOCK_MESSAGES];
let updates = [...MOCK_UPDATES];
let files = [...MOCK_FILES];

/**
 * Get project details
 */
export const getProject = async (projectId: string): Promise<ProjectInfo> => {
  await simulateDelay();

  if (projectId === project.id) {
    return project;
  }

  throw new ApiError(404, 'Project not found');
};

/**
 * Get project messages
 */
export const getProjectMessages = async (projectId: string): Promise<ProjectMessage[]> => {
  await simulateDelay();

  if (projectId !== project.id) {
    throw new ApiError(404, 'Project not found');
  }

  return messages;
};

/**
 * Send a message in project
 */
export const sendProjectMessage = async (
  data: SendProjectMessageFormData
): Promise<ProjectMessage> => {
  await simulateDelay(800);

  if (data.projectId !== project.id) {
    throw new ApiError(404, 'Project not found');
  }

  const newMessage: ProjectMessage = {
    id: `msg-${Date.now()}`,
    sender: 'freelancer',
    senderName: 'Alex Chen',
    senderRole: 'AI Engineer',
    avatar: 'AC',
    content: data.content,
    timestamp: new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }),
    date: 'Today',
    type: 'text',
  };

  messages.push(newMessage);

  return newMessage;
};

/**
 * Get project updates
 */
export const getProjectUpdates = async (projectId: string): Promise<ProjectUpdate[]> => {
  await simulateDelay();

  if (projectId !== project.id) {
    throw new ApiError(404, 'Project not found');
  }

  return updates;
};

/**
 * Get project files
 */
export const getProjectFiles = async (projectId: string): Promise<ProjectFile[]> => {
  await simulateDelay();

  if (projectId !== project.id) {
    throw new ApiError(404, 'Project not found');
  }

  return files;
};

/**
 * Upload file to project
 */
export const uploadProjectFile = async (
  projectId: string,
  file: File
): Promise<ProjectFile> => {
  await simulateDelay(1000);

  if (projectId !== project.id) {
    throw new ApiError(404, 'Project not found');
  }

  const newFile: ProjectFile = {
    id: `file-${Date.now()}`,
    name: file.name,
    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    uploadedBy: 'Alex Chen',
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  };

  files.unshift(newFile);

  return newFile;
};

/**
 * Request final payment
 */
export const requestFinalPayment = async (projectId: string): Promise<void> => {
  await simulateDelay(800);

  if (projectId !== project.id) {
    throw new ApiError(404, 'Project not found');
  }

  // Add update for payment request
  const newUpdate: ProjectUpdate = {
    id: `update-${Date.now()}`,
    type: 'message',
    title: 'Payment Request',
    description: 'Requested release of final payment',
    user: 'Alex Chen',
    avatar: 'AC',
    timestamp: 'Just now',
    date: 'Today',
  };

  updates.unshift(newUpdate);
};
