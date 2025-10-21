import { Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function PaymentInfoCard() {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">Secure Payment Structure</h4>
            <p className="text-sm text-muted-foreground">
              LinkerAI uses a 50/50 payment model: You'll pay 50% upfront when
              you hire an AI expert, and the remaining 50% upon successful
              completion and validation of the work.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <PaymentPhase
                label="Upfront Payment"
                percentage="50% on hire"
              />
              <PaymentPhase
                label="Final Payment"
                percentage="50% on completion"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface PaymentPhaseProps {
  label: string;
  percentage: string;
}

function PaymentPhase({ label, percentage }: PaymentPhaseProps) {
  return (
    <div className="bg-background/80 rounded-lg p-3">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="font-medium text-primary">{percentage}</p>
    </div>
  );
}
