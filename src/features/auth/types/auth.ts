export type UserRole = 'admin' | 'client' | 'freelancer';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: UserRole;
  company_name?: string;
  avatar_url?: string;
  email_verified: boolean;
  phone?: string;
  is_active: boolean;
  is_banned: boolean;
  banned_reason?: string;
  banned_at?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  companyName?: string;
}
