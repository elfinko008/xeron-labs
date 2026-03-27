import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const LOCALES = ['en', 'de', 'fr', 'es', 'pt', 'ja', 'zh']
const DEFAULT_LOCALE = 'en'

// Browser language → supported locale mapping
function detectLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return DEFAULT_LOCALE
  const langs = acceptLanguage.split(',').map(l => l.split(';')[0].trim().toLowerCase().slice(0, 2))
  for (const lang of langs) {
    if (LOCALES.includes(lang)) return lang
  }
  return DEFAULT_LOCALE
}

const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localeDetection: true,
  localePrefix: 'as-needed',
})

const PROTECTED_PATHS = ['/dashboard']
const AUTH_PATHS = ['/login', '/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // Auto-detect browser language on first visit
  const hasLocaleCookie = request.cookies.has('NEXT_LOCALE')
  if (!hasLocaleCookie) {
    const detected = detectLocale(request.headers.get('accept-language'))
    if (detected !== DEFAULT_LOCALE) {
      // Set cookie so i18n/request.ts picks it up
      response.cookies.set('NEXT_LOCALE', detected, { path: '/', maxAge: 31536000 })
    }
  }

  // Auth guard for protected routes
  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p))
  const isAuthPath = AUTH_PATHS.some(p => pathname.startsWith(p))

  if (isProtected || isAuthPath) {
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll: () => request.cookies.getAll(),
            setAll: (cookiesToSet: Array<{ name: string; value: string; options?: object }>) => {
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
              )
            },
          },
        }
      )
      const { data: { user } } = await supabase.auth.getUser()

      if (isProtected && !user) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }

      if (isAuthPath && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch {}
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}
