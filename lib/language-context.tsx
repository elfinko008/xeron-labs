'use client'

import { createContext, useContext, ReactNode } from 'react'

type Locale = 'en'

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

export function LanguageProvider({ children }: { children: ReactNode }) {
  return (
    <LanguageContext.Provider value={{ locale: 'en', setLocale: () => {}, t: (key) => key, messages: {} }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
