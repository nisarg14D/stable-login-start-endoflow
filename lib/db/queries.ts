// in src/lib/db/queries.ts
import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from './drizzle';
import { users, type User } from './schema';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth/session';

export async function getUser(): Promise<User | null> {
  const cookie = (await cookies()).get('session')?.value;
  const session = await decrypt(cookie);
  
  // CORRECTED: Safely check if session and session.user exist
  if (!session?.user) {
    return null;
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id)) // Now this is safe
    .limit(1);

  return user || null;
}