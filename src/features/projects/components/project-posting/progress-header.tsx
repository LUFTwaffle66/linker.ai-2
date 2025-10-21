import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS = [
  'Project Details',
  'Budget & Timeline',
  'Invite Experts',
  'Review & Submit',
] as const;

export function ProgressHeader({ currentStep, totalSteps }: ProgressHeaderProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
        <div className="grid grid-cols-4 gap-2 mt-4 text-xs sm:text-sm">
          {STEP_LABELS.map((label, index) => (
            <span
              key={label}
              className={
                currentStep >= index + 1
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground'
              }
            >
              {label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
