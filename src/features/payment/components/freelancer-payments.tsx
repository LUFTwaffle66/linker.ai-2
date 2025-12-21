'use client';

import { useLocale } from 'next-intl'; // 1. Import useLocale
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Wallet,
  Briefcase,
  History,
} from 'lucide-react';
import {
  useFreelancerEarnings,
  useFreelancerContracts,
  useFreelancerTransactions,
  useFreelancerStripeAccount,
} from '../hooks';
import { toast } from 'sonner';
import { BalanceCard } from './shared/balance-card';
import { TransactionHistory } from './shared/transaction-history';
import { FreelancerOnboardingCard } from './freelancer-onboarding-card';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// 2. Define props to accept userId
interface FreelancerPaymentsProps {
  userId: string;
}

export function FreelancerPayments({ userId }: FreelancerPaymentsProps) {
  const locale = useLocale(); // 3. Get current language ('en', 'cs', etc.)
  
  const { data: earnings, isLoading: earningsLoading } = useFreelancerEarnings();
  const { data: contracts, isLoading: contractsLoading } = useFreelancerContracts();
  const { data: transactions, isLoading: transactionsLoading } = useFreelancerTransactions();
  const { data: stripeAccount, isLoading: stripeLoading } = useFreelancerStripeAccount();

  if (earningsLoading) return <div className="p-8 mx-auto max-w-7xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Payments & Earnings</h1>
          <p className="text-muted-foreground">
            View your earnings, contracts, and payment history.
          </p>
        </div>

        {!stripeLoading && (
          <div className="mb-8">
            <FreelancerOnboardingCard
              hasStripeAccount={stripeAccount?.hasStripeAccount ?? false}
              payoutsEnabled={stripeAccount?.payoutsEnabled}
              // We accept detailsSubmitted to handle the "Check & Submit" state correctly
              detailsSubmitted={stripeAccount?.detailsSubmitted ?? false} 
              onboardingUrl={stripeAccount?.onboardingUrl ?? null}
              onStartOnboarding={async () => {
                try {
                  // 4. THE FIX: Generate a fresh link with locale instead of using the stale prop
                  const response = await fetch('/api/stripe/connect/onboard', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      userId,   // passed from props
                      locale    // passed from hook
                    }),
                  });

                  const data = await response.json();

                  if (data.url) {
                    window.location.href = data.url;
                  } else {
                    toast.error('Failed to generate onboarding link');
                  }
                } catch (error) {
                  console.error(error);
                  toast.error('An error occurred while connecting to Stripe');
                }
              }}
            />
          </div>
        )}

        {/* ... Rest of the UI (BalanceCards, Tabs, etc.) stays exactly the same ... */}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <BalanceCard
            title="Lifetime Earnings"
            amount={earnings?.lifetimeEarnings || earnings?.availableBalance || 0}
            icon={<Wallet className="w-5 h-5 text-primary" />}
            footerText="Processing Funds"
            helperText="Funds usually arrive in your bank account in 2-5 business days."
          />
          {/* ... other cards ... */}
        </div>

        {/* ... Tabs section ... */}
         <div className="grid grid-cols-1 gap-8">
          <Tabs defaultValue="contracts" className="w-full">
            {/* ... tabs content ... */}
             <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="contracts" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span className="hidden sm:inline">Contracts</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="contracts">
              {/* ... contracts list ... */}
               <Card>
                <CardHeader>
                  <CardTitle>Active Contracts</CardTitle>
                  <CardDescription>Track payments for your ongoing projects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contractsLoading ? (
                    <p>Loading...</p>
                  ) : (
                    contracts?.map((contract, idx) => (
                      <div key={contract.id}>
                        <Link
                          href={`/projects/${contract.id}`}
                          className="block rounded-lg transition hover:bg-accent/50 cursor-pointer"
                        >
                          <div className="space-y-4 p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium mb-1 flex items-center gap-2">
                                  {contract.projectName}
                                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </h4>
                                <p className="text-sm text-muted-foreground">{contract.clientName}</p>
                              </div>
                              <Badge variant="secondary">${contract.totalBudget.toLocaleString()}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm mb-2">
                              <span className="text-muted-foreground">
                                Earned: <span className="text-foreground font-medium">${contract.amountPaid.toLocaleString()}</span>
                              </span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-muted-foreground">Status: {contract.status}</span>
                            </div>
                            <Progress value={(contract.amountPaid / contract.totalBudget) * 100} className="h-2" />
                          </div>
                        </Link>
                        {idx !== (contracts?.length || 0) - 1 && <Separator className="mt-6" />}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history">
              <TransactionHistory transactions={transactions || []} isLoading={transactionsLoading} isClient={false} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
