import { Star, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { FreelancerOption } from '../../types';

interface FreelancerCardProps {
  freelancer: FreelancerOption;
  overlapSkills?: string[];
  matchScore?: number;
  isSelected: boolean;
  onToggle: () => void;
}

export function FreelancerCard({
  freelancer,
  overlapSkills = [],
  matchScore = 0,
  isSelected,
  onToggle,
}: FreelancerCardProps) {
  const averageRating = freelancer.averageRating ?? freelancer.rating ?? null;
  const totalReviews = freelancer.totalReviews ?? freelancer.reviewCount ?? 0;
  const hasReviews = (totalReviews || 0) > 0;

  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected ? 'border-primary bg-primary/5' : 'hover:shadow-md'
      }`}
      onClick={onToggle}
    >
      <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="w-12 h-12">
            <AvatarFallback>{freelancer.avatar?.slice(0, 2) || 'AI'}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{freelancer.name}</h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {freelancer.title}
                  </p>
                  {matchScore > 0 && (
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      {matchScore} skill{matchScore !== 1 ? 's' : ''} match
                    </span>
                  )}
                </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {hasReviews ? (
                  <>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {(averageRating ?? 0).toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({totalReviews})
                    </span>
                  </>
                ) : (
                  <span className="text-xs font-medium text-muted-foreground">
                    New Talent
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              {freelancer.skills.slice(0, 3).map((skill) => {
                const isMatch = overlapSkills.includes(skill);
                return (
                  <Badge
                    key={skill}
                    variant={isMatch ? 'default' : 'secondary'}
                    className={`text-xs ${isMatch ? 'bg-green-500/80 text-white' : ''}`}
                  >
                    {skill}
                  </Badge>
                );
              })}
              {freelancer.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{freelancer.skills.length - 3}
                </Badge>
              )}
              {matchScore > 0 && (
                <Badge variant="outline" className="text-[10px] ml-1">
                  {matchScore} skill{matchScore !== 1 ? 's' : ''} match
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>{freelancer.completedProjects} projects completed</span>
            </div>
          </div>

          <div className="flex-shrink-0">
            {isSelected ? (
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-primary-foreground" />
              </div>
            ) : (
              <div className="w-6 h-6 border-2 border-muted-foreground rounded-full" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
