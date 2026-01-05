export interface MockFreelancer {
  id: string;
  name: string;
  title: string;
  skills: string[];
  hourlyRate: number;
  matchScore?: number;
  avatarUrl: string;
}

export const MOCK_FREELANCERS: MockFreelancer[] = [
  {
    id: '1a2b3c4d-0001',
    name: 'Alex Chen',
    title: 'Senior AI Engineer',
    skills: ['Python', 'OpenAI API', 'LangChain', 'React', 'SQL'],
    hourlyRate: 120,
    avatarUrl: 'https://i.pravatar.cc/150?u=1a2b3c4d-0001',
  },
  {
    id: '1a2b3c4d-0002',
    name: 'Maria Garcia',
    title: 'ML Engineer & Data Scientist',
    skills: ['TensorFlow', 'Python', 'Data Science', 'SQL', 'AWS'],
    hourlyRate: 110,
    avatarUrl: 'https://i.pravatar.cc/150?u=1a2b3c4d-0002',
  },
  {
    id: '1a2b3c4d-0003',
    name: 'David Park',
    title: 'Automation Engineer',
    skills: ['Node.js', 'Workflow Automation', 'API Integration', 'React'],
    hourlyRate: 95,
    avatarUrl: 'https://i.pravatar.cc/150?u=1a2b3c4d-0003',
  },
  {
    id: '1a2b3c4d-0004',
    name: 'Sarah Johnson',
    title: 'AI Product Engineer',
    skills: ['OpenAI API', 'React', 'Python', 'LangChain'],
    hourlyRate: 105,
    avatarUrl: 'https://i.pravatar.cc/150?u=1a2b3c4d-0004',
  },
  {
    id: '1a2b3c4d-0005',
    name: 'Michael Brown',
    title: 'Cloud & Data Engineer',
    skills: ['AWS', 'SQL', 'Data Science', 'Python', 'Node.js'],
    hourlyRate: 115,
    avatarUrl: 'https://i.pravatar.cc/150?u=1a2b3c4d-0005',
  },
  {
    id: '1a2b3c4d-0006',
    name: 'Priya Singh',
    title: 'Full-Stack AI Engineer',
    skills: ['React', 'Node.js', 'OpenAI API', 'LangChain', 'SQL'],
    hourlyRate: 100,
    avatarUrl: 'https://i.pravatar.cc/150?u=1a2b3c4d-0006',
  },
  {
    id: '1a2b3c4d-0007',
    name: 'Ethan Lee',
    title: 'Data & Analytics Engineer',
    skills: ['SQL', 'Python', 'Google Cloud', 'API Integration'],
    hourlyRate: 90,
    avatarUrl: 'https://i.pravatar.cc/150?u=1a2b3c4d-0007',
  },
  {
    id: '1a2b3c4d-0008',
    name: 'Laura Kim',
    title: 'NLP Engineer',
    skills: ['Natural Language Processing', 'Python', 'TensorFlow', 'OpenAI API'],
    hourlyRate: 130,
    avatarUrl: 'https://i.pravatar.cc/150?u=1a2b3c4d-0008',
  },
  {
    id: '1a2b3c4d-0009',
    name: 'Omar Farouk',
    title: 'Automation Specialist',
    skills: ['Workflow Automation', 'API Integration', 'Python', 'SQL'],
    hourlyRate: 85,
    avatarUrl: 'https://i.pravatar.cc/150?u=1a2b3c4d-0009',
  },
  {
    id: '1a2b3c4d-0010',
    name: 'Helena Petrova',
    title: 'Computer Vision Engineer',
    skills: ['Computer Vision', 'Python', 'PyTorch', 'AWS'],
    hourlyRate: 125,
    avatarUrl: 'https://i.pravatar.cc/150?u=1a2b3c4d-0010',
  },
  {
    id: '1a2b3c4d-0011',
    name: 'James Wilson',
    title: 'Backend & API Engineer',
    skills: ['Node.js', 'API Integration', 'SQL', 'AWS'],
    hourlyRate: 90,
    avatarUrl: 'https://i.pravatar.cc/150?u=1a2b3c4d-0011',
  },
  {
    id: '1a2b3c4d-0012',
    name: 'Chloe Martin',
    title: 'AI Solutions Architect',
    skills: ['Python', 'OpenAI API', 'LangChain', 'AWS', 'SQL'],
    hourlyRate: 140,
    avatarUrl: 'https://i.pravatar.cc/150?u=1a2b3c4d-0012',
  },
  {
    id: '1a2b3c4d-0013',
    name: 'Luis Alvarez',
    title: 'ML Ops Engineer',
    skills: ['TensorFlow', 'PyTorch', 'AWS', 'Docker', 'Kubernetes'],
    hourlyRate: 135,
    avatarUrl: 'https://i.pravatar.cc/150?u=1a2b3c4d-0013',
  },
  {
    id: '1a2b3c4d-0014',
    name: 'Rina Sato',
    title: 'Data Pipeline Engineer',
    skills: ['SQL', 'Python', 'API Integration', 'Google Cloud'],
    hourlyRate: 95,
    avatarUrl: 'https://i.pravatar.cc/150?u=1a2b3c4d-0014',
  },
  {
    id: '1a2b3c4d-0015',
    name: 'Maxime Dubois',
    title: 'AI Automation Engineer',
    skills: ['Workflow Automation', 'OpenAI API', 'LangChain', 'Node.js'],
    hourlyRate: 110,
    avatarUrl: 'https://i.pravatar.cc/150?u=1a2b3c4d-0015',
  },
];
