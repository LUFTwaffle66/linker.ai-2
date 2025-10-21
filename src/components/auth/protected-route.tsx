'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/lib/auth-client';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiredRole?: string;
}

export function ProtectedRoute({
  children,
  redirectTo = '/login',
  requiredRole,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
      } else if (requiredRole && user?.role !== requiredRole) {
        router.push('/unauthorized');
      }
    }
  }, [isAuthenticated, isLoading, user, router, redirectTo, requiredRole]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
