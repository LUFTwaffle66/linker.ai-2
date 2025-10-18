export const paths = {
  home: {
    getHref: () => '/',
  },

  auth: {
    signup: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/signup${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    login: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    onboardingClient: {
      getHref: () => '/onboarding/client',
    },
    onboardingFreelancer: {
      getHref: () => '/onboarding/freelancer',
    },
  },

  public: {
    browse: {
      getHref: (params?: { tab?: 'projects' | 'freelancers'; q?: string }) => {
        if (!params) return '/browse';
        const searchParams = new URLSearchParams();
        if (params.tab) searchParams.set('tab', params.tab);
        if (params.q) searchParams.set('q', params.q);
        return `/browse?${searchParams.toString()}`;
      },
    },
    findWork: {
      getHref: () => '/browse?tab=projects',
    },
    findExperts: {
      getHref: () => '/browse?tab=freelancers',
    },
    help: {
      getHref: () => '/help',
    },
    about: {
      getHref: () => '/about',
    },
    howItWorks: {
      getHref: () => '/how-it-works',
    },
    trustSafety: {
      getHref: () => '/trust-safety',
    },
    contact: {
      getHref: () => '/contact',
    },
    privacy: {
      getHref: () => '/privacy',
    },
    terms: {
      getHref: () => '/terms',
    },
  },

  app: {
    root: {
      getHref: () => '/app',
    },
    dashboard: {
      getHref: () => '/app',
    },
    discussions: {
      getHref: () => '/app/discussions',
    },
    discussion: {
      getHref: (id: string) => `/app/discussions/${id}`,
    },
    users: {
      getHref: () => '/app/users',
    },
    profile: {
      getHref: () => '/app/profile',
    },
    messages: {
      getHref: () => '/app/messages',
    },
    payments: {
      getHref: () => '/app/payments',
    },
    settings: {
      getHref: () => '/app/settings',
    },
    freelancerProfile: {
      getHref: () => '/app/freelancer-profile',
    },
    clientProfile: {
      getHref: () => '/app/client-profile',
    },
    submitProposal: {
      getHref: (projectId?: number | string) =>
        `/submit-proposal${projectId ? `?projectId=${projectId}` : ''}`,
    },
  },
} as const;
