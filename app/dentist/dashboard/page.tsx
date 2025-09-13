import { getUser } from '@/lib/db/queries';
import { DentistDashboard } from '@/components/dentist-dashboard';

export default async function DentistDashboardPage() {
  const user = await getUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Please log in to access the dentist dashboard.</p>
      </div>
    );
  }

  // Mock dentist data - replace with real data from your database
  const dentistData = {
    name: `Dr. ${user.email?.split('@')[0]}`,
    email: user.email,
    role: 'dentist',
    // Add more dentist-specific data here as needed
  };

  return <DentistDashboard dentistData={dentistData} />;
}