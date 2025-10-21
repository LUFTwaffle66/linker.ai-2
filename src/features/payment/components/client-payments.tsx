'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Wallet,
  Shield,
  DollarSign,
  Briefcase,
  History,
  Plus,
  CheckCircle,
} from 'lucide-react';
import {
  useClientBalance,
  useClientProjects,
  useClientTransactions,
  usePaymentMethods,
  useAddFunds,
  useReleaseFinalPayment,
} from '../hooks';
import { toast } from 'sonner';
import { BalanceCard } from './shared/balance-card';
import { TransactionHistory } from './shared/transaction-history';
import { PaymentMethods } from './shared/payment-methods';

export function ClientPayments() {
  const [addFundsAmount, setAddFundsAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showAddFunds, setShowAddFunds] = useState(false);

  const { data: balance, isLoading: balanceLoading } = useClientBalance();
  const { data: projects, isLoading: projectsLoading } = useClientProjects();
  const { data: transactions, isLoading: transactionsLoading } = useClientTransactions();
  const { data: paymentMethods } = usePaymentMethods();
  const addFundsMutation = useAddFunds();
  const releaseMutation = useReleaseFinalPayment();

  const handleAddFunds = () => {
    const amount = parseFloat(addFundsAmount);
    if (!amount || amount < 10 || !selectedPaymentMethod) {
      toast.error('Please enter a valid amount and select a payment method');
      return;
    }

    addFundsMutation.mutate(
      { amount, paymentMethodId: selectedPaymentMethod },
      {
        onSuccess: () => {
          toast.success('Funds added successfully');
          setShowAddFunds(false);
          setAddFundsAmount('');
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to add funds');
        },
      }
    );
  };

  if (balanceLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Payments & Billing</h1>
          <p className="text-muted-foreground">
            Manage your payments, escrow accounts, and billing information
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <BalanceCard
            title="Account Balance"
            amount={balance?.availableBalance || 0}
            icon={<Wallet className="w-5 h-5 text-primary" />}
            onAddFunds={() => setShowAddFunds(true)}
          />
          <BalanceCard
            title="In Escrow"
            amount={balance?.escrowBalance || 0}
            icon={<Shield className="w-5 h-5 text-cyan-500" />}
            footerText="Protected funds"
          />
          <BalanceCard
            title="Pending Payments"
            amount={balance?.pendingPayments || 0}
            icon={<DollarSign className="w-5 h-5 text-muted-foreground" />}
            footerText="Processing"
          />
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
                    <CardTitle>Active Projects & Escrow</CardTitle>
                    <CardDescription>Manage payments for your ongoing projects</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {projectsLoading ? (
                      <p>Loading...</p>
                    ) : (
                      projects?.map((project, idx) => (
                        <div key={project.id}>
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-medium mb-1">{project.projectName}</h4>
                                  <p className="text-sm text-muted-foreground">{project.freelancerName}</p>
                                </div>
                                <div className="text-right">
                                  <Badge variant="secondary">${project.totalBudget.toLocaleString()}</Badge>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    ${project.amountInEscrow.toLocaleString()} in escrow
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

                            {project.amountInEscrow > 0 && project.status === 'active' && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  releaseMutation.mutate(
                                    { contractId: project.id, amount: project.amountInEscrow },
                                    {
                                      onSuccess: () => toast.success('Payment released successfully'),
                                      onError: (error) => toast.error(error.message || 'Failed to release payment'),
                                    }
                                  );
                                }}
                                disabled={releaseMutation.isPending}
                              >
                                Release Final Payment (${project.amountInEscrow.toLocaleString()})
                              </Button>
                            )}
                          </div>
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
            <PaymentMethods paymentMethods={paymentMethods || []} />
            <Card className="border-cyan-500/20 bg-cyan-500/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-600" />
                  <CardTitle>Escrow Protection</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">Your payments are protected by our secure escrow system</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <span>Funds held securely until project completion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <span>Release payments only when satisfied</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <span>Dispute resolution support</span>
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
