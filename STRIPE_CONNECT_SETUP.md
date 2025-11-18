# Stripe Connect Setup Guide for LinkerAI

This guide will walk you through setting up Stripe Connect for your freelance marketplace with escrow functionality and milestone-based payments (50% upfront, 50% on completion).

---

## Table of Contents

1. [Overview](#overview)
2. [Stripe Account Setup](#stripe-account-setup)
3. [Database Schema](#database-schema)
4. [Environment Variables](#environment-variables)
5. [Stripe Connect Integration](#stripe-connect-integration)
6. [Payment Flow Implementation](#payment-flow-implementation)
7. [Webhook Setup](#webhook-setup)
8. [Testing](#testing)
9. [Production Checklist](#production-checklist)

---

## Overview

### Payment Flow Architecture

```
┌─────────────┐     50% Upfront      ┌──────────────────┐
│   Client    │ ──────────────────► │  Stripe Connect  │
│             │                      │  (Your Platform) │
└─────────────┘                      └──────────────────┘
                                              │
                                              │ Held in escrow
                                              │
                                     ┌────────▼────────┐
                                     │  Milestone 1    │
                                     │  (50% release)  │
                                     └────────┬────────┘
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │   Freelancer    │
                                     │  Stripe Account │
                                     └─────────────────┘
                                              ▲
                                              │
                                     ┌────────┴────────┐
                                     │  Milestone 2    │
                                     │  (50% release)  │
                                     └────────▲────────┘
                                              │
┌─────────────┐     50% Final        ┌───────┴──────────┐
│   Client    │ ──────────────────► │  Stripe Connect  │
│             │                      │  (Your Platform) │
└─────────────┘                      └──────────────────┘
```

### Key Features
- ✅ Escrow functionality (hold payments until milestones)
- ✅ Automatic platform fee deduction (10-20%)
- ✅ Split payments (50% upfront, 50% completion)
- ✅ Dispute handling
- ✅ Automatic payouts to freelancers
- ✅ Multi-currency support
- ✅ Tax compliance (Stripe Tax)

---

## Stripe Account Setup

### Step 1: Create Stripe Account

1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Sign up for a Stripe account
3. Complete business verification (required for Connect)

### Step 2: Enable Stripe Connect

1. Go to [https://dashboard.stripe.com/settings/connect](https://dashboard.stripe.com/settings/connect)
2. Click **"Get Started"**
3. Choose **"Platform or Marketplace"** as your integration type
4. Select **"Standard"** account type (recommended for freelancers)

### Step 3: Configure Connect Settings

1. **Branding**:
   - Upload your LinkerAI logo
   - Set brand color
   - Add support email

2. **OAuth Settings**:
   - Redirect URI: `https://yourdomain.com/api/stripe/callback`
   - For development: `http://localhost:3000/api/stripe/callback`

3. **Platform Settings**:
   - Enable "Statement Descriptor": `LINKERAI`
   - Set default platform fee: 15% (you can adjust)

### Step 4: Get API Keys

1. Go to [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)
4. Copy your **Webhook signing secret** (we'll get this later)

---

## Database Schema

Add these tables to your Supabase database:

### Migration: `011_add_stripe_payments.sql`

```sql
-- Stripe Connected Accounts
CREATE TABLE stripe_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_account_id TEXT NOT NULL UNIQUE,
  account_type TEXT NOT NULL DEFAULT 'standard', -- standard, express, custom
  charges_enabled BOOLEAN DEFAULT false,
  payouts_enabled BOOLEAN DEFAULT false,
  details_submitted BOOLEAN DEFAULT false,
  country TEXT,
  currency TEXT DEFAULT 'usd',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)
);

-- Payment Intents (Escrow)
CREATE TABLE payment_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES users(id),
  freelancer_id UUID NOT NULL REFERENCES users(id),
  stripe_payment_intent_id TEXT NOT NULL UNIQUE,
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL, -- requires_payment_method, requires_confirmation, succeeded, canceled
  milestone_type TEXT NOT NULL, -- upfront_50, completion_50
  platform_fee INTEGER, -- your commission in cents
  application_fee INTEGER, -- Stripe's fee in cents
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transfers (Payouts to Freelancers)
CREATE TABLE transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_intent_id UUID REFERENCES payment_intents(id),
  project_id UUID NOT NULL REFERENCES projects(id),
  freelancer_id UUID NOT NULL REFERENCES users(id),
  freelancer_stripe_account_id TEXT NOT NULL,
  stripe_transfer_id TEXT NOT NULL UNIQUE,
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL, -- pending, paid, failed, canceled, reversed
  description TEXT,
  metadata JSONB,
  transferred_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment History
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  type TEXT NOT NULL, -- payment, payout, refund, platform_fee
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL,
  stripe_id TEXT, -- payment_intent, transfer, or refund ID
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_stripe_accounts_user_id ON stripe_accounts(user_id);
CREATE INDEX idx_payment_intents_project_id ON payment_intents(project_id);
CREATE INDEX idx_payment_intents_status ON payment_intents(status);
CREATE INDEX idx_transfers_project_id ON transfers(project_id);
CREATE INDEX idx_transfers_freelancer_id ON transfers(freelancer_id);
CREATE INDEX idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_project_id ON payment_transactions(project_id);

-- RLS Policies
ALTER TABLE stripe_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own stripe account
CREATE POLICY "Users can view own stripe account"
  ON stripe_accounts FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view payment intents they're involved in
CREATE POLICY "Users can view own payment intents"
  ON payment_intents FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

-- Users can view transfers they're involved in
CREATE POLICY "Users can view own transfers"
  ON transfers FOR SELECT
  USING (auth.uid() = freelancer_id);

-- Users can view their own payment transactions
CREATE POLICY "Users can view own transactions"
  ON payment_transactions FOR SELECT
  USING (auth.uid() = user_id);
```

---

## Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe API Keys (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx

# Stripe Connect Settings
NEXT_PUBLIC_STRIPE_CONNECT_CLIENT_ID=ca_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PLATFORM_FEE_PERCENTAGE=15 # Your platform fee (15%)

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_REDIRECT_URI=http://localhost:3000/api/stripe/callback
```

### For Production (`.env.production`):

```bash
# Stripe API Keys (Live Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx

# Stripe Connect Settings
NEXT_PUBLIC_STRIPE_CONNECT_CLIENT_ID=ca_xxxxxxxxxxxxxxxxxxxxx
STRIPE_PLATFORM_FEE_PERCENTAGE=15

# Application URLs
NEXT_PUBLIC_APP_URL=https://linkerai.com
STRIPE_REDIRECT_URI=https://linkerai.com/api/stripe/callback
```

---

## Stripe Connect Integration

### Step 1: Install Stripe SDK

```bash
pnpm add stripe @stripe/stripe-js
pnpm add -D @types/stripe
```

### Step 2: Create Stripe Client

Create `src/lib/stripe/stripe-server.ts`:

```typescript
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

export const platformFeePercentage = parseInt(
  process.env.STRIPE_PLATFORM_FEE_PERCENTAGE || '15'
);
```

Create `src/lib/stripe/stripe-client.ts`:

```typescript
import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }
  return stripePromise;
};
```

### Step 3: Freelancer Onboarding Flow

Create `src/app/api/stripe/connect/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe-server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    // Create Stripe Connect account
    const account = await stripe.accounts.create({
      type: 'standard', // Freelancers manage their own Stripe dashboard
      country: 'US', // Or get from user profile
      email: userEmail, // Get from database
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // Save to database
    const { error } = await supabase
      .from('stripe_accounts')
      .insert({
        user_id: userId,
        stripe_account_id: account.id,
        account_type: 'standard',
      });

    if (error) throw error;

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/stripe/reauth`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?stripe=success`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error('Stripe Connect error:', error);
    return NextResponse.json(
      { error: 'Failed to create Stripe account' },
      { status: 500 }
    );
  }
}
```

### Step 4: OAuth Callback Handler

Create `src/app/api/stripe/callback/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe-server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?stripe=error`
    );
  }

  try {
    // Exchange code for account ID
    const response = await stripe.oauth.token({
      grant_type: 'authorization_code',
      code,
    });

    const accountId = response.stripe_user_id;

    // Get account details
    const account = await stripe.accounts.retrieve(accountId);

    // Update database
    await supabase
      .from('stripe_accounts')
      .update({
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        details_submitted: account.details_submitted,
      })
      .eq('stripe_account_id', accountId);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?stripe=success`
    );
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?stripe=error`
    );
  }
}
```

---

## Payment Flow Implementation

### Phase 1: Client Pays 50% Upfront

Create `src/app/api/payments/create-intent/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe, platformFeePercentage } from '@/lib/stripe/stripe-server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { projectId, clientId, freelancerId } = await req.json();

    // Get project details
    const { data: project } = await supabase
      .from('projects')
      .select('*, client:users!projects_client_id_fkey(*)')
      .eq('id', projectId)
      .single();

    if (!project) throw new Error('Project not found');

    // Get freelancer's Stripe account
    const { data: stripeAccount } = await supabase
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
    await supabase.from('payment_intents').insert({
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
```

### Phase 2: Release Payment to Freelancer (After Milestone)

Create `src/app/api/payments/release/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe-server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId, projectId } = await req.json();

    // Get payment intent from database
    const { data: paymentIntent } = await supabase
      .from('payment_intents')
      .select('*, freelancer:users!payment_intents_freelancer_id_fkey(*)')
      .eq('stripe_payment_intent_id', paymentIntentId)
      .single();

    if (!paymentIntent) throw new Error('Payment intent not found');

    // Get freelancer's Stripe account
    const { data: stripeAccount } = await supabase
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
    await supabase.from('transfers').insert({
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
    await supabase.from('payment_transactions').insert({
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
```

---

## Webhook Setup

### Step 1: Create Webhook Endpoint

Create `src/app/api/webhooks/stripe/route.ts`:

```typescript
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
```

### Step 2: Register Webhook in Stripe Dashboard

1. Go to [https://dashboard.stripe.com/test/webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click **"Add endpoint"**
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. For local testing: Use Stripe CLI or ngrok
5. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `transfer.created`
   - `transfer.failed`
   - `account.updated`
6. Copy the **Signing secret** to your `.env.local`

---

## Testing

### Local Testing with Stripe CLI

1. Install Stripe CLI:
```bash
brew install stripe/stripe-cli/stripe
```

2. Login:
```bash
stripe login
```

3. Forward webhooks to local server:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

4. Use test cards:
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Authentication Required: 4000 0027 6000 3184
```

### Test Payment Flow

```typescript
// 1. Create test project
// 2. Connect freelancer Stripe account (test mode)
// 3. Client pays 50% upfront using test card
// 4. Verify payment intent created in Stripe dashboard
// 5. Mark milestone complete
// 6. Release payment to freelancer
// 7. Verify transfer in Stripe dashboard
```

---

## Production Checklist

Before going live:

- [ ] Switch to **Live API keys** (not test keys)
- [ ] Update webhook endpoint to production URL
- [ ] Complete Stripe account verification
- [ ] Set up proper error monitoring (Sentry)
- [ ] Add email notifications for payments
- [ ] Implement refund handling
- [ ] Add dispute management UI
- [ ] Set up automatic tax calculation (Stripe Tax)
- [ ] Configure payout schedule for freelancers
- [ ] Add payment receipt generation
- [ ] Implement payment retry logic for failed payments
- [ ] Add multi-currency support (if needed)
- [ ] Set up fraud detection rules
- [ ] Test with real bank accounts (small amounts)
- [ ] Add Terms of Service agreement before payment
- [ ] Implement secure PCI compliance
- [ ] Add payment dashboard for users

---

## Additional Resources

- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Security](https://stripe.com/docs/security/stripe)

---

## Support

For issues or questions:
- Stripe Support: https://support.stripe.com
- Stripe Community: https://stripe.com/community
- Documentation: https://stripe.com/docs

---

**Next Steps:**
1. Set up your Stripe account
2. Run the database migration
3. Implement the API routes
4. Build the payment UI components
5. Test with Stripe test mode
6. Go live! 🚀
