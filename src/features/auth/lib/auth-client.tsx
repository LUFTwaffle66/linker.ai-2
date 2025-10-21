'use client';

import React, { createContext, useContext } from 'react';
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';
import type { Session } from 'next-auth';
import type { UserRole } from '../types/auth';

export interface User {
  id: string;
  email: string;
  name: string;
  fullName: string;
  image?: string;
  avatarUrl?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  const user: User | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.fullName || '',
        fullName: session.user.fullName || '',
        image: session.user.avatarUrl || undefined,
        avatarUrl: session.user.avatarUrl || undefined,
        role: session.user.role,
      }
    : null;

  const login = async (email: string, password: string) => {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
  };

  const logout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Hook to check if user has a specific role
 */
export function useHasRole(role: UserRole): boolean {
  const { user } = useAuth();
  return user?.role === role;
}
