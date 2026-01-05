export const PROJECT_TEMPLATES = {
  // --- Customer Support ---
  'faq-responder': {
    title: '24/7 FAQ Auto-Responder',
    description:
      "I need an automated customer support agent integrated into my website. The goal is to handle common FAQs instantly using AI and escalate complex queries to human support.\n\nKey Requirements:\n- Integration with my existing knowledge base.\n- 24/7 auto-responses for common questions.\n- Seamless handoff to human agents when needed.",
    category: 'AI Chatbots & Assistants',
    skills: ['GPT-4', 'OpenAI API', 'Natural Language Processing', 'LangChain', 'React'],
  },
  'support-triage': {
    title: 'AI Support Triage & Routing',
    description:
      "I need a machine learning model that reads incoming support emails, classifies them by topic (e.g., 'Billing', 'Tech Support'), and automatically routes them to the correct department's inbox.\n\nKey Requirements:\n- Text classification model.\n- Email server integration (IMAP/Gmail API).\n- Continuous learning from corrections.",
    category: 'AI Chatbots & Assistants',
    skills: ['Machine Learning', 'TensorFlow', 'Natural Language Processing', 'Python'],
  },

  // --- Data & Analytics ---
  'kpi-dashboard': {
    title: 'Executive KPI Command Center',
    description:
      "I need a centralized dashboard that pulls data from multiple sources (Stripe, Google Ads, CRM) to show live profit and loss metrics. No more manual spreadsheet updates.\n\nKey Requirements:\n- Connectors for 3+ data sources.\n- Real-time visualization.\n- Automated daily email reports.",
    category: 'Data Analysis & BI',
    skills: ['SQL', 'Data Science', 'API Integration', 'Python', 'Google Cloud'],
  },
  'ad-spend-consolidator': {
    title: 'Ad Spend & ROI Consolidator',
    description:
      'I need a script that aggregates ad spend data from Facebook, Google, and TikTok Ads into a single clean table to calculate my daily Blended ROAS (Return on Ad Spend).\n\nKey Requirements:\n- Data extraction from marketing APIs.\n- Currency conversion and normalization.\n- Automated daily syncing to a database.',
    category: 'Data Analysis & BI',
    skills: ['Data Science', 'Python', 'SQL', 'API Integration'],
  },

  // --- Marketing & Content ---
  'content-repurposing': {
    title: 'Content Repurposing Engine',
    description:
      'I want to take a single YouTube video or blog post and automatically turn it into multiple pieces of content: Twitter threads, LinkedIn posts, and a newsletter using AI.\n\nKey Requirements:\n- AI content summarization and rewriting.\n- Tone matching for different platforms.\n- Auto-scheduling via API.',
    category: 'Custom AI Solutions',
    skills: ['GPT-4', 'Natural Language Processing', 'Python', 'REST APIs'],
  },
  'lead-magnet-delivery': {
    title: 'Lead Magnet Delivery System',
    description:
      'I need a system where leads who sign up on my landing page instantly receive a specific PDF/resource via email, and are tagged appropriately in my CRM.\n\nKey Requirements:\n- Instant email delivery via SendGrid/Mailgun.\n- Database tagging and segmentation.\n- Error handling for bounced emails.',
    category: 'Custom AI Solutions',
    skills: ['Node.js', 'API Integration', 'REST APIs', 'SQL'],
  },

  // --- IT & Internal Ops ---
  'employee-onboarding': {
    title: 'Instant Employee Onboarding',
    description:
      'I need an automation workflow that triggers when a new employee signs their offer letter. It should automatically create their email, Slack account, and assign them to the correct Notion dashboard.\n\nKey Requirements:\n- Trigger based on DocuSign/HelloSign envelope.\n- Provisioning of accounts across multiple tools.\n- Security compliance and logging.',
    category: 'Workflow Automation',
    skills: ['Workflow Automation', 'API Integration', 'REST APIs', 'RPA'],
  },
  'meeting-action-items': {
    title: 'Meeting to Action Items',
    description:
      'I need a system that joins my Zoom/Teams meetings, transcribes the audio, and automatically extracts action items and deadlines. The results should be pushed directly to Notion or Jira.\n\nKey Requirements:\n- Automated transcription.\n- Keyword extraction for tasks.\n- Integration with project management tools.',
    category: 'Workflow Automation',
    skills: ['OpenAI API', 'Natural Language Processing', 'LangChain', 'Python'],
  },
  'daily-standup-reporter': {
    title: 'Daily Standup Reporter',
    description:
      "I need a Slack/Teams bot that asks my team 3 questions every morning ('What did you do?', 'What will you do?', 'Blockers?'), aggregates the answers, and emails a summary to management.\n\nKey Requirements:\n- Chatbot interface (Slack/Teams).\n- Scheduled cron jobs.\n- Text summarization.",
    category: 'Workflow Automation',
    skills: ['Node.js', 'REST APIs', 'GPT-4', 'Workflow Automation'],
  },
  'instant-contract-generator': {
    title: 'Instant Contract Generator',
    description:
      'I need a form where I input client details, and it automatically generates a PDF contract, sends it for e-signature, and saves the signed copy to Google Drive.\n\nKey Requirements:\n- Dynamic PDF generation.\n- E-signature API integration.\n- Cloud storage file management.',
    category: 'Workflow Automation',
    skills: ['Python', 'Workflow Automation', 'REST APIs', 'FastAPI'],
  },

  // --- Finance & Accounting ---
  'auto-invoice-chaser': {
    title: 'Auto-Invoice Chaser',
    description:
      'I need a script that checks my accounting software for unpaid invoices. If an invoice is overdue, it should send a polite, personalized reminder email to the client automatically.\n\nKey Requirements:\n- Integration with Xero/QuickBooks API.\n- Customizable email templates.\n- Stop logic if payment is received.',
    category: 'Process Automation (RPA)',
    skills: ['Python', 'Workflow Automation', 'SQL', 'API Integration'],
  },
  'receipt-scanner': {
    title: 'Receipt to Expense Scanner',
    description:
      'I need a tool that lets me upload photos of receipts, automatically reads the vendor and total amount (OCR), and categorizes the expense into my accounting software.\n\nKey Requirements:\n- High accuracy OCR for receipts.\n- Auto-categorization of expenses.\n- Export to database or accounting tool.',
    category: 'Process Automation (RPA)',
    skills: ['Computer Vision', 'Python', 'Machine Learning', 'API Integration'],
  },

  // --- Sales & CRM ---
  'linkedin-lead-miner': {
    title: 'LinkedIn Lead Miner',
    description:
      'I want to automate the process of finding prospects on LinkedIn. It should identify profiles matching my criteria, extract public contact info, and save them to a CSV.\n\nKey Requirements:\n- Automated profile scraping/enrichment.\n- Data validation and cleaning.\n- Respectful rate limiting.',
    category: 'API Integration',
    skills: ['UiPath', 'RPA', 'Python', 'Automation Anywhere'],
  },

  // --- HR & Recruitment ---
  'resume-screener': {
    title: 'AI Resume Screener',
    description:
      'I receive too many applications. I need an AI system to parse incoming PDF resumes, match them against the job description, and rank the top 10% of candidates automatically.\n\nKey Requirements:\n- PDF text parsing.\n- Keyword and semantic matching.\n- Automated candidate scoring.',
    category: 'Custom AI Solutions',
    skills: ['Machine Learning', 'Natural Language Processing', 'Vector Databases', 'Python'],
  },

  // --- E-commerce & Logistics ---
  'smart-return-processor': {
    title: 'Smart Return & Refund Processor',
    description:
      'I need to automate my e-commerce return process. The system should validate the return reason against our policy and automatically generate a shipping label or process the refund without human intervention.\n\nKey Requirements:\n- Policy logic validation.\n- Shipping carrier API integration.\n- Payment gateway integration (Stripe/Shopify).',
    category: 'Workflow Automation',
    skills: ['Workflow Automation', 'REST APIs', 'Node.js', 'SQL'],
  },
  'inventory-sync': {
    title: 'Multi-Channel Inventory Sync',
    description:
      'I sell on Shopify and Amazon. I need an automation that syncs inventory levels in real-time. When a sale happens on one platform, the other must update immediately to prevent overselling.\n\nKey Requirements:\n- Real-time webhook listeners.\n- Two-way API syncing.\n- Error handling for failed updates.',
    category: 'Workflow Automation',
    skills: ['AWS', 'SQL', 'REST APIs', 'API Integration'],
  },
};
