import type { Metadata } from 'next';
import { DashboardClient } from './client';

export const metadata: Metadata = {
  title: 'Dashboard | LinkerAI',
  description:
    'View your dashboard with insights on projects, proposals, earnings, and activity. Track your performance and manage your work efficiently.',
  openGraph: {
    title: 'Dashboard | LinkerAI',
    description:
      'View your dashboard with insights on projects, proposals, earnings, and activity.',
    type: 'website',
  },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
