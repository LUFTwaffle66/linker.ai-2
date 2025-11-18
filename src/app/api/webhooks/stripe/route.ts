import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe-server';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle events
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object);
      break;

    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object);
      break;

    case 'transfer.created':
      await handleTransferCreated(event.data.object);
      break;

    case 'account.updated':
      await handleAccountUpdated(event.data.object);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Update payment intent status
  await supabase
    .from('payment_intents')
    .update({ status: 'succeeded' })
    .eq('stripe_payment_intent_id', paymentIntent.id);

  // Log transaction
  await supabase.from('payment_transactions').insert({
    user_id: paymentIntent.metadata.clientId,
    project_id: paymentIntent.metadata.projectId,
    type: 'payment',
    amount: paymentIntent.amount,
    status: 'completed',
    stripe_id: paymentIntent.id,
    description: 'Payment received',
  });

  // TODO: Send email notification
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  await supabase
    .from('payment_intents')
    .update({ status: 'failed' })
    .eq('stripe_payment_intent_id', paymentIntent.id);

  // TODO: Send failure notification
}

async function handleTransferCreated(transfer: Stripe.Transfer) {
  // Update transfer status
  await supabase
    .from('transfers')
    .update({ status: 'paid' })
    .eq('stripe_transfer_id', transfer.id);

  // TODO: Send payout notification to freelancer
}

async function handleAccountUpdated(account: Stripe.Account) {
  await supabase
    .from('stripe_accounts')
    .update({
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted,
    })
    .eq('stripe_account_id', account.id);
}
