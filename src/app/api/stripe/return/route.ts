import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe-server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// 1. Must use named export 'GET', not 'default'
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // 2. Extract parameters manually (API Routes don't give you 'params' prop)
  // We look for 'account_id' because that is what we will set in the link creator
  const stripeAccountId = searchParams.get('account_id');
  const lang = searchParams.get('lang') || 'en'; // Fallback to 'en'

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (!stripeAccountId) {
    return NextResponse.redirect(new URL(`/${lang}/payments?onboarding=error`, baseUrl));
  }

  try {
    // 3. ASK STRIPE (Sync on Return)
    const account = await stripe.accounts.retrieve(stripeAccountId);

    if (
      account.details_submitted &&
      account.requirements?.currently_due?.length === 0
    ) {
      // 4. SYNC TO DB
      await supabaseAdmin
        .from('stripe_accounts') // Make sure this matches your exact table name
        .update({
          details_submitted: true,
          charges_enabled: account.charges_enabled,
          payouts_enabled: account.payouts_enabled,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_account_id', stripeAccountId);

      // 5. SUCCESS REDIRECT
      return NextResponse.redirect(new URL(`/${lang}/payments?onboarding=success`, baseUrl));
    }

    // 6. INCOMPLETE REDIRECT
    return NextResponse.redirect(new URL(`/${lang}/payments?onboarding=incomplete`, baseUrl));

  } catch (error) {
    console.error('Stripe return error:', error);
    return NextResponse.redirect(new URL(`/${lang}/payments?onboarding=error`, baseUrl));
  }
}