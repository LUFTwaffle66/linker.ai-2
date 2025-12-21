/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import { useCallback, useState } from 'react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQueryClient } from '@tanstack/react-query';
import { getStripe } from '@/lib/stripe/stripe-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { dashboardKeys } from '@/features/dashboard/hooks/use-dashboard';

interface StripePaymentSheetProps {
  clientSecret: string;
  projectId?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

function PaymentForm({ onSuccess }: { onSuccess?: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = useCallback(async () => {
    if (!stripe || !elements) return;
    setSubmitting(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    setSubmitting(false);

    if (error) {
      toast.error(error.message || 'Payment confirmation failed');
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      toast.success('Payment confirmed');
      onSuccess?.();
    } else {
      toast.message('Payment submitted', {
        description: 'We will update the status shortly.',
      });
    }
  }, [elements, onSuccess, stripe]);

  return (
    <div className="space-y-4">
      <PaymentElement />
      <Button className="w-full" onClick={handleConfirm} disabled={!stripe || submitting}>
        {submitting ? 'Processing...' : 'Confirm Payment'}
      </Button>
    </div>
  );
}

export function StripePaymentSheet({
  clientSecret,
  projectId,
  onSuccess,
  onClose,
}: StripePaymentSheetProps) {
  const queryClient = useQueryClient();

  if (!clientSecret) return null;

  const handleSuccess = () => {
    if (projectId) {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    }
    onSuccess?.();
    onClose?.();
  };

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <Elements stripe={getStripe()} options={{ clientSecret }}>
          <PaymentForm onSuccess={handleSuccess} />
        </Elements>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="w-full">
            Cancel
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
