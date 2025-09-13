// in middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth/session';
import { cookies } from 'next/headers';

// 1. Specify protected and public routes
const protectedRoutes = ['/dentist', '/assistant', '/patient'];
const publicRoutes = ['/sign-in', '/register'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((prefix) => path.startsWith(prefix));

  // 2. Decrypt the session from the cookie
  const cookie = (await cookies()).get('session')?.value; // This line is now CORRECTED with await
  const session = await decrypt(cookie);

  // 3. Redirect logic
  if (isProtectedRoute && !session?.user) {
    // Redirect to login if trying to access a protected route without a session
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
}

// We add this to prevent the "Invalid page configuration" warning
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};