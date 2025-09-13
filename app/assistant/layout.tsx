import { getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';

export default async function AssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  // Redirect if not logged in
  if (!user) {
    redirect('/sign-in');
  }

  // Redirect if not an assistant
  if (user.role !== 'assistant') {
    redirect('/sign-in');
  }

  return <>{children}</>;
}