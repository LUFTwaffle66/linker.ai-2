import { Card, CardContent } from '@/components/ui/card';

interface BalanceCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  footerText?: string;
  helperText?: string;
}

export function BalanceCard({ title, amount, icon, footerText, helperText }: BalanceCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          {icon}
        </div>
        <p className="text-3xl mb-1">${amount.toLocaleString()}</p>
        {footerText && <p className="text-xs text-muted-foreground">{footerText}</p>}
        {helperText && <p className="text-xs text-muted-foreground mt-1">{helperText}</p>}
      </CardContent>
    </Card>
  );
}
