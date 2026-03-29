'use client'

import { useState, useEffect } from 'react'
import { X, Link2, CheckCircle, Loader2, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PlatformKey } from '@/lib/platform-router'
import { PLATFORM_CONFIG } from '@/lib/platform-router'

interface Props {
  isOpen: boolean
  onClose: () => void
  platform: PlatformKey
}

export function ConnectStudioModal({ isOpen, onClose, platform }: Props) {
  const [code, setCode] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(600) // 10 min
  const config = PLATFORM_CONFIG[platform]

  const generateCode = async () => {
    setLoading(true)
    setConnected(false)
    setCode(null)
    setSecondsLeft(600)
    try {
      const res = await fetch('/api/plugin/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform }),
      })
      const data = await res.json()
      if (res.ok) setCode(data.code)
    } finally {
      setLoading(false)
    }
  }

  // Generate code on open
  useEffect(() => {
    if (isOpen) generateCode()
    else { setCode(null); setConnected(false) }
  }, [isOpen, platform])

  // Countdown timer
  useEffect(() => {
    if (!code || connected) return
    const interval = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) { clearInterval(interval); setCode(null); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [code, connected])

  // Poll for connection
  useEffect(() => {
    if (!code || connected) return
    const poll = setInterval(async () => {
      const res = await fetch(`/api/plugin/generate-code?code=${code}`)
      const data = await res.json()
      if (data.connected) {
        setConnected(true)
        clearInterval(poll)
      }
    }, 2000)
    return () => clearInterval(poll)
  }, [code, connected])

  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60
  const codeChars = code ? code.split('') : []

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.78)', zIndex: 9980, backdropFilter: 'blur(12px)' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            style={{ position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', zIndex: 9985, width: '100%', maxWidth: 480, padding: '0 16px' }}
          >
            <div className="yacht-card" style={{ padding: 36 }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(0,128,255,0.12)', border: '0.5px solid rgba(0,128,255,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Link2 size={18} color="#66B2FF" />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, fontWeight: 700, color: 'var(--t-1)' }}>
                      Connect {config.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--t-3)' }}>Enter this code in the XERON plugin</div>
                  </div>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t-3)', padding: 4 }}>
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              {connected ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '16px 0' }}>
                  <CheckCircle size={48} color="#4ADE80" style={{ margin: '0 auto 16px' }} />
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 700, color: '#4ADE80', marginBottom: 8 }}>
                    Connected!
                  </div>
                  <div style={{ color: 'var(--t-2)', fontSize: 14 }}>
                    {config.name} plugin is now linked to your account. Generated code will be automatically inserted.
                  </div>
                  <button className="btn-primary" onClick={onClose} style={{ marginTop: 24 }}>
                    Done
                  </button>
                </motion.div>
              ) : loading ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <Loader2 size={32} color="#66B2FF" style={{ margin: '0 auto', animation: 'spin 1s linear infinite' }} />
                  <div style={{ marginTop: 12, color: 'var(--t-3)', fontSize: 13 }}>Generating code...</div>
                </div>
              ) : !code || secondsLeft === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ color: 'var(--t-2)', fontSize: 14, marginBottom: 20 }}>
                    {secondsLeft === 0 ? 'Code expired.' : 'Failed to generate code.'}
                  </div>
                  <button className="btn-primary" onClick={generateCode}>
                    <RefreshCw size={15} /> Generate New Code
                  </button>
                </div>
              ) : (
                <>
                  {/* Code display */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
                    {codeChars.map((char, i) => (
                      <div
                        key={i}
                        style={{
                          width: char === '-' ? 16 : 44, height: 56,
                          borderRadius: 12,
                          background: char === '-' ? 'transparent' : 'rgba(0,128,255,0.10)',
                          border: char === '-' ? 'none' : '1.5px solid rgba(0,128,255,0.35)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: char === '-' ? 28 : 26,
                          color: char === '-' ? '#506080' : '#66B2FF',
                          letterSpacing: 0,
                        }}
                      >
                        {char}
                      </div>
                    ))}
                  </div>

                  {/* Timer */}
                  <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <span style={{ fontSize: 13, color: secondsLeft < 60 ? '#F87171' : 'var(--t-3)', fontFamily: "'Outfit',sans-serif" }}>
                      Expires in {mins}:{secs.toString().padStart(2, '0')}
                    </span>
                  </div>

                  {/* Steps */}
                  <ol style={{ padding: 0, margin: '0 0 16px', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      `Open ${config.name}`,
                      'Launch the XERON plugin',
                      'Enter the code above',
                      'Connection confirmed automatically',
                    ].map((step, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,128,255,0.12)', border: '0.5px solid rgba(0,128,255,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#66B2FF', fontWeight: 700, flexShrink: 0 }}>
                          {i + 1}
                        </span>
                        <span style={{ fontSize: 13, color: 'var(--t-2)' }}>{step}</span>
                      </li>
                    ))}
                  </ol>

                  <button className="btn-ghost" onClick={generateCode} style={{ width: '100%', justifyContent: 'center' }}>
                    <RefreshCw size={13} /> Regenerate Code
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ConnectStudioModal
