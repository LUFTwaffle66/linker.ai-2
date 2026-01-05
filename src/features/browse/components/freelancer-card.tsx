'use client';

import { Star, MapPin, Briefcase, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { BrowseFreelancer } from '../types';

interface FreelancerCardProps {
  freelancer: BrowseFreelancer;
  onClick?: (freelancer: BrowseFreelancer) => void;
  className?: string;
}

export function FreelancerCard({ freelancer, onClick, className }: FreelancerCardProps) {
  // Format hourly rate
  const formattedRate = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(freelancer.hourly_rate);

  // Count completed projects from portfolio
  const completedProjects = freelancer.portfolio?.length || 0;
  const averageRating = freelancer.user.average_rating ?? null;
  const totalReviews = freelancer.user.total_reviews ?? 0;
  const hasReviews = (totalReviews || 0) > 0;

  return (
    <Card
      className={cn(
        'hover:shadow-md transition-shadow cursor-pointer',
        className
      )}
      onClick={() => onClick?.(freelancer)}
    >
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-start gap-4 flex-1">
            <Avatar className="w-16 h-16 flex-shrink-0">
              {freelancer.user.avatar_url ? (
                <img src={freelancer.user.avatar_url} alt={freelancer.user.full_name} />
              ) : (
                <AvatarFallback className="text-xl">
                  {freelancer.user.full_name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-medium text-lg">{freelancer.user.full_name}</h3>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>

              <p className="text-muted-foreground mb-2">{freelancer.title}</p>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                {hasReviews ? (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {(averageRating ?? 0).toFixed(1)}
                    </span>
                    <span>({totalReviews} reviews)</span>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-muted-foreground">New Talent</span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {freelancer.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {completedProjects} projects
                </span>
              </div>

              <p className="text-muted-foreground mb-3 text-sm line-clamp-2">
                {freelancer.bio}
              </p>

              <div className="flex flex-wrap gap-2">
                {freelancer.skills.slice(0, 4).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {freelancer.skills.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{freelancer.skills.length - 4}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:min-w-[140px]">
            <div className="text-center sm:text-right">
              <p className="font-medium text-lg text-primary">{formattedRate}</p>
              <p className="text-sm text-muted-foreground">per hour</p>
            </div>

            <div className="flex items-center gap-2">
              {freelancer.experience >= 5 && (
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs whitespace-nowrap">
                  Top Rated
                </Badge>
              )}
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                Available
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
