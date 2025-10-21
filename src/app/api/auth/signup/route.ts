import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/features/auth/lib/auth-utils';
import type { UserRole } from '@/features/auth/types/auth';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['client', 'freelancer']),
  companyName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = signupSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password, fullName, role, companyName } = validationResult.data;

    // Check if user already exists
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create user
    const user = await createUser({
      email,
      password,
      fullName,
      role: role as UserRole,
      companyName,
    });

    // Return success response (without password hash)
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          companyName: user.company_name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create user. Please try again.' },
      { status: 500 }
    );
  }
}
