// in src/app/page.tsx
import { LoginForm } from '@/components/ui/login-form';

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40">
      <LoginForm />
    </div>
  );
}