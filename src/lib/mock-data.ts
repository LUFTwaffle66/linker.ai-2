import type { Project, Expert } from '@/types/browse';

export const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'AI Chatbot for E-commerce Support',
    category: 'AI Chatbot',
    budget: '$8,000 - $12,000',
    timeline: '3-4 weeks',
    description:
      'Need an AI-powered chatbot using GPT-4 to handle customer support inquiries for our e-commerce platform. Must integrate with our existing CRM and handle 1000+ daily queries.',
    skills: ['GPT-4', 'Python', 'API Integration', 'Natural Language Processing'],
    postedDate: '2 days ago',
    proposals: 12,
    client: {
      name: 'ShopHub Inc',
      rating: 4.9,
      verified: true,
      spent: '$45K+',
    },
    fullDescription: `We are seeking a skilled React developer to create a responsive layout for our web application. The layout should include a header with navigation links and a dropdown menu, a main content area with a specific layout for dynamic or static content, and a footer with contact information.

Deliverables:
• Develop a responsive header with navigation links and dropdown menu
• Create a main content area with a specific layout for dynamic or static content
• Design a footer with contact information
• The design should be clean, responsive, and easy to extend in the future

The ideal candidate should have experience with modern frontend frameworks and responsive design principles. Must be able to integrate with our existing CRM system and handle high traffic volumes.`,
    deliverables: [
      'Functional AI chatbot integrated with GPT-4',
      'CRM integration with Salesforce',
      'Admin dashboard for monitoring',
      'Complete API documentation',
      'Testing and deployment support',
    ],
    experienceLevel: 'Intermediate',
    projectType: 'One-time project',
    location: 'Worldwide',
    connects: 7,
  },
  {
    id: 2,
    title: 'Automated Invoice Processing System',
    category: 'Workflow Automation',
    budget: '$15,000 - $20,000',
    timeline: '6-8 weeks',
    description:
      'Build an RPA system to automatically process invoices from email attachments, extract data using OCR, and input into our accounting software. Must handle 500+ invoices per day.',
    skills: ['RPA', 'UiPath', 'OCR', 'Python', 'Data Extraction'],
    postedDate: '3 days ago',
    proposals: 8,
    client: {
      name: 'Finance Solutions LLC',
      rating: 4.8,
      verified: true,
      spent: '$120K+',
    },
    fullDescription: `Looking for an experienced RPA developer to build an automated invoice processing system. The system should extract invoice data from email attachments using OCR technology and automatically input the information into our QuickBooks accounting system.

Requirements:
• Must handle various invoice formats (PDF, images, scanned documents)
• 95%+ accuracy in data extraction
• Error handling and manual review workflow
• Real-time processing with queue management
• Detailed logging and reporting

This is a critical business process automation that will save our team hundreds of hours monthly.`,
    deliverables: [
      'Complete RPA workflow in UiPath',
      'OCR integration with high accuracy',
      'QuickBooks integration',
      'Error handling system',
      'Admin dashboard and reports',
      'Documentation and training',
    ],
    experienceLevel: 'Expert',
    projectType: 'One-time project',
    location: 'Worldwide',
    connects: 10,
  },
  {
    id: 3,
    title: 'Predictive Maintenance ML Model',
    category: 'Machine Learning',
    budget: '$25,000 - $35,000',
    timeline: '8-10 weeks',
    description:
      'Develop a machine learning model to predict equipment failures in manufacturing. Need historical data analysis, model training, and real-time monitoring dashboard.',
    skills: ['Machine Learning', 'TensorFlow', 'Python', 'Data Science', 'Time Series'],
    postedDate: '5 days ago',
    proposals: 15,
    client: {
      name: 'Manufacturing Corp',
      rating: 4.7,
      verified: true,
      spent: '$250K+',
    },
    fullDescription: `We need a machine learning expert to develop a predictive maintenance system for our manufacturing equipment. The system should analyze historical sensor data and predict equipment failures before they occur.

Project Scope:
• Analyze 5 years of historical sensor data
• Develop and train ML models for failure prediction
• Create real-time monitoring dashboard
• Implement alerting system for maintenance teams
• Deploy models to production environment

We have extensive data available and a strong technical team to support integration.`,
    deliverables: [
      'Data analysis report',
      'Trained ML models with 90%+ accuracy',
      'Real-time monitoring dashboard',
      'API for model predictions',
      'Complete documentation',
      'Training for maintenance team',
    ],
    experienceLevel: 'Expert',
    projectType: 'One-time project',
    location: 'Worldwide',
    connects: 12,
  },
  {
    id: 4,
    title: 'AI-Powered Content Generation Tool',
    category: 'AI & NLP',
    budget: '$10,000 - $15,000',
    timeline: '4-5 weeks',
    description:
      'Create an AI content generation tool using GPT-4 for blog posts, social media, and marketing copy. Must include custom prompts, brand voice training, and WordPress integration.',
    skills: ['GPT-4', 'OpenAI API', 'JavaScript', 'WordPress', 'Content Strategy'],
    postedDate: '1 week ago',
    proposals: 18,
    client: {
      name: 'ContentPro Agency',
      rating: 4.8,
      verified: true,
      spent: '$85K+',
    },
    experienceLevel: 'Intermediate',
    projectType: 'One-time project',
    location: 'Worldwide',
    connects: 8,
  },
  {
    id: 5,
    title: 'Data Pipeline Automation with Airflow',
    category: 'Data Engineering',
    budget: '$18,000 - $22,000',
    timeline: '5-6 weeks',
    description:
      'Build automated data pipelines using Apache Airflow to process and transform data from multiple sources. Includes ETL workflows, data validation, and monitoring.',
    skills: ['Apache Airflow', 'Python', 'ETL', 'SQL', 'Data Engineering'],
    postedDate: '1 week ago',
    proposals: 9,
    client: {
      name: 'DataTech Solutions',
      rating: 4.9,
      verified: true,
      spent: '$200K+',
    },
    experienceLevel: 'Expert',
    projectType: 'One-time project',
    location: 'Worldwide',
    connects: 9,
  },
  {
    id: 6,
    title: 'Computer Vision for Quality Control',
    category: 'Computer Vision',
    budget: '$30,000 - $40,000',
    timeline: '10-12 weeks',
    description:
      'Develop a computer vision system to detect defects in manufactured products on production line. Real-time processing with 99%+ accuracy required.',
    skills: ['Computer Vision', 'TensorFlow', 'OpenCV', 'Python', 'Deep Learning'],
    postedDate: '2 weeks ago',
    proposals: 11,
    client: {
      name: 'Industrial Automation Corp',
      rating: 4.7,
      verified: true,
      spent: '$500K+',
    },
    experienceLevel: 'Expert',
    projectType: 'One-time project',
    location: 'Worldwide',
    connects: 15,
  },
];

export const MOCK_FREELANCERS: Expert[] = [
  {
    id: 1,
    name: 'Alex Chen',
    title: 'Senior AI Automation Engineer',
    hourlyRate: '$125/hr',
    rating: 4.9,
    reviews: 89,
    skills: ['AI Chatbots', 'GPT-4', 'Python', 'Automation', 'NLP'],
    location: 'San Francisco, CA',
    available: true,
    avatar: 'AC',
    verified: true,
    topRated: true,
    completedProjects: 89,
    certification: 'Google Cloud ML Engineer',
    description:
      'Senior AI engineer specializing in GPT-4 chatbots, workflow automation, and custom ML models.',
    portfolio: [
      'Built AI chatbot handling 10K+ daily queries for e-commerce platform',
      'Developed workflow automation reducing processing time by 80%',
      'Created custom ML models for customer sentiment analysis',
    ],
    languages: ['English (Native)', 'Mandarin (Fluent)'],
    successRate: 98,
    responseTime: '< 1 hour',
  },
  {
    id: 2,
    name: 'Sarah Rodriguez',
    title: 'RPA & Process Automation Specialist',
    hourlyRate: '$95/hr',
    rating: 4.8,
    reviews: 67,
    skills: ['UiPath', 'RPA', 'Process Automation', 'Python', 'API Integration'],
    location: 'Austin, TX',
    available: true,
    avatar: 'SR',
    verified: true,
    topRated: false,
    completedProjects: 102,
    certification: 'UiPath Certified Advanced RPA',
    description:
      'RPA specialist with expertise in UiPath, Automation Anywhere, and custom workflow solutions.',
    portfolio: [
      'Automated invoice processing for Fortune 500 company',
      'Built 20+ RPA workflows saving 1000+ hours monthly',
      'Expertise in document processing and data extraction',
    ],
    languages: ['English (Native)', 'Spanish (Native)'],
    successRate: 96,
    responseTime: '< 2 hours',
  },
  {
    id: 3,
    name: 'Michael Park',
    title: 'Machine Learning Engineer',
    hourlyRate: '$140/hr',
    rating: 4.9,
    reviews: 124,
    skills: ['Machine Learning', 'TensorFlow', 'Data Science', 'Python', 'Deep Learning'],
    location: 'New York, NY',
    available: false,
    avatar: 'MP',
    verified: true,
    topRated: true,
    completedProjects: 156,
    certification: 'AWS ML Specialist',
    description:
      'ML engineer with 10+ years building predictive models and AI systems for Fortune 500 companies.',
    portfolio: [
      'Developed predictive maintenance system with 95% accuracy',
      'Built recommendation engine processing 1M+ users',
      'Created computer vision models for quality inspection',
    ],
    languages: ['English (Native)', 'Korean (Fluent)'],
    successRate: 99,
    responseTime: '< 3 hours',
  },
  {
    id: 4,
    name: 'Emily Johnson',
    title: 'AI Chatbot Developer',
    hourlyRate: '$110/hr',
    rating: 4.9,
    reviews: 78,
    skills: ['Chatbots', 'Dialogflow', 'Node.js', 'GPT-4', 'Conversational AI'],
    location: 'Seattle, WA',
    available: true,
    avatar: 'EJ',
    verified: true,
    topRated: true,
    completedProjects: 94,
    certification: 'Google Cloud Professional',
    description:
      'Chatbot specialist creating intelligent conversational AI for customer service and engagement.',
    portfolio: [
      'Built multi-lingual chatbot for global retail brand',
      'Developed voice-enabled AI assistant for healthcare',
      'Created 50+ chatbots with 95%+ customer satisfaction',
    ],
    languages: ['English (Native)', 'French (Fluent)'],
    successRate: 97,
    responseTime: '< 1 hour',
  },
  {
    id: 5,
    name: 'David Kumar',
    title: 'Data Science & Analytics Expert',
    hourlyRate: '$105/hr',
    rating: 4.8,
    reviews: 92,
    skills: ['Data Science', 'Python', 'R', 'SQL', 'Data Visualization'],
    location: 'Boston, MA',
    available: true,
    avatar: 'DK',
    verified: true,
    topRated: false,
    completedProjects: 112,
    certification: 'Microsoft Certified Data Scientist',
    description:
      'Data scientist specializing in predictive analytics, statistical modeling, and business intelligence.',
    portfolio: [
      'Built customer churn prediction model with 92% accuracy',
      'Developed sales forecasting system for retail chain',
      'Created interactive dashboards for executive reporting',
    ],
    languages: ['English (Fluent)', 'Hindi (Native)'],
    successRate: 95,
    responseTime: '< 2 hours',
  },
  {
    id: 6,
    name: 'Lisa Wang',
    title: 'Computer Vision Engineer',
    hourlyRate: '$135/hr',
    rating: 4.9,
    reviews: 67,
    skills: ['Computer Vision', 'PyTorch', 'OpenCV', 'Deep Learning', 'Python'],
    location: 'Los Angeles, CA',
    available: false,
    avatar: 'LW',
    verified: true,
    topRated: true,
    completedProjects: 73,
    certification: 'NVIDIA Deep Learning Certified',
    description:
      'Computer vision expert specializing in object detection, image segmentation, and real-time processing.',
    portfolio: [
      'Developed facial recognition system for security application',
      'Built autonomous vehicle perception system',
      'Created medical image analysis AI for diagnostics',
    ],
    languages: ['English (Fluent)', 'Mandarin (Native)'],
    successRate: 98,
    responseTime: '< 2 hours',
  },
];
