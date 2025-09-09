// in src/components/ui/login-form.tsx
'use client';

// CHANGE 1: We now import 'useActionState' directly from React
import { useActionState } from 'react'; 
import { useFormStatus } from 'react-dom';
import { signIn } from '@/app/(login)/actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginForm() {
  // CHANGE 2: We call the hook with its new, official name 'useActionState'
  const [state, formAction] = useActionState(signIn, undefined);

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login to ENDOFLOW</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email" // 'name' is required for server actions
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" name="password" required />
          </div>
          {/* This will display any error messages from the server */}
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}

// A helper component to show a "loading" state on the button during login
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Signing In...' : 'Sign In'}
    </Button>
  );
}