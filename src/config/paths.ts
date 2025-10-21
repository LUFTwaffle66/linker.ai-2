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
      getHref: () => '/',
    },
    dashboard: {
      getHref: () => '/',
    },
    discussions: {
      getHref: () => '/discussions',
    },
    discussion: {
      getHref: (id: string) => `/discussions/${id}`,
    },
    users: {
      getHref: () => '/users',
    },
    profile: {
      getHref: () => '/profile',
    },
    messages: {
      getHref: () => '/messages',
    },
    payments: {
      getHref: () => '/payments',
    },
    settings: {
      getHref: () => '/settings',
    },
    freelancerProfile: {
      getHref: (freelancerId: string) => `/freelancer/${freelancerId}`,
    },
    clientProfile: {
      getHref: (clientId: string) => `/client/${clientId}`,
    },
    submitProposal: {
      getHref: (projectId?: number | string) =>
        `/submit-proposal${projectId ? `?projectId=${projectId}` : ''}`,
    },
    postProject: {
      getHref: () => '/post-project',
    },
    activeProject: {
      getHref: (projectId: string) => `/projects/${projectId}`,
    },
  },
} as const;
