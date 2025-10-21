-- Migration: Seed mock data for testing
-- Description: Populates freelancer_profiles and projects tables with realistic mock data

-- Note: Using gen_random_uuid() for proper UUID generation instead of hardcoded values
-- This ensures PostgreSQL-compliant UUID format

-- =============================================
-- Insert Mock Users (Freelancers and Clients)
-- =============================================

-- Insert Freelancers with generated UUIDs
DO $$
DECLARE
  -- Your actual user (Devansh Tiwari)
  freelancer_devansh UUID := 'c96cb8a9-c3db-42b1-88f8-07d77f657987';

  freelancer_sarah UUID := gen_random_uuid();
  freelancer_michael UUID := gen_random_uuid();
  freelancer_emily UUID := gen_random_uuid();
  freelancer_david UUID := gen_random_uuid();
  freelancer_olivia UUID := gen_random_uuid();
  freelancer_james UUID := gen_random_uuid();
  freelancer_sophia UUID := gen_random_uuid();
  freelancer_alex UUID := gen_random_uuid();
BEGIN
  -- Insert Freelancers (including your user)
  INSERT INTO users (id, email, password_hash, full_name, role, avatar_url, email_verified, is_active, created_at)
  VALUES
    (freelancer_devansh, 'devanshtiwari@gmail.com', '$2b$10$yk8DvZo6Pp3bDZxRWeOKo.N1t', 'Devansh Tiwari', 'freelancer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Devansh', true, true, NOW() - INTERVAL '3 months'),
    (freelancer_sarah, 'sarah.johnson@example.com', '$2a$10$X7vQJQqGPZmWmRJ5H7fKj.mockhashmockhashmock', 'Sarah Johnson', 'freelancer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', true, true, NOW() - INTERVAL '6 months'),
    (freelancer_michael, 'michael.chen@example.com', '$2a$10$X7vQJQqGPZmWmRJ5H7fKj.mockhashmockhashmock', 'Michael Chen', 'freelancer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', true, true, NOW() - INTERVAL '8 months'),
    (freelancer_emily, 'emily.rodriguez@example.com', '$2a$10$X7vQJQqGPZmWmRJ5H7fKj.mockhashmockhashmock', 'Emily Rodriguez', 'freelancer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily', true, true, NOW() - INTERVAL '1 year'),
    (freelancer_david, 'david.kumar@example.com', '$2a$10$X7vQJQqGPZmWmRJ5H7fKj.mockhashmockhashmock', 'David Kumar', 'freelancer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', true, true, NOW() - INTERVAL '2 years'),
    (freelancer_olivia, 'olivia.martinez@example.com', '$2a$10$X7vQJQqGPZmWmRJ5H7fKj.mockhashmockhashmock', 'Olivia Martinez', 'freelancer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia', true, true, NOW() - INTERVAL '3 months'),
    (freelancer_james, 'james.wilson@example.com', '$2a$10$X7vQJQqGPZmWmRJ5H7fKj.mockhashmockhashmock', 'James Wilson', 'freelancer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', true, true, NOW() - INTERVAL '1 year'),
    (freelancer_sophia, 'sophia.anderson@example.com', '$2a$10$X7vQJQqGPZmWmRJ5H7fKj.mockhashmockhashmock', 'Sophia Anderson', 'freelancer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia', true, true, NOW() - INTERVAL '5 months'),
    (freelancer_alex, 'alex.thompson@example.com', '$2a$10$X7vQJQqGPZmWmRJ5H7fKj.mockhashmockhashmock', 'Alex Thompson', 'freelancer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', true, true, NOW() - INTERVAL '4 months')
  ON CONFLICT (email) DO NOTHING;

  -- Insert Freelancer Profiles
  INSERT INTO freelancer_profiles (
    user_id, profile_image, title, bio, location, experience, skills, hourly_rate,
    portfolio, work_experience, onboarding_completed, created_at, updated_at
  )
  SELECT * FROM (VALUES
    -- Devansh Tiwari - Your Profile
    (
      freelancer_devansh,
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Devansh',
      'Full Stack Developer & AI Integration Specialist',
      'Passionate full-stack developer with expertise in building modern web applications and integrating AI solutions. Proficient in React, Next.js, TypeScript, and Node.js. Experienced in implementing GPT-4, LangChain, and creating seamless AI-powered user experiences. Strong focus on clean code, scalable architecture, and delivering production-ready solutions.',
      'India',
      3,
      ARRAY['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'GPT-4', 'LangChain', 'Supabase', 'PostgreSQL', 'TailwindCSS'],
      65.00,
      '[{"id":"p1","title":"AI-Powered SaaS Platform","description":"Built a complete SaaS application with AI chatbot integration, user authentication, and real-time features","tags":["Next.js","TypeScript","Supabase","OpenAI"]},{"id":"p2","title":"E-commerce Automation System","description":"Developed automated workflows for inventory management and order processing","tags":["React","Node.js","API Integration"]}]'::jsonb,
      '[{"id":"w1","company":"Freelance","position":"Full Stack Developer","startDate":"2022-01","endDate":null,"description":"Building web applications and AI integrations for various clients"}]'::jsonb,
      true,
      NOW() - INTERVAL '3 months',
      NOW()
    ),
    -- Sarah Johnson - AI Chatbot Specialist
    (
      freelancer_sarah,
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      'AI Chatbot & NLP Engineer',
      'Specialized in building intelligent conversational AI systems using GPT-4, Python, and modern NLP frameworks. 5+ years of experience delivering production-ready chatbots for e-commerce, customer support, and enterprise applications. Expert in LangChain, vector databases, and seamless API integrations.',
      'San Francisco, CA',
      5,
      ARRAY['GPT-4', 'Python', 'LangChain', 'NLP', 'TensorFlow', 'API Integration', 'React', 'Node.js'],
      95.00,
      '[{"id":"p1","title":"E-commerce Customer Support Bot","description":"Built an AI-powered chatbot that handles 1000+ daily customer inquiries with 95% accuracy","tags":["GPT-4","Python","LangChain"]}]'::jsonb,
      '[{"id":"w1","company":"AI Solutions Inc","position":"Senior ML Engineer","startDate":"2020-01","endDate":"2023-12","description":"Led development of conversational AI products"}]'::jsonb,
      true,
      NOW() - INTERVAL '6 months',
      NOW() - INTERVAL '1 day'
    ),
    -- Michael Chen - RPA Automation Expert
    (
      freelancer_michael,
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      'RPA & Process Automation Specialist',
      'Expert in UiPath, Power Automate, and Python automation. Specialized in automating complex business workflows, data entry, and document processing. 6+ years helping companies save 100+ hours/month through intelligent automation.',
      'Austin, TX',
      6,
      ARRAY['UiPath', 'Power Automate', 'Python', 'Selenium', 'APIs', 'Excel Automation', 'Web Scraping'],
      85.00,
      '[{"id":"p1","title":"Invoice Processing Automation","description":"Automated invoice processing for Fortune 500 company, reducing processing time by 85%","tags":["UiPath","OCR","SAP Integration"]}]'::jsonb,
      '[{"id":"w1","company":"Automation Experts LLC","position":"Lead RPA Developer","startDate":"2018-03","endDate":null,"description":"Leading RPA implementation projects"}]'::jsonb,
      true,
      NOW() - INTERVAL '8 months',
      NOW() - INTERVAL '2 days'
    ),
    -- Emily Rodriguez - ML & Data Analytics
    (
      freelancer_emily,
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      'Machine Learning & Data Analytics Expert',
      'Data scientist with expertise in predictive modeling, ML pipelines, and business intelligence. Proficient in Python, TensorFlow, and cloud platforms. 7+ years turning data into actionable insights and automated decision-making systems.',
      'New York, NY',
      7,
      ARRAY['Machine Learning', 'Python', 'TensorFlow', 'PyTorch', 'SQL', 'Tableau', 'AWS', 'Scikit-learn'],
      90.00,
      '[{"id":"p1","title":"Predictive Sales Forecasting Model","description":"Built ML model that improved sales forecasts accuracy by 40% for retail chain","tags":["Python","TensorFlow","AWS"]}]'::jsonb,
      '[{"id":"w1","company":"DataCorp Analytics","position":"Senior Data Scientist","startDate":"2017-06","endDate":"2024-01","description":"Built ML models for various industries"}]'::jsonb,
      true,
      NOW() - INTERVAL '1 year',
      NOW()
    ),
    -- David Kumar - Computer Vision AI
    (
      freelancer_david,
      'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      'Computer Vision & AI Engineer',
      'Specialized in computer vision, image recognition, and video analytics using PyTorch and OpenCV. 8+ years building AI systems for quality control, security, and medical imaging applications.',
      'Seattle, WA',
      8,
      ARRAY['PyTorch', 'Computer Vision', 'Python', 'OpenCV', 'YOLO', 'Deep Learning', 'AWS'],
      88.00,
      '[{"id":"p1","title":"Automated Quality Control System","description":"Developed vision AI system for manufacturing defect detection with 98% accuracy","tags":["PyTorch","OpenCV","Python"]}]'::jsonb,
      '[{"id":"w1","company":"Vision AI Labs","position":"Principal AI Engineer","startDate":"2016-01","endDate":null,"description":"Leading computer vision projects"}]'::jsonb,
      true,
      NOW() - INTERVAL '2 years',
      NOW() - INTERVAL '1 week'
    ),
    -- Olivia Martinez - Full Stack AI Developer
    (
      freelancer_olivia,
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia',
      'Full Stack AI Application Developer',
      'Building end-to-end AI applications from backend ML models to production-ready web interfaces. Expert in OpenAI API, LangChain, React, and Node.js. 4+ years creating AI-powered SaaS products.',
      'Denver, CO',
      4,
      ARRAY['OpenAI API', 'LangChain', 'React', 'Node.js', 'Python', 'TypeScript', 'Next.js', 'FastAPI'],
      80.00,
      '[{"id":"p1","title":"AI Content Generation Platform","description":"Built SaaS platform for AI-powered content creation serving 5000+ users","tags":["OpenAI","React","Node.js"]}]'::jsonb,
      '[{"id":"w1","company":"Startup Inc","position":"Full Stack Developer","startDate":"2020-06","endDate":"2023-12","description":"Built AI-powered web applications"}]'::jsonb,
      true,
      NOW() - INTERVAL '3 months',
      NOW() - INTERVAL '3 days'
    ),
    -- James Wilson - Workflow Automation
    (
      freelancer_james,
      'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
      'Workflow Automation & Integration Expert',
      'Specialist in Zapier, Make.com, and custom API integrations. Connecting tools and automating workflows for maximum efficiency. 5+ years helping businesses eliminate manual processes.',
      'Boston, MA',
      5,
      ARRAY['Zapier', 'Make.com', 'API Integration', 'Python', 'JavaScript', 'Webhooks', 'REST APIs'],
      75.00,
      '[{"id":"p1","title":"Multi-Platform Integration System","description":"Connected 15+ business tools saving client 30 hours/week in manual data entry","tags":["Zapier","APIs","JavaScript"]}]'::jsonb,
      '[]'::jsonb,
      true,
      NOW() - INTERVAL '1 year',
      NOW() - INTERVAL '5 days'
    ),
    -- Sophia Anderson - AI Research & Development
    (
      freelancer_sophia,
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
      'AI Research Engineer & Innovation Consultant',
      'PhD in AI with focus on cutting-edge LLM applications and autonomous agents. Expertise in prompt engineering, RAG systems, and custom AI model fine-tuning. 6+ years in AI research and product development.',
      'Palo Alto, CA',
      6,
      ARRAY['GPT-4', 'LangChain', 'Vector Databases', 'Fine-tuning', 'Prompt Engineering', 'Python', 'Research'],
      100.00,
      '[{"id":"p1","title":"Enterprise RAG System","description":"Developed retrieval-augmented generation system for Fortune 100 company knowledge base","tags":["GPT-4","Pinecone","LangChain"]}]'::jsonb,
      '[{"id":"w1","company":"AI Research Lab","position":"Research Scientist","startDate":"2018-09","endDate":null,"description":"Leading AI innovation projects"}]'::jsonb,
      true,
      NOW() - INTERVAL '5 months',
      NOW()
    ),
    -- Alex Thompson - DevOps & AI Infrastructure
    (
      freelancer_alex,
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      'AI Infrastructure & MLOps Engineer',
      'Specialized in deploying and scaling AI/ML systems. Expert in Docker, Kubernetes, AWS, and CI/CD pipelines for ML models. 5+ years building production-ready AI infrastructure.',
      'Portland, OR',
      5,
      ARRAY['Docker', 'Kubernetes', 'AWS', 'MLOps', 'Python', 'CI/CD', 'Terraform', 'Monitoring'],
      82.00,
      '[{"id":"p1","title":"ML Model Deployment Pipeline","description":"Built automated deployment system for ML models reducing deployment time by 90%","tags":["Docker","Kubernetes","AWS"]}]'::jsonb,
      '[{"id":"w1","company":"CloudTech Solutions","position":"DevOps Engineer","startDate":"2019-03","endDate":null,"description":"Managing cloud infrastructure for AI systems"}]'::jsonb,
      true,
      NOW() - INTERVAL '4 months',
      NOW() - INTERVAL '1 day'
    )
  ) AS data
  ON CONFLICT (user_id) DO NOTHING;

  RAISE NOTICE 'Freelancer users and profiles created successfully!';
END $$;

-- Insert Clients
DO $$
DECLARE
  client_john UUID := gen_random_uuid();
  client_lisa UUID := gen_random_uuid();
  client_robert UUID := gen_random_uuid();
  client_maria UUID := gen_random_uuid();
  client_william UUID := gen_random_uuid();
BEGIN
  INSERT INTO users (id, email, password_hash, full_name, role, company_name, avatar_url, email_verified, is_active, created_at)
  VALUES
    (client_john, 'john.smith@techcorp.com', '$2a$10$X7vQJQqGPZmWmRJ5H7fKj.mockhashmockhashmock', 'John Smith', 'client', 'TechCorp Inc', 'https://api.dicebear.com/7.x/initials/svg?seed=TechCorp', true, true, NOW() - INTERVAL '1 year'),
    (client_lisa, 'lisa.brown@shophub.com', '$2a$10$X7vQJQqGPZmWmRJ5H7fKj.mockhashmockhashmock', 'Lisa Brown', 'client', 'ShopHub Inc', 'https://api.dicebear.com/7.x/initials/svg?seed=ShopHub', true, true, NOW() - INTERVAL '8 months'),
    (client_robert, 'robert.davis@financeai.com', '$2a$10$X7vQJQqGPZmWmRJ5H7fKj.mockhashmockhashmock', 'Robert Davis', 'client', 'FinanceAI Solutions', 'https://api.dicebear.com/7.x/initials/svg?seed=FinanceAI', true, true, NOW() - INTERVAL '6 months'),
    (client_maria, 'maria.garcia@healthtech.com', '$2a$10$X7vQJQqGPZmWmRJ5H7fKj.mockhashmockhashmock', 'Maria Garcia', 'client', 'HealthTech Pro', 'https://api.dicebear.com/7.x/initials/svg?seed=HealthTech', true, true, NOW() - INTERVAL '4 months'),
    (client_william, 'william.lee@datainsights.com', '$2a$10$X7vQJQqGPZmWmRJ5H7fKj.mockhashmockhashmock', 'William Lee', 'client', 'DataInsights Corp', 'https://api.dicebear.com/7.x/initials/svg?seed=DataInsights', true, true, NOW() - INTERVAL '3 months')
  ON CONFLICT (email) DO NOTHING;

  -- Insert Client Profiles
  INSERT INTO client_profiles (
    user_id, profile_image, location, website, industry, company_size,
    about_company, project_goals, budget_range, timeline, onboarding_completed, created_at, updated_at
  )
  SELECT * FROM (VALUES
    (
      client_john,
      'https://api.dicebear.com/7.x/initials/svg?seed=TechCorp',
      'San Francisco, CA',
      'https://techcorp.example.com',
      'SaaS',
      '50-200',
      'Leading provider of enterprise software solutions serving Fortune 500 companies worldwide.',
      ARRAY['Automate customer support', 'Improve response times', 'Scale operations'],
      'large',
      'medium',
      true,
      NOW() - INTERVAL '1 year',
      NOW() - INTERVAL '1 month'
    ),
    (
      client_lisa,
      'https://api.dicebear.com/7.x/initials/svg?seed=ShopHub',
      'Los Angeles, CA',
      'https://shophub.example.com',
      'E-commerce',
      '10-50',
      'Fast-growing e-commerce platform connecting buyers with local sellers.',
      ARRAY['Build AI chatbot', 'Automate order processing', 'Personalize recommendations'],
      'medium',
      'urgent',
      true,
      NOW() - INTERVAL '8 months',
      NOW() - INTERVAL '2 weeks'
    ),
    (
      client_robert,
      'https://api.dicebear.com/7.x/initials/svg?seed=FinanceAI',
      'New York, NY',
      'https://financeai.example.com',
      'Finance',
      '200-500',
      'AI-powered financial analytics and investment platform for institutional clients.',
      ARRAY['Predictive analytics', 'Risk assessment', 'Market automation'],
      'large',
      'long',
      true,
      NOW() - INTERVAL '6 months',
      NOW() - INTERVAL '1 week'
    ),
    (
      client_maria,
      'https://api.dicebear.com/7.x/initials/svg?seed=HealthTech',
      'Seattle, WA',
      'https://healthtech.example.com',
      'Healthcare',
      '50-200',
      'Healthcare technology company revolutionizing patient care with AI solutions.',
      ARRAY['Patient data automation', 'Appointment scheduling', 'Medical imaging AI'],
      'medium',
      'medium',
      true,
      NOW() - INTERVAL '4 months',
      NOW() - INTERVAL '3 days'
    ),
    (
      client_william,
      'https://api.dicebear.com/7.x/initials/svg?seed=DataInsights',
      'Chicago, IL',
      'https://datainsights.example.com',
      'Analytics',
      '10-50',
      'Business intelligence and data analytics consultancy helping companies make data-driven decisions.',
      ARRAY['Dashboard automation', 'Report generation', 'Data pipeline'],
      'small',
      'short',
      true,
      NOW() - INTERVAL '3 months',
      NOW()
    )
  ) AS data
  ON CONFLICT (user_id) DO NOTHING;

  RAISE NOTICE 'Client users and profiles created successfully!';
  RAISE NOTICE 'Mock data seeded successfully!';
  RAISE NOTICE '- 8 Freelancer users and profiles created';
  RAISE NOTICE '- 5 Client users and profiles created';
END $$;
