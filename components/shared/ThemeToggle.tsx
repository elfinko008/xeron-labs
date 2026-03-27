'use client'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    try {
      const t = localStorage.getItem('xeron-theme')
      setDark(t !== 'light')
    } catch {}
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    try { localStorage.setItem('xeron-theme', next ? 'dark' : 'light') } catch {}
    document.documentElement.setAttribute('data-theme', next ? '' : 'light')
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      style={{
        width: 38, height: 38, borderRadius: 12, background: 'var(--glass-2)',
        border: '1px solid var(--glass-border)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--t-2)', transition: 'all 0.3s ease',
      }}
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
