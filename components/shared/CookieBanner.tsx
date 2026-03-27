'use client'
import { useState, useEffect } from 'react'
import { X, Cookie, ChevronDown, ChevronUp } from 'lucide-react'

interface CookiePrefs { essential: true; analytics: boolean; marketing: boolean }

export function CookieBanner() {
  const [show, setShow] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [prefs, setPrefs] = useState<CookiePrefs>({ essential: true, analytics: false, marketing: false })

  useEffect(() => {
    try {
      const saved = localStorage.getItem('xeron_cookie_consent')
      if (!saved) setShow(true)
    } catch { setShow(true) }
  }, [])

  const save = async (p: CookiePrefs) => {
    try {
      localStorage.setItem('xeron_cookie_consent', JSON.stringify(p))
    } catch {}
    try {
      await fetch('/api/consent/cookie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cookie_essential: true,
          cookie_analytics: p.analytics,
          cookie_marketing: p.marketing,
        }),
      })
    } catch {}
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        zIndex: 9990, width: '100%', maxWidth: 680, padding: '0 16px',
      }}
    >
      <div className="lg-modal" style={{ padding: '28px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14, flexShrink: 0,
            background: 'rgba(212,160,23,0.12)', border: '1px solid rgba(212,160,23,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Cookie size={20} color="var(--gold-400)" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="t-headline" style={{ fontSize: 17, marginBottom: 8 }}>
              We use cookies
            </div>
            <p className="t-body" style={{ fontSize: 14, marginBottom: 16 }}>
              We use essential cookies to make XERON work, and optional cookies to improve your experience. Please choose your preference below.
            </p>

            {expanded && (
              <div style={{ marginBottom: 20 }}>
                <div className="lg-divider" style={{ marginBottom: 16 }} />
                {[
                  { key: 'essential', label: 'Essential', desc: 'Authentication, security, core functionality. Always active.', locked: true },
                  { key: 'analytics', label: 'Analytics', desc: 'Helps us understand how you use XERON to improve it.' },
                  { key: 'marketing', label: 'Marketing', desc: 'Personalized ads and content based on your interests.' },
                ].map(item => (
                  <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'var(--t-1)', fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                      <div style={{ color: 'var(--t-3)', fontSize: 13 }}>{item.desc}</div>
                    </div>
                    {item.locked ? (
                      <div style={{ padding: '4px 12px', borderRadius: 8, background: 'rgba(34,197,94,0.1)', color: '#4ADE80', fontSize: 12, fontWeight: 600 }}>Always on</div>
                    ) : (
                      <button
                        onClick={() => setPrefs(p => ({ ...p, [item.key]: !p[item.key as keyof CookiePrefs] }))}
                        style={{
                          width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                          background: prefs[item.key as keyof CookiePrefs] ? 'var(--gold-500)' : 'var(--glass-2)',
                          transition: 'background 0.3s ease',
                          position: 'relative', flexShrink: 0,
                        }}
                        aria-label={`Toggle ${item.label}`}
                        aria-checked={prefs[item.key as keyof CookiePrefs] as boolean}
                        role="switch"
                      >
                        <div style={{
                          position: 'absolute', top: 3, left: prefs[item.key as keyof CookiePrefs] ? 23 : 3,
                          width: 18, height: 18, borderRadius: '50%', background: '#fff',
                          transition: 'left 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                        }} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <button className="btn-luxury" style={{ padding: '10px 24px', fontSize: 14 }} onClick={() => save({ essential: true, analytics: true, marketing: true })}>
                Accept All
              </button>
              <button className="btn-glass" style={{ padding: '10px 20px', fontSize: 14 }} onClick={() => save(prefs)}>
                {expanded ? 'Save preferences' : 'Essential Only'}
              </button>
              <button
                onClick={() => setExpanded(e => !e)}
                style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--t-3)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
              >
                Customize {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
