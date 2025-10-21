import { CheckCircle, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MOCK_FREELANCERS } from './constants';

interface ReviewStepProps {
  formData: {
    title: string;
    category: string;
    description: string;
    skills: string[];
    budgetAmount: string;
    timeline: string;
  };
  selectedFreelancers: string[];
  attachments: File[];
  onBack: () => void;
}

export function ReviewStep({
  formData,
  selectedFreelancers,
  attachments,
  onBack,
}: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Your Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ReviewItem label="Project Title" value={formData.title} />

          <div>
            <h3 className="font-medium mb-2">Category</h3>
            <Badge variant="secondary">
              {formData.category || 'Not selected'}
            </Badge>
          </div>

          <ReviewItem
            label="Description"
            value={formData.description || 'No description provided'}
          />

          <div>
            <h3 className="font-medium mb-2">Required Skills & Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {formData.skills.length > 0 ? (
                formData.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No skills selected</p>
              )}
            </div>
          </div>

          <ReviewItem
            label="Project Budget"
            value={formData.budgetAmount ? `$${formData.budgetAmount}` : 'Not specified'}
          />

          <ReviewItem
            label="Timeline"
            value={formData.timeline || 'Not specified'}
          />

          {selectedFreelancers.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Invited AI Experts</h3>
              <div className="space-y-2">
                {selectedFreelancers.map((freelancerId) => {
                  const freelancer = MOCK_FREELANCERS.find(
                    (f) => f.id === freelancerId
                  );
                  return freelancer ? (
                    <div
                      key={freelancerId}
                      className="flex items-center gap-3 p-2 bg-muted rounded"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{freelancer.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{freelancer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {freelancer.title}
                        </p>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {attachments.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Attachments</h3>
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Paperclip className="w-4 h-4" />
                    <span>{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-green-500/10 border-green-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Ready to Post</h4>
              <p className="text-sm text-muted-foreground">
                Once you submit, your project will be visible to qualified AI
                experts.
                {selectedFreelancers.length > 0 &&
                  ` ${selectedFreelancers.length} invited expert${selectedFreelancers.length !== 1 ? 's' : ''} will be notified immediately.`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Invite Experts
        </Button>
        <Button type="submit" size="lg">
          Post Project
        </Button>
      </div>
    </div>
  );
}

interface ReviewItemProps {
  label: string;
  value: string;
  capitalize?: boolean;
}

function ReviewItem({ label, value, capitalize }: ReviewItemProps) {
  return (
    <div>
      <h3 className="font-medium mb-2">{label}</h3>
      <p className={`text-muted-foreground ${capitalize ? 'capitalize' : ''}`}>
        {value || 'Not specified'}
      </p>
    </div>
  );
}
