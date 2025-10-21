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
import {
  Wallet,
  Clock,
  CheckCircle,
  TrendingUp,
  Briefcase,
  History,
  AlertCircle,
  DollarSign,
  Plus,
  FileText,
  ArrowDownLeft,
  Download,
} from 'lucide-react';
import {
  useFreelancerEarnings,
  useFreelancerContracts,
  useFreelancerTransactions,
  usePaymentMethods,
  useTaxDocuments,
  useWithdrawFunds,
} from '../hooks';
import { toast } from 'sonner';
import { BalanceCard } from './shared/balance-card';
import { TransactionHistory } from './shared/transaction-history';
import { PaymentMethods } from './shared/payment-methods';

export function FreelancerPayments() {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const { data: earnings, isLoading: earningsLoading } = useFreelancerEarnings();
  const { data: contracts, isLoading: contractsLoading } = useFreelancerContracts();
  const { data: transactions, isLoading: transactionsLoading } = useFreelancerTransactions();
  const { data: paymentMethods } = usePaymentMethods();
  const { data: taxDocuments } = useTaxDocuments();
  const withdrawMutation = useWithdrawFunds();

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < 10 || !selectedMethod) {
      toast.error('Please enter a valid amount and select a payment method');
      return;
    }

    withdrawMutation.mutate(
      { amount, paymentMethodId: selectedMethod },
      {
        onSuccess: () => {
          toast.success('Withdrawal initiated successfully');
          setWithdrawAmount('');
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to process withdrawal');
        },
      }
    );
  };

  if (earningsLoading) return <div className="p-8 mx-auto max-w-7xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Payments & Earnings</h1>
          <p className="text-muted-foreground">
            Manage your earnings, withdrawals, and payment methods
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <BalanceCard
            title="Available Balance"
            amount={earnings?.availableBalance || 0}
            icon={<Wallet className="w-5 h-5 text-primary" />}
            footerText="Ready to withdraw"
          />
          <BalanceCard
            title="Pending"
            amount={earnings?.pendingClearance || 0}
            icon={<Clock className="w-5 h-5 text-amber-500" />}
            footerText="In review"
          />
          <BalanceCard
            title="This Period"
            amount={earnings?.totalEarnings || 0}
            icon={<CheckCircle className="w-5 h-5 text-cyan-500" />}
            footerText="Current earnings"
          />
          <BalanceCard
            title="Total Earned"
            amount={earnings?.lifetimeEarnings || 0}
            icon={<TrendingUp className="w-5 h-5 text-success-green" />}
            footerText="All time"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="withdraw" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="withdraw" className="flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  <span className="hidden sm:inline">Withdraw</span>
                </TabsTrigger>
                <TabsTrigger value="contracts" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span className="hidden sm:inline">Contracts</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  <span className="hidden sm:inline">History</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="withdraw">
                <Card>
                  <CardHeader>
                    <CardTitle>Withdraw Funds</CardTitle>
                    <CardDescription>Transfer your available balance to your payment method</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Available to Withdraw</p>
                          <p className="text-2xl">${earnings?.availableBalance.toLocaleString()}</p>
                        </div>
                        <Wallet className="w-8 h-8 text-primary" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Withdrawal Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Minimum withdrawal: $10 • Maximum: ${earnings?.availableBalance.toLocaleString()}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="method">Payment Method</Label>
                      <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods?.map((method) => (
                            <SelectItem key={method.id} value={method.id}>
                              {method.type} ****{method.last4}
                              {method.isDefault && ' (Default)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium mb-1">Processing Time</p>
                          <p className="text-sm text-muted-foreground">
                            Bank transfers take 3-5 business days. PayPal transfers are instant.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleWithdraw}
                      disabled={!withdrawAmount || parseFloat(withdrawAmount) < 10 || withdrawMutation.isPending}
                    >
                      <ArrowDownLeft className="w-4 h-4 mr-2" />
                      {withdrawMutation.isPending ? 'Processing...' : 'Withdraw Funds'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contracts">
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
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-medium mb-1">{contract.projectName}</h4>
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
                          </div>
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

          <div className="space-y-6">
            <PaymentMethods paymentMethods={paymentMethods || []} />
            <Card>
              <CardHeader>
                <CardTitle>Tax Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {taxDocuments?.map((doc) => (
                  <Button key={doc.id} variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    {doc.type} {doc.year}
                    <Download className="w-4 h-4 ml-auto" />
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
