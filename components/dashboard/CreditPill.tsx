'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CreditPillProps {
  credits: number
}

export default function CreditPill({ credits }: CreditPillProps) {
  const router = useRouter()
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        className="credit-pill"
        onClick={() => router.push('/shop')}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Credits — Click for Credits & Plans"
      >
        <span className="credit-coin">🪙</span>
        <span className="credit-number">{credits.toLocaleString()}</span>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 10px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--depth-3)',
            border: '1px solid var(--glass-border-gold)',
            borderRadius: 10,
            padding: '6px 14px',
            fontSize: 12,
            color: 'var(--t-2)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 100,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            animation: 'fadeIn 0.15s ease',
          }}
        >
          Click for Credits &amp; Plans
          {/* Arrow */}
          <span
            style={{
              position: 'absolute',
              bottom: -6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid var(--glass-border-gold)',
            }}
          />
        </div>
      )}
    </div>
  )
}
