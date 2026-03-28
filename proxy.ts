import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PROTECTED_PATHS = ['/dashboard']
const AUTH_PATHS = ['/login', '/register']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // Auth guard for protected routes
  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p))
  const isAuthPath = AUTH_PATHS.some(p => pathname.startsWith(p))

  if (isProtected || isAuthPath) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (url && key) {
      try {
        const supabase = createServerClient(url, key, {
          cookies: {
            getAll: () => request.cookies.getAll(),
            setAll: (cookiesToSet: Array<{ name: string; value: string; options?: object }>) => {
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(
                  name,
                  value,
                  options as Parameters<typeof response.cookies.set>[2]
                )
              )
            },
          },
        })
        const { data: { user } } = await supabase.auth.getUser()

        if (isProtected && !user) {
          const loginUrl = new URL('/login', request.url)
          loginUrl.searchParams.set('redirect', pathname)
          return NextResponse.redirect(loginUrl)
        }

        if (isAuthPath && user) {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      } catch {
        // Supabase unavailable — allow request through
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}
