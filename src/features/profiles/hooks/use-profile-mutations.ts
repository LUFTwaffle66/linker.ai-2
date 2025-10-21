'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  updateFreelancerBio,
  updateFreelancerSkills,
  addFreelancerPortfolio,
  updateFreelancerPortfolio,
  deleteFreelancerPortfolio,
  addFreelancerExperience,
  updateClientBio,
} from '../api/profiles';
import { profileKeys } from './use-client-profile';

/**
 * Hook for updating freelancer bio
 */
export function useUpdateFreelancerBio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, bio }: { userId: string; bio: string }) =>
      updateFreelancerBio(userId, bio),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.freelancer(variables.userId),
      });
      toast.success('Bio updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update bio');
    },
  });
}

/**
 * Hook for updating freelancer skills
 */
export function useUpdateFreelancerSkills() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, skills }: { userId: string; skills: string[] }) =>
      updateFreelancerSkills(userId, skills),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.freelancer(variables.userId),
      });
      toast.success('Skills updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update skills');
    },
  });
}

/**
 * Hook for adding a new portfolio item
 */
export function useAddFreelancerPortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      portfolioItem,
    }: {
      userId: string;
      portfolioItem: {
        title: string;
        description: string;
        tags: string[];
        imageUrl?: string;
        url?: string;
      };
    }) => addFreelancerPortfolio(userId, portfolioItem),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.freelancer(variables.userId),
      });
      toast.success('Portfolio item added successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to add portfolio item');
    },
  });
}

/**
 * Hook for updating an existing portfolio item
 */
export function useUpdateFreelancerPortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      portfolioId,
      portfolioItem,
    }: {
      userId: string;
      portfolioId: string;
      portfolioItem: {
        title: string;
        description: string;
        tags: string[];
        imageUrl?: string;
        url?: string;
      };
    }) => updateFreelancerPortfolio(userId, portfolioId, portfolioItem),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.freelancer(variables.userId),
      });
      toast.success('Portfolio item updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update portfolio item');
    },
  });
}

/**
 * Hook for deleting a portfolio item
 */
export function useDeleteFreelancerPortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      portfolioId,
    }: {
      userId: string;
      portfolioId: string;
    }) => deleteFreelancerPortfolio(userId, portfolioId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.freelancer(variables.userId),
      });
      toast.success('Portfolio item deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete portfolio item');
    },
  });
}

/**
 * Hook for adding freelancer work experience
 */
export function useAddFreelancerExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      experience,
    }: {
      userId: string;
      experience: {
        position: string;
        company: string;
        period: string;
        description: string;
      };
    }) => addFreelancerExperience(userId, experience),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.freelancer(variables.userId),
      });
      toast.success('Work experience added successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to add work experience');
    },
  });
}

/**
 * Hook for updating client bio
 */
export function useUpdateClientBio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, bio }: { userId: string; bio: string }) =>
      updateClientBio(userId, bio),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.client(variables.userId),
      });
      toast.success('Bio updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update bio');
    },
  });
}
