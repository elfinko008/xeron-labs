import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

const LOCALES = ['en', 'de', 'fr', 'es', 'pt', 'ja', 'zh'] as const
type Locale = typeof LOCALES[number]

function isValidLocale(l: string): l is Locale {
  return LOCALES.includes(l as Locale)
}

// Locales that have a complete messages file
const AVAILABLE_MESSAGES: Partial<Record<Locale, boolean>> = {
  en: true,
  de: true,
  fr: true,
  es: true,
  pt: true,
  ja: true,
  zh: true,
}

async function loadMessages(locale: Locale) {
  try {
    if (AVAILABLE_MESSAGES[locale]) {
      return (await import(`../messages/${locale}.json`)).default
    }
  } catch {
    // fall through to English fallback
  }
  return (await import('../messages/en.json')).default
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
    messages: await loadMessages(locale),
  }
})
