import { Calculator, Clock, Lightbulb, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { Control } from 'react-hook-form';
import { PaymentInfoCard } from './payment-info-card';

interface BudgetTimelineStepProps {
  control: Control<any>;
  onBack: () => void;
  onNext: () => void;
}

export function BudgetTimelineStep({
  control,
  onBack,
  onNext,
}: BudgetTimelineStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Budget & Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Estimation Guide */}
          <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-medium">
              <Lightbulb className="w-4 h-4" />
              <span>How to estimate?</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-foreground font-medium text-xs uppercase tracking-wide">
                  <Calculator className="w-3 h-3" /> Budget (ROI Method)
                </div>
                <p>
                  Don&apos;t guess. Calculate the value:
                  <br />
                  <span className="italic">
                    &quot;If this tool saves me 10 hours/month at $50/hr, that&apos;s $500/mo value.&quot;
                  </span>
                </p>
                <p className="text-foreground/90 font-medium">
                  → Recommendation: Budget 3-4 months of that value (e.g., $1,500 - $2,000).
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-foreground font-medium text-xs uppercase tracking-wide">
                  <Clock className="w-3 h-3" /> Realistic Timeline
                </div>
                <ul className="list-disc list-inside space-y-1 ml-1">
                  <li>
                    <strong>1-2 Weeks:</strong> Simple scripts &amp; automations.
                  </li>
                  <li>
                    <strong>4-8 Weeks:</strong> Custom dashboards or tools.
                  </li>
                  <li>
                    <strong>3+ Months:</strong> Complex AI products.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <FormField
            control={control}
            name="budgetAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Budget *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="25000"
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Total project budget for the complete solution
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="timeline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Timeline *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="less-than-1-week">
                      Less than 1 week
                    </SelectItem>
                    <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                    <SelectItem value="1-month">1 month</SelectItem>
                    <SelectItem value="2-3-months">2-3 months</SelectItem>
                    <SelectItem value="3-6-months">3-6 months</SelectItem>
                    <SelectItem value="more-than-6-months">
                      More than 6 months
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <PaymentInfoCard />
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Project Details
        </Button>
        <Button type="button" onClick={onNext}>
          Continue to Invite Experts
        </Button>
      </div>
    </div>
  );
}
