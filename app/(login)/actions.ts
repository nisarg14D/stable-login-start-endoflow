'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { comparePasswords, setSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { validatedAction } from '@/lib/auth/validation';

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100)
});

export const signIn = validatedAction(signInSchema, async (data) => {
  const { email, password } = data;

  const [foundUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!foundUser || !foundUser.passwordHash) {
    return { error: 'Invalid email or password.' };
  }

  const isPasswordValid = await comparePasswords(
    password,
    foundUser.passwordHash
  );

  if (!isPasswordValid) {
    return { error: 'Invalid email or password.' };
  }

  await setSession(foundUser);

  // --- Role--Based Redirection for ENDOFLOW ---
  switch (foundUser.role) {
    case 'dentist':
      redirect('/dentist/dashboard');
      break;
    case 'assistant':
      redirect('/assistant/dashboard');
      break;
    case 'patient':
      redirect('/patient/home');
      break;
    default:
      redirect('/login');
  }
});

export async function signOut() {
  const { destroySession } = await import('@/lib/auth/session');
  await destroySession();
  redirect('/login');
}