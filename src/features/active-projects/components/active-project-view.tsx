'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, DollarSign, TrendingUp } from 'lucide-react';
import { ProjectHeader } from './project-header';
import { ProjectMessagesTab } from './project-messages-tab';
import { ProjectPaymentTab } from './project-payment-tab';
import { ProjectUpdatesTab } from './project-updates-tab';
import { ProjectSidebar } from './project-sidebar';
import { useProject } from '../api/get-project';

interface ActiveProjectViewProps {
  projectId: string;
}

export function ActiveProjectView({ projectId }: ActiveProjectViewProps) {
  const [activeTab, setActiveTab] = useState('messages');
  const { data: project, isLoading } = useProject(projectId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <ProjectHeader project={project} />

        {/* Tabs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Tabs */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="messages" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Messages</span>
                </TabsTrigger>
                <TabsTrigger value="payment" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="hidden sm:inline">Payment</span>
                </TabsTrigger>
                <TabsTrigger value="updates" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Updates</span>
                </TabsTrigger>
              </TabsList>

              {/* Messages Tab */}
              <TabsContent value="messages">
                <ProjectMessagesTab projectId={projectId} />
              </TabsContent>

              {/* Payment Tab */}
              <TabsContent value="payment">
                <ProjectPaymentTab project={project} />
              </TabsContent>

              {/* Updates Tab */}
              <TabsContent value="updates">
                <ProjectUpdatesTab projectId={projectId} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <ProjectSidebar project={project} />
        </div>
      </div>
    </div>
  );
}
