import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import type { Control } from 'react-hook-form';
import type { ProposalFormData } from '../../types';

interface CoverLetterSectionProps {
  control: Control<any>;
}

export function CoverLetterSection({ control }: CoverLetterSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Cover Letter
          <span className="text-destructive">*</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Introduce yourself and explain why you're the best fit for this project. Highlight your relevant experience, similar projects you've completed, and your approach to this specific project..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {field.value.length} / 5000 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
