'use client';

import { useRouter } from '@/i18n/routing';
import {
  Bot, Workflow, Brain, Database, Code, LineChart, Search, ArrowRight,
  DollarSign, Clock, CheckCircle, Star, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { paths } from '@/config/paths';

interface LandingPageProps {
  onNavigate?: (screen: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const router = useRouter();

  const handleNavigate = (screen: string) => {
    if (onNavigate) {
      onNavigate(screen);
    } else {
      // Default navigation logic
      switch (screen) {
        case 'browse':
          router.push(paths.public.browse.getHref());
          break;
        default:
          router.push('/');
      }
    }
  };

  const categories = [
    { icon: Bot, name: 'AI Chatbots & Assistants', count: '1,847 experts' },
    { icon: Workflow, name: 'Workflow Automation', count: '2,134 experts' },
    { icon: Brain, name: 'Machine Learning & AI', count: '1,567 experts' },
    { icon: Database, name: 'Data Analysis & BI', count: '1,923 experts' },
    { icon: Code, name: 'API Integration', count: '1,456 experts' },
    { icon: LineChart, name: 'Process Automation', count: '987 experts' },
  ];

  const testimonials = [
    {
      name: 'Jennifer Chen',
      role: 'CEO, TechStart Inc',
      avatar: 'JC',
      content: 'Our AI chatbot specialist automated 80% of our customer support inquiries. Response times dropped from hours to seconds, and customer satisfaction soared.',
      rating: 5
    },
    {
      name: 'David Rodriguez',
      role: 'AI Automation Expert',
      avatar: 'DR',
      content: 'LinkerAI helped me find consistent high-value projects. I\'ve built workflow automations for Fortune 500 companies and grown my consultancy significantly.',
      rating: 5
    },
    {
      name: 'Sarah Thompson',
      role: 'Operations Director',
      avatar: 'ST',
      content: 'The escrow system and milestone payments give me confidence. Our data analysis project delivered incredible insights, and payments were seamless.',
      rating: 5
    }
  ];

  const featuredProjects = [
    {
      id: 1,
      title: 'AI Customer Support Chatbot Development',
      description: 'Need an experienced AI engineer to build a GPT-4 powered chatbot for our e-commerce platform. Should integrate with our existing CRM system.',
      budget: { min: 5000, max: 8000 },
      duration: '4-6 weeks',
      skills: ['GPT-4', 'Python', 'API Integration', 'NLP'],
      client: 'TechRetail Inc',
      clientAvatar: 'TR',
      proposals: 12,
      verified: true,
      postedTime: '2 hours ago'
    },
    {
      id: 2,
      title: 'Document Processing Automation with OCR',
      description: 'Looking for an automation expert to create a system that extracts data from invoices using OCR and populates our database automatically.',
      budget: { min: 3000, max: 5000 },
      duration: '3-4 weeks',
      skills: ['OCR', 'Python', 'Computer Vision', 'RPA'],
      client: 'DataFlow Solutions',
      clientAvatar: 'DF',
      proposals: 8,
      verified: true,
      postedTime: '5 hours ago'
    },
    {
      id: 3,
      title: 'Predictive Analytics Dashboard',
      description: 'Seeking a data scientist to build ML models for sales forecasting and create interactive dashboards using Tableau or Power BI.',
      budget: { min: 7000, max: 12000 },
      duration: '6-8 weeks',
      skills: ['Machine Learning', 'Python', 'TensorFlow', 'Tableau'],
      client: 'Analytics Corp',
      clientAvatar: 'AC',
      proposals: 15,
      verified: true,
      postedTime: '1 day ago'
    }
  ];

  const featuredFreelancers = [
    {
      id: 1,
      name: 'Alex Chen',
      title: 'Senior AI Engineer & ML Specialist',
      avatar: 'AC',
      hourlyRate: 95,
      rating: 4.9,
      reviewCount: 127,
      completedProjects: 89,
      skills: ['GPT-4', 'Python', 'TensorFlow', 'NLP', 'OpenAI API'],
      location: 'San Francisco, CA',
      verified: true,
      topRated: true,
      description: 'Specialized in building custom AI chatbots and automation systems. 8+ years of experience in ML and AI.'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      title: 'RPA & Workflow Automation Expert',
      avatar: 'MG',
      hourlyRate: 85,
      rating: 5.0,
      reviewCount: 94,
      completedProjects: 76,
      skills: ['UiPath', 'Power Automate', 'Python', 'API Integration'],
      location: 'Austin, TX',
      verified: true,
      topRated: true,
      description: 'Expert in robotic process automation and business workflow optimization. Certified UiPath developer.'
    },
    {
      id: 3,
      name: 'David Park',
      title: 'Data Scientist & Analytics Engineer',
      avatar: 'DP',
      hourlyRate: 90,
      rating: 4.8,
      reviewCount: 156,
      completedProjects: 112,
      skills: ['Machine Learning', 'Python', 'R', 'Tableau', 'SQL'],
      location: 'New York, NY',
      verified: true,
      topRated: true,
      description: 'Building predictive models and data visualization dashboards. Ph.D. in Data Science.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/30 to-background px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-6xl mb-6">
              Transform your business with <span className="text-primary">AI automation</span> experts
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with vetted AI specialists and automation engineers. From chatbots to workflow automation, find the perfect expert to streamline your operations and boost efficiency.
            </p>

            {/* Search Section */}
            <div className="bg-background border border-border rounded-xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      placeholder="What AI automation do you need?"
                      className="pl-10 h-12 text-base"
                    />
                  </div>
                </div>
                <Button size="lg" className="h-12 px-8">
                  Search
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Popular:</span>
                {['AI Chatbot', 'Workflow Automation', 'Data Analysis', 'Custom AI Model'].map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" className="h-12 px-8" onClick={() => handleNavigate('browse')}>
                Hire AI Experts
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8" onClick={() => handleNavigate('browse')}>
                Find Projects
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl mb-4">Browse by Expertise</h2>
            <p className="text-muted-foreground">Find the right AI automation expert for your project</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.name} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.count}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl mb-4">How LinkerAI Works</h2>
            <p className="text-muted-foreground">Simple, secure, and efficient</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="font-medium mb-2">Post Your Project</h3>
              <p className="text-muted-foreground">Describe your automation needs and get proposals from qualified AI experts within hours.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="font-medium mb-2">Hire the Best</h3>
              <p className="text-muted-foreground">Review portfolios, technical skills, and ratings to find the perfect AI specialist for your needs.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="font-medium mb-2">Pay Safely</h3>
              <p className="text-muted-foreground">Our escrow system protects your payments until you're 100% satisfied with the automation delivered.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl mb-2">Featured Projects</h2>
              <p className="text-muted-foreground">Hand-picked opportunities from top companies</p>
            </div>
            <Button variant="outline" onClick={() => handleNavigate('browse')} className="hidden sm:flex items-center gap-2">
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">{project.clientAvatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{project.client}</p>
                        {project.verified && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-500">Verified</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{project.postedTime}</span>
                  </div>

                  <h3 className="font-medium mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-primary">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium">
                          ${project.budget.min.toLocaleString()}-${project.budget.max.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{project.duration}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {project.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.skills.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-xs text-muted-foreground">
                        {project.proposals} proposals
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center sm:hidden">
            <Button variant="outline" onClick={() => handleNavigate('browse')} className="w-full">
              View All Projects
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Freelancers */}
      <section className="bg-muted/30 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl mb-2">Top AI Experts</h2>
              <p className="text-muted-foreground">Hire vetted professionals with proven track records</p>
            </div>
            <Button variant="outline" onClick={() => handleNavigate('browse')} className="hidden sm:flex items-center gap-2">
              View All Experts
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {featuredFreelancers.map((freelancer) => (
              <Card key={freelancer.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback>{freelancer.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{freelancer.name}</h3>
                        {freelancer.verified && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{freelancer.title}</p>
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{freelancer.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({freelancer.reviewCount} reviews)
                        </span>
                      </div>
                      {freelancer.topRated && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                          Top Rated
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {freelancer.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {freelancer.skills.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Hourly Rate</span>
                      <span className="font-medium text-primary">${freelancer.hourlyRate}/hr</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Completed Jobs</span>
                      <span className="font-medium">{freelancer.completedProjects}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{freelancer.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center sm:hidden">
            <Button variant="outline" onClick={() => handleNavigate('browse')} className="w-full">
              View All Experts
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground">Join thousands of satisfied clients and AI experts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
