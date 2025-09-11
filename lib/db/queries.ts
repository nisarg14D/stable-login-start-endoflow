import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from './drizzle';
import { users, type User } from './schema';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth/session';

export async function getUser(): Promise<User | null> {
  const sessionCookie = (await cookies()).get('session')?.value;
  const session = await decrypt(sessionCookie);
  if (!session || typeof session !== 'object' || !('user' in session)) {
    return null;
  }

  const user = session.user as User;
  const [dbUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  return dbUser || null;
}