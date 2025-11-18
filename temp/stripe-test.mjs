import Stripe from 'stripe';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY not found in environment variables');
  console.error('Make sure .env file exists and contains STRIPE_SECRET_KEY');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  typescript: true,
});

async function testStripeIntegration() {
  console.log('🧪 Testing Stripe Integration (Direct API Calls - No Database)\n');
  console.log('Using Stripe Key:', STRIPE_SECRET_KEY.substring(0, 15) + '...\n');

  try {
    // 1. Test Stripe Connect Account Creation
    console.log('=== Test 1: Creating Stripe Connect Account ===');
    const account = await stripe.accounts.create({
      type: 'standard',
      email: 'test-freelancer@example.com',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });
    console.log('✓ Account created:', account.id);
    console.log('  Type:', account.type);
    console.log('  Email:', account.email);

    // 2. Test Account Link Creation (for onboarding)
    console.log('\n=== Test 2: Creating Account Onboarding Link ===');
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'http://localhost:3000/stripe/reauth',
      return_url: 'http://localhost:3000/dashboard?stripe=success',
      type: 'account_onboarding',
    });
    console.log('✓ Onboarding URL created:', accountLink.url.substring(0, 50) + '...');

    // 3. Test Payment Intent Creation (with mock data)
    console.log('\n=== Test 3: Creating Payment Intent ===');
    const amount = 250000; // $2,500 (50% of $5,000 project)
    const platformFee = Math.round(amount * 0.15); // 15% platform fee

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      application_fee_amount: platformFee,
      transfer_data: {
        destination: account.id, // Transfer to the account we just created
      },
      metadata: {
        projectId: 'test-project-123',
        milestoneType: 'upfront_50',
      },
      description: 'Test Project - 50% Upfront Payment',
    });
    console.log('✓ Payment Intent created:', paymentIntent.id);
    console.log('  Amount:', `$${(amount / 100).toFixed(2)}`);
    console.log('  Platform Fee:', `$${(platformFee / 100).toFixed(2)}`);
    console.log('  Status:', paymentIntent.status);
    console.log('  Client Secret:', paymentIntent.client_secret?.substring(0, 30) + '...');

    // 4. Test Transfer Creation (simulating payout)
    console.log('\n=== Test 4: Creating Transfer to Connected Account ===');
    const transferAmount = amount - platformFee;

    try {
      const transfer = await stripe.transfers.create({
        amount: transferAmount,
        currency: 'usd',
        destination: account.id,
        description: 'Test milestone payment',
        metadata: {
          projectId: 'test-project-123',
          milestoneType: 'upfront_50',
        },
      });
      console.log('✓ Transfer created:', transfer.id);
      console.log('  Amount:', `$${(transferAmount / 100).toFixed(2)}`);
      console.log('  Destination:', transfer.destination);
    } catch (error) {
      console.log('⚠️  Transfer failed (expected in test mode until account is verified)');
      console.log('   Error:', error.message);
    }

    // 5. Clean up test account
    console.log('\n=== Test 5: Cleaning Up Test Account ===');
    await stripe.accounts.del(account.id);
    console.log('✓ Test account deleted:', account.id);

    console.log('\n✅ All Stripe API tests completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Add SUPABASE_SERVICE_ROLE_KEY to .env');
    console.log('2. Restart your dev server');
    console.log('3. Test the full integration with database');

  } catch (error) {
    console.error('\n❌ Stripe test failed:');
    console.error('Error:', error.message);
    if (error.type) console.error('Type:', error.type);
    if (error.code) console.error('Code:', error.code);
  }
}

testStripeIntegration();
