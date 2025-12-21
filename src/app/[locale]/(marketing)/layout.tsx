import { Footer } from '@/components/layouts/footer';
import { Navigation } from '@/components/layouts/navbar';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </>
  );
}
