import "@/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Toaster } from '@/components/ui/sonner';

import { TRPCReactProvider } from "@/trpc/react";
import { AppProvider } from "./provider";
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
	title: "Linkerai",
	description: "Scalable Next.js application",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
	children,
	params
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;

	// Ensure that the incoming `locale` is valid
	if (!routing.locales.includes(locale as any)) {
		notFound();
	}

	// Providing all messages to the client
	const messages = await getMessages();

	return (
		<html lang={locale} className={`${geist.variable}`} suppressHydrationWarning>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<NextIntlClientProvider messages={messages}>
						<TRPCReactProvider>
							<AppProvider>
								{children}
								<Toaster />
							</AppProvider>
						</TRPCReactProvider>
					</NextIntlClientProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
