import { ClientProfileData, FreelancerProfileData } from '../types';

export const MOCK_CLIENT_PROFILE: ClientProfileData = {
  id: 'client-1',
  name: 'Michael Thompson',
  title: 'Product Manager at TechCorp Solutions',
  company: 'TechCorp Solutions',
  avatar: 'MT',
  location: 'San Francisco, CA',
  memberSince: '2021',
  rating: 4.9,
  reviewCount: 34,
  verified: true,
  industries: ['SaaS', 'Enterprise Software', 'AI Integration', 'Cloud Services'],
  bio: `I'm a Product Manager at TechCorp Solutions, where I lead initiatives to integrate AI and automation into our enterprise SaaS platform. With over 8 years of experience in product development and digital transformation, I'm passionate about leveraging cutting-edge AI technology to solve real business problems.

I regularly work with AI automation experts to enhance our platform capabilities and streamline our internal operations. I value technical excellence, innovative solutions, and professionals who can deliver measurable ROI through intelligent automation.`,
  lookingFor: [
    {
      title: 'Proven AI/ML Expertise',
      description: 'Demonstrated experience with GPT-4, machine learning, or automation platforms'
    },
    {
      title: 'Enterprise Experience',
      description: 'Track record working with large-scale systems and enterprise clients'
    },
    {
      title: 'Clear Documentation',
      description: 'Ability to provide comprehensive documentation and training materials'
    },
    {
      title: 'ROI-Focused Approach',
      description: 'Solutions that deliver measurable business value and efficiency gains'
    }
  ],
  stats: {
    memberSince: '2021',
    projectsPosted: 34,
    totalSpent: '$520K+',
    repeatExperts: '76%',
    avgProjectSize: '$18K'
  },
  verification: {
    paymentMethodVerified: true,
    businessLicenseVerified: true,
    taxIdVerified: true,
    phoneVerified: true,
    emailVerified: true
  },
  recentActivity: [
    { action: 'Posted new AI project', date: '2 days ago' },
    { action: 'Left review for Alex Chen', date: '1 week ago' },
    { action: 'Released milestone payment', date: '2 weeks ago' }
  ],
  pastProjects: [
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
  ]
};

export const MOCK_FREELANCER_PROFILE: FreelancerProfileData = {
  id: 'freelancer-1',
  name: 'Alex Chen',
  title: 'Senior AI Automation Engineer',
  avatar: 'AC',
  location: 'San Francisco, CA',
  timezone: 'PST (UTC-8)',
  hourlyRate: {
    min: 95,
    max: 150
  },
  rating: 4.9,
  reviewCount: 89,
  verified: true,
  skills: ['AI Chatbots', 'Workflow Automation', 'Machine Learning', 'Python', 'OpenAI API'],
  bio: `I'm a senior AI automation engineer with 8+ years of experience building intelligent automation solutions for startups and Fortune 500 companies. I specialize in developing AI chatbots, implementing workflow automation, and creating custom machine learning models that drive real business value.

My expertise includes GPT-4 integration, RPA development, natural language processing, and predictive analytics. I've helped businesses save thousands of hours through intelligent automation while improving accuracy and customer satisfaction. Every solution I build is scalable, well-documented, and designed with long-term maintenance in mind.`,
  expertise: [
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
  ],
  certifications: [
    {
      name: 'Google Cloud Professional ML Engineer',
      issuer: 'Google Cloud',
      credentialId: 'GCP-ML-2024',
      status: 'Current',
      icon: 'shield'
    },
    {
      name: 'AWS Certified Machine Learning Specialist',
      issuer: 'Amazon Web Services',
      status: 'Current',
      icon: 'award'
    },
    {
      name: 'UiPath Certified Advanced RPA Developer',
      issuer: 'UiPath',
      status: 'Current',
      icon: 'shield'
    }
  ],
  portfolio: [
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
  ],
  reviews: [
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
  ],
  experience: [
    {
      position: 'Senior AI Automation Engineer',
      company: 'Freelance',
      period: '2020 - Present',
      description: 'Develop custom AI automation solutions for clients across healthcare, finance, and e-commerce. Specialize in GPT-4 chatbot development, RPA implementation, and machine learning model deployment. Delivered 80+ successful projects with 98% client satisfaction rate.'
    },
    {
      position: 'Machine Learning Engineer',
      company: 'TechCorp AI',
      period: '2018 - 2020',
      description: 'Built and deployed production ML models for customer behavior prediction and automation. Led team of 4 engineers in developing NLP-based document processing systems.'
    },
    {
      position: 'Software Engineer',
      company: 'Innovation Labs',
      period: '2016 - 2018',
      description: 'Developed backend systems and APIs for data-driven applications. Gained expertise in Python, cloud infrastructure, and automated workflows.'
    }
  ],
  stats: {
    projectsCompleted: 89,
    totalEarnings: '$850K+',
    repeatClients: '82%',
    onTimeDelivery: '98%'
  },
  availability: {
    status: 'Available',
    responseTime: 'Within 2 hours'
  },
  languages: [
    { language: 'English', proficiency: 'Native' },
    { language: 'Mandarin', proficiency: 'Fluent' }
  ],
  topTechnologies: [
    { name: 'Python', level: 'Expert' },
    { name: 'TensorFlow/PyTorch', level: 'Advanced' },
    { name: 'OpenAI API', level: 'Expert' },
    { name: 'UiPath/Automation', level: 'Advanced' }
  ]
};
