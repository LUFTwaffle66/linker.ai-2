import { CheckCircle, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import type { Project } from '@/types/browse';

interface ClientInfoCardProps {
  client: Project['client'];
  proposalCount: number;
}

export function ClientInfoCard({ client, proposalCount }: ClientInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Client Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarFallback>
              {client.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium">{client.name}</p>
              {client.verified && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{client.rating}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          <ClientStat
            label="Total Spent"
            value={client.spent}
          />
          <ClientStat
            label="Proposals"
            value={proposalCount.toString()}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface ClientStatProps {
  label: string;
  value: string;
}

function ClientStat({ label, value }: ClientStatProps) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
