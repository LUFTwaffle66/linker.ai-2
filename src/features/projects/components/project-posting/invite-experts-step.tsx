import { Search, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FreelancerCard } from './freelancer-card';
import { useBrowseFreelancers } from '@/features/browse';
import type { FreelancerOption } from '../../types';

interface InviteExpertsStepProps {
  searchQuery: string;
  selectedFreelancers: string[];
  onSearchChange: (value: string) => void;
  onToggleFreelancer: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function InviteExpertsStep({
  searchQuery,
  selectedFreelancers,
  onSearchChange,
  onToggleFreelancer,
  onBack,
  onNext,
}: InviteExpertsStepProps) {
  const { data: freelancers, isLoading, error } = useBrowseFreelancers({ search: searchQuery });

  const filteredFreelancers = freelancers || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invite AI Experts (Optional)</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Search and invite specific AI experts to submit proposals for your
            project
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Bar */}
          <div>
            <Label htmlFor="freelancer-search">Search AI Experts</Label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="freelancer-search"
                placeholder="Search by name, skills, or expertise..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Find experts by their name, skills (e.g., GPT-4, TensorFlow), or
              specialization
            </p>
          </div>

          {/* Selected Count */}
          {selectedFreelancers.length > 0 && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <p className="text-sm font-medium text-primary">
                <UserPlus className="w-4 h-4 inline mr-1" />
                {selectedFreelancers.length} expert
                {selectedFreelancers.length !== 1 ? 's' : ''} will be invited to
                submit proposals
              </p>
            </div>
          )}

          {/* Freelancer Results */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Loading...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">
                <p>Error loading freelancers.</p>
              </div>
            ) : filteredFreelancers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No AI experts found matching your search</p>
              </div>
            ) : (
              filteredFreelancers.map((freelancer) => (
                <FreelancerCard
                  key={freelancer.id}
                  freelancer={{
                    id: freelancer.user_id,
                    name: freelancer.user.full_name || '',
                    title: freelancer.title,
                    avatar: freelancer.user.avatar_url || '',
                    rating: 4.9,
                    reviewCount: 87,
                    skills: freelancer.skills,
                    hourlyRate: freelancer.hourly_rate,
                    completedProjects: freelancer.portfolio?.length || 0,
                  }}
                  isSelected={selectedFreelancers.includes(freelancer.user_id)}
                  onToggle={() => onToggleFreelancer(freelancer.user_id)}
                />
              ))
            )}
          </div>

          {/* Info Box */}
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <UserPlus className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium mb-1">How Invitations Work</h4>
                  <p className="text-sm text-muted-foreground">
                    Invited experts will receive a notification and can view your
                    project details. They can choose to submit a proposal if
                    interested. You can still receive proposals from other experts
                    not on this list.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Budget & Timeline
        </Button>
        <Button type="button" onClick={onNext}>
          {selectedFreelancers.length > 0
            ? 'Continue to Review'
            : 'Skip & Continue to Review'}
        </Button>
      </div>
    </div>
  );
}
