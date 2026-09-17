import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for NextAuth session token cookie (e.g., next-auth.session-token or __Secure-next-auth.session-token)
  const sessionToken =
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value;

  const { pathname } = request.url ? new URL(request.url) : { pathname: '' };

  // Task 3: If unauthenticated and trying to access a protected route, redirect to /login
  if (!sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Task 4: Authenticated requests proceed without interruption
  return NextResponse.next();
}

// Task 1 & 2: Matcher scopes middleware to protected routes only (excluding public routes like /, /login, api, static assets)
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/jwt-profile/:path*'],
};