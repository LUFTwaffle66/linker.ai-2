import { DollarSign, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { Control } from 'react-hook-form';
import type { ProposalFormData } from '../../types';

interface BudgetTimelineSectionProps {
  control: Control<any>;
  budgetType: 'fixed' | 'hourly';
  projectBudget: string;
  projectTimeline: string;
}

export function BudgetTimelineSection({
  control,
  budgetType,
  projectBudget,
  projectTimeline,
}: BudgetTimelineSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget & Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Budget Type */}
        <FormField
          control={control}
          name="budgetType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How would you like to be paid? *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed" className="cursor-pointer font-normal">
                      Fixed Price - Pay a set amount for the entire project
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hourly" id="hourly" />
                    <Label htmlFor="hourly" className="cursor-pointer font-normal">
                      Hourly Rate - Pay per hour worked
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {budgetType === 'fixed' ? (
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
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hourly Rate *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        type="number"
                        placeholder="125"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="estimatedHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Hours</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        type="number"
                        placeholder="80"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

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
