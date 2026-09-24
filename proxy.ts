import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/adminSession';

// Optimistic gate for admin pages; every admin API route still checks the session itself.
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/admin') return NextResponse.next();

  if (!verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path+'],
};
