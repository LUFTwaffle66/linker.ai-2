import { redirect } from 'next/navigation';
import { Navigation } from '@/components/layouts/navbar';
import { Footer } from '@/components/layouts/footer';
import { MarketingLandingPage } from '@/components/marketing/landing-page';
import { getServerUser } from '@/features/auth/lib/supabase-auth-server';

export default async function LocaleHome({
  params,
}: {
  params: { locale: string };
}) {
  const user = await getServerUser();

  if (user) {
    redirect(`/${params.locale}/dashboard`);
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
