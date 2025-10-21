import { auth } from '@/server/auth';
import { ClientPayments, FreelancerPayments } from '@/features/payment';
import { redirect } from 'next/navigation';
import { paths } from '@/config/paths';

export default async function PaymentsPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect(paths.auth.login.getHref());
  }

  if (user.role === 'client') {
    return <ClientPayments />;
  }

  if (user.role === 'freelancer') {
    return <FreelancerPayments />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Payments</h1>
      <p>You do not have the required role to view this page.</p>
    </div>
  );
}
