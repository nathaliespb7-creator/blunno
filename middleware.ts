import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { LOCALE_COOKIE_KEY, localeFromAcceptLanguage, parseLocale } from '@/i18n/locale';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/og-image.png') {
    const url = request.nextUrl.clone();
    url.pathname = '/og-image';
    return NextResponse.rewrite(url);
  }

  const stored = parseLocale(request.cookies.get(LOCALE_COOKIE_KEY)?.value);
  const locale = stored ?? localeFromAcceptLanguage(request.headers.get('accept-language'));

  const response = NextResponse.next();
  if (!stored) {
    response.cookies.set(LOCALE_COOKIE_KEY, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: [
    '/og-image.png',
    '/((?!_next/static|_next/image|favicon.ico|sw\\.js|precache-manifest\\.json|manifest\\.webmanifest|\\.well-known|.*\\.(?:svg|png|jpg|jpeg|webp|mp3|wav|ogg|woff2?|ico|webmanifest)$).*)',
  ],
};
