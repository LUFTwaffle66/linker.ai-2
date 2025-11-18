import { NextRequest, NextResponse } from 'next/server';
import { stripe, platformFeePercentage } from '@/lib/stripe/stripe-server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const { projectId, clientId, freelancerId } = await req.json();

    // Get project details
    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('*, client:users!projects_client_id_fkey(*)')
      .eq('id', projectId)
      .single();

    if (!project) throw new Error('Project not found');

    // Get freelancer's Stripe account
    const { data: stripeAccount } = await supabaseAdmin
      .from('stripe_accounts')
      .select('*')
      .eq('user_id', freelancerId)
      .single();

    if (!stripeAccount) {
      throw new Error('Freelancer has not connected Stripe account');
    }

    // Calculate amounts (50% upfront)
    const totalAmount = project.fixed_budget * 100; // Convert to cents
    const upfrontAmount = Math.round(totalAmount * 0.5);
    const platformFee = Math.round(upfrontAmount * (platformFeePercentage / 100));

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: upfrontAmount,
      currency: 'usd',
      application_fee_amount: platformFee,
      transfer_data: {
        destination: stripeAccount.stripe_account_id,
      },
      metadata: {
        projectId: projectId,
        clientId: clientId,
        freelancerId: freelancerId,
        milestoneType: 'upfront_50',
      },
      description: `${project.title} - 50% Upfront Payment`,
    });

    // Save to database
    await supabaseAdmin.from('payment_intents').insert({
      project_id: projectId,
      client_id: clientId,
      freelancer_id: freelancerId,
      stripe_payment_intent_id: paymentIntent.id,
      amount: upfrontAmount,
      platform_fee: platformFee,
      milestone_type: 'upfront_50',
      status: paymentIntent.status,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
