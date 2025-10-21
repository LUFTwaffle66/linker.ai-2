import { AuthGuard } from "@/components/auth/auth-guard";
import { Navigation } from "@/components/layouts/navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Navigation />
      {children}
    </AuthGuard>
  );
}
