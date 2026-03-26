'use client'

import { useState, useEffect } from 'react'

interface CreditDisplayProps {
  credits: number
  purchasedCredits: number
  plan: string
  creditsResetAt: string | null
}

function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress >= 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return value
}

function getTimeUntilReset(resetAt: string | null) {
  if (!resetAt) return null
  const diff = new Date(resetAt).getTime() - Date.now()
  if (diff <= 0) return null
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  return { days, hours }
}

const PLAN_COLORS: Record<string, string> = {
  free: '#94a3b8',
  starter: '#60a5fa',
  pro: '#a78bfa',
  enterprise: '#f59e0b',
}

export default function CreditDisplay({ credits, purchasedCredits, plan, creditsResetAt }: CreditDisplayProps) {
  const [showPopover, setShowPopover] = useState(false)
  const total = credits + purchasedCredits
  const animatedTotal = useCountUp(total)
  const resetTime = getTimeUntilReset(creditsResetAt)
  const planMax = { free: 10, starter: 100, pro: 500, enterprise: 1000 }[plan] || 10

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowPopover(!showPopover)}
        className="glass-card"
        style={{
          width: '100%',
          padding: 16,
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          display: 'block',
        }}
      >
        <div style={{ marginBottom: 4, fontSize: 12, color: 'var(--text-muted)' }}>Your Credits</div>
        <div
          className="font-display"
          style={{
            fontSize: 32,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.1,
          }}
        >
          {animatedTotal.toLocaleString()}
        </div>
        <div style={{ marginTop: 8 }}>
          <span className="glass-badge" style={{ fontSize: 11, color: PLAN_COLORS[plan] }}>
            {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
          </span>
        </div>
      </button>

      {showPopover && (
        <div className="glass-card" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: 8,
          padding: 16,
          zIndex: 50,
          borderRadius: 20,
        }}>
          {plan === 'free' ? (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>
              Upgrade to get more credits &amp; access to game generation
            </p>
          ) : (
            <>
              {resetTime && (
                <div style={{ marginBottom: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Credits reset in</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>
                    <span className="text-gradient-purple">{resetTime.days}d {resetTime.hours}h</span>
                  </div>
                  {/* Progress ring */}
                  <div style={{ marginTop: 8 }}>
                    <svg width="60" height="60" viewBox="0 0 60 60" style={{ display: 'block', margin: '0 auto' }}>
                      <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(124,58,237,0.2)" strokeWidth="4"/>
                      <circle cx="30" cy="30" r="25" fill="none" stroke="#7c3aed" strokeWidth="4"
                        strokeDasharray={`${2 * Math.PI * 25}`}
                        strokeDashoffset={`${2 * Math.PI * 25 * (1 - resetTime.days / 30)}`}
                        strokeLinecap="round"
                        transform="rotate(-90 30 30)"
                      />
                      <text x="30" y="34" textAnchor="middle" fill="#a78bfa" fontSize="11" fontWeight="bold">
                        {resetTime.days}d
                      </text>
                    </svg>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Sub Credits</span>
                  <span style={{ color: '#a78bfa', fontWeight: 600 }}>{credits}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Bonus Credits</span>
                  <span style={{ color: '#4ade80', fontWeight: 600 }}>{purchasedCredits}</span>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ fontWeight: 600 }}>Total</span>
                  <span style={{ fontWeight: 700 }}>{total}</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
