'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const SESSION_KEY = 'xeron_promo_hidden'
const BANNER_H = 36

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
        background: 'linear-gradient(90deg, rgba(138,95,0,0.95) 0%, rgba(212,160,23,0.95) 30%, rgba(232,188,58,0.98) 50%, rgba(212,160,23,0.95) 70%, rgba(138,95,0,0.95) 100%)',
        backgroundSize: '200% auto',
        animation: 'promoShimmer 6s linear infinite',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(232,188,58,0.3)',
      }}
    >
      <span style={{
        fontSize: 12,
        fontWeight: 600,
        color: '#0A0900',
        letterSpacing: '0.04em',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        ✦ LIMITED — 3 Months Pro for the price of 1 &nbsp;
        <a
          href="/shop"
          style={{
            color: '#0A0900',
            fontWeight: 800,
            textDecoration: 'underline',
            textUnderlineOffset: 2,
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
          color: 'rgba(10,9,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          padding: 4,
          borderRadius: 4,
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#0A0900')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(10,9,0,0.6)')}
      >
        <X size={14} />
      </button>

      <style>{`
        @keyframes promoShimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @media (max-width: 768px) {
          .promo-mobile-hide { display: none; }
        }
      `}</style>
    </div>
  )
}
