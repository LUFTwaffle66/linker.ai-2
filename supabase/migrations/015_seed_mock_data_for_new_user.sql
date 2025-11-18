-- =====================================================
-- SEED MOCK DATA FOR NEW SUPABASE AUTH USER
-- =====================================================
-- This migration creates mock freelancers, clients, projects, and proposals
-- IMPORTANT: Replace 'YOUR_USER_ID_HERE' with your actual Supabase Auth user ID
-- after you sign up through the UI

DO $$
DECLARE
  -- YOUR USER ID - Replace this with your actual user ID after signup
  v_your_user_id UUID := 'YOUR_USER_ID_HERE'; -- TODO: Replace this!

  -- Mock Freelancers
  v_freelancer_sarah UUID := gen_random_uuid();
  v_freelancer_michael UUID := gen_random_uuid();
  v_freelancer_emily UUID := gen_random_uuid();
  v_freelancer_david UUID := gen_random_uuid();

  -- Mock Clients
  v_client_john UUID := gen_random_uuid();
  v_client_lisa UUID := gen_random_uuid();
  v_client_robert UUID := gen_random_uuid();

  -- Mock Projects
  v_project_1 UUID := gen_random_uuid();
  v_project_2 UUID := gen_random_uuid();
  v_project_3 UUID := gen_random_uuid();
  v_project_4 UUID := gen_random_uuid();

BEGIN
  -- =====================================================
  -- INSERT MOCK USERS (Freelancers and Clients)
  -- =====================================================

  -- Insert Mock Freelancers
  INSERT INTO users (id, email, password_hash, full_name, role, avatar_url, email_verified, is_active, created_at)
  VALUES
    (v_freelancer_sarah, 'sarah.johnson@example.com', '', 'Sarah Johnson', 'freelancer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', true, true, NOW() - INTERVAL '6 months'),
    (v_freelancer_michael, 'michael.chen@example.com', '', 'Michael Chen', 'freelancer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', true, true, NOW() - INTERVAL '8 months'),
    (v_freelancer_emily, 'emily.rodriguez@example.com', '', 'Emily Rodriguez', 'freelancer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily', true, true, NOW() - INTERVAL '1 year'),
    (v_freelancer_david, 'david.kumar@example.com', '', 'David Kumar', 'freelancer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', true, true, NOW() - INTERVAL '2 years')
  ON CONFLICT (email) DO NOTHING;

  -- Insert Mock Clients
  INSERT INTO users (id, email, password_hash, full_name, role, company_name, avatar_url, email_verified, is_active, created_at)
  VALUES
    (v_client_john, 'john.smith@techcorp.com', '', 'John Smith', 'client', 'TechCorp Solutions', 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', true, true, NOW() - INTERVAL '1 year'),
    (v_client_lisa, 'lisa.wang@innovate.io', '', 'Lisa Wang', 'client', 'Innovate.io', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa', true, true, NOW() - INTERVAL '8 months'),
    (v_client_robert, 'robert.brown@startup.com', '', 'Robert Brown', 'client', 'StartupHub', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert', true, true, NOW() - INTERVAL '3 months')
  ON CONFLICT (email) DO NOTHING;

  -- =====================================================
  -- INSERT FREELANCER PROFILES
  -- =====================================================

  INSERT INTO freelancer_profiles (
    user_id, profile_image, title, bio, location, experience, skills, hourly_rate,
    portfolio, work_experience, onboarding_completed, created_at, updated_at
  )
  VALUES
    -- Sarah Johnson
    (
      v_freelancer_sarah,
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      'Senior ML Engineer & AI Consultant',
      'Specializing in deep learning, NLP, and computer vision. 8+ years building production ML systems.',
      'San Francisco, CA',
      8,
      ARRAY['TensorFlow', 'PyTorch', 'Python', 'Keras', 'Computer Vision', 'NLP', 'AWS SageMaker'],
      120,
      JSONB_BUILD_ARRAY(
        JSONB_BUILD_OBJECT('title', 'AI Chatbot Platform', 'description', 'Built conversational AI using GPT-4', 'url', 'https://example.com'),
        JSONB_BUILD_OBJECT('title', 'Image Recognition System', 'description', 'CNN-based image classifier with 95% accuracy', 'url', 'https://example.com')
      ),
      JSONB_BUILD_ARRAY(
        JSONB_BUILD_OBJECT('company', 'Google AI', 'position', 'ML Engineer', 'duration', '2020-2023'),
        JSONB_BUILD_OBJECT('company', 'OpenAI', 'position', 'Research Engineer', 'duration', '2018-2020')
      ),
      true,
      NOW() - INTERVAL '6 months',
      NOW() - INTERVAL '6 months'
    ),

    -- Michael Chen
    (
      v_freelancer_michael,
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      'Full Stack AI Developer | LangChain Expert',
      'Building intelligent applications with LangChain, OpenAI, and modern web frameworks.',
      'Austin, TX',
      4,
      ARRAY['LangChain', 'OpenAI API', 'React', 'Node.js', 'Python', 'Vector Databases'],
      85,
      JSONB_BUILD_ARRAY(
        JSONB_BUILD_OBJECT('title', 'RAG Document Chat', 'description', 'Built RAG system for enterprise docs', 'url', 'https://example.com')
      ),
      JSONB_BUILD_ARRAY(
        JSONB_BUILD_OBJECT('company', 'AI Startup', 'position', 'Full Stack Developer', 'duration', '2021-Present')
      ),
      true,
      NOW() - INTERVAL '8 months',
      NOW() - INTERVAL '8 months'
    ),

    -- Emily Rodriguez
    (
      v_freelancer_emily,
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      'AI Integration Specialist | Automation Expert',
      'Helping businesses integrate AI into existing workflows. Expert in APIs, automation, and ML pipelines.',
      'New York, NY',
      10,
      ARRAY['REST APIs', 'Python', 'FastAPI', 'Docker', 'CI/CD', 'Cloud Architecture'],
      150,
      JSONB_BUILD_ARRAY(
        JSONB_BUILD_OBJECT('title', 'Enterprise AI Dashboard', 'description', 'Real-time ML model monitoring', 'url', 'https://example.com')
      ),
      JSONB_BUILD_ARRAY(
        JSONB_BUILD_OBJECT('company', 'Microsoft', 'position', 'Senior Software Engineer', 'duration', '2019-2023')
      ),
      true,
      NOW() - INTERVAL '1 year',
      NOW() - INTERVAL '1 year'
    ),

    -- David Kumar
    (
      v_freelancer_david,
      'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      'Data Scientist & ML Consultant',
      'Transforming data into actionable insights. Expert in predictive modeling and data pipelines.',
      'Seattle, WA',
      6,
      ARRAY['Python', 'scikit-learn', 'Pandas', 'SQL', 'Data Visualization', 'Statistical Analysis'],
      95,
      JSONB_BUILD_ARRAY(
        JSONB_BUILD_OBJECT('title', 'Predictive Analytics Platform', 'description', 'Customer churn prediction model', 'url', 'https://example.com')
      ),
      JSONB_BUILD_ARRAY(
        JSONB_BUILD_OBJECT('company', 'Amazon', 'position', 'Data Scientist', 'duration', '2020-Present')
      ),
      true,
      NOW() - INTERVAL '2 years',
      NOW() - INTERVAL '2 years'
    )
  ON CONFLICT (user_id) DO NOTHING;

  -- =====================================================
  -- INSERT CLIENT PROFILES
  -- =====================================================

  INSERT INTO client_profiles (
    user_id, about_company, industry, company_size,
    website, location, onboarding_completed, created_at, updated_at
  )
  VALUES
    -- John Smith - TechCorp Solutions
    (
      v_client_john,
      'Enterprise software solutions for Fortune 500 companies',
      'Software',
      '500+',
      'https://techcorp-example.com',
      'San Francisco, CA',
      true,
      NOW() - INTERVAL '1 year',
      NOW() - INTERVAL '1 year'
    ),

    -- Lisa Wang - Innovate.io
    (
      v_client_lisa,
      'AI-powered productivity tools for modern teams',
      'Technology',
      '50-200',
      'https://innovate-example.io',
      'Boston, MA',
      true,
      NOW() - INTERVAL '8 months',
      NOW() - INTERVAL '8 months'
    ),

    -- Robert Brown - StartupHub
    (
      v_client_robert,
      'Connecting startups with resources and talent',
      'Technology',
      '10-50',
      'https://startuphub-example.com',
      'Austin, TX',
      true,
      NOW() - INTERVAL '3 months',
      NOW() - INTERVAL '3 months'
    )
  ON CONFLICT (user_id) DO NOTHING;

  -- =====================================================
  -- INSERT MOCK PROJECTS
  -- =====================================================

  INSERT INTO projects (
    id, client_id, title, category, description, fixed_budget,
    timeline, status, skills, is_published, created_at
  )
  VALUES
    -- Project 1: AI Chatbot
    (
      v_project_1,
      v_client_john,
      'Build AI-Powered Customer Support Chatbot',
      'AI & Machine Learning',
      'We need an intelligent chatbot that can handle customer inquiries, integrate with our knowledge base, and escalate complex issues to human agents. Must use GPT-4 or similar LLM with RAG capabilities.',
      5000,
      '4-6 weeks',
      'open',
      ARRAY['OpenAI API', 'LangChain', 'Python', 'RAG', 'Vector Databases'],
      true,
      NOW() - INTERVAL '3 days'
    ),

    -- Project 2: ML Pipeline
    (
      v_project_2,
      v_client_lisa,
      'Machine Learning Pipeline for Product Recommendations',
      'AI & Machine Learning',
      'Looking for an expert to build an end-to-end ML pipeline for our product recommendation system. Need to process user behavior data and generate personalized recommendations in real-time.',
      8000,
      '8-12 weeks',
      'open',
      ARRAY['Python', 'TensorFlow', 'AWS', 'Docker', 'MLOps'],
      true,
      NOW() - INTERVAL '5 days'
    ),

    -- Project 3: Data Dashboard
    (
      v_project_3,
      v_client_robert,
      'Interactive Analytics Dashboard with AI Insights',
      'Web Development',
      'Create a beautiful dashboard that displays business metrics and uses AI to generate insights and predictions. Should include data visualization and natural language querying.',
      4500,
      '3-4 weeks',
      'open',
      ARRAY['React', 'Python', 'FastAPI', 'Chart.js', 'OpenAI API'],
      true,
      NOW() - INTERVAL '1 day'
    ),

    -- Project 4: Computer Vision
    (
      v_project_4,
      v_client_john,
      'Computer Vision System for Quality Control',
      'AI & Machine Learning',
      'Develop a computer vision system to detect defects in manufacturing. Need real-time image processing and classification with high accuracy.',
      12000,
      '10-16 weeks',
      'open',
      ARRAY['Computer Vision', 'PyTorch', 'OpenCV', 'Python', 'Edge AI'],
      true,
      NOW() - INTERVAL '7 days'
    );

  -- =====================================================
  -- INSERT MOCK PROPOSALS
  -- =====================================================

  INSERT INTO proposals (
    project_id, freelancer_id, cover_letter, total_budget, timeline, status, created_at
  )
  VALUES
    -- Proposal from Sarah to Project 1
    (
      v_project_1,
      v_freelancer_sarah,
      'Hi! I have 8+ years of experience building production ML systems including several AI chatbots. I recently built a similar system for a Fortune 500 company that reduced support tickets by 40%. I can deliver a high-quality RAG-based chatbot with GPT-4 integration within your timeline.',
      4800,
      '4-6 weeks',
      'submitted',
      NOW() - INTERVAL '2 days'
    ),

    -- Proposal from Michael to Project 3
    (
      v_project_3,
      v_freelancer_michael,
      'I specialize in building full-stack AI applications. I can create an interactive dashboard with AI-powered insights using React, FastAPI, and OpenAI. I have experience with similar projects and can deliver within your budget.',
      4500,
      '3-4 weeks',
      'submitted',
      NOW() - INTERVAL '1 day'
    ),

    -- Proposal from Emily to Project 2
    (
      v_project_2,
      v_freelancer_emily,
      'With 10+ years at Microsoft building ML systems, I am well-equipped to build your recommendation pipeline. I have experience with MLOps, real-time processing, and deploying production ML systems at scale.',
      7500,
      '8-10 weeks',
      'submitted',
      NOW() - INTERVAL '4 days'
    ),

    -- Proposal from David to Project 4
    (
      v_project_4,
      v_freelancer_david,
      'I have extensive experience in computer vision for manufacturing. At Amazon, I built similar defect detection systems achieving 98% accuracy. I can deliver a robust solution with real-time processing capabilities.',
      11000,
      '10-12 weeks',
      'submitted',
      NOW() - INTERVAL '5 days'
    );

  RAISE NOTICE 'Mock data inserted successfully!';
  RAISE NOTICE 'IMPORTANT: Replace YOUR_USER_ID_HERE with your actual user ID in the migration file!';

END $$;
