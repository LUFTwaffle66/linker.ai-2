'use client';

import {
  FileText,
  CheckCircle,
  Users,
  DollarSign,
  Shield,
  AlertTriangle,
  Scale,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function TermsOfServicePage() {
  const lastUpdated = 'January 13, 2025';

  const sections = [
    {
      id: 'acceptance',
      icon: CheckCircle,
      title: '1. Acceptance of Terms',
      content: [
        {
          subtitle: '1.1 Agreement to Terms',
          text: 'By accessing or using LinkerAI, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our platform.',
        },
        {
          subtitle: '1.2 Eligibility',
          text: 'You must be at least 18 years old to use LinkerAI. By using the platform, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms.',
        },
        {
          subtitle: '1.3 Modifications',
          text: 'We reserve the right to modify these Terms at any time. We will notify users of material changes via email or platform notification. Your continued use of LinkerAI after changes become effective constitutes acceptance of the modified Terms.',
        },
      ],
    },
    {
      id: 'account',
      icon: Users,
      title: '2. User Accounts',
      content: [
        {
          subtitle: '2.1 Account Creation',
          text: 'To use certain features of LinkerAI, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate and current.',
        },
        {
          subtitle: '2.2 Account Types',
          text: 'LinkerAI offers two account types: AI Expert accounts (for freelancers providing AI automation services) and Client accounts (for those hiring AI experts). You may only create one account per email address.',
        },
        {
          subtitle: '2.3 Account Security',
          text: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use of your account or breach of security.',
        },
        {
          subtitle: '2.4 Account Suspension and Termination',
          text: 'We reserve the right to suspend or terminate your account if you violate these Terms, engage in fraudulent activity, or use the platform in a manner that harms other users or LinkerAI. You may terminate your account at any time through account settings.',
        },
      ],
    },
    {
      id: 'services',
      icon: FileText,
      title: '3. Platform Services',
      content: [
        {
          subtitle: '3.1 Service Description',
          text: 'LinkerAI is a marketplace platform that connects clients with AI automation experts for project-based work. We provide tools for project posting, proposal submission, messaging, payment processing, and escrow services.',
        },
        {
          subtitle: '3.2 Independent Contractors',
          text: 'AI experts on LinkerAI are independent contractors, not employees or agents of LinkerAI. LinkerAI does not control the work performed by experts and is not responsible for the quality, legality, or outcome of projects.',
        },
        {
          subtitle: '3.3 Platform Role',
          text: 'LinkerAI acts as a neutral platform facilitating connections between clients and AI experts. We are not a party to the contractual relationships between users and do not guarantee the performance of any user.',
        },
      ],
    },
    {
      id: 'projects',
      icon: FileText,
      title: '4. Projects and Proposals',
      content: [
        {
          subtitle: '4.1 Posting Projects (Clients)',
          text: 'Clients may post projects describing the AI automation work they need. Project postings must be accurate, complete, and not misleading. Clients agree not to post projects for illegal purposes or that violate intellectual property rights.',
        },
        {
          subtitle: '4.2 Submitting Proposals (AI Experts)',
          text: "AI experts may submit proposals for projects they are qualified to complete. Proposals must accurately represent the expert's capabilities and include realistic timelines and budgets.",
        },
        {
          subtitle: '4.3 Contracts',
          text: 'When a client accepts a proposal, a contract is formed between the client and the AI expert. Both parties agree to fulfill their obligations as described in the project scope and proposal.',
        },
        {
          subtitle: '4.4 Project Modifications',
          text: 'Any changes to project scope, timeline, or budget must be agreed upon by both parties through the platform messaging system. Scope changes may require adjustments to payment terms.',
        },
      ],
    },
    {
      id: 'payments',
      icon: DollarSign,
      title: '5. Payments and Fees',
      content: [
        {
          subtitle: '5.1 Payment Structure',
          text: 'LinkerAI operates on a two-stage milestone model consisting of a 50% Upfront Payment and a 50% Final Milestone. When a Client hires an AI Expert, the 50% upfront portion is released immediately to the Expert to initiate the project. The remaining 50% is secured by the platform as a final milestone and is released to the Expert only upon project completion and explicit Client approval.',
        },
        {
          subtitle: '5.2 Platform Fees',
          text: 'LinkerAI charges a service fee of 15% on all projects. This fee is deducted from the total project budget and covers secure payment processing, milestone management, dispute resolution services, and platform maintenance.',
        },
        {
          subtitle: '5.3 Payment Processing',
          text: 'All payments are processed through our secure third-party payment partners. Clients are required to fund the project in its entirety (both the upfront and milestone portions) before work begins. AI Experts receive their earned payments via their designated payment method once funds are released according to the project milestones.',
        },
        {
          subtitle: '5.4 Refunds',
          text: "The 50% upfront payment is non-refundable once released to the AI Expert. The Final Milestone payment (the remaining 50%) remains refundable if the Expert fails to deliver the work as agreed, subject to the outcome of LinkerAI's formal dispute resolution process.",
        },
        {
          subtitle: '5.5 Taxes',
          text: 'Users are solely responsible for determining, reporting, and paying all applicable local and international taxes. LinkerAI may provide relevant tax documentation where legally required (such as 1099 forms for US-based users) but does not provide financial or tax advice.',
        },
      ],
    },
    {
      id: 'conduct',
      icon: Shield,
      title: '6. User Conduct and Prohibited Activities',
      content: [
        {
          subtitle: '6.1 Acceptable Use',
          text: 'Users must use LinkerAI in compliance with all applicable laws and these Terms. You agree to conduct yourself professionally and treat other users with respect.',
        },
        {
          subtitle: '6.2 Prohibited Activities',
          text: 'Users may not:\n\n• Use LinkerAI for illegal purposes\n• Post false, misleading, or fraudulent information\n• Impersonate others or create fake accounts\n• Harass, threaten, or abuse other users\n• Attempt to circumvent payment through LinkerAI\n• Share account credentials\n• Use bots or automated tools to manipulate the platform\n• Scrape or collect user data without permission\n• Post spam or unsolicited commercial content\n• Violate intellectual property rights\n• Attempt to gain unauthorized access to systems',
        },
        {
          subtitle: '6.3 Consequences',
          text: 'Violation of these terms may result in account suspension, termination, loss of funds, and legal action. We reserve the right to investigate suspected violations and cooperate with law enforcement.',
        },
      ],
    },
    {
      id: 'ip',
      icon: FileText,
      title: '7. Intellectual Property',
      content: [
        {
          subtitle: '7.1 Platform IP',
          text: 'LinkerAI and its content (logos, designs, text, graphics, code) are owned by or licensed to us and protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works without our permission.',
        },
        {
          subtitle: '7.2 User Content',
          text: 'You retain ownership of content you post on LinkerAI (profiles, project descriptions, portfolios). By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content in connection with operating the platform.',
        },
        {
          subtitle: '7.3 Project Work Product',
          text: 'Ownership of work product created by AI experts is governed by the agreement between the client and expert. Unless otherwise specified, work product typically transfers to the client upon full payment.',
        },
        {
          subtitle: '7.4 Copyright Infringement',
          text: 'We respect intellectual property rights and expect users to do the same. If you believe content on LinkerAI infringes your copyright, contact us at copyright@linkerai.com with detailed information.',
        },
      ],
    },
    {
      id: 'disputes',
      icon: Scale,
      title: '8. Disputes and Resolution',
      content: [
        {
          subtitle: '8.1 User Disputes',
          text: 'Disputes between clients and AI experts should first be resolved through direct communication. If a resolution cannot be reached, either party may request mediation through LinkerAI support.',
        },
        {
          subtitle: '8.2 Mediation Process',
          text: 'Our support team will review the project requirements, deliverables, communications, and evidence from both parties. We will make a determination based on the agreed-upon scope of work and our Terms of Service.',
        },
        {
          subtitle: '8.3 Escrow Decisions',
          text: 'In disputes involving escrow funds, LinkerAI reserves the right to determine the appropriate distribution of funds based on evidence of work completed and adherence to the original agreement.',
        },
        {
          subtitle: '8.4 Arbitration',
          text: 'Any disputes between you and LinkerAI will be resolved through binding arbitration rather than in court, except you may assert claims in small claims court. You waive your right to participate in class actions or class arbitrations.',
        },
      ],
    },
    {
      id: 'disclaimers',
      icon: AlertTriangle,
      title: '9. Disclaimers and Limitations of Liability',
      content: [
        {
          subtitle: '9.1 Service "As Is"',
          text: 'LinkerAI is provided "as is" and "as available" without warranties of any kind, express or implied. We do not guarantee the platform will be uninterrupted, secure, or error-free.',
        },
        {
          subtitle: '9.2 No Guarantee of Results',
          text: 'We do not guarantee the quality, accuracy, or outcomes of projects completed through LinkerAI. We do not verify all credentials, certifications, or portfolio claims made by AI experts.',
        },
        {
          subtitle: '9.3 User Responsibility',
          text: 'Users are responsible for evaluating the qualifications and suitability of other users before entering into agreements. We recommend reviewing profiles, ratings, portfolios, and conducting due diligence.',
        },
        {
          subtitle: '9.4 Limitation of Liability',
          text: 'To the maximum extent permitted by law, LinkerAI and its officers, directors, employees, and agents will not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising from your use of the platform.',
        },
        {
          subtitle: '9.5 Maximum Liability',
          text: 'Our total liability to you for all claims arising from your use of LinkerAI will not exceed the amount of fees you paid to us in the 12 months preceding the claim, or $100, whichever is greater.',
        },
      ],
    },
    {
      id: 'indemnification',
      icon: Shield,
      title: '10. Indemnification',
      content: [
        {
          subtitle: '10.1 Your Indemnification',
          text: 'You agree to indemnify, defend, and hold harmless LinkerAI and its affiliates from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:\n\n• Your use of the platform\n• Your violation of these Terms\n• Your violation of any rights of another user\n• Content you post on LinkerAI\n• Your conduct in connection with the platform',
        },
      ],
    },
    {
      id: 'general',
      icon: FileText,
      title: '11. General Provisions',
      content: [
        {
          subtitle: '11.1 Governing Law',
          text: 'These Terms are governed by the laws of [Jurisdiction], without regard to conflict of law principles. Any disputes will be resolved in the courts of [Jurisdiction].',
        },
        {
          subtitle: '11.2 Entire Agreement',
          text: 'These Terms constitute the entire agreement between you and LinkerAI regarding use of the platform and supersede all prior agreements.',
        },
        {
          subtitle: '11.3 Severability',
          text: 'If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.',
        },
        {
          subtitle: '11.4 No Waiver',
          text: 'Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.',
        },
        {
          subtitle: '11.5 Assignment',
          text: 'You may not assign or transfer these Terms or your account without our written consent. We may assign our rights and obligations without restriction.',
        },
      ],
    },
    {
      id: 'contact',
      icon: FileText,
      title: '12. Contact Information',
      content: [
        {
          subtitle: '12.1 Questions',
          text: 'If you have questions about these Terms of Service, please contact us at:\n\nEmail: legal@linkerai.com\nAddress: LinkerAI Legal Team, [Address]',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl mb-4">Terms of Service</h1>
          <p className="text-lg text-muted-foreground mb-4">Please read these terms carefully before using LinkerAI</p>
          <Badge variant="secondary" className="text-sm">
            Last Updated: {lastUpdated}
          </Badge>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-muted-foreground leading-relaxed mb-4">
              These Terms of Service ("Terms") govern your access to and use of LinkerAI, an AI automation freelance
              marketplace platform operated by LinkerAI Inc. ("LinkerAI," "we," "us," or "our").
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using LinkerAI, you agree to be bound by these Terms and our Privacy Policy. If you do not
              agree to these Terms, do not use the platform.
            </p>
          </CardContent>
        </Card>

        {/* Terms Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle>{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {section.content.map((item, index) => (
                    <div key={index}>
                      <h4 className="font-medium mb-2">{item.subtitle}</h4>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{item.text}</p>
                      {index < section.content.length - 1 && <Separator className="mt-6" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Acknowledgment */}
        <Card className="mt-8 border-2 border-yellow-500/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium mb-2">Important Notice</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  By using LinkerAI, you acknowledge that you have read, understood, and agree to be bound by these Terms
                  of Service. These Terms include important limitations on liability, dispute resolution procedures, and
                  other legal rights. Please read them carefully.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Card */}
        <Card className="mt-8 bg-gradient-to-br from-primary/10 to-cyan-500/10">
          <CardContent className="p-6 text-center">
            <Scale className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-medium mb-2">Questions About Our Terms?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our legal team is available to clarify any questions you may have.
            </p>
            <p className="text-sm text-muted-foreground">
              Contact us at <span className="text-primary font-medium">legal@linkerai.com</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
