import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe-server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId, projectId } = await req.json();

    // Get payment intent from database
    const { data: paymentIntent } = await supabaseAdmin
      .from('payment_intents')
      .select('*, freelancer:users!payment_intents_freelancer_id_fkey(*)')
      .eq('stripe_payment_intent_id', paymentIntentId)
      .single();

    if (!paymentIntent) throw new Error('Payment intent not found');

    // Get freelancer's Stripe account
    const { data: stripeAccount } = await supabaseAdmin
      .from('stripe_accounts')
      .select('*')
      .eq('user_id', paymentIntent.freelancer_id)
      .single();

    // Calculate transfer amount (after platform fee)
    const transferAmount = paymentIntent.amount - paymentIntent.platform_fee;

    // Create transfer to freelancer
    const transfer = await stripe.transfers.create({
      amount: transferAmount,
      currency: 'usd',
      destination: stripeAccount.stripe_account_id,
      transfer_group: projectId,
      description: `Payment for project ${projectId} - ${paymentIntent.milestone_type}`,
      metadata: {
        projectId: projectId,
        paymentIntentId: paymentIntentId,
        milestoneType: paymentIntent.milestone_type,
      },
    });

    // Save transfer to database
    await supabaseAdmin.from('transfers').insert({
      payment_intent_id: paymentIntent.id,
      project_id: projectId,
      freelancer_id: paymentIntent.freelancer_id,
      freelancer_stripe_account_id: stripeAccount.stripe_account_id,
      stripe_transfer_id: transfer.id,
      amount: transferAmount,
      status: 'paid',
      transferred_at: new Date().toISOString(),
    });

    // Log transaction
    await supabaseAdmin.from('payment_transactions').insert({
      user_id: paymentIntent.freelancer_id,
      project_id: projectId,
      type: 'payout',
      amount: transferAmount,
      status: 'completed',
      stripe_id: transfer.id,
      description: `Milestone payment received`,
    });

    return NextResponse.json({ success: true, transfer });
  } catch (error) {
    console.error('Transfer error:', error);
    return NextResponse.json(
      { error: 'Failed to release payment' },
      { status: 500 }
    );
  }
}
