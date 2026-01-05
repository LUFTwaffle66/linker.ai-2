'use client';

import { Link } from '@/i18n/routing';
import { paths } from '@/config/paths';
import { useAuth } from '@/features/auth/lib/auth-client';

export function NavLinks() {
  const { user, isAuthenticated } = useAuth();
  const role = user?.role;
  const isClient = role === 'client';
  const isFreelancer = role === 'freelancer';
  const findWorkHref = isAuthenticated ? paths.public.findWork.getHref() : '/signup?role=expert';
  const findExpertsHref = isAuthenticated ? paths.public.findExperts.getHref() : '/signup?role=company';

  return (
    <div className="hidden md:flex items-center space-x-6 ml-8">
      {!isClient && (
        <Link
          href={findWorkHref}
          className="text-foreground hover:text-primary transition-colors"
        >
          Find Work
        </Link>
      )}
      {!isFreelancer && (
        <Link
          href={findExpertsHref}
          className="text-foreground hover:text-primary transition-colors"
        >
          Find AI Experts
        </Link>
      )}
      {user?.role === 'client' && (
        <>
          <Link
            href={paths.public.examples.getHref()}
            className="text-foreground hover:text-primary transition-colors"
          >
            Automation Examples
          </Link>
          <Link
            href={paths.app.postProject.getHref()}
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Post Project
          </Link>
        </>
      )}
    </div>
  );
}
