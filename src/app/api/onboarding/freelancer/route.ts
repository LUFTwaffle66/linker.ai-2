import { NextRequest, NextResponse } from 'next/server';
import { getRouteHandlerUser, createRouteHandlerClient } from '@/lib/supabase/route-handler';
import {
  createFreelancerProfile,
  updateFreelancerProfile,
  getFreelancerProfile,
} from '@/features/onboarding/lib/onboarding-utils';
import { freelancerOnboardingSchema } from '@/features/onboarding/lib/validations';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getRouteHandlerUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user is a freelancer
    if (user.role !== 'freelancer') {
      return NextResponse.json(
        { error: 'Only freelancers can create freelancer profiles' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validationResult = freelancerOnboardingSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Create authenticated Supabase client
    const supabase = await createRouteHandlerClient();

    // Check if profile already exists
    const existingProfile = await getFreelancerProfile(supabase, user.id);

    let profile;
    if (existingProfile) {
      // Update existing profile
      profile = await updateFreelancerProfile(supabase, user.id, data);
    } else {
      // Create new profile
      profile = await createFreelancerProfile(supabase, user.id, data);
    }

    return NextResponse.json(
      {
        success: true,
        profile,
      },
      { status: existingProfile ? 200 : 201 }
    );
  } catch (error) {
    console.error('Freelancer onboarding error:', error);
    return NextResponse.json(
      {
        error: 'Failed to save freelancer profile',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await getRouteHandlerUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user is a freelancer
    if (user.role !== 'freelancer') {
      return NextResponse.json(
        { error: 'Only freelancers can access freelancer profiles' },
        { status: 403 }
      );
    }

    // Create authenticated Supabase client
    const supabase = await createRouteHandlerClient();

    const profile = await getFreelancerProfile(supabase, user.id);

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Get freelancer profile error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get freelancer profile',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
