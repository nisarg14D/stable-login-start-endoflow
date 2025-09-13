'use client';

import { useState, useTransition } from 'react';
import { signIn } from './actions';
import { LoginForm } from '@/components/ui/login-form';

export function Login() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const handleLogin = async (email: string, password: string) => {
    startTransition(async () => {
      setError(undefined);
      try {
        // Create FormData to work with our server action
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        
        // Call our server action
        const result = await signIn(formData);
        
        if (result?.error) {
          setError(result.error);
        }
        // If no error, the redirect in the server action will handle navigation
      } catch (err) {
        console.error('Login error:', err);
        setError('An unexpected error occurred. Please try again.');
      }
    });
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    console.log('Forgot password clicked');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm
          onLogin={handleLogin}
          isLoading={isPending}
          error={error}
          onForgotPassword={handleForgotPassword}
        />
      </div>
    </div>
  );
}