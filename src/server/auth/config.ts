import type { DefaultSession, NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyCredentials } from "@/features/auth/lib/auth-utils";
import type { UserRole } from "@/features/auth/types/auth";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			role: UserRole;
			fullName: string;
			avatarUrl?: string;
		} & DefaultSession["user"];
	}

	interface User {
		role: UserRole;
		fullName: string;
		avatarUrl?: string;
	}
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const user = await verifyCredentials(
					credentials.email as string,
					credentials.password as string
				);

				if (!user) {
					return null;
				}

				return {
					id: user.id,
					email: user.email,
					role: user.role,
					fullName: user.full_name,
					avatarUrl: user.avatar_url,
					name: user.full_name,
					image: user.avatar_url,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
				token.email = user.email;
				token.fullName = user.fullName;
				token.avatarUrl = user.avatarUrl;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user = {
					...session.user,
					id: token.id as string,
					role: token.role as UserRole,
					email: token.email as string,
					fullName: token.fullName as string,
					avatarUrl: token.avatarUrl as string | undefined,
				};
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
		error: "/login",
	},
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
} satisfies NextAuthConfig;
