import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe-server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    // 1. Receive locale from body (more reliable than headers)
    const { userId, locale = 'en' } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Check DB for existing account
    const { data: existingAccount } = await supabaseAdmin
      .from('stripe_accounts')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    let stripeAccountId: string;

    if (existingAccount) {
      stripeAccountId = existingAccount.stripe_account_id;
    } else {
      // Logic to create new if missing (Fail-safe)
      const account = await stripe.accounts.create({
        type: 'express',
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });

      stripeAccountId = account.id;

      await supabaseAdmin.from('stripe_accounts').insert({
        user_id: userId,
        stripe_account_id: stripeAccountId,
        charges_enabled: false,
        payouts_enabled: false,
        details_submitted: false,
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl) throw new Error('NEXT_PUBLIC_APP_URL is missing');

    // 2. Generate Link with Passthrough State
    const returnUrl = `${baseUrl}/api/stripe/return?account_id=${stripeAccountId}&lang=${locale}`;
    const refreshUrl = `${baseUrl}/${locale}/payments?error=refresh`; 

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error('Stripe onboarding error:', error);
    return NextResponse.json(
      { error: 'Failed to start onboarding' },
      { status: 500 }
    );
  }
}