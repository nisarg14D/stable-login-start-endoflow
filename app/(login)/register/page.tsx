'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RegistrationForm } from '@/components/ui/registration-form';
import { registerPatient } from '../actions';

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  agreeToPrivacy: boolean;
}

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegistration = async (data: RegistrationData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await registerPatient(data);
      
      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        // Registration successful - in a real app, you'd send login credentials via email
        console.log('Registration successful! Temporary password:', result.tempPassword);
        
        // For now, redirect back to login after a delay
        setTimeout(() => {
          router.push('/sign-in');
        }, 3000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <RegistrationForm
          onSubmit={handleRegistration}
          isLoading={isLoading}
          error={error || undefined}
        />
      </div>
    </div>
  );
}