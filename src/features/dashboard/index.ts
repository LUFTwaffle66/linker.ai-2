// Components
export { MetricCard } from './components/metric-card';
export { RecentActivityCard } from './components/recent-activity-card';
export { FreelancerDashboard } from './components/freelancer-dashboard';
export { ClientDashboard } from './components/client-dashboard';

// Hooks
export { useFreelancerDashboard, useClientDashboard, dashboardKeys } from './hooks/use-dashboard';

// API
export { getFreelancerDashboard, getClientDashboard } from './api/dashboard';

// Types
export type { ActivityItem } from './components/recent-activity-card';
export type { FreelancerDashboardData } from './components/freelancer-dashboard';
export type { ClientDashboardData } from './components/client-dashboard';
