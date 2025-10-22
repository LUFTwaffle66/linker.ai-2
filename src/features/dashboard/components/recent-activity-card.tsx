import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  type: 'project' | 'proposal' | 'payment' | 'message';
  status?: string;
}

interface RecentActivityCardProps {
  activities: ActivityItem[];
  emptyMessage?: string;
}

export function RecentActivityCard({
  activities,
  emptyMessage = 'No recent activity',
}: RecentActivityCardProps) {
  const getStatusColor = (type: string, status?: string) => {
    if (status === 'accepted' || status === 'completed') return 'bg-green-500/10 text-green-500';
    if (status === 'rejected' || status === 'cancelled') return 'bg-red-500/10 text-red-500';
    if (status === 'pending' || status === 'in_progress') return 'bg-yellow-500/10 text-yellow-500';
    return 'bg-primary/10 text-primary';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            {emptyMessage}
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                {activity.status && (
                  <Badge
                    variant="secondary"
                    className={getStatusColor(activity.type, activity.status)}
                  >
                    {activity.status}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
