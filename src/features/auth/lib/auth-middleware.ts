import { auth } from '@/server/auth';
import type { UserRole } from '../types/auth';

/**
 * Get current user from session
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user || null;
}

/**
 * Check if current user is authenticated
 */
export async function requireAuth(): Promise<boolean> {
  const session = await auth();
  return !!session?.user;
}

/**
 * Check if the current user has a specific role
 */
export async function requireRole(role: UserRole | UserRole[]): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;

  const allowedRoles = Array.isArray(role) ? role : [role];
  return allowedRoles.includes(session.user.role);
}

/**
 * Throw error if user is not authenticated
 */
export async function enforceAuth() {
  if (!(await requireAuth())) {
    throw new Error('Unauthorized: Authentication required');
  }
}

/**
 * Throw error if user doesn't have required role
 */
export async function enforceRole(role: UserRole | UserRole[]) {
  if (!(await requireRole(role))) {
    const roles = Array.isArray(role) ? role.join(', ') : role;
    throw new Error(`Unauthorized: Required role(s): ${roles}`);
  }
}
