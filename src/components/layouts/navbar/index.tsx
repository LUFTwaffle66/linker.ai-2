'use client';

import { useAuth } from '@/features/auth/lib/auth-client';
import { useRouter } from '@/i18n/routing';
import { HelpCircle, MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { paths } from '@/config/paths';
import { useCheckOnboardingStatus } from '@/features/auth/hooks/use-email-verification';
import { Logo } from './logo';
import { NavLinks } from './nav-links';
import { SearchBar } from './search-bar';
import { LanguageSwitcher } from './language-switcher';
import { NotificationsDropdown } from './notifications-dropdown';
import { ProfileDropdown } from './profile-dropdown';
import { MobileMenu } from './mobile-menu';

export function Navigation() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const isLoggedIn = isAuthenticated;
  const { data: onboardingStatus } = useCheckOnboardingStatus(user?.id);

  const showOnboardingAlert =
    isLoggedIn && onboardingStatus && !onboardingStatus.hasCompletedOnboarding;

  return (
    <>
      <nav className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Logo />
              <NavLinks />
            </div>

            {/* <SearchBar /> */}

            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <div className="hidden md:flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(paths.public.help.getHref())}
                    >
                      <HelpCircle className="w-5 h-5" />
                    </Button>
                    <NotificationsDropdown />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(paths.app.messages.getHref())}
                    >
                      <MessageSquare className="w-5 h-5" />
                    </Button>
                  </div>
                  <LanguageSwitcher />
                  <ProfileDropdown />
                </>
              ) : (
                <>
                  <LanguageSwitcher />
                  <Button
                    variant="ghost"
                    className="hidden md:inline-flex"
                    onClick={() => router.push(paths.auth.login.getHref())}
                  >
                    Log In
                  </Button>
                  <Button
                    className="hidden md:inline-flex"
                    onClick={() => router.push(paths.auth.signup.getHref())}
                  >
                    Sign Up
                  </Button>
                </>
              )}
              <MobileMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Onboarding Incomplete Banner */}
      {showOnboardingAlert && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Alert className="border-0 bg-transparent p-0">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
              <AlertDescription className="flex items-center justify-between ml-2">
                <span className="text-sm text-yellow-800 dark:text-yellow-200">
                  Complete your profile to access all features
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-4 border-yellow-600 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-500 dark:text-yellow-400 dark:hover:bg-yellow-900/40"
                  onClick={() => {
                    const role = (user as any)?.user_metadata?.role || 'freelancer';
                    if (role === 'client') {
                      router.push(paths.auth.onboardingClient.getHref());
                    } else {
                      router.push(paths.auth.onboardingFreelancer.getHref());
                    }
                  }}
                >
                  Complete Profile
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}
    </>
  );
}
