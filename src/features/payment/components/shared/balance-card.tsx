import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface BalanceCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  footerText?: string;
  onAddFunds?: () => void;
}

export function BalanceCard({ title, amount, icon, footerText, onAddFunds }: BalanceCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          {icon}
        </div>
        <p className="text-3xl mb-1">${amount.toLocaleString()}</p>
        {footerText && <p className="text-xs text-muted-foreground">{footerText}</p>}
        {onAddFunds && (
          <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={onAddFunds}>
            <Plus className="w-3 h-3 mr-1" />
            Add Funds
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
