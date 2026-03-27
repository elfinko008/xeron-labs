import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

const LOCALES = ['en', 'de', 'fr', 'es', 'pt', 'ja', 'zh'] as const
type Locale = typeof LOCALES[number]

function isValidLocale(l: string): l is Locale {
  return LOCALES.includes(l as Locale)
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value

  let locale: Locale = 'en'
  if (cookieLocale && isValidLocale(cookieLocale)) {
    locale = cookieLocale
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
