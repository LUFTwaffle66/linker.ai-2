import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe-server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    // 1. Receive locale from frontend
    const { userId, userEmail, locale = 'en' } = await req.json();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl) throw new Error('NEXT_PUBLIC_APP_URL is missing');

    // 2. Create Stripe Connect account (EXPRESS type)
    const account = await stripe.accounts.create({
      type: 'express', // CHANGED: 'standard' -> 'express' to match your goal
      email: userEmail,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // 3. Save to database
    const { error } = await supabaseAdmin
      .from('stripe_accounts')
      .insert({
        user_id: userId,
        stripe_account_id: account.id,
        account_type: 'express', // CHANGED: Match the stripe type
        charges_enabled: false,
        details_submitted: false,
        payouts_enabled: false
      });

    if (error) throw error;

    // 4. Create Link with Passthrough State
    // We pass 'lang' so the return handler knows where to redirect
    const returnUrl = `${baseUrl}/api/stripe/return?account_id=${account.id}&lang=${locale}`;
    
    // Refresh URL: If user cancels, send them back to dashboard to click "try again"
    const refreshUrl = `${baseUrl}/${locale}/payments?error=refresh`; 

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      type: 'account_onboarding',
      return_url: returnUrl,
      refresh_url: refreshUrl,
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