'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { users, patients } from '@/lib/db/schema';
import { comparePasswords, setSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { validatedAction } from '@/lib/auth/validation';
import { randomUUID } from 'crypto';

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
      redirect('/patient');
      break;
    default:
      redirect('/sign-in');
  }
});

export async function signOut() {
  const { destroySession } = await import('@/lib/auth/session');
  await destroySession();
  redirect('/sign-in');
}

// Registration schema
const registrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Please enter a valid email').max(255),
  phone: z.string().min(1, 'Phone number is required').max(20),
  agreeToPrivacy: z.boolean().refine((val) => val === true, 'You must agree to the privacy policy')
});

export async function registerPatient(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  agreeToPrivacy: boolean;
}) {
  'use server';
  
  try {
    // Validate the data
    const validatedData = registrationSchema.parse(data);

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (existingUser) {
      return { error: 'A user with this email already exists.' };
    }

    // Generate a temporary password (in real app, you'd send this via email)
    const tempPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await import('@/lib/auth/session').then(m => m.hashPassword(tempPassword));

    // Create user record
    const [newUser] = await db
      .insert(users)
      .values({
        id: randomUUID(),
        email: validatedData.email,
        passwordHash,
        role: 'patient'
      })
      .returning();

    // Create patient profile
    await db
      .insert(patients)
      .values({
        id: newUser.id,
        uhid: `ENDO-${Date.now().toString().slice(-6)}`, // Generate simple UHID
        firstName: validatedData.firstName,
        lastName: validatedData.lastName
      });

    // In a real application, you would send an email with login credentials
    console.log(`Registration successful for ${validatedData.email}. Temporary password: ${tempPassword}`);

    return { success: true, tempPassword };
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof z.ZodError) {
      return { error: error.errors[0]?.message || 'Validation failed' };
    }
    return { error: 'Registration failed. Please try again.' };
  }
}