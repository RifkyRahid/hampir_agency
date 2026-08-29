import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_COOKIE = 'admin_session'

export function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE)?.value
  const { pathname } = request.nextUrl
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

export const config = {
  matcher: ['/admin/:path*'],
}
