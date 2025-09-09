// in src/lib/auth/session.ts
import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { type User } from '@/lib/db/schema';
import * as bcrypt from 'bcryptjs';

const secretKey = process.env.SESSION_SECRET;
const key = new TextEncoder().encode(secretKey);

export interface SessionPayload {
  userId: string;
  role: string;
  expires: Date;
}

export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS2-6' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key);
}

export async function decrypt(session: string | undefined = ''): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256']
    });
    // This now correctly returns all the properties of the payload
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function setSession(user: User) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const sessionPayload = { userId: user.id, role: user.role as string, expires };
  const session = await encrypt(sessionPayload);

  (await cookies()).set('session', session, {
    expires,
    httpOnly: true,
    path: '/'
  });
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePasswords(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}