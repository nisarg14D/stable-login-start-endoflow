import { getUser } from '@/lib/db/queries';
import { AssistantDashboard } from '@/components/assistant-dashboard';

export default async function AssistantDashboardPage() {
  const user = await getUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Please log in to access the assistant dashboard.</p>
      </div>
    );
  }

  // Mock assistant data - replace with real data from your database
  const assistantData = {
    name: `Assistant ${user.email?.split('@')[0]}`,
    email: user.email,
    role: 'assistant',
    // Add more assistant-specific data here as needed
  };

  return <AssistantDashboard assistantData={assistantData} />;
}