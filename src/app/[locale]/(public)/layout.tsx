import { Navigation } from '@/components/layouts/navbar';
import { Footer } from '@/components/layouts/footer';

export default function PublicLayout({
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
