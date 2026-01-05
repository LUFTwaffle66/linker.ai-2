import { Search, UserPlus } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FreelancerCard } from './freelancer-card';
import { supabase } from '@/lib/supabase/client';

interface InviteExpertsStepProps {
  searchQuery: string;
  selectedFreelancers: string[];
  projectSkills: string[];
  onSearchChange: (value: string) => void;
  onToggleFreelancer: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function InviteExpertsStep({
  searchQuery,
  selectedFreelancers,
  projectSkills,
  onSearchChange,
  onToggleFreelancer,
  onBack,
  onNext,
}: InviteExpertsStepProps) {
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFreelancers() {
      // 1. Start Loading
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from('freelancer_profiles')
          .select(`
            *,
            user:users (
              id,
              full_name,
              avatar_url,
              projects:projects!projects_hired_freelancer_id_fkey ( status )
            )
          `);

        if (error) {
          console.error('Supabase Error fetching freelancers:', error);
          return;
        }

        if (data) {
          const mapped = data.map((profile: any) => {
            // Match Score
            const profileSkills = profile.skills || [];
            const matchCount = profileSkills.filter((skill: string) => 
              projectSkills.includes(skill)
            ).length;

            // Projects Completed (Case Insensitive)
            const userProjects = profile.user?.projects || [];
            const completedCount = userProjects.filter(
              (p: any) => p.status?.toLowerCase() === 'completed'
            ).length;

            // Display Title
            const displayTitle = profile.title || profile.job_title || 'Freelancer';

            return {
              id: profile.user?.id || profile.id,
              profileId: profile.id,
              name: profile.user?.full_name || 'Unknown Freelancer',
              title: displayTitle,
              skills: profileSkills,
              hourlyRate: profile.hourly_rate || 0,
              avatarUrl: profile.user?.avatar_url || '',
              matchScore: matchCount,
              projectsCompleted: completedCount,
            };
          });

          // Sort by Match Score
          const sorted = mapped.sort((a, b) => b.matchScore - a.matchScore);
          setFreelancers(sorted);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        // 4. STOP LOADING
        setLoading(false);
      }
    }

    fetchFreelancers();
  }, [projectSkills, selectedFreelancers.length]);

  const scoredFreelancers = useMemo(() => {
    return freelancers
      .map((freelancer) => {
        const overlap = (freelancer.skills || []).filter((skill: string) => projectSkills.includes(skill));
        const score = overlap.length;
        const completedProjects =
          freelancer.projectsCompleted ??
          freelancer.total_projects_completed ??
          freelancer.projects_completed ??
          freelancer.portfolio?.length ??
          0;
        return {
          id: freelancer.user_id || freelancer.id,
          name: freelancer.user?.full_name || '',
          title: freelancer.title,
          avatar: freelancer.user?.avatar_url || '',
          skills: freelancer.skills || [],
          hourlyRate: freelancer.hourly_rate,
          completedProjects,
          overlapSkills: overlap,
          score,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [freelancers, projectSkills]);

  // Auto-select top 3 freelancers with at least 1 matching skill on mount
  useEffect(() => {
    if (!selectedFreelancers.length && projectSkills.length > 0) {
      const topMatches = scoredFreelancers.filter((f) => f.score > 0).slice(0, 3);
      topMatches.forEach((f) => onToggleFreelancer(f.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Loading...</p>
              </div>
            ) : scoredFreelancers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No AI experts found matching your search</p>
              </div>
            ) : (
              scoredFreelancers.map((freelancer) => (
                <FreelancerCard
                  key={freelancer.id}
                  freelancer={{
                    id: freelancer.id,
                    name: freelancer.name,
                    title: freelancer.title,
                    avatar: freelancer.avatar,
                    averageRating: null,
                    totalReviews: 0,
                    skills: freelancer.skills,
                    hourlyRate: freelancer.hourlyRate,
                    completedProjects: freelancer.completedProjects,
                  }}
                  overlapSkills={freelancer.overlapSkills}
                  matchScore={freelancer.score}
                  isSelected={selectedFreelancers.includes(freelancer.id)}
                  onToggle={() => onToggleFreelancer(freelancer.id)}
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
