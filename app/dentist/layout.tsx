import { getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';

export default async function DentistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  // Redirect if not logged in
  if (!user) {
    redirect('/sign-in');
  }

  // Redirect if not a dentist
  if (user.role !== 'dentist') {
    redirect('/sign-in');
  }

  return <>{children}</>;
}