'use client'

import { useEffect, useState } from 'react'

export function SplashScreenWrapper() {
  return <SplashScreen />
}

function SplashScreen() {
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    try {
      const shown = sessionStorage.getItem('splash_shown')
      if (!shown) {
        setVisible(true)
        sessionStorage.setItem('splash_shown', '1')
        setTimeout(() => setFading(true), 1000)
        setTimeout(() => setVisible(false), 1500)
      }
    } catch {
      // sessionStorage not available
    }
  }, [])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#060612',
        transition: 'opacity 0.5s ease',
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? 'none' : 'all',
      }}
    >
      <div className="text-center">
        <div
          className="font-display text-5xl mb-4 glow-pulse"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          XERON
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: 14, letterSpacing: '0.2em' }}>
          ENGINE
        </div>
        <div style={{ marginTop: 24, display: 'flex', gap: 8, justifyContent: 'center' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'rgba(124,58,237,0.6)',
                animation: `glowPulse 1s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
