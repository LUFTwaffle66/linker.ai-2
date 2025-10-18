'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  CheckCircle,
  DollarSign,
  File,
  MessageSquare,
  AlertCircle,
  Target,
} from 'lucide-react';
import { useProjectUpdates } from '../api/get-project-updates';
import type { UpdateType } from '../types';

interface ProjectUpdatesTabProps {
  projectId: string;
}

const getUpdateIcon = (type: UpdateType) => {
  switch (type) {
    case 'milestone_completed':
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case 'milestone_started':
      return <Target className="w-5 h-5 text-primary" />;
    case 'payment_released':
      return <DollarSign className="w-5 h-5 text-green-600" />;
    case 'file_uploaded':
      return <File className="w-5 h-5 text-cyan-600" />;
    case 'message':
      return <MessageSquare className="w-5 h-5 text-primary" />;
    default:
      return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
  }
};

export function ProjectUpdatesTab({ projectId }: ProjectUpdatesTabProps) {
  const { data: updates, isLoading } = useProjectUpdates(projectId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading updates...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Activity</CardTitle>
        <CardDescription>Recent updates and activity on this project</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {updates?.map((update) => (
            <div
              key={update.id}
              className="flex gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                {getUpdateIcon(update.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-medium">{update.title}</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {update.timestamp}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{update.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Avatar className="w-4 h-4">
                    <AvatarFallback className="text-[8px]">{update.avatar}</AvatarFallback>
                  </Avatar>
                  <span>{update.user}</span>
                  <span>•</span>
                  <span>{update.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
