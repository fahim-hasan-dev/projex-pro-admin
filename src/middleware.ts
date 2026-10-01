import { baseURL } from '@/utils/BaseURL';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'cat-admin-token';
const PUBLIC_ASSET_REGEX = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/v1')) {
    const requestHeaders = new Headers(request.headers);
    if (token && !requestHeaders.has('Authorization')) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }

    const targetUrl = `${baseURL}${pathname}${request.nextUrl.search}`;
    return NextResponse.rewrite(targetUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  const isAuthRoute =
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/auth/forgot-password') ||
    pathname.startsWith('/auth/verify-email') ||
    pathname.startsWith('/auth/reset-password') ||
    pathname === '/auth' ||
    pathname.startsWith('/auth/');

  const isPublicAsset =
    PUBLIC_ASSET_REGEX.test(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/logo/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/font/');

  const isUnauthorizedPage = pathname.startsWith('/unauthorized');

  const isInternalApi =
    pathname.startsWith('/api/auth/logout') ||
    pathname.startsWith('/api/auth');

  if (isPublicAsset || isInternalApi) {
    return NextResponse.next();
  }

  if (!token && !isAuthRoute && !isUnauthorizedPage) {
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isAuthRoute) {
    const dashboardUrl = new URL('/', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
