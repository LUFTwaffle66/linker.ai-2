'use client';

import { useState } from 'react';
import {
  CheckCircle, Star, MapPin, Briefcase, Globe, Award, MessageSquare, TrendingUp
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type Expert } from '@/types/browse';
import { cn } from '@/lib/utils';
import { AuthRequiredDialog } from './auth-required-dialog';

interface FreelancerDetailSheetProps {
  freelancer: Expert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendMessage?: (freelancer: Expert) => void;
  isAuthenticated?: boolean;
}

export function FreelancerDetailSheet({
  freelancer,
  open,
  onOpenChange,
  onSendMessage,
  isAuthenticated = false
}: FreelancerDetailSheetProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  if (!freelancer) return null;

  const handleSendMessage = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }
    onSendMessage?.(freelancer);
    onOpenChange(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20 flex-shrink-0">
                <AvatarFallback className="text-xl">{freelancer.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <SheetTitle className="text-2xl">{freelancer.name}</SheetTitle>
                  {freelancer.verified && (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
                <SheetDescription className="mb-2">{freelancer.title}</SheetDescription>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{freelancer.rating}</span>
                    <span className="text-muted-foreground">({freelancer.reviews} reviews)</span>
                  </div>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {freelancer.location}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    {freelancer.completedProjects} projects
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-medium text-primary">{freelancer.hourlyRate}</p>
                <p className="text-sm text-muted-foreground">per hour</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {freelancer.topRated && (
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Top Rated
                </Badge>
              )}
              <Badge
                className={cn(
                  freelancer.available
                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                    : 'bg-muted'
                )}
              >
                {freelancer.available ? 'Available' : 'Busy'}
              </Badge>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 px-6 py-6">
            <div className="space-y-6">
              {/* About */}
              <div>
                <h3 className="font-medium mb-3">About</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {freelancer.description}
                </p>
              </div>

              <Separator />

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                  <p className="text-xl font-medium">{freelancer.successRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Response Time</p>
                  <p className="text-xl font-medium">{freelancer.responseTime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Jobs Completed</p>
                  <p className="text-xl font-medium">{freelancer.completedProjects}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Reviews</p>
                  <p className="text-xl font-medium">{freelancer.reviews}</p>
                </div>
              </div>

              <Separator />

              {/* Portfolio Highlights */}
              {freelancer.portfolio && (
                <>
                  <div>
                    <h3 className="font-medium mb-3">Portfolio Highlights</h3>
                    <ul className="space-y-2">
                      {freelancer.portfolio.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Separator />
                </>
              )}

              {/* Skills */}
              <div>
                <h3 className="font-medium mb-3">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Certifications */}
              <div>
                <h3 className="font-medium mb-3">Certifications</h3>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Award className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">{freelancer.certification}</p>
                    <p className="text-sm text-muted-foreground">Verified certification</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Languages */}
              {freelancer.languages && (
                <div>
                  <h3 className="font-medium mb-3">Languages</h3>
                  <div className="space-y-2">
                    {freelancer.languages.map((lang, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{lang}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Action Button */}
          <div className="px-6 py-4 border-t bg-background">
            <Button
              className="w-full"
              size="lg"
              onClick={handleSendMessage}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>

      {/* Auth Required Dialog */}
      <AuthRequiredDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        action="message"
      />
    </>
  );
}
