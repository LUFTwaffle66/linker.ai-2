'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Star,
  MapPin,
  Building,
  CheckCircle,
  MessageSquare,
  Plus,
  Calendar,
  DollarSign,
  Share2,
  Pencil,
  Loader2
} from 'lucide-react';
import { paths } from '@/config/paths';
import { ShareProfileDialog } from './share-profile-dialog';
import type { ClientProfileData } from '../types';
import { useAuth } from '@/features/auth/lib/auth-client';
import { EditLanguagesDialog } from './edit-languages-dialog';
import { useUpdateClientProfile } from '../hooks';
import { toast } from 'sonner';

interface ClientProfileProps {
  profile: ClientProfileData;
  clientId: string;
  isOwnProfile?: boolean;
  onNavigateToMessages?: () => void;
}

export function ClientProfile({ profile, clientId, isOwnProfile = false, onNavigateToMessages }: ClientProfileProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [aboutValue, setAboutValue] = useState(profile.bio || '');
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [aboutError, setAboutError] = useState<string | null>(null);
  const [languages, setLanguages] = useState<string[]>(profile.languages || []);
  const [editLanguagesOpen, setEditLanguagesOpen] = useState(false);
  const [isSavingAbout, setIsSavingAbout] = useState(false);
  const [isSavingLanguages, setIsSavingLanguages] = useState(false);
  const updateProfileMutation = useUpdateClientProfile();
  const isSelf = isOwnProfile || user?.id === clientId || user?.id === profile.id;
  const averageRating = profile.average_rating ?? profile.rating ?? null;
  const totalReviews = profile.total_reviews ?? profile.reviewCount ?? 0;
  const hasReviews = (totalReviews || 0) > 0;

  useEffect(() => {
    setAboutValue(profile.bio || '');
    setLanguages(profile.languages || []);
  }, [profile.bio, profile.languages]);

  const handlePostProject = () => {
    router.push(paths.app.postProject.getHref());
  };

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

  const handleSaveAbout = async () => {
    if (!isSelf) return;
    const previousAbout = profile.bio || '';
    setIsSavingAbout(true);
    setAboutError(null);
    try {
      const updated = await updateProfileMutation.mutateAsync({
        clientId,
        data: { bio: aboutValue },
      });
      setAboutValue(updated.bio || '');
      setIsEditingAbout(false);
      toast.success('About section updated');
    } catch (error) {
      setAboutValue(previousAbout);
      const message = error instanceof Error ? error.message : 'Failed to update about section';
      setAboutError(message);
      toast.error(message);
    } finally {
      setIsSavingAbout(false);
    }
  };

  const handleCancelAboutEdit = () => {
    setAboutValue(profile.bio || '');
    setAboutError(null);
    setIsEditingAbout(false);
  };

  const handleToggleLanguage = async (language: string) => {
    if (!isSelf || isSavingLanguages) return;

    const previousLanguages = [...languages];
    const exists = languages.includes(language);
    const updatedLanguages = exists
      ? languages.filter((l) => l !== language)
      : [...languages, language];

    setLanguages(updatedLanguages);
    setIsSavingLanguages(true);

    try {
      const updatedProfile = await updateProfileMutation.mutateAsync({
        clientId,
        data: { languages: updatedLanguages },
      });
      setLanguages(updatedProfile.languages || updatedLanguages);
      toast.success('Languages updated');
    } catch (error) {
      setLanguages(previousLanguages);
      const message = error instanceof Error ? error.message : 'Failed to update languages';
      toast.error(message);
    } finally {
      setIsSavingLanguages(false);
    }
  };

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
                        <span className="text-sm text-green-600">Verified Client</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      {hasReviews ? (
                        <>
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{(averageRating ?? 0).toFixed(1)}</span>
                          <span className="text-muted-foreground">({totalReviews} reviews)</span>
                        </>
                      ) : (
                        <span className="text-sm font-medium text-muted-foreground">New Talent</span>
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
                          {profile.company && (
                            <div className="flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              <span>{profile.company}</span>
                            </div>
                          )}
                        </div>

                        {profile.industries.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {profile.industries.map((industry) => (
                              <Badge key={industry} variant="secondary">{industry}</Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 min-w-[200px]">
                        {!isSelf && (
                          <Button className="w-full" onClick={handleSendMessage}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Send Message
                          </Button>
                        )}
                        <Button variant="outline" className="w-full" onClick={handlePostProject}>
                          <Plus className="w-4 h-4 mr-2" />
                          Post New Project
                        </Button>
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="projects">Past Projects</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>About</CardTitle>
                    {isSelf && !isEditingAbout && (
                      <Button variant="ghost" size="sm" onClick={() => setIsEditingAbout(true)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {isEditingAbout ? (
                      <>
                        <Textarea
                          value={aboutValue}
                          onChange={(event) => setAboutValue(event.target.value)}
                          placeholder="Describe your company, goals, and what you're looking for."
                          className="min-h-[160px]"
                        />
                        {aboutError && <p className="text-sm text-destructive">{aboutError}</p>}
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelAboutEdit}
                            disabled={isSavingAbout}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSaveAbout}
                            disabled={isSavingAbout}
                          >
                            {isSavingAbout && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Save
                          </Button>
                        </div>
                      </>
                    ) : (
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {aboutValue?.trim()
                          ? aboutValue
                          : isSelf
                          ? 'Add a short description about your company.'
                          : 'No description provided yet.'}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>Languages</CardTitle>
                    {isSelf && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditLanguagesOpen(true)}
                        disabled={isSavingLanguages}
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {languages.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {languages.map((language) => (
                          <Badge key={language} variant="secondary" className="text-sm py-1 px-3">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {isSelf ? 'Add the languages you speak to help experts connect with you.' : 'No languages listed'}
                      </p>
                    )}
                    {isSavingLanguages && (
                      <p className="text-xs text-muted-foreground mt-2">Saving changes...</p>
                    )}
                  </CardContent>
                </Card>

                {profile.lookingFor.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>What We Look For</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {profile.lookingFor.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                {profile.pastProjects.length > 0 ? (
                  profile.pastProjects.map((project) => (
                    <Card key={project.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium">{project.title}</h3>
                              <Badge
                                variant={project.status === 'Completed' ? 'default' : 'secondary'}
                                className={project.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                              >
                                {project.status}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mb-3">{project.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {project.budget}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {project.completedDate}
                              </span>
                              <span>Expert: {project.contractor}</span>
                            </div>
                          </div>
                          {project.rating && (
                            <div className="flex items-center gap-1">
                              {[...Array(project.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">No past projects yet</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                {profile.reviews.length > 0 ? (
                  profile.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={review.reviewer_avatar || undefined} />
                            <AvatarFallback>{getInitials(review.reviewer_name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium">{review.reviewer_name}</p>
                                {review.project_title && (
                                  <p className="text-sm text-muted-foreground">{review.project_title}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 mb-1">
                                  {Array.from({ length: review.rating }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(review.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </p>
                              </div>
                            </div>
                            <p className="text-muted-foreground mb-2">{review.comment}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Badge variant="outline">Rating: {review.rating}/5</Badge>
                              {review.project_title && (
                                <Badge variant="secondary">{review.project_title}</Badge>
                              )}
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
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Client Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.memberSince && (
                  <div className="flex justify-between">
                    <span className="text-sm">Member Since</span>
                    <span className="font-medium">{profile.memberSince}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm">Projects Posted</span>
                  <span className="font-medium">{profile.stats.projectsPosted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Spent</span>
                  <span className="font-medium">{profile.stats.totalSpent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg. Project Size</span>
                  <span className="font-medium">{profile.stats.avgProjectSize}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Verification */}
            <Card>
              <CardHeader>
                <CardTitle>Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.verification.paymentMethodVerified && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Payment Method Verified</span>
                  </div>
                )}
                {profile.verification.businessLicenseVerified && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Business License Verified</span>
                  </div>
                )}
                {profile.verification.taxIdVerified && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Tax ID Verified</span>
                  </div>
                )}
                {profile.verification.phoneVerified && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Phone Number Verified</span>
                  </div>
                )}
                {profile.verification.emailVerified && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Email Verified</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            {profile.recentActivity.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile.recentActivity.map((activity, idx) => (
                    <div key={idx} className="text-sm">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-muted-foreground">{activity.date}</p>
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
        profileUrl={`/en/client/${clientId}`}
        profileName={profile.name}
        profileTitle={profile.title}
      />

      {isSelf && (
        <EditLanguagesDialog
          open={editLanguagesOpen}
          onOpenChange={setEditLanguagesOpen}
          languages={languages}
          onToggle={handleToggleLanguage}
        />
      )}
    </div>
  );
}
