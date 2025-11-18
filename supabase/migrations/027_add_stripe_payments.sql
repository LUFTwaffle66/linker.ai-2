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
