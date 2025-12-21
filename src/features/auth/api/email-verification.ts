import { supabase } from '@/lib/supabase';

export interface ResendVerificationEmailParams {
  email: string;
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(params: ResendVerificationEmailParams) {
  const { email } = params;

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true, message: 'Verification email sent successfully' };
}

/**
 * Check if user's email is verified
 */
export async function checkEmailVerified() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('User not found');
  }

  return {
    isVerified: !!user.email_confirmed_at,
    email: user.email,
    user,
  };
}

/**
 * Check if user has completed onboarding
 */
export async function checkOnboardingStatus(userId: string) {
  // Check if user has a profile in either client_profiles or freelancer_profiles
  const { data: clientProfileData, error: clientProfileError } = await supabase
    .from('client_profiles')
    .select('user_id')
    .eq('user_id', userId);

  if (clientProfileError) {
    throw new Error(clientProfileError.message);
  }

  const clientProfile = clientProfileData?.[0] ?? null;

  const { data: freelancerProfileData, error: freelancerProfileError } = await supabase
    .from('freelancer_profiles')
    .select('user_id')
    .eq('user_id', userId);

  if (freelancerProfileError) {
    throw new Error(freelancerProfileError.message);
  }

  const freelancerProfile = freelancerProfileData?.[0] ?? null;

  const hasProfile = !!(clientProfile || freelancerProfile);

  return {
    hasCompletedOnboarding: hasProfile,
    profileType: clientProfile ? 'client' : freelancerProfile ? 'freelancer' : null,
  };
}
