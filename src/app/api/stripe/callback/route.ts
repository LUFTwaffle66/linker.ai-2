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

    if (!accountId) {
      throw new Error('Stripe account ID not found');
    }

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
