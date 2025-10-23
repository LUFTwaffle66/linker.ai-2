'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, RefreshCw, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/features/auth/lib/auth-client';
import {
  useCheckEmailVerified,
  useResendVerificationEmail,
  useCheckOnboardingStatus,
} from '@/features/auth/hooks/use-email-verification';
import { paths } from '@/config/paths';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [cooldown, setCooldown] = useState(0);
  const { data: emailStatus, refetch } = useCheckEmailVerified();
  const { data: onboardingStatus } = useCheckOnboardingStatus(user?.id);
  const resendEmailMutation = useResendVerificationEmail();

  // Start cooldown timer after sending email
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Redirect when email is verified
  useEffect(() => {
    if (emailStatus?.isVerified) {
      // Check if onboarding is completed
      if (onboardingStatus?.hasCompletedOnboarding) {
        // Redirect to dashboard
        router.push(paths.app.dashboard.getHref());
      } else {
        // Redirect to onboarding based on user role
        const role = (user as any)?.user_metadata?.role || 'freelancer';
        if (role === 'client') {
          router.push(paths.auth.onboardingClient.getHref());
        } else {
          router.push(paths.auth.onboardingFreelancer.getHref());
        }
      }
    }
  }, [emailStatus, onboardingStatus, user, router]);

  const handleResendEmail = async () => {
    if (!emailStatus?.email) return;

    try {
      await resendEmailMutation.mutateAsync({ email: emailStatus.email });
      setCooldown(60); // 60 second cooldown
      // Refetch to check if email is verified
      setTimeout(() => refetch(), 2000);
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show success message while redirecting
  if (emailStatus?.isVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Email Verified!</CardTitle>
            <CardDescription>Redirecting you to complete your profile...</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to
            <span className="block font-medium text-foreground mt-1">
              {emailStatus?.email || user.email}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Check your inbox</p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Open the email from LinkerAI</li>
                  <li>Click the verification link</li>
                  <li>You'll be automatically redirected</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <p className="text-sm font-medium">Didn't receive the email?</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure you entered the correct email</li>
              <li>• Wait a few minutes and try again</li>
            </ul>
          </div>

          <Button
            onClick={handleResendEmail}
            disabled={cooldown > 0 || resendEmailMutation.isPending}
            className="w-full"
            variant="outline"
          >
            {resendEmailMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : cooldown > 0 ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend in {cooldown}s
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend Verification Email
              </>
            )}
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <p className="text-xs text-center text-muted-foreground">
            This page will automatically update when you verify your email
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(paths.public.login.getHref())}
            className="text-xs"
          >
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
