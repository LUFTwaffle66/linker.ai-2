'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DollarSign, Clock, Calendar, CheckCircle, Paperclip, Plus, X, Star, Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { type Project } from '@/types/browse';
import { paths } from '@/config/paths';
import { proposalSchema, type ProposalFormData } from '../types';

interface SubmitProposalFormProps {
  project?: Project;
  onProposalSubmitted?: () => void;
}

export function SubmitProposalForm({ project: propProject, onProposalSubmitted }: SubmitProposalFormProps) {
  const router = useRouter();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  // Project details (use prop if provided, otherwise use default)
  const project = propProject || {
    id: 1,
    title: 'AI Chatbot for E-commerce Support',
    category: 'AI Chatbot',
    budget: '$8,000 - $12,000',
    timeline: '3-4 weeks',
    description: 'Need an AI-powered chatbot using GPT-4 to handle customer support inquiries for our e-commerce platform. Must integrate with our existing CRM and handle 1000+ daily queries.',
    skills: ['GPT-4', 'Python', 'API Integration', 'Natural Language Processing'],
    postedDate: '2 days ago',
    proposals: 12,
    client: {
      name: 'ShopHub Inc',
      rating: 4.9,
      verified: true,
      spent: '$45K+',
    }
  };

  const form = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      coverLetter: '',
      budgetType: 'fixed',
      totalBudget: '',
      hourlyRate: '',
      estimatedHours: '',
      timeline: '',
      attachments: [],
    },
  });

  const budgetType = form.watch('budgetType');
  const totalBudget = form.watch('totalBudget');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments([...attachments, ...files]);
    form.setValue('attachments', [...attachments, ...files]);
  };

  const removeFile = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
    form.setValue('attachments', newAttachments);
  };

  const onSubmit = (data: ProposalFormData) => {
    console.log('Proposal data:', data);
    // TODO: Submit to API
    setShowSuccessDialog(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    if (onProposalSubmitted) {
      onProposalSubmitted();
    } else {
      router.push(paths.public.browse.getHref({ tab: 'projects' }));
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl mb-2">Submit Proposal</h1>
          <p className="text-muted-foreground">
            Submit your proposal to work on this project
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Cover Letter */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Cover Letter
                      <span className="text-destructive">*</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
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

                {/* Budget & Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Budget & Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Budget Type */}
                    <FormField
                      control={form.control}
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
                        control={form.control}
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
                              Client budget range: {project.budget}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
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
                          control={form.control}
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
                      control={form.control}
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
                            Client preferred timeline: {project.timeline}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Payment Structure Info */}
                {budgetType === 'fixed' && totalBudget && (
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
                        <div className="bg-background rounded-lg p-4 border">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-primary font-medium">1</span>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Upfront Payment</p>
                              <p className="font-medium text-green-600">
                                ${(parseFloat(totalBudget) / 2).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">Released when client hires you</p>
                        </div>

                        <div className="bg-background rounded-lg p-4 border">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-primary font-medium">2</span>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Final Payment</p>
                              <p className="font-medium text-green-600">
                                ${(parseFloat(totalBudget) / 2).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">Released upon project completion</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Attachments */}
                <Card>
                  <CardHeader>
                    <CardTitle>Attachments (Optional)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Paperclip className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-3">
                        Add relevant files (portfolio samples, certifications, technical docs)
                      </p>
                      <label htmlFor="file-upload">
                        <Button variant="outline" size="sm" asChild>
                          <span className="cursor-pointer">
                            <Plus className="w-4 h-4 mr-2" />
                            Choose Files
                          </span>
                        </Button>
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>

                    {attachments.length > 0 && (
                      <div className="space-y-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-2">
                              <Paperclip className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{file.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              type="button"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex items-center gap-4">
                  <Button type="submit" size="lg" className="flex-1">
                    Submit Proposal
                  </Button>
                  <Button type="button" variant="outline" size="lg">
                    Save Draft
                  </Button>
                </div>
              </div>

              {/* Sidebar - Project Info */}
              <div className="space-y-6">
                {/* Project Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Project Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">{project.title}</h3>
                      <Badge variant="outline">{project.category}</Badge>
                    </div>

                    <Separator />

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        <span>{project.budget}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{project.timeline}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Posted {project.postedDate}</span>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm text-muted-foreground mb-3">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {project.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Client Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Client Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>
                          {project.client.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{project.client.name}</p>
                          {project.client.verified && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{project.client.rating}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Spent</span>
                        <span className="font-medium">{project.client.spent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Proposals</span>
                        <span className="font-medium">{project.proposals}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tips */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="w-5 h-5 text-primary" />
                      Tips for Success
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>✓ Personalize your cover letter to this specific project</p>
                    <p>✓ Highlight relevant experience and similar projects</p>
                    <p>✓ Be realistic with timeline and budget estimates</p>
                    <p>✓ Break down complex projects into clear milestones</p>
                    <p>✓ Attach portfolio samples or case studies</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">Proposal Submitted Successfully!</DialogTitle>
            <DialogDescription className="text-center pt-2">
              Your proposal for "{project.title}" has been submitted to {project.client.name}.
              You'll be notified when the client reviews your proposal.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-2 mt-4">
            <Button
              size="lg"
              className="w-full"
              onClick={handleSuccessClose}
            >
              Browse More Projects
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => setShowSuccessDialog(false)}
            >
              View My Proposals
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
