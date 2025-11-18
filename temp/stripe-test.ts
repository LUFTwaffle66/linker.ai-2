import { stripe } from '@/lib/stripe/stripe-server';
import { supabase } from '@/lib/supabase';

async function testStripeIntegration() {
  // Replace with actual IDs from your database
  const CLIENT_ID = '...';
  const FREELANCER_ID = '...';
  const PROJECT_ID = '...';

  try {
    // 1. Test Freelancer Onboarding
    const connectResponse = await fetch('http://localhost:3000/api/stripe/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: FREELANCER_ID, userEmail: 'freelancer@example.com' }),
    });
    const { url: connectUrl } = await connectResponse.json();
    console.log('Freelancer Onboarding URL:', connectUrl);

    // 2. Test Payment Intent Creation
    const intentResponse = await fetch('http://localhost:3000/api/payments/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: PROJECT_ID, clientId: CLIENT_ID, freelancerId: FREELANCER_ID }),
    });
    const { clientSecret, paymentIntentId } = await intentResponse.json();
    console.log('Payment Intent Client Secret:', clientSecret);

    // 3. Test Payment Release
    const releaseResponse = await fetch('http://localhost:3000/api/payments/release', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentIntentId, projectId: PROJECT_ID }),
    });
    const { success, transfer } = await releaseResponse.json();
    console.log('Payment Released:', success, transfer);

  } catch (error) {
    console.error('Stripe test failed:', error);
  }
}

testStripeIntegration();
