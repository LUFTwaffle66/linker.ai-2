'use client';

import { DollarSign, Briefcase, FileText, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { MetricCard } from './metric-card';
import { RecentActivityCard, type ActivityItem } from './recent-activity-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/routing';
import { paths } from '@/config/paths';
import type { ProjectStatus } from '@/features/active-projects/types';

export interface FreelancerDashboardData {
  totalEarnings: number;
  activeProjects: number;
  proposalsSent: number;
  successRate: number;
  pendingProposals: number;
  completedProjects: number;
  recentActivities: ActivityItem[];
  recentProposals: Array<{
    id: string;
    projectTitle: string;
    amount: number;
    status: string;
    submittedAt: Date;
  }>;
  activeProjectsList: Array<{
    id: string;
    title: string;
    client: string;
    budget: number;
    deadline: string;
    progress: number;
    status: ProjectStatus;
  }>;
}

interface FreelancerDashboardProps {
  data: FreelancerDashboardData;
  isLoading?: boolean;
}

export function FreelancerDashboard({ data, isLoading }: FreelancerDashboardProps) {
  const router = useRouter();
  const statusStyles: Record<ProjectStatus, string> = {
    pending: 'bg-yellow-500/10 text-yellow-600',
    'in-progress': 'bg-blue-500/10 text-blue-600',
    completed: 'bg-green-500/10 text-green-600',
    cancelled: 'bg-red-500/10 text-red-600',
  };

  const formatStatus = (status: ProjectStatus) =>
    status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1);

  if (isLoading) {
    return (
      <div className="space-y-6">
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

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Earnings"
          value={`$${data.totalEarnings.toLocaleString()}`}
          icon={DollarSign}
          description="Lifetime earnings"
          className="border-primary/20"
        />
        <MetricCard
          title="Active Projects"
          value={data.activeProjects}
          icon={Briefcase}
          description={`${data.completedProjects} completed`}
        />
        <MetricCard
          title="Proposals Sent"
          value={data.proposalsSent}
          icon={FileText}
          description={`${data.pendingProposals} pending`}
        />
        <MetricCard
          title="Success Rate"
          value={`${data.successRate}%`}
          icon={TrendingUp}
          description="Proposal acceptance rate"
        />
      </div>

      {/* Active Projects & Recent Proposals */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Projects</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(paths.app.projects.getHref())}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {data.activeProjectsList.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No active projects yet
              </p>
            ) : (
              <div className="space-y-4">
                {data.activeProjectsList.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => router.push(paths.app.projectDetail.getHref(project.id))}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{project.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Client: {project.client}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="secondary" className="ml-2">
                          ${project.budget.toLocaleString()}
                        </Badge>
                        <Badge variant="outline" className={statusStyles[project.status]}>
                          {formatStatus(project.status)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Due: {project.deadline}
                      </span>
                      <span>Payment: {project.progress}%</span>
                    </div>
                    <div className="w-full bg-muted h-1.5 rounded-full mt-2">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Proposals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Proposals</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(paths.app.proposals.getHref())}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {data.recentProposals.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">
                  No proposals sent yet
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(paths.app.browseProjects.getHref())}
                >
                  Browse Projects
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentProposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm flex-1">
                        {proposal.projectTitle}
                      </h4>
                      <Badge
                        variant="secondary"
                        className={
                          proposal.status === 'accepted'
                            ? 'bg-green-500/10 text-green-500'
                            : proposal.status === 'rejected'
                            ? 'bg-red-500/10 text-red-500'
                            : 'bg-yellow-500/10 text-yellow-500'
                        }
                      >
                        {proposal.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>${proposal.amount.toLocaleString()}</span>
                      <span>
                        {formatDistanceToNow(new Date(proposal.submittedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <RecentActivityCard
        activities={data.recentActivities}
        emptyMessage="No recent activity to show"
      />
    </div>
  );
}

function formatDistanceToNow(date: Date, options: { addSuffix: boolean }) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}
