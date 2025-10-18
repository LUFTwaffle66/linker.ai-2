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
  Clock,
  DollarSign,
  CheckCircle,
  MessageSquare,
  Heart,
  Share2,
  Calendar as CalendarIcon,
  ExternalLink,
  Shield,
  Award
} from 'lucide-react';
import { paths } from '@/config/paths';

interface FreelancerProfileProps {
  onNavigateToMessages?: () => void;
}

export function FreelancerProfile({ onNavigateToMessages }: FreelancerProfileProps) {
  const router = useRouter();

  const portfolioItems = [
    {
      id: 1,
      title: 'Customer Support AI Chatbot',
      description: 'GPT-4 powered chatbot handling 10K+ inquiries/month',
      tags: ['OpenAI API', 'Python', 'NLP', 'React'],
      url: '#'
    },
    {
      id: 2,
      title: 'Invoice Processing Automation',
      description: 'RPA system reducing processing time by 85%',
      tags: ['UiPath', 'OCR', 'Python', 'API Integration'],
      url: '#'
    },
    {
      id: 3,
      title: 'Predictive Analytics Dashboard',
      description: 'ML model for sales forecasting with 92% accuracy',
      tags: ['TensorFlow', 'Python', 'Power BI', 'SQL'],
      url: '#'
    }
  ];

  const reviews = [
    {
      id: 1,
      client: 'Sarah Chen',
      avatar: 'SC',
      rating: 5,
      date: '2 weeks ago',
      project: 'AI Chatbot Development',
      comment: 'Exceptional work! Alex delivered a sophisticated chatbot that exceeded our expectations. Response times improved by 90% and customer satisfaction is through the roof.',
      budget: '$12,000'
    },
    {
      id: 2,
      client: 'TechCorp Solutions',
      avatar: 'TC',
      rating: 5,
      date: '1 month ago',
      project: 'Workflow Automation',
      comment: 'Professional and highly skilled. The automation saved our team 30+ hours per week. Alex provided excellent documentation and training.',
      budget: '$18,500'
    }
  ];

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
                      <AvatarFallback className="text-xl">AC</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">Verified AI Expert</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.9</span>
                      <span className="text-muted-foreground">(89 reviews)</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h1 className="text-2xl mb-2">Alex Chen</h1>
                        <p className="text-lg text-muted-foreground mb-3">Senior AI Automation Engineer</p>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>San Francisco, CA</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>PST (UTC-8)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>$95-150/hour</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {['AI Chatbots', 'Workflow Automation', 'Machine Learning', 'Python', 'OpenAI API'].map((skill) => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <Button className="w-full" onClick={handleSendMessage}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contact Alex
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
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
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      I'm a senior AI automation engineer with 8+ years of experience building intelligent automation
                      solutions for startups and Fortune 500 companies. I specialize in developing AI chatbots,
                      implementing workflow automation, and creating custom machine learning models that drive real
                      business value.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      My expertise includes GPT-4 integration, RPA development, natural language processing, and
                      predictive analytics. I've helped businesses save thousands of hours through intelligent
                      automation while improving accuracy and customer satisfaction. Every solution I build is
                      scalable, well-documented, and designed with long-term maintenance in mind.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'AI & Machine Learning',
                        'GPT-4 & OpenAI API',
                        'Python',
                        'TensorFlow',
                        'PyTorch',
                        'Workflow Automation',
                        'RPA (UiPath)',
                        'NLP & Chatbots',
                        'Data Analysis',
                        'LangChain',
                        'API Integration',
                        'Cloud Platforms (AWS/GCP)',
                        'Docker & Kubernetes',
                        'SQL & NoSQL',
                        'React & Node.js'
                      ].map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-sm py-1 px-3">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Certifications & Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium">Google Cloud Professional ML Engineer</p>
                          <p className="text-sm text-muted-foreground">Certification ID: GCP-ML-2024 (Current)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium">AWS Certified Machine Learning Specialist</p>
                          <p className="text-sm text-muted-foreground">Specialty Certification (Current)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="font-medium">UiPath Certified Advanced RPA Developer</p>
                          <p className="text-sm text-muted-foreground">Professional Level (Current)</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolioItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground">Project Image</p>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{item.title}</h3>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
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
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback>{review.avatar}</AvatarFallback>
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
                ))}
              </TabsContent>

              <TabsContent value="experience" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Work Experience</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border-l-2 border-muted pl-4 space-y-6">
                      <div>
                        <h3 className="font-medium">Senior AI Automation Engineer</h3>
                        <p className="text-muted-foreground">Freelance • 2020 - Present</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Develop custom AI automation solutions for clients across healthcare, finance, and e-commerce.
                          Specialize in GPT-4 chatbot development, RPA implementation, and machine learning model deployment.
                          Delivered 80+ successful projects with 98% client satisfaction rate.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">Machine Learning Engineer</h3>
                        <p className="text-muted-foreground">TechCorp AI • 2018 - 2020</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Built and deployed production ML models for customer behavior prediction and automation.
                          Led team of 4 engineers in developing NLP-based document processing systems.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">Software Engineer</h3>
                        <p className="text-muted-foreground">Innovation Labs • 2016 - 2018</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Developed backend systems and APIs for data-driven applications.
                          Gained expertise in Python, cloud infrastructure, and automated workflows.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Availability */}
            <Card>
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
                    <Badge className="bg-green-100 text-green-800">Available</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Response Time</span>
                    <span className="text-sm text-muted-foreground">Within 2 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Projects Completed</span>
                  <span className="font-medium">89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Earnings</span>
                  <span className="font-medium">$850K+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Repeat Clients</span>
                  <span className="font-medium">82%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">On-Time Delivery</span>
                  <span className="font-medium">98%</span>
                </div>
              </CardContent>
            </Card>

            {/* Technologies */}
            <Card>
              <CardHeader>
                <CardTitle>Top Technologies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Python</span>
                  <span className="text-sm text-muted-foreground">Expert</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">TensorFlow/PyTorch</span>
                  <span className="text-sm text-muted-foreground">Advanced</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">OpenAI API</span>
                  <span className="text-sm text-muted-foreground">Expert</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">UiPath/Automation</span>
                  <span className="text-sm text-muted-foreground">Advanced</span>
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">English</span>
                  <span className="text-sm text-muted-foreground">Native</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Mandarin</span>
                  <span className="text-sm text-muted-foreground">Fluent</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
