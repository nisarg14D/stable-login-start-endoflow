import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { type User } from '@/lib/db/schema';
import * as bcrypt from 'bcryptjs';

const secretKey = process.env.SESSION_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: { user: User; expires: Date }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // Session expires in 1 day
    .sign(key);
}

export async function decrypt(session: string | undefined = '') {
  if (!session) {
    return null;
  }
  
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256']
    });
    return payload;
  } catch (error) {
    // Only log error if it's not a simple "no session" case
    if (session.length > 0) {
      console.log('Failed to verify session:', error);
    }
    return null;
  }
}

export async function setSession(user: User) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
  const session = await encrypt({ user, expires });
  
  (await cookies()).set('session', session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
}

export async function getSession() {
  const sessionCookie = (await cookies()).get('session')?.value;
  if (!sessionCookie) return null;
  
  const payload = await decrypt(sessionCookie);
  if (!payload || typeof payload !== 'object' || !('user' in payload)) {
    return null;
  }
  
  return payload.user as User;
}

export async function destroySession() {
  (await cookies()).delete('session');
}

export async function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}