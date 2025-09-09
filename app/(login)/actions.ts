'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { comparePasswords, setSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// Define the shape of the data for the login form
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function signIn(prevState: any, formData: FormData) {
  // 1. Get the data from the form
  const data = Object.fromEntries(formData);
  const parsed = signInSchema.safeParse(data);

  // 2. Validate the data
  if (!parsed.success) {
    return { error: 'Invalid form data. Please check your inputs.' };
  }
  const { email, password } = parsed.data;

  // 3. Find the user in the database
  const [foundUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
    
  if (!foundUser || !foundUser.passwordHash) {
    return { error: 'Invalid email or password.' };
  }

  // 4. Check if the password is correct
  const isPasswordValid = await comparePasswords(password, foundUser.passwordHash);
  if (!isPasswordValid) {
    return { error: 'Invalid email or password.' };
  }

  // 5. If everything is correct, create a session cookie
  await setSession(foundUser);

  // 6. Redirect the user to the correct dashboard based on their role
  switch (foundUser.role) {
    case 'dentist':
      return redirect('/dentist/dashboard');
    case 'assistant':
      return redirect('/assistant/dashboard');
    case 'patient':
      return redirect('/patient/home');
    default:
      return redirect('/login');
  }
}

// --- Sign-Out Logic for ENDOFLOW ---
export async function signOut() {
  // 1. Delete the session cookie
  (await cookies()).delete('session');
  // 2. Redirect the user to the main page
  redirect('/');
}