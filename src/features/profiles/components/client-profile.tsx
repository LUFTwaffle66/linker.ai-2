'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
} from 'lucide-react';
import { paths } from '@/config/paths';

interface ClientProfileProps {
  onNavigateToMessages?: () => void;
}

export function ClientProfile({ onNavigateToMessages }: ClientProfileProps) {
  const router = useRouter();

  const pastProjects = [
    {
      id: 1,
      title: 'Customer Support AI Chatbot',
      status: 'Completed',
      budget: '$18,000',
      contractor: 'Alex Chen - AI Automation',
      rating: 5,
      completedDate: 'Dec 2024',
      description: 'GPT-4 powered chatbot reducing support tickets by 75% and improving response time to under 30 seconds'
    },
    {
      id: 2,
      title: 'Automated Data Processing Pipeline',
      status: 'In Progress',
      budget: '$32,000',
      contractor: 'DataFlow Solutions',
      completedDate: 'Expected Feb 2025',
      description: 'End-to-end automation of sales data processing, analysis, and reporting using Python and ML models'
    },
    {
      id: 3,
      title: 'Invoice Processing RPA System',
      status: 'Completed',
      budget: '$12,500',
      contractor: 'AutomateNow Inc',
      rating: 4,
      completedDate: 'Nov 2024',
      description: 'Automated invoice extraction and processing system handling 500+ invoices daily with 98% accuracy'
    }
  ];

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
                      <AvatarFallback className="text-xl">TC</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">Verified Client</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.9</span>
                      <span className="text-muted-foreground">(34 reviews)</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h1 className="text-2xl mb-2">Michael Thompson</h1>
                        <p className="text-lg text-muted-foreground mb-3">Product Manager at TechCorp Solutions</p>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>San Francisco, CA</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            <span>TechCorp Solutions</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Member since 2021</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {['SaaS', 'Enterprise Software', 'AI Integration', 'Cloud Services'].map((industry) => (
                            <Badge key={industry} variant="secondary">{industry}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <Button className="w-full" onClick={handleSendMessage}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>
                        <Button variant="outline" className="w-full" onClick={handlePostProject}>
                          <Plus className="w-4 h-4 mr-2" />
                          Post New Project
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Content Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="projects">Past Projects</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      I'm a Product Manager at TechCorp Solutions, where I lead initiatives to integrate AI and automation
                      into our enterprise SaaS platform. With over 8 years of experience in product development and digital
                      transformation, I'm passionate about leveraging cutting-edge AI technology to solve real business problems.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      I regularly work with AI automation experts to enhance our platform capabilities and streamline our
                      internal operations. I value technical excellence, innovative solutions, and professionals who can
                      deliver measurable ROI through intelligent automation.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>What We Look For</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Proven AI/ML Expertise</p>
                          <p className="text-sm text-muted-foreground">Demonstrated experience with GPT-4, machine learning, or automation platforms</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Enterprise Experience</p>
                          <p className="text-sm text-muted-foreground">Track record working with large-scale systems and enterprise clients</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Clear Documentation</p>
                          <p className="text-sm text-muted-foreground">Ability to provide comprehensive documentation and training materials</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">ROI-Focused Approach</p>
                          <p className="text-sm text-muted-foreground">Solutions that deliver measurable business value and efficiency gains</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                {pastProjects.map((project) => (
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
                ))}
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
                <div className="flex justify-between">
                  <span className="text-sm">Member Since</span>
                  <span className="font-medium">2021</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Projects Posted</span>
                  <span className="font-medium">34</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Spent</span>
                  <span className="font-medium">$520K+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Repeat Experts</span>
                  <span className="font-medium">76%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg. Project Size</span>
                  <span className="font-medium">$18K</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Verification */}
            <Card>
              <CardHeader>
                <CardTitle>Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Payment Method Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Business License Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Tax ID Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Phone Number Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Email Verified</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium">Posted new AI project</p>
                  <p className="text-muted-foreground">2 days ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Left review for Alex Chen</p>
                  <p className="text-muted-foreground">1 week ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Released milestone payment</p>
                  <p className="text-muted-foreground">2 weeks ago</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
