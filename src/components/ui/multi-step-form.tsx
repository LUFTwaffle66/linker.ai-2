'use client';

import { type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface Step {
  num: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MultiStepFormProps {
  currentStep: number;
  totalSteps: number;
  steps: Step[];
  title: string;
  subtitle: string;
  children: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  onComplete?: () => void;
  canGoNext?: boolean;
  canGoBack?: boolean;
  showSkip?: boolean;
  nextLabel?: string;
  completeLabel?: string;
}

export function MultiStepForm({
  currentStep,
  totalSteps,
  steps,
  title,
  subtitle,
  children,
  onNext,
  onBack,
  onSkip,
  onComplete,
  canGoNext = true,
  canGoBack = true,
  showSkip = true,
  nextLabel = 'Next',
  completeLabel = 'Complete Setup',
}: MultiStepFormProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-primary mb-4">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-8 px-4">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div key={step.num} className="flex flex-col items-center flex-1 relative">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all z-10',
                    currentStep > step.num
                      ? 'bg-primary text-primary-foreground'
                      : currentStep === step.num
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {currentStep > step.num ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs hidden sm:block',
                    currentStep >= step.num ? 'text-foreground font-medium' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'hidden md:block absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5',
                      currentStep > step.num ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-6 sm:p-8">{children}</CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <div>
            {currentStep > 1 && canGoBack && (
              <Button variant="outline" onClick={onBack} className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {showSkip && (
              <Button variant="ghost" onClick={onSkip} className="text-muted-foreground">
                Skip for now
              </Button>
            )}

            {!isLastStep ? (
              <Button onClick={onNext} disabled={!canGoNext} className="gap-2">
                {nextLabel}
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={onComplete} disabled={!canGoNext} className="gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {completeLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
