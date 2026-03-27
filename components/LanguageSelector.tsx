'use client'
import { useState, useRef, useEffect } from 'react'
import { Globe } from 'lucide-react'

const LANGUAGES = [
  { code: 'en', label: 'English',    flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch',    flag: '🇩🇪' },
  { code: 'fr', label: 'Français',   flag: '🇫🇷' },
  { code: 'es', label: 'Español',    flag: '🇪🇸' },
  { code: 'pt', label: 'Português',  flag: '🇵🇹' },
  { code: 'ja', label: '日本語',      flag: '🇯🇵' },
  { code: 'zh', label: '中文',        flag: '🇨🇳' },
] as const

type Locale = typeof LANGUAGES[number]['code']

export default function LanguageSelector({ currentLocale = 'en' }: { currentLocale?: string }) {
  const [open, setOpen] = useState(false)
  const [activeLocale, setActiveLocale] = useState(currentLocale)
  const ref = useRef<HTMLDivElement>(null)

  const current = LANGUAGES.find(l => l.code === activeLocale) || LANGUAGES[0]

  useEffect(() => {
    // Read from cookie on mount
    try {
      const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/)
      if (match) setActiveLocale(match[1])
    } catch {}
  }, [])

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const switchLocale = (code: Locale) => {
    setOpen(false)
    setActiveLocale(code)
    // Save to cookie and localStorage only — no URL changes
    try { document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000` } catch {}
    try { localStorage.setItem('xeron-lang', code) } catch {}
    // Reload to apply new locale via cookie
    window.location.reload()
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Select language"
        style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px',
          background: 'var(--glass-2)', border: '1px solid var(--glass-border)',
          borderRadius: 12, cursor: 'pointer', color: 'var(--t-2)', fontSize: 13, fontFamily: "'DM Sans',sans-serif",
          transition: 'all 0.3s ease',
        }}
      >
        <Globe size={14} />
        <span>{current.flag}</span>
        <span style={{ fontWeight: 600 }}>{current.code.toUpperCase()}</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 200,
          background: 'rgba(7,7,26,0.96)', backdropFilter: 'blur(40px)',
          border: '1px solid var(--glass-border-gold)', borderRadius: 16, padding: 8, minWidth: 160,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => switchLocale(lang.code)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '9px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: activeLocale === lang.code ? 'rgba(212,160,23,0.12)' : 'transparent',
                color: activeLocale === lang.code ? 'var(--gold-400)' : 'var(--t-2)',
                fontSize: 13, fontFamily: "'DM Sans',sans-serif", textAlign: 'left',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => { if (activeLocale !== lang.code) (e.currentTarget as HTMLElement).style.background = 'var(--glass-2)' }}
              onMouseLeave={e => { if (activeLocale !== lang.code) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <span style={{ fontSize: 16 }}>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
