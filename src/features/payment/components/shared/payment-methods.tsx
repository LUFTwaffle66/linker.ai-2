import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Building } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: string;
  brand?: string;
  last4: string;
  isDefault: boolean;
}

interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[];
}

export function PaymentMethods({ paymentMethods }: PaymentMethodsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Payment Methods</CardTitle>
          <Button variant="ghost" size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {paymentMethods?.map((method) => (
          <div
            key={method.id}
            className={`p-4 rounded-lg border ${method.isDefault ? 'border-primary bg-primary/5' : 'border-border'}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${method.isDefault ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <Building className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium mb-1">{method.brand || method.type}</p>
                <p className="text-sm text-muted-foreground">****{method.last4}</p>
                {method.isDefault && (
                  <Badge variant="secondary" className="mt-2">
                    Primary
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
