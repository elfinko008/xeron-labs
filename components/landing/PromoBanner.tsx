'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const SESSION_KEY = 'xeron_promo_hidden'
const BANNER_H = 32

export default function PromoBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === '1') return
    } catch { /* ignore */ }
    setVisible(true)
    // Signal navbar and layout
    document.documentElement.style.setProperty('--promo-h', `${BANNER_H}px`)
  }, [])

  const handleClose = () => {
    setVisible(false)
    try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* ignore */ }
    document.documentElement.style.setProperty('--promo-h', '0px')
  }

  if (!visible) return null

  return (
    <div
      className="promo-banner"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: BANNER_H,
        zIndex: 1001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backdropFilter: 'blur(8px)',
        borderBottom: '0.5px solid rgba(242,192,80,0.20)',
      }}
    >
      <span style={{
        fontSize: 11,
        fontFamily: "'Tenor Sans', sans-serif",
        letterSpacing: '0.15em',
        textTransform: 'uppercase' as const,
        color: 'var(--gold-pale)',
      }}>
        ✦ LIMITED — 3 Months Pro for the price of 1 —{' '}
        <a
          href="/shop"
          style={{
            color: 'var(--gold-pale)',
            fontFamily: "'Tenor Sans', sans-serif",
            textDecoration: 'underline',
            textUnderlineOffset: 2,
            letterSpacing: '0.15em',
          }}
        >
          Claim Now →
        </a>
      </span>

      <button
        onClick={handleClose}
        aria-label="Close"
        style={{
          position: 'absolute',
          right: 12,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'rgba(248,220,144,0.5)',
          display: 'flex',
          alignItems: 'center',
          padding: 4,
          borderRadius: 4,
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold-pale)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,220,144,0.5)')}
      >
        <X size={14} />
      </button>
    </div>
  )
}
