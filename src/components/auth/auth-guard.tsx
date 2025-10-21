'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/features/auth/types/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireRole?: UserRole | UserRole[];
  fallbackUrl?: string;
}

export function AuthGuard({ children, requireRole, fallbackUrl = '/login' }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    // Not authenticated - redirect to login
    if (!session) {
      router.push(fallbackUrl);
      return;
    }

    // Check role if required
    if (requireRole) {
      const allowedRoles = Array.isArray(requireRole) ? requireRole : [requireRole];
      if (!allowedRoles.includes(session.user.role)) {
        router.push('/403'); // Forbidden page
      }
    }
  }, [session, status, requireRole, fallbackUrl, router]);

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return null;
  }

  // Check role
  if (requireRole) {
    const allowedRoles = Array.isArray(requireRole) ? requireRole : [requireRole];
    if (!allowedRoles.includes(session.user.role)) {
      return null;
    }
  }

  return <>{children}</>;
}
