import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});

export const platformFeePercentage = parseInt(
  process.env.STRIPE_PLATFORM_FEE_PERCENTAGE || '15'
);
