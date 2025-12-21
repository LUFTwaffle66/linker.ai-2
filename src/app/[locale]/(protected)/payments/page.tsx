import { getServerUser } from '@/features/auth/lib/auth-server';
import { ClientPayments, FreelancerPayments } from '@/features/payment';
import { redirect } from 'next/navigation';
import { paths } from '@/config/paths';

export default async function PaymentsPage() {
  const user = await getServerUser();

  if (!user) {
    redirect(paths.auth.login.getHref());
  }

  if (user.role === 'client') {
    return <ClientPayments />;
  }

  if (user.role === 'freelancer') {
    // PASS THE USER ID HERE
    return <FreelancerPayments userId={user.id} />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Payments</h1>
      <p>You do not have the required role to view this page.</p>
    </div>
  );
}
