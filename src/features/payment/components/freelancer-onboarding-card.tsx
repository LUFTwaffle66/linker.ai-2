'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface FreelancerOnboardingCardProps {
  /** Whether the freelancer already has a connected Stripe account */
  hasStripeAccount: boolean;
  /** Whether Stripe charges & payouts are enabled */
  payoutsEnabled?: boolean;
  /** URL returned from backend to start Stripe onboarding */
  onboardingUrl?: string | null;
  /** Called when user clicks "Connect Stripe" */
  onStartOnboarding: () => Promise<void>;
  detailsSubmitted?: boolean;
}

export function FreelancerOnboardingCard({
  hasStripeAccount,
  payoutsEnabled,
  onboardingUrl,
  onStartOnboarding,
  detailsSubmitted,
}: FreelancerOnboardingCardProps) {
  const handleConnect = async () => {
    try {
      if (onboardingUrl) {
        window.location.href = onboardingUrl;
        return;
      }
      await onStartOnboarding();
    } catch (err) {
      console.error(err);
      toast.error('Failed to start Stripe onboarding');
    }
  };

  // Case 1: Fully onboarded
  if (hasStripeAccount && detailsSubmitted) {
    return (
      <Card className="border-green-500/20 bg-green-500/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              Stripe Connected
            </CardTitle>
            <Badge variant="secondary" className="bg-green-500/10 text-green-700">
              Active
            </Badge>
          </div>
          <CardDescription>
            Your Stripe account is connected and ready to receive payouts.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Case 2: Started but not completed
  if (hasStripeAccount && !detailsSubmitted) {
    return (
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-600" />
            Finish Stripe Setup
          </CardTitle>
          <CardDescription>
            Your Stripe account needs additional information before payouts can be enabled.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={handleConnect}>
            Continue Stripe Onboarding
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Case 3: Not connected at all
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Connect Stripe to Get Paid
        </CardTitle>
        <CardDescription>
          To receive payments from clients, you must connect a Stripe account.
          Stripe handles identity verification and secure payouts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="text-sm text-muted-foreground list-disc pl-4">
          <li>Secure escrow-based payments</li>
          <li>Automatic payouts to your bank account</li>
          <li>Required by law for freelancer payouts</li>
        </ul>

        <Button className="w-full" onClick={handleConnect}>
          Connect Stripe
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

export default FreelancerOnboardingCard;
