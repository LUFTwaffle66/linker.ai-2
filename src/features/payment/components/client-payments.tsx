'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, DollarSign, Briefcase, History, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useClientBalance, useClientProjects, useClientTransactions } from '../hooks/use-client-payments';
import { BalanceCard } from './shared/balance-card';
import { TransactionHistory } from './shared/transaction-history';

export function ClientPayments() {
  const { data: balance, isLoading: balanceLoading } = useClientBalance();
  const { data: projects, isLoading: projectsLoading } = useClientProjects();
  const { data: transactions, isLoading: transactionsLoading } = useClientTransactions();

  if (balanceLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Payments & Billing</h1>
          <p className="text-muted-foreground">
            View your billing overview, secured milestone funds, and payment history.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <BalanceCard
            title="Total Spent"
            amount={balance?.totalSpent || 0}
            icon={<DollarSign className="w-5 h-5 text-muted-foreground" />}
            footerText="All time"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="projects" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="projects" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span className="hidden sm:inline">Active Projects</span>
                  <span className="sm:hidden">Projects</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  <span className="hidden sm:inline">Transaction History</span>
                  <span className="sm:hidden">History</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="projects">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Projects & Milestone Payments</CardTitle>
                    <CardDescription>Manage payments for your ongoing projects</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {projectsLoading ? (
                      <p>Loading...</p>
                    ) : (
                      projects?.map((project, idx) => (
                        <div key={project.id}>
                          <Link
                            href={`/projects/${project.id}`}
                            className="block rounded-lg transition hover:bg-accent/50 cursor-pointer"
                          >
                            <div className="space-y-4 p-3">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-medium mb-1 flex items-center gap-2">
                                    {project.projectName}
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                  </h4>
                                  <p className="text-sm text-muted-foreground">{project.freelancerName}</p>
                                </div>
                                <div className="text-right">
                                  <Badge variant="secondary">${project.totalBudget.toLocaleString()}</Badge>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    ${project.amountInEscrow.toLocaleString()} secured for milestones
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm mb-2">
                                <span className="text-muted-foreground">
                                  Paid: <span className="text-foreground font-medium">${project.amountPaid.toLocaleString()}</span>
                                </span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">Status: {project.status}</span>
                              </div>
                              <Progress value={(project.amountPaid / project.totalBudget) * 100} className="h-2" />
                            </div>
                          </Link>
                          {idx !== (projects?.length || 0) - 1 && <Separator className="mt-6" />}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <TransactionHistory transactions={transactions || []} isLoading={transactionsLoading} isClient />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="border-cyan-500/20 bg-cyan-500/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-600" />
                  <CardTitle>Secured Payments</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Your payments flow through secured milestone payments.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <span>Funds move only when milestones are approved.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <span>Release payments when you approve the work.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <span>Dispute resolution support.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
