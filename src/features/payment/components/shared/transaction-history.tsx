import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ArrowUpRight, ArrowDownLeft, Shield } from 'lucide-react';

import type { Transaction } from '../../types';

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading: boolean;
  isClient: boolean;
}

export function TransactionHistory({ transactions, isLoading, isClient }: TransactionHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>All payments and account activity</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            transactions?.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.amount > 0
                        ? 'bg-success-green/10'
                        : transaction.type === 'deposit'
                        ? 'bg-cyan-500/10'
                        : 'bg-primary/10'
                    }`}
                  >
                    {isClient ? (
                      transaction.amount > 0 ? (
                        <ArrowUpRight className="w-5 h-5 text-success-green" />
                      ) : transaction.type === 'deposit' ? (
                        <Shield className="w-5 h-5 text-cyan-500" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5 text-primary" />
                      )
                    ) : transaction.type === 'payment' ? (
                      <ArrowUpRight className="w-5 h-5 text-success-green" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium mb-1 truncate">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      {(isClient ? transaction.freelancerName : transaction.clientName) && (
                        <>
                          <span>•</span>
                          <span>{isClient ? transaction.freelancerName : transaction.clientName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`font-medium ${transaction.amount > 0 ? 'text-success-green' : 'text-foreground'}`}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
