'use client';

import {
  DollarSign,
  Briefcase,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { MetricCard } from './metric-card';
import { RecentActivityCard, type ActivityItem } from './recent-activity-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useRouter } from '@/i18n/routing';
import { paths } from '@/config/paths';
import type { ProjectStatus } from '@/features/active-projects/types';

export interface ClientDashboardData {
  totalSpent: number;
  activeProjects: number;
  totalFreelancersHired: number;
  projectsCompleted: number;
  proposalsReceived: number;
  pendingProposals: number;
  recentActivities: ActivityItem[];
  activeProjectsList: Array<{
    id: string;
    title: string;
    budget: number;
    proposalCount: number;
    status: ProjectStatus;
    paymentProgress: number;
    postedAt: Date;
  }>;
  recentProposalsList: Array<{
    id: string;
    projectId: string;
    projectTitle: string;
    freelancerName: string;
    freelancerAvatar?: string;
    amount: number;
    status: string;
    submittedAt: Date;
  }>;
}

interface ClientDashboardProps {
  data: ClientDashboardData;
  isLoading?: boolean;
}

export function ClientDashboard({ data, isLoading }: ClientDashboardProps) {
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
          title="Total Spent"
          value={`$${data.totalSpent.toLocaleString()}`}
          icon={DollarSign}
          description="Across all projects"
          className="border-primary/20"
        />
        <MetricCard
          title="Active Projects"
          value={data.activeProjects}
          icon={Briefcase}
          description={`${data.projectsCompleted} completed`}
        />
        <MetricCard
          title="Freelancers Hired"
          value={data.totalFreelancersHired}
          icon={Users}
          description="Total collaborations"
        />
        <MetricCard
          title="Proposals Received"
          value={data.proposalsReceived}
          icon={FileText}
          description={`${data.pendingProposals} pending review`}
        />
      </div>

      {/* Active Projects & Recent Proposals */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Projects</CardTitle>
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
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">
                  No projects posted yet
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(paths.app.postProject.getHref())}
                >
                  Post a Project
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
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
                          Posted {formatDistanceToNow(new Date(project.postedAt), { addSuffix: true })}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={statusStyles[project.status]}
                      >
                        {formatStatus(project.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        ${project.budget.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {project.proposalCount} {project.proposalCount === 1 ? 'proposal' : 'proposals'}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Payment progress</span>
                        <span className="font-medium text-foreground">{project.paymentProgress}%</span>
                      </div>
                      <div className="w-full bg-muted h-1.5 rounded-full">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${project.paymentProgress}%` }}
                        />
                      </div>
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
            {data.recentProposalsList.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No proposals received yet
              </p>
            ) : (
              <div className="space-y-3">
                {data.recentProposalsList.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => router.push(paths.app.projectDetail.getHref(proposal.projectId))}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <Avatar className="w-8 h-8">
                        {proposal.freelancerAvatar ? (
                          <img src={proposal.freelancerAvatar} alt={proposal.freelancerName} />
                        ) : (
                          <AvatarFallback className="text-xs">
                            {proposal.freelancerName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{proposal.freelancerName}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {proposal.projectTitle}
                        </p>
                      </div>
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
                    <div className="flex items-center justify-between text-xs text-muted-foreground ml-11">
                      <span className="font-medium text-foreground">
                        ${proposal.amount.toLocaleString()}
                      </span>
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
