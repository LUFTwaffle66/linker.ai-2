import { DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { Control } from 'react-hook-form';

interface BudgetTimelineSectionProps {
  control: Control<any>;
  projectBudget: string;
  projectTimeline: string;
}

export function BudgetTimelineSection({
  control,
  projectBudget,
  projectTimeline,
}: BudgetTimelineSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget & Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="totalBudget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Project Budget *</FormLabel>
              <FormControl>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="number"
                    placeholder="10,000"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Client budget range: {projectBudget}
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
              <FormControl>
                <Input
                  placeholder="e.g., 4 weeks"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Client preferred timeline: {projectTimeline}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
