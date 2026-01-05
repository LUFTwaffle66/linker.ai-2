import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe-server';
// CHANGE 1: Use the Admin client to bypass RLS
import { supabaseAdmin } from '@/lib/supabase/admin'; 
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

  try {
    // Handle events
    switch (event.type as any) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'transfer.created':
        await handleTransferCreated(event.data.object as Stripe.Transfer);
        break;

      case 'account.updated':
        await handleAccountUpdated(event.data.object as Stripe.Account);
        break;

      // REMOVED 'payment.created' as it is a typo/invalid event
      case 'payment_intent.created':
      case 'charge.updated':
        console.log(`No-op handler for event type: ${event.type}`);
        return NextResponse.json({ received: true });
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
        return NextResponse.json({ received: true });
    }
  } catch (error: any) {
    // Catch database errors so we see them in Vercel/Server logs
    console.error(`Webhook processing failed for ${event.type}:`, error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // 1. Extract and validate metadata (throw if missing so we don't silently skip updates)
  const { projectId, clientId, freelancerId, milestoneType } = paymentIntent.metadata;

  if (!projectId) {
    throw new Error('Missing projectId in payment intent metadata');
  }

  if (!milestoneType) {
    throw new Error(`Missing milestoneType for project ${projectId}`);
  }

  console.log(`💰 Processing success for Project: ${projectId}, Type: ${milestoneType}`);

  // 2. Update Payment Intent Status (Keep this)
  const { error: intentError } = await supabaseAdmin
    .from('payment_intents')
    .update({ status: 'succeeded' })
    .eq('stripe_payment_intent_id', paymentIntent.id);

  if (intentError) throw new Error(`Intent Update Failed: ${intentError.message}`);

  // 3. LOG FOR CLIENT (The "Spender")
  // This keeps the Client's "Total Spent" dashboard correct
  const { error: clientTxError } = await supabaseAdmin.from('payment_transactions').insert({
    user_id: clientId,
    project_id: projectId,
    type: 'payment', // or 'payment_sent'
    amount: paymentIntent.amount, 
    status: 'succeeded',
    stripe_id: paymentIntent.id,
    description: `Paid: ${milestoneType}`,
  });

  if (clientTxError) console.error(`Client Tx Failed: ${clientTxError.message}`);

  // 4. [NEW] LOG FOR FREELANCER (The "Earner")
  // This fixes the "$0 Lifetime Earnings" bug!
  if (freelancerId) {
    const { error: freelancerTxError } = await supabaseAdmin.from('payment_transactions').insert({
      user_id: freelancerId,
      project_id: projectId,
      type: 'payment', // This matches your Earnings calculation logic
      amount: paymentIntent.amount, 
      status: 'succeeded', // Confirmed money
      stripe_id: paymentIntent.id,
      description: `Received: ${milestoneType}`,
    });

    if (freelancerTxError) console.error(`Freelancer Tx Failed: ${freelancerTxError.message}`);

    // Notify freelancer that the payment is on the way
    const amountString = ((paymentIntent.amount || 0) / 100).toFixed(2);
    const milestoneLabel = milestoneType === 'upfront_50' ? 'upfront' : 'final';

    const { error: notificationError } = await supabaseAdmin.from('notifications').insert({
      user_id: freelancerId,
      category: 'payment',
      type: 'payment_received',
      title: 'Payment Received',
      message:
        'Great news! The client has paid the milestone. Funds are processing and will arrive in your bank account in 2-5 business days.',
      project_id: projectId,
      payment_intent_id: null,
      actor_id: clientId,
      action_url: `/projects/${projectId}`,
      metadata: { milestone: milestoneLabel, amount: amountString, stripe_id: paymentIntent.id },
    });

    if (notificationError) {
      console.error(`Notification insert failed for freelancer ${freelancerId}:`, notificationError);
    }
  }

  // 5. Update the Project State (Keep this exactly as you had it)
  const updateData: any = {};
  
  if (milestoneType === 'upfront_50') {
    updateData.upfront_paid = true;
    updateData.upfront_date = new Date().toISOString();
    updateData.status = 'in_progress';
  } else if (milestoneType === 'final_50') {
    updateData.final_paid = true;
    updateData.final_date = new Date().toISOString();
    updateData.status = 'completed';
  } else {
    throw new Error(`Unhandled milestone type "${milestoneType}" for project ${projectId}`);
  }

  if (Object.keys(updateData).length > 0) {
    const { data: updatedProject, error: projectError } = await supabaseAdmin
      .from('projects')
      .update(updateData)
      .eq('id', projectId)
      .select('id, title, client_id, hired_freelancer_id, upfront_paid, final_paid, status')
      .single();

    if (projectError) throw new Error(`Project Update Failed: ${projectError.message}`);
    if (!updatedProject) throw new Error(`Project ${projectId} not found for update`);

    console.log(
      `✅ Updated project ${projectId}: upfront_paid=${updatedProject.upfront_paid}, status=${updatedProject.status}`
    );

    // Completion notifications on final payment
    if (milestoneType === 'final_50') {
      const amountString = ((paymentIntent.amount || 0) / 100).toFixed(2);

      // Notify freelancer: project completed
      if (freelancerId) {
        const { error: finalFreelancerNotifError } = await supabaseAdmin.from('notifications').insert({
          user_id: freelancerId,
          category: 'payment',
          type: 'payment_received',
          title: 'Project Completed',
          message: 'The client released the final payment. Your project is now complete.',
          project_id: projectId,
          payment_intent_id: null,
          actor_id: clientId,
          action_url: `/projects/${projectId}`,
          metadata: { milestone: 'final', amount: amountString, stripe_id: paymentIntent.id },
        });
        if (finalFreelancerNotifError) {
          console.error('Final payment freelancer notification failed:', finalFreelancerNotifError);
        }
      }

      // Notify client: project closed
      if (clientId) {
        const { error: finalClientNotifError } = await supabaseAdmin.from('notifications').insert({
          user_id: clientId,
          category: 'payment',
          type: 'payment_received',
          title: 'Project Closed',
          message: 'Final payment processed and the project is now closed.',
          project_id: projectId,
          payment_intent_id: null,
          actor_id: freelancerId,
          action_url: `/projects/${projectId}`,
          metadata: { milestone: 'final', amount: amountString, stripe_id: paymentIntent.id },
        });
        if (finalClientNotifError) {
          console.error('Final payment client notification failed:', finalClientNotifError);
        }
      }

      // Notify both client and freelancer that the project is completed
      const completionTargets = [clientId, freelancerId].filter(Boolean) as string[];
      const projectTitle = updatedProject.title || 'Project';

      if (completionTargets.length > 0) {
        const completionPayload = completionTargets.map((userId) => ({
          user_id: userId,
          category: 'projects',
          type: 'project_completed',
          title: 'Project Completed',
          message: `The project "${projectTitle}" has been completed. Please leave a review.`,
          project_id: projectId,
          actor_id: clientId,
          is_read: false,
          action_url: `/projects/${projectId}`,
          metadata: { project_name: projectTitle, action: 'leave_review' },
        }));

        const { error: completionNotifError } = await supabaseAdmin
          .from('notifications')
          .insert(completionPayload);

        if (completionNotifError) {
          console.error('Project completion notifications failed:', completionNotifError);
        }
      }
    }
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const { error } = await supabaseAdmin
    .from('payment_intents')
    .update({ status: 'failed' })
    .eq('stripe_payment_intent_id', paymentIntent.id);
    
  if (error) console.error('Error updating failed intent:', error);
}

async function handleTransferCreated(transfer: Stripe.Transfer) {
  await supabaseAdmin
    .from('transfers')
    .update({ status: 'paid' })
    .eq('stripe_transfer_id', transfer.id);
}

async function handleAccountUpdated(account: Stripe.Account) {
  await supabaseAdmin
    .from('stripe_accounts')
    .update({
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted,
    })
    .eq('stripe_account_id', account.id);
}
