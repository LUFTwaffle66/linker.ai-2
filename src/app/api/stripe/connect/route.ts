import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe-server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const { userId, userEmail } = await req.json();

    const appUrl = process.env.NEXT_PUBLIC_URL;
    if (!appUrl || !appUrl.startsWith('http')) {
      throw new Error('NEXT_PUBLIC_URL is not a valid URL in .env');
    }
    // Create Stripe Connect account
    const account = await stripe.accounts.create({
      type: 'standard', // Freelancers manage their own Stripe dashboard
      email: userEmail, // Pre-fill email in onboarding form
      // Don't set country - it will be collected during Stripe-hosted onboarding
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // Save to database (using admin client to bypass RLS)
    const { error } = await supabaseAdmin
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
      refresh_url: `${appUrl}/stripe/reauth`,
      return_url: `${appUrl}/dashboard?stripe=success`,
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
