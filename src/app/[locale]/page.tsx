import { redirect } from 'next/navigation';
import { Navigation } from '@/components/layouts/navbar';
import { Footer } from '@/components/layouts/footer';
import { MarketingLandingPage } from '@/components/marketing/landing-page';
import { getServerUser } from '@/features/auth/lib/supabase-auth-server';

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const user = await getServerUser();

  if (user) {
    redirect(`/${resolvedParams.locale}/dashboard`);
  }

  return (
    <>
      <Navigation />
      <main>
        <MarketingLandingPage />
      </main>
      <Footer />
    </>
  );
}
