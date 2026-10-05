import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale, isValidLocale } from '@/lib/i18n/config'

const SESSION_COOKIE = 'admin_session'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Admin route protection
  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get(SESSION_COOKIE)?.value
    const isLoginRoute = pathname === '/admin/login'

    // Not authenticated → force to login
    if (!session && !isLoginRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // Already authenticated → skip login page
    if (session && isLoginRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  }

  // 2. Ignore static assets & special files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/uploads') ||
    pathname.startsWith('/seed') ||
    pathname.includes('.') // file with extension (favicon.ico, robots.txt, etc.)
  ) {
    return NextResponse.next()
  }

  // 3. Check if pathname already starts with a supported locale
  const pathnameLocale = pathname.split('/')[1]
  if (isValidLocale(pathnameLocale)) {
    const response = NextResponse.next()
    response.cookies.set('NEXT_LOCALE', pathnameLocale, { path: '/', maxAge: 60 * 60 * 24 * 365 })
    return response
  }

  // 4. Redirect to preferred or default locale
  const savedLocale = request.cookies.get('NEXT_LOCALE')?.value
  const targetLocale = savedLocale && isValidLocale(savedLocale) ? savedLocale : defaultLocale
  const url = request.nextUrl.clone()
  url.pathname = `/${targetLocale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

