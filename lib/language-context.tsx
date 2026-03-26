'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Locale = 'en' | 'de' | 'fr' | 'es' | 'pt' | 'ja' | 'zh'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  messages: Record<string, unknown>
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
  messages: {},
})

const messagesCache: Partial<Record<Locale, Record<string, unknown>>> = {}

async function loadMessages(locale: Locale) {
  if (messagesCache[locale]) return messagesCache[locale]!
  try {
    const msgs = await import(`../messages/${locale}.json`)
    messagesCache[locale] = msgs.default
    return msgs.default as Record<string, unknown>
  } catch {
    const msgs = await import('../messages/en.json')
    messagesCache[locale] = msgs.default
    return msgs.default as Record<string, unknown>
  }
}

function getNestedValue(obj: Record<string, unknown>, key: string): string {
  const parts = key.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current && typeof current === 'object') {
      current = (current as Record<string, unknown>)[part]
    } else return key
  }
  return typeof current === 'string' ? current : key
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [messages, setMessages] = useState<Record<string, unknown>>({})

  useEffect(() => {
    const saved = (localStorage.getItem('locale') || 'en') as Locale
    setLocaleState(saved)
    loadMessages(saved).then(setMessages)
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`
    loadMessages(newLocale).then(setMessages)
  }

  const t = (key: string) => getNestedValue(messages as Record<string, unknown>, key)

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, messages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
