import { supabase } from '@/lib/supabase';
import type { User, UserRole, SignupData } from '../types/auth';
import bcrypt from 'bcryptjs';

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compare a plain text password with a hashed password
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) {
    return null;
  }

  return data as User;
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as User;
}

/**
 * Create a new user
 */
export async function createUser(userData: SignupData): Promise<User> {
  const passwordHash = await hashPassword(userData.password);

  const { data, error } = await supabase
    .from('users')
    .insert({
      email: userData.email,
      password_hash: passwordHash,
      full_name: userData.fullName,
      role: userData.role,
      company_name: userData.companyName,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as User;
}

/**
 * Update user's last login timestamp
 */
export async function updateLastLogin(userId: string): Promise<void> {
  await supabase
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', userId);
}

/**
 * Check if user has a specific role
 */
export async function hasRole(userId: string, role: UserRole): Promise<boolean> {
  const user = await getUserById(userId);
  return user?.role === role;
}

/**
 * Verify user credentials
 */
export async function verifyCredentials(
  email: string,
  password: string
): Promise<User | null> {
  const user = await getUserByEmail(email);

  if (!user) {
    return null;
  }

  // Check if user is active
  if (!user.is_active || user.is_banned) {
    return null;
  }

  // Verify password
  const isValid = await comparePassword(password, user.password_hash);

  if (!isValid) {
    return null;
  }

  // Update last login
  await updateLastLogin(user.id);

  return user;
}
