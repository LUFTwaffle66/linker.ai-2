import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/auth';
import {
  createClientProfile,
  updateClientProfile,
  getClientProfile,
} from '@/features/onboarding/lib/onboarding-utils';
import { clientOnboardingSchema } from '@/features/onboarding/lib/validations';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user is a client
    if (session.user.role !== 'client') {
      return NextResponse.json(
        { error: 'Only clients can create client profiles' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validationResult = clientOnboardingSchema.safeParse(body);
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

    // Check if profile already exists
    const existingProfile = await getClientProfile(session.user.id);

    let profile;
    if (existingProfile) {
      // Update existing profile
      profile = await updateClientProfile(session.user.id, data);
    } else {
      // Create new profile
      profile = await createClientProfile(session.user.id, data);
    }

    return NextResponse.json(
      {
        success: true,
        profile,
      },
      { status: existingProfile ? 200 : 201 }
    );
  } catch (error) {
    console.error('Client onboarding error:', error);
    return NextResponse.json(
      {
        error: 'Failed to save client profile',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user is a client
    if (session.user.role !== 'client') {
      return NextResponse.json(
        { error: 'Only clients can access client profiles' },
        { status: 403 }
      );
    }

    const profile = await getClientProfile(session.user.id);

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Get client profile error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get client profile',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
