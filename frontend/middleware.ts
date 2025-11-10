import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PATHS = []

export function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request
  const pathname = nextUrl.pathname

  const requiresAuth = PROTECTED_PATHS.some((path) => pathname.startsWith(path))

  if (!requiresAuth) {
    return NextResponse.next()
  }

  const accessToken = cookies.get('access_token_cookie')

  if (!accessToken) {
    const redirectUrl = new URL('/', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/account/:path*', '/create-account/:path*', '/smart/:path*'],
}
