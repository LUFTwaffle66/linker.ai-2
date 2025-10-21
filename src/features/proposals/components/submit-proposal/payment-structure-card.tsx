import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PaymentStructureCardProps {
  totalBudget: string;
}

export function PaymentStructureCard({ totalBudget }: PaymentStructureCardProps) {
  const budgetAmount = parseFloat(totalBudget);
  const upfrontAmount = budgetAmount / 2;
  const finalAmount = budgetAmount / 2;

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckCircle className="w-5 h-5 text-primary" />
          Payment Structure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This project follows LinkerAI's secure 50/50 payment model. The client will pay 50% upfront when they hire you, and the remaining 50% upon successful completion and validation of your work.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <PaymentPhase
            phase={1}
            title="Upfront Payment"
            amount={upfrontAmount}
            description="Released when client hires you"
          />
          <PaymentPhase
            phase={2}
            title="Final Payment"
            amount={finalAmount}
            description="Released upon project completion"
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface PaymentPhaseProps {
  phase: number;
  title: string;
  amount: number;
  description: string;
}

function PaymentPhase({ phase, title, amount, description }: PaymentPhaseProps) {
  return (
    <div className="bg-background rounded-lg p-4 border">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-primary font-medium">{phase}</span>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="font-medium text-green-600">
            ${amount.toLocaleString()}
          </p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
