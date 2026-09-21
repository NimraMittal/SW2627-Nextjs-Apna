import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for NextAuth JWT session cookie
  const sessionToken =
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value;

  const { pathname } = new URL(request.url);

  if (!sessionToken) {
    const loginUrl = new URL('/auth', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Protect candidate and employer routes
  matcher: [
    '/',
    '/jobs/:path*',
    '/applications/:path*',
    '/saved-jobs/:path*',
    '/resume/:path*',
    '/notifications/:path*',
    '/profile/:path*',
    '/employer/:path*',
  ],
};