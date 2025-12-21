'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Star,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  MessageSquare,
  Share2,
  Calendar as CalendarIcon,
  ExternalLink,
  Shield,
  Award,
  Pencil,
  Plus
} from 'lucide-react';
import { paths } from '@/config/paths';
import { ShareProfileDialog } from './share-profile-dialog';
import { EditAboutDialog } from './edit-about-dialog';
import { EditSkillsDialog } from './edit-skills-dialog';
import { EditPortfolioDialog } from './edit-portfolio-dialog';
import { EditExperienceDialog } from './edit-experience-dialog';
import {
  useUpdateFreelancerBio,
  useUpdateFreelancerSkills,
  useAddFreelancerPortfolio,
  useAddFreelancerExperience,
} from '../hooks/use-profile-mutations';
import type { FreelancerProfileData } from '../types';
import { useAuth } from '@/features/auth/lib/auth-client';

interface FreelancerProfileProps {
  profile: FreelancerProfileData;
  freelancerId: string;
  isOwnProfile?: boolean;
  onNavigateToMessages?: () => void;
}

export function FreelancerProfile({ profile, freelancerId, isOwnProfile = false, onNavigateToMessages }: FreelancerProfileProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [editAboutOpen, setEditAboutOpen] = useState(false);
  const [editSkillsOpen, setEditSkillsOpen] = useState(false);
  const [editPortfolioOpen, setEditPortfolioOpen] = useState(false);
  const [editExperienceOpen, setEditExperienceOpen] = useState(false);

  // React Query mutation hooks
  const updateBioMutation = useUpdateFreelancerBio();
  const updateSkillsMutation = useUpdateFreelancerSkills();
  const addPortfolioMutation = useAddFreelancerPortfolio();
  const addExperienceMutation = useAddFreelancerExperience();

  const handleSendMessage = () => {
    if (onNavigateToMessages) {
      onNavigateToMessages();
    } else {
      router.push(paths.app.messages.getHref());
    }
  };

  const handleShare = () => {
    setShareDialogOpen(true);
  };

  // Edit handlers with React Query mutations
  const handleSaveBio = async (bio: string) => {
    await updateBioMutation.mutateAsync({ userId: freelancerId, bio });
    setEditAboutOpen(false);
  };

  const handleSaveSkills = async (skills: string[]) => {
    await updateSkillsMutation.mutateAsync({ userId: freelancerId, skills });
    setEditSkillsOpen(false);
  };

  const handleSavePortfolio = async (item: {
    title: string;
    description: string;
    tags: string[];
    imageUrl?: string;
    url?: string;
  }) => {
    await addPortfolioMutation.mutateAsync({
      userId: freelancerId,
      portfolioItem: item,
    });
    setEditPortfolioOpen(false);
  };

  const handleSaveExperience = async (experience: {
    position: string;
    company: string;
    period: string;
    description: string;
  }) => {
    await addExperienceMutation.mutateAsync({ userId: freelancerId, experience });
    setEditExperienceOpen(false);
  };

  const isSelf = isOwnProfile || user?.id === freelancerId || user?.id === profile.id;

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0]?.[0] || ''}${names[1]?.[0] || ''}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center md:items-start">
                    <Avatar className="w-24 h-24 mb-4">
                      <AvatarImage src={profile.avatar} />
                      <AvatarFallback className="text-xl">{getInitials(profile.name)}</AvatarFallback>
                    </Avatar>
                    {profile.verified && (
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600">Verified AI Expert</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      {profile.reviewCount > 0 ? (
                        <>
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{profile.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground">({profile.reviewCount} reviews)</span>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">(0 reviews)</span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h1 className="text-2xl mb-2">{profile.name}</h1>
                        <p className="text-lg text-muted-foreground mb-3">{profile.title}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          {profile.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{profile.location}</span>
                            </div>
                          )}
                          {profile.timezone && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{profile.timezone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>${profile.hourlyRate.min}-${profile.hourlyRate.max}/hour</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {profile.skills.slice(0, 5).map((skill) => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 min-w-[200px]">
                        {!isSelf && (
                          <Button className="w-full" onClick={handleSendMessage}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Contact {profile.name.split(' ')[0]}
                          </Button>
                        )}
                        <Button variant="outline" className="w-full" onClick={handleShare}>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Content Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>About Me</CardTitle>
                    {isOwnProfile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditAboutOpen(true)}
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {profile.bio ? (
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {profile.bio}
                      </p>
                    ) : isOwnProfile ? (
                      <p className="text-muted-foreground italic">
                        No bio added yet. Click Edit to add your bio.
                      </p>
                    ) : (
                      <p className="text-muted-foreground italic">No bio available</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>Skills & Expertise</CardTitle>
                    {isOwnProfile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditSkillsOpen(true)}
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {profile.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-sm py-1 px-3">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : isOwnProfile ? (
                      <p className="text-muted-foreground italic">
                        No skills added yet. Click Edit to add your skills.
                      </p>
                    ) : (
                      <p className="text-muted-foreground italic">No skills listed</p>
                    )}
                  </CardContent>
                </Card>

                {profile.certifications.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Certifications & Achievements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {profile.certifications.map((cert, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            {cert.status === 'Current' ? (
                              <Shield className="w-5 h-5 text-green-500" />
                            ) : (
                              <Award className="w-5 h-5 text-gray-500" />
                            )}
                            <div>
                              <p className="font-medium">{cert.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {cert.issuer} {cert.credentialId && `• ID: ${cert.credentialId}`} ({cert.status})
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-6">
                {profile.portfolio.length > 0 ? (
                  <>
                    {isOwnProfile && (
                      <div className="flex justify-end mb-4">
                        <Button onClick={() => setEditPortfolioOpen(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Portfolio Item
                        </Button>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {profile.portfolio.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                          {item.imageUrl ? (
                            <div className="aspect-video bg-muted flex items-center justify-center">
                              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="aspect-video bg-muted flex items-center justify-center">
                              <p className="text-muted-foreground">Project Image</p>
                            </div>
                          )}
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-medium">{item.title}</h3>
                              <div className="flex gap-1">
                                {isOwnProfile && (
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                )}
                                {item.url && (
                                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="w-4 h-4" />
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    {isOwnProfile && (
                      <div className="flex justify-end">
                        <Button onClick={() => setEditPortfolioOpen(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Portfolio Item
                        </Button>
                      </div>
                    )}
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">
                          {isOwnProfile ? 'No portfolio items yet. Click "Add Portfolio Item" to showcase your work.' : 'No portfolio items yet'}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                {profile.reviews.length > 0 ? (
                  profile.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={review.avatar} />
                            <AvatarFallback>{review.client.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium">{review.client}</p>
                                <p className="text-sm text-muted-foreground">{review.project}</p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 mb-1">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                                <p className="text-sm text-muted-foreground">{review.date}</p>
                              </div>
                            </div>
                            <p className="text-muted-foreground mb-2">{review.comment}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <Badge variant="outline">{review.budget}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">No reviews yet</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="experience" className="space-y-6">
                {profile.experience.length > 0 ? (
                  <>
                    {isOwnProfile && (
                      <div className="flex justify-end mb-4">
                        <Button onClick={() => setEditExperienceOpen(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Experience
                        </Button>
                      </div>
                    )}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle>Work Experience</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="border-l-2 border-muted pl-4 space-y-6">
                          {profile.experience.map((exp, idx) => (
                            <div key={idx} className="group relative">
                              {isOwnProfile && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute -right-2 -top-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              )}
                              <h3 className="font-medium">{exp.position}</h3>
                              <p className="text-muted-foreground">{exp.company} • {exp.period}</p>
                              <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <div className="space-y-4">
                    {isOwnProfile && (
                      <div className="flex justify-end">
                        <Button onClick={() => setEditExperienceOpen(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Experience
                        </Button>
                      </div>
                    )}
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">
                          {isOwnProfile ? 'No work experience added yet. Click "Add Experience" to showcase your professional background.' : 'No experience listed'}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Availability */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <Badge
                      className={
                        profile.availability.status === 'Available'
                          ? 'bg-green-100 text-green-800'
                          : profile.availability.status === 'Busy'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {profile.availability.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Response Time</span>
                    <span className="text-sm text-muted-foreground">{profile.availability.responseTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Projects Completed</span>
                  <span className="font-medium">{profile.stats.projectsCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Earnings</span>
                  <span className="font-medium">{profile.stats.totalEarnings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Repeat Clients</span>
                  <span className="font-medium">{profile.stats.repeatClients}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">On-Time Delivery</span>
                  <span className="font-medium">{profile.stats.onTimeDelivery}</span>
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            {profile.languages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Languages</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {profile.languages.map((lang, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-sm">{lang.language}</span>
                      <span className="text-sm text-muted-foreground">{lang.proficiency}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <ShareProfileDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        profileUrl={`/en/freelancer/${freelancerId}`}
        profileName={profile.name}
        profileTitle={profile.title}
      />

      {/* Edit Dialogs - Only available when viewing own profile */}
      {isOwnProfile && (
        <>
          <EditAboutDialog
            open={editAboutOpen}
            onOpenChange={setEditAboutOpen}
            currentBio={profile.bio}
            onSave={handleSaveBio}
          />

          <EditSkillsDialog
            open={editSkillsOpen}
            onOpenChange={setEditSkillsOpen}
            currentSkills={profile.skills}
            onSave={handleSaveSkills}
          />

          <EditPortfolioDialog
            open={editPortfolioOpen}
            onOpenChange={setEditPortfolioOpen}
            onSave={handleSavePortfolio}
          />

          <EditExperienceDialog
            open={editExperienceOpen}
            onOpenChange={setEditExperienceOpen}
            onSave={handleSaveExperience}
          />
        </>
      )}
    </div>
  );
}
