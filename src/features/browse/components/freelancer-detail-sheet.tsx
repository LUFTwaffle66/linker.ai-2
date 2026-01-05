'use client';

import { useState } from 'react';
import { useAuth } from '@/features/auth/lib/auth-client';import { useRouter } from '@/i18n/routing';
import {
  CheckCircle, Star, MapPin, Briefcase, MessageSquare, TrendingUp
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
import { useCreateOrGetConversation } from '@/features/messaging';
import { paths } from '@/config/paths';
import { toast } from 'sonner';
import type { BrowseFreelancer } from '../types';
import { AuthRequiredDialog } from './auth-required-dialog';

interface FreelancerDetailSheetProps {
  freelancer: BrowseFreelancer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendMessage?: (freelancer: BrowseFreelancer) => void;
}

export function FreelancerDetailSheet({
  freelancer,
  open,
  onOpenChange,
  onSendMessage,
}: FreelancerDetailSheetProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const createOrGetConversation = useCreateOrGetConversation();

  if (!freelancer) return null;

  // Check if current user is viewing their own profile
  const isOwnProfile = user?.id === freelancer.user_id;

  const handleSendMessage = async () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }

    if (!user?.id) return;

    try {
      const conversationId = await createOrGetConversation.mutateAsync({
        userId1: user.id,
        userId2: freelancer.user_id,
      });
      toast.success('Conversation started!');
      router.push(paths.app.messages.getHref());
    } catch (error) {
      console.error('Failed to create or get conversation:', error);
      toast.error('Failed to start conversation. Please try again.');
    }
  };

  // Format hourly rate
  const formattedRate = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(freelancer.hourly_rate);

  // Calculate stats
  const completedProjects = freelancer.portfolio?.length || 0;
  const averageRating = freelancer.user.average_rating ?? null;
  const totalReviews = freelancer.user.total_reviews ?? 0;
  const hasReviews = (totalReviews || 0) > 0;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20 flex-shrink-0">
                {freelancer.user.avatar_url ? (
                  <img src={freelancer.user.avatar_url} alt={freelancer.user.full_name ?? ''} />
                ) : (
                  <AvatarFallback className="text-xl">
                    {freelancer.user.full_name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <SheetTitle className="text-2xl">{freelancer.user.full_name}</SheetTitle>
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                </div>
                <SheetDescription className="mb-2">{freelancer.title}</SheetDescription>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  {hasReviews ? (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{(averageRating ?? 0).toFixed(1)}</span>
                      <span className="text-muted-foreground">({totalReviews} reviews)</span>
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground">New Talent</span>
                  )}
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {freelancer.location}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    {completedProjects} projects
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-medium text-primary">{formattedRate}</p>
                <p className="text-sm text-muted-foreground">per hour</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {freelancer.experience >= 5 && (
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Top Rated
                </Badge>
              )}
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                Available
              </Badge>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 px-6 py-6">
            <div className="space-y-6">
              {/* About */}
              <div>
                <h3 className="font-medium mb-3">About</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {freelancer.bio}
                </p>
              </div>

              <Separator />

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Experience</p>
                  <p className="text-xl font-medium">{freelancer.experience} years</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Hourly Rate</p>
                  <p className="text-xl font-medium">{formattedRate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Projects Completed</p>
                  <p className="text-xl font-medium">{completedProjects}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Rating</p>
                  <div className="flex items-center gap-1">
                    {hasReviews ? (
                      <>
                        <p className="text-xl font-medium">{(averageRating ?? 0).toFixed(1)}</p>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      </>
                    ) : (
                      <p className="text-sm font-medium text-muted-foreground">New Talent</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Work Experience */}
              {freelancer.experience && (
                <>
                  <div>
                    <h3 className="font-medium mb-3">Work Experience</h3>
                    <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{freelancer.title}</p>
                            </div>
                            <p className="text-xs text-muted-foreground whitespace-nowrap">
                              {freelancer.experience} years
                            </p>
                          </div>
                        </div>
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Portfolio */}
              {freelancer.portfolio && freelancer.portfolio.length > 0 && (
                <>
                  <div>
                    <h3 className="font-medium mb-3">Portfolio</h3>
                    <div className="space-y-3">
                      {freelancer.portfolio.map((item, index) => (
                        <div key={index} className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-medium">{item.title}</p>
                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline"
                              >
                                View Project
                              </a>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                          {item.technologies && (item.technologies as string[]).length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {(item.technologies as string[]).map((tech: string, techIndex: number) => (
                                <Badge key={techIndex} variant="secondary" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
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

              {/* Location */}
              <div>
                <h3 className="font-medium mb-3">Location</h3>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{freelancer.location}</span>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-t bg-background">
            <div className="flex flex-col gap-3">
              {!isOwnProfile && (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleSendMessage}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => {
                  router.push(paths.app.freelancerProfile.getHref(freelancer.user_id));
                }}
              >
                View Full Profile
              </Button>
            </div>
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
