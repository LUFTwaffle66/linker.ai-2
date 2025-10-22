'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LanguageSwitcherCompact } from '@/components/language-switcher-compact';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      {/* Language Switcher - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcherCompact />
      </div>

      <Card className="w-full max-w-2xl p-8 md:p-12">
        <div className="flex flex-col items-center space-y-6 text-center">
          {/* 404 Visual */}
          <div className="relative">
            <h1 className="text-9xl font-bold text-muted-foreground/20">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-primary/10 p-6">
                <svg
                  className="h-16 w-16 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
            <p className="text-lg text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>

          {/* Suggestions */}
          <div className="w-full max-w-md space-y-3 pt-4">
            <p className="text-sm text-muted-foreground">{t('helpfulLinks')}</p>
            <div className="grid gap-2">
              <Link href="/" className="w-full">
                <Button variant="outline" className="w-full">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  {t('goToDashboard')}
                </Button>
              </Link>
              <Link href="/browse" className="w-full">
                <Button variant="outline" className="w-full">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  {t('browseProjects')}
                </Button>
              </Link>
              <Link href="/help" className="w-full">
                <Button variant="outline" className="w-full">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {t('getHelp')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Back Button */}
          <div className="pt-6">
            <Button
              variant="default"
              size="lg"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              {t('goBack')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
