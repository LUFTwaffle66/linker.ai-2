-- Migration: Seed projects and proposals with mock data
-- Description: Creates realistic project postings and freelancer proposals (including Devansh's proposals)

-- Note: This migration references the user IDs created in migration 005
-- Make sure to run migration 005 first

DO $$
DECLARE
  -- Devansh's user ID (your actual account)
  freelancer_devansh UUID := 'c96cb8a9-c3db-42b1-88f8-07d77f657987';

  -- Client IDs (will be fetched from database)
  client_techcorp UUID;
  client_shophub UUID;
  client_financeai UUID;
  client_healthtech UUID;
  client_datainsights UUID;

  -- Freelancer IDs (will be fetched from database)
  freelancer_sarah UUID;
  freelancer_michael UUID;
  freelancer_emily UUID;
  freelancer_david UUID;
  freelancer_olivia UUID;
  freelancer_sophia UUID;

  -- Project IDs
  project_chatbot UUID := gen_random_uuid();
  project_invoice UUID := gen_random_uuid();
  project_forecasting UUID := gen_random_uuid();
  project_medical UUID := gen_random_uuid();
  project_report UUID := gen_random_uuid();
  project_integration UUID := gen_random_uuid();
  project_rag UUID := gen_random_uuid();
  project_mlops UUID := gen_random_uuid();
BEGIN
  -- Fetch client IDs
  SELECT id INTO client_techcorp FROM users WHERE email = 'john.smith@techcorp.com';
  SELECT id INTO client_shophub FROM users WHERE email = 'lisa.brown@shophub.com';
  SELECT id INTO client_financeai FROM users WHERE email = 'robert.davis@financeai.com';
  SELECT id INTO client_healthtech FROM users WHERE email = 'maria.garcia@healthtech.com';
  SELECT id INTO client_datainsights FROM users WHERE email = 'william.lee@datainsights.com';

  -- Fetch freelancer IDs
  SELECT id INTO freelancer_sarah FROM users WHERE email = 'sarah.johnson@example.com';
  SELECT id INTO freelancer_michael FROM users WHERE email = 'michael.chen@example.com';
  SELECT id INTO freelancer_emily FROM users WHERE email = 'emily.rodriguez@example.com';
  SELECT id INTO freelancer_david FROM users WHERE email = 'david.kumar@example.com';
  SELECT id INTO freelancer_olivia FROM users WHERE email = 'olivia.martinez@example.com';
  SELECT id INTO freelancer_sophia FROM users WHERE email = 'sophia.anderson@example.com';

  -- =============================================
  -- Insert Mock Projects
  -- =============================================

  INSERT INTO projects (
    id, client_id, title, category, description, skills, fixed_budget, timeline,
    attachments, invited_freelancers, status, proposal_count, is_published, is_featured,
    created_at, updated_at, published_at
  )
  VALUES
    -- Project 1: AI Chatbot (ShopHub) - Devansh will submit proposal
    (
      project_chatbot,
      client_shophub,
      'AI Chatbot for E-commerce Customer Support',
      'AI Chatbot',
      'We need an AI-powered chatbot using GPT-4 to handle customer support inquiries for our e-commerce platform. The chatbot must integrate with our existing CRM system and handle 1000+ daily queries efficiently.

Key Requirements:
- Natural language understanding for customer questions
- Integration with Shopify and our custom CRM
- Ability to handle order status, returns, product recommendations
- Multi-language support (English, Spanish)
- Escalation to human agents when needed
- Analytics dashboard for tracking performance

Current Pain Points:
- Customer service team overwhelmed with repetitive questions
- Average response time is 2+ hours
- Need 24/7 availability

Expected Outcomes:
- Reduce response time to under 1 minute
- Handle 70%+ of inquiries automatically
- Improve customer satisfaction scores',
      ARRAY['GPT-4', 'Python', 'API Integration', 'Natural Language Processing', 'React', 'Node.js'],
      12000.00,
      '1-month',
      '[]'::jsonb,
      ARRAY[freelancer_sarah, freelancer_olivia, freelancer_devansh],
      'open',
      0,
      true,
      true,
      NOW() - INTERVAL '5 days',
      NOW() - INTERVAL '5 days',
      NOW() - INTERVAL '5 days'
    ),

    -- Project 2: Invoice Processing (TechCorp)
    (
      project_invoice,
      client_techcorp,
      'Automated Invoice Processing & Data Entry System',
      'Process Automation',
      'Looking for an experienced RPA developer to automate our invoice processing workflow. Currently processing 500+ invoices per week manually.

Project Scope:
- OCR extraction from PDF invoices
- Data validation and error checking
- Integration with our ERP system (SAP)
- Email notifications for approvals
- Exception handling workflow
- Detailed logging and audit trail

Technical Requirements:
- UiPath or Power Automate preferred
- Experience with SAP integration
- OCR technology (ABBYY or similar)
- Robust error handling

Goal: Reduce processing time by 80% and eliminate manual data entry errors.',
      ARRAY['UiPath', 'Power Automate', 'Python', 'OCR', 'SAP Integration', 'Excel Automation'],
      18000.00,
      '2-3-months',
      '[]'::jsonb,
      ARRAY[freelancer_michael],
      'open',
      0,
      true,
      true,
      NOW() - INTERVAL '3 days',
      NOW() - INTERVAL '3 days',
      NOW() - INTERVAL '3 days'
    ),

    -- Project 3: Sales Forecasting (FinanceAI) - Devansh will submit proposal
    (
      project_forecasting,
      client_financeai,
      'ML-Powered Sales Forecasting & Analytics Platform',
      'Machine Learning',
      'We need a machine learning solution to predict sales trends and automate our forecasting process. Currently using manual Excel-based forecasts that are often inaccurate.

Project Goals:
- Build ML model for sales forecasting (next 3, 6, 12 months)
- Interactive dashboard for visualizing predictions
- Automated daily/weekly report generation
- Integration with our data warehouse (Snowflake)
- Historical data analysis and pattern recognition

Technical Stack Preferences:
- Python (TensorFlow or PyTorch)
- Tableau or similar for dashboards
- AWS for deployment
- CI/CD pipeline for model updates

Success Metrics:
- Forecast accuracy >85%
- Reduce forecasting time from 2 days to automated
- Enable data-driven decision making',
      ARRAY['Machine Learning', 'Python', 'TensorFlow', 'Tableau', 'SQL', 'AWS', 'Data Analytics'],
      25000.00,
      '3-6-months',
      '[]'::jsonb,
      ARRAY[freelancer_emily],
      'open',
      0,
      true,
      false,
      NOW() - INTERVAL '7 days',
      NOW() - INTERVAL '7 days',
      NOW() - INTERVAL '7 days'
    ),

    -- Project 4: Medical Imaging (HealthTech)
    (
      project_medical,
      client_healthtech,
      'Computer Vision AI for Medical Image Analysis',
      'Computer Vision',
      'Healthcare technology project requiring computer vision expertise to analyze medical images and assist in diagnosis.

Project Overview:
- Develop AI model for detecting anomalies in X-ray images
- Support for multiple image types (chest X-rays, bone scans)
- Integration with our existing PACS system
- HIPAA-compliant deployment
- User-friendly interface for radiologists

Technical Requirements:
- PyTorch or TensorFlow for model development
- Experience with medical imaging datasets
- Understanding of HIPAA compliance
- AWS deployment with encryption
- Model explainability

Deliverables:
- Trained model with >95% accuracy
- Web-based review interface
- API for integration
- Documentation and training materials
- 3 months post-launch support',
      ARRAY['PyTorch', 'Computer Vision', 'Python', 'Deep Learning', 'AWS', 'Healthcare', 'AI'],
      45000.00,
      '3-6-months',
      '[]'::jsonb,
      ARRAY[freelancer_david],
      'open',
      0,
      true,
      true,
      NOW() - INTERVAL '2 days',
      NOW() - INTERVAL '2 days',
      NOW() - INTERVAL '2 days'
    ),

    -- Project 5: Report Generation (DataInsights) - Devansh will submit proposal
    (
      project_report,
      client_datainsights,
      'AI-Powered Report Generation & Business Intelligence Tool',
      'AI Chatbot',
      'Need to build an internal tool that uses AI to automatically generate business intelligence reports from our data warehouse.

Requirements:
- Natural language queries to SQL conversion
- Automated report writing based on data analysis
- Integration with our PostgreSQL data warehouse
- Slack notifications for key insights
- Scheduled report generation
- Custom templates for different report types

Technology Preferences:
- OpenAI API (GPT-4)
- LangChain for orchestration
- React + Node.js for web interface
- PostgreSQL integration
- Deployment on AWS

Team Access:
- Will be used by 50+ employees
- Different permission levels
- Audit logging required

Timeline: Need MVP in 4-6 weeks, full production version in 2 months',
      ARRAY['OpenAI API', 'LangChain', 'React', 'Node.js', 'PostgreSQL', 'Python', 'AWS'],
      15000.00,
      '1-2-weeks',
      '[]'::jsonb,
      ARRAY[freelancer_olivia, freelancer_sophia, freelancer_devansh],
      'open',
      0,
      true,
      false,
      NOW() - INTERVAL '1 day',
      NOW() - INTERVAL '1 day',
      NOW() - INTERVAL '1 day'
    ),

    -- Project 6: Workflow Integration (TechCorp)
    (
      project_integration,
      client_techcorp,
      'Multi-Platform Integration & Workflow Automation',
      'Workflow Automation',
      'We need to connect and automate workflows across our tech stack (15+ tools). Looking for an integration expert to eliminate manual data transfers.

Tools to Integrate:
- Salesforce, HubSpot, Slack, Jira, Google Workspace, QuickBooks, Zendesk, and 8 more...

Automation Workflows Needed:
- Lead management automation
- Support ticket routing
- Invoice processing
- And 20+ more workflows...

Requirements:
- Use Zapier, Make.com, or custom APIs
- Robust error handling and retry logic
- Monitoring and alerting
- Documentation for future maintenance

Goal: Achieve near-real-time data sync across all platforms',
      ARRAY['Zapier', 'Make.com', 'API Integration', 'Python', 'JavaScript', 'Webhooks'],
      10000.00,
      '1-month',
      '[]'::jsonb,
      NULL,
      'open',
      0,
      true,
      false,
      NOW() - INTERVAL '4 days',
      NOW() - INTERVAL '4 days',
      NOW() - INTERVAL '4 days'
    ),

    -- Project 7: Enterprise RAG (TechCorp)
    (
      project_rag,
      client_techcorp,
      'Enterprise RAG System for Internal Knowledge Base',
      'AI Chatbot',
      'Building an enterprise-grade Retrieval-Augmented Generation system to make our internal knowledge base searchable and interactive via AI.

Project Background:
- 10+ years of documentation, wikis, and internal resources
- 5000+ employees need quick access to information
- Current search is keyword-based and ineffective

Solution Requirements:
- RAG system using GPT-4 and vector database
- Semantic search across all documents
- Conversational interface for queries
- Document upload and auto-indexing
- Citation and source tracking
- Role-based access control

Technical Stack:
- GPT-4 API
- Vector database (Pinecone, Weaviate, or similar)
- LangChain for orchestration
- React frontend, Python backend
- AWS deployment

This is a high-priority strategic project with executive sponsorship.',
      ARRAY['GPT-4', 'LangChain', 'Vector Databases', 'Python', 'React', 'RAG', 'NLP'],
      38000.00,
      '2-3-months',
      '[]'::jsonb,
      ARRAY[freelancer_sophia, freelancer_sarah],
      'open',
      0,
      true,
      true,
      NOW() - INTERVAL '6 days',
      NOW() - INTERVAL '6 days',
      NOW() - INTERVAL '6 days'
    ),

    -- Project 8: MLOps (FinanceAI)
    (
      project_mlops,
      client_financeai,
      'MLOps Infrastructure & Automated Deployment Pipeline',
      'Workflow Automation',
      'Need DevOps/MLOps expert to build infrastructure for deploying and monitoring our machine learning models in production.

Project Goals:
- Automated ML model deployment pipeline
- Containerization with Docker
- Kubernetes orchestration
- Model versioning and rollback
- A/B testing framework
- Performance monitoring and alerting
- Cost optimization

Infrastructure:
- AWS cloud environment
- Multiple ML models (Python/TensorFlow)
- Real-time and batch inference
- Need to handle 1M+ predictions/day

Timeline: 6-8 weeks for MVP, ongoing optimization',
      ARRAY['Docker', 'Kubernetes', 'AWS', 'MLOps', 'Python', 'CI/CD', 'Terraform'],
      22000.00,
      '1-2-weeks',
      '[]'::jsonb,
      NULL,
      'open',
      0,
      true,
      false,
      NOW() - INTERVAL '8 days',
      NOW() - INTERVAL '8 days',
      NOW() - INTERVAL '8 days'
    );

  -- =============================================
  -- Insert Mock Proposals
  -- =============================================

  INSERT INTO proposals (
    id, project_id, freelancer_id, cover_letter, total_budget, timeline,
    status, viewed_by_client, created_at, updated_at
  )
  VALUES
    -- Devansh's Proposal 1: AI Chatbot Project
    (
      gen_random_uuid(),
      project_chatbot,
      freelancer_devansh,
      'Hi Lisa,

I''m excited to submit my proposal for your AI chatbot project! As a full-stack developer specializing in AI integrations, I have hands-on experience building chatbot solutions with GPT-4 and LangChain.

My Relevant Experience:
✓ Built AI-powered SaaS platform with chatbot integration
✓ Proficient in React, Node.js, and OpenAI API
✓ Experience with e-commerce platforms and CRM integrations
✓ Delivered production-ready solutions with clean, maintainable code

My Approach:
Week 1-2: Architecture & Setup
- Design chatbot conversation flows
- Set up GPT-4 integration with proper prompt engineering
- Connect to Shopify and CRM APIs

Week 3-4: Development
- Build chatbot backend with Node.js
- Create React-based chat widget for your website
- Implement multi-language support (English, Spanish)
- Develop escalation logic for complex queries

Week 5: Analytics & Deployment
- Build analytics dashboard with key metrics
- Load testing and optimization
- Deployment and training your team

What''s Included:
✓ Modern, responsive chat widget
✓ Admin dashboard for monitoring
✓ Complete source code and documentation
✓ 4 weeks of post-launch support
✓ Training sessions for your team

I''m confident I can deliver a high-quality solution that reduces your response time to under 30 seconds and handles 75%+ of customer inquiries automatically.

Looking forward to working together!

Best regards,
Devansh Tiwari',
      11000.00,
      '5 weeks',
      'submitted',
      false,
      NOW() - INTERVAL '2 days',
      NOW() - INTERVAL '2 days'
    ),

    -- Devansh's Proposal 2: Report Generation Project
    (
      gen_random_uuid(),
      project_report,
      freelancer_devansh,
      'Hello William,

I''m excited about this AI-powered report generation project! With my experience in Next.js, React, and LangChain, I can build a powerful BI tool that transforms how your team accesses data insights.

Why I''m a Great Fit:
✓ Full-stack expertise in React, Node.js, and TypeScript
✓ Experience with OpenAI API and LangChain
✓ PostgreSQL integration and complex queries
✓ Built similar AI-powered internal tools

Technical Approach:

Phase 1 (Weeks 1-2): Foundation
- Set up Next.js application with TypeScript
- Integrate OpenAI GPT-4 API
- Connect to PostgreSQL data warehouse
- Design user interface for queries

Phase 2 (Weeks 3-4): AI Features
- Implement natural language to SQL conversion using LangChain
- Build AI report generation engine
- Create custom report templates
- Develop Slack notification system

Phase 3 (Weeks 5-6): Polish & Deploy
- Role-based access control
- Audit logging system
- Schedule automated report generation
- AWS deployment with CI/CD
- User training and documentation

Deliverables:
✓ Production-ready web application
✓ Natural language query interface
✓ Automated report generation
✓ Slack integration
✓ Admin panel for user management
✓ Complete documentation
✓ 1 month post-launch support

I can deliver the MVP in 4 weeks and the full production version within 6 weeks.

Available to start immediately!

Best regards,
Devansh',
      13500.00,
      '6 weeks',
      'submitted',
      false,
      NOW() - INTERVAL '1 day',
      NOW() - INTERVAL '1 day'
    ),

    -- Devansh's Proposal 3: Sales Forecasting Project
    (
      gen_random_uuid(),
      project_forecasting,
      freelancer_devansh,
      'Hi Robert,

I''m interested in your ML forecasting project. While my primary expertise is in full-stack development, I have experience working with ML models and can help build the complete solution including the dashboard and deployment infrastructure.

My Contribution:
- Build the interactive Tableau/React dashboard
- Set up AWS infrastructure and CI/CD pipeline
- Create APIs for model predictions
- Integrate with your data warehouse
- Automate report generation

I would recommend collaborating with a data scientist for the core ML model development, while I focus on the application layer, deployment, and user experience.

This hybrid approach ensures both excellent ML performance and a polished, production-ready application.

Happy to discuss how we can structure this collaboration!

Best,
Devansh',
      18000.00,
      '14 weeks',
      'submitted',
      false,
      NOW() - INTERVAL '4 days',
      NOW() - INTERVAL '4 days'
    ),

    -- Other freelancers' proposals
    (
      gen_random_uuid(),
      project_chatbot,
      freelancer_sarah,
      'Hi Lisa,

I''m excited about this e-commerce chatbot project! With 5+ years building conversational AI systems, I''ve delivered similar solutions that achieved 95%+ customer satisfaction.

Why I''m a Great Fit:
✓ Recently built a chatbot handling 1000+ daily queries with 94% accuracy
✓ Expert in GPT-4, LangChain, and CRM integrations
✓ Experience with Shopify and multi-language support

I''m confident I can reduce your response time to under 30 seconds and handle 75%+ of inquiries automatically.

Best regards,
Sarah Johnson',
      11500.00,
      '4-6 weeks',
      'submitted',
      false,
      NOW() - INTERVAL '3 days',
      NOW() - INTERVAL '3 days'
    ),

    (
      gen_random_uuid(),
      project_chatbot,
      freelancer_olivia,
      'Hello Lisa,

I specialize in building end-to-end AI applications and would love to help automate your customer support!

My Experience:
- Built AI chatbot platform now serving 5000+ users
- Full-stack development (React, Node.js, OpenAI API)
- Experience with Shopify and e-commerce integrations

I can start immediately and have this live within 5 weeks!

Looking forward to working together,
Olivia',
      10800.00,
      '5 weeks',
      'submitted',
      false,
      NOW() - INTERVAL '2 days',
      NOW() - INTERVAL '2 days'
    ),

    (
      gen_random_uuid(),
      project_invoice,
      freelancer_michael,
      'Dear John,

As an RPA specialist with 6+ years of experience, I''ve automated similar invoice processing workflows for Fortune 500 companies, including SAP integrations.

Expected Results:
- 80%+ reduction in processing time ✓
- 95%+ accuracy rate ✓
- ROI achieved within 6 months ✓

Ready to eliminate your manual data entry!

Best regards,
Michael Chen',
      17500.00,
      '12 weeks',
      'submitted',
      false,
      NOW() - INTERVAL '2 days',
      NOW() - INTERVAL '2 days'
    ),

    (
      gen_random_uuid(),
      project_forecasting,
      freelancer_emily,
      'Hi Robert,

Your sales forecasting project aligns perfectly with my expertise in ML and predictive analytics. I recently built a forecasting model that improved accuracy by 40% for a major retail chain.

Deliverables:
✓ ML models with >85% accuracy (target: 90%)
✓ Automated daily/weekly reports
✓ Interactive dashboards

Best,
Emily Rodriguez',
      24000.00,
      '16 weeks',
      'submitted',
      false,
      NOW() - INTERVAL '4 days',
      NOW() - INTERVAL '4 days'
    ),

    (
      gen_random_uuid(),
      project_medical,
      freelancer_david,
      'Dear Maria,

I''m deeply interested in this medical imaging project. With 8+ years in computer vision and healthcare AI, I understand both the technical challenges and regulatory requirements.

Key Features:
✓ >95% accuracy (target: 97-98%)
✓ Explainable AI with visual highlights
✓ HIPAA-compliant infrastructure

Available to start immediately!

Sincerely,
Dr. David Kumar',
      43000.00,
      '20 weeks',
      'submitted',
      false,
      NOW() - INTERVAL '1 day',
      NOW() - INTERVAL '1 day'
    ),

    (
      gen_random_uuid(),
      project_rag,
      freelancer_sophia,
      'Hello John,

This enterprise RAG project is exactly what I specialize in! I recently delivered a similar system for a Fortune 100 company with 500,000+ documents.

This will transform how your employees access knowledge!

Looking forward to collaborating,
Dr. Sophia Anderson',
      37000.00,
      '16 weeks',
      'submitted',
      false,
      NOW() - INTERVAL '5 days',
      NOW() - INTERVAL '5 days'
    );

  -- Update proposal counts
  UPDATE projects
  SET proposal_count = (
    SELECT COUNT(*)
    FROM proposals
    WHERE proposals.project_id = projects.id
  );

  RAISE NOTICE 'Projects and proposals seeded successfully!';
  RAISE NOTICE '- 8 projects created';
  RAISE NOTICE '- 9 proposals created (including 3 from Devansh Tiwari)';
  RAISE NOTICE 'Devansh submitted proposals to:';
  RAISE NOTICE '  1. AI Chatbot project ($11,000)';
  RAISE NOTICE '  2. Report Generation project ($13,500)';
  RAISE NOTICE '  3. Sales Forecasting project ($18,000)';
END $$;
