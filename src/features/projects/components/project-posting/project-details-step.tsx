import { Upload, X, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { Control } from 'react-hook-form';
import { CATEGORIES, SKILLS } from './constants';

interface ProjectDetailsStepProps {
  control: Control<any>;
  skills: string[];
  attachments: File[];
  onToggleSkill: (skill: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onNext: () => void;
}

export function ProjectDetailsStep({
  control,
  skills,
  attachments,
  onToggleSkill,
  onFileUpload,
  onRemoveFile,
  onNext,
}: ProjectDetailsStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., AI Chatbot for customer support automation"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Write a clear, descriptive title for your AI automation
                  project
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your AI automation needs in detail. Include current processes, desired outcomes, data sources, integration requirements, expected volume/scale, and any technical constraints..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {field.value.length} / 5000 characters. Minimum 100 characters
                  required.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Required Skills & Technologies *</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.map((skill) => (
                      <Badge
                        key={skill}
                        variant={skills.includes(skill) ? 'default' : 'outline'}
                        className="cursor-pointer hover:bg-primary/90"
                        onClick={() => onToggleSkill(skill)}
                      >
                        {skill}
                        {skills.includes(skill) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </FormControl>
                <FormDescription>
                  Select all skills and technologies required for this project
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Label>Project Attachments (Optional)</Label>
            <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Upload requirements docs, diagrams, data samples, or
                specifications
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                onChange={onFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Choose Files
              </Button>
            </div>

            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-muted p-2 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveFile(index)}
                      className="h-6 w-6"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="button" onClick={onNext}>
          Continue to Budget & Timeline
        </Button>
      </div>
    </div>
  );
}
