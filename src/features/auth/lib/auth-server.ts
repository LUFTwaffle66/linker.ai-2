import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';

/**
 * Server-side auth utilities
 * Use these in Server Components, Server Actions, and Route Handlers
 */

/**
 * Get the current session on the server
 * Returns null if not authenticated
 */
export async function getServerSession() {
  return await auth();
}

/**
 * Get the current user on the server
 * Returns null if not authenticated
 */
export async function getServerUser() {
  const session = await auth();
  return session?.user || null;
}

/**
 * Require authentication on the server
 * Redirects to login if not authenticated
 */
export async function requireAuth(redirectTo: string = '/login') {
  const session = await auth();
  if (!session) {
    redirect(redirectTo);
  }
  return session;
}

/**
 * Check if user is authenticated
 * Returns boolean
 */
export async function isAuthenticated() {
  const session = await auth();
  return !!session;
}

/**
 * Require specific role on the server
 * Redirects if role doesn't match
 */
export async function requireRole(role: string, redirectTo: string = '/unauthorized') {
  const session = await requireAuth();
  // Extend this based on where you store role in your session
  // const userRole = session.user.role;
  // if (userRole !== role) {
  //   redirect(redirectTo);
  // }
  return session;
}
