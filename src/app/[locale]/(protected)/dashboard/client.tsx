'use client';

import { useAuth } from '@/features/auth/lib/auth-client';
import { FreelancerDashboard } from '@/features/dashboard/components/freelancer-dashboard';
import { ClientDashboard } from '@/features/dashboard/components/client-dashboard';
import { useFreelancerDashboard, useClientDashboard } from '@/features/dashboard/hooks/use-dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function DashboardClient() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const isFreelancer = user?.role === 'freelancer';
  const isClient = user?.role === 'client';

  // Fetch dashboard data based on role
  const {
    data: freelancerData,
    isLoading: isFreelancerLoading,
    error: freelancerError,
  } = useFreelancerDashboard(isFreelancer ? user?.id : undefined);

  const {
    data: clientData,
    isLoading: isClientLoading,
    error: clientError,
  } = useClientDashboard(isClient ? user?.id : undefined);

  // Loading state
  if (isAuthLoading || (isFreelancer && isFreelancerLoading) || (isClient && isClientLoading)) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (freelancerError || clientError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // No user or invalid role
  if (!user || (!isFreelancer && !isClient)) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to determine your account type. Please complete your profile.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          {isFreelancer
            ? 'Track your projects, proposals, and earnings'
            : 'Manage your projects and review proposals'}
        </p>
      </div>

      {/* Role-based Dashboard */}
      {isFreelancer && freelancerData && (
        <FreelancerDashboard data={freelancerData} isLoading={isFreelancerLoading} />
      )}

      {isClient && clientData && (
        <ClientDashboard data={clientData} isLoading={isClientLoading} />
      )}
    </div>
  );
}
