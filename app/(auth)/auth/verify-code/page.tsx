'use client'

import { useState, useRef, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { motion } from 'framer-motion'
import { LuxuryBackground } from '@/components/landing/LuxuryBackground'
import { ParticleSystem } from '@/components/landing/ParticleSystem'

const RESEND_COOLDOWN = 60

function VerifyCodeContent() {
  const router = useRouter()
  const params = useSearchParams()
  const email = params.get('email') ?? ''

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resentMsg, setResentMsg] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  function getSupabase() {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  // Resend countdown
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  // Auto-submit when all 6 filled
  useEffect(() => {
    if (digits.every(d => d !== '')) {
      handleVerify()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits])

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return
    const next = [...digits]
    next[index] = value
    setDigits(next)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits]
        next[index] = ''
        setDigits(next)
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = ['', '', '', '', '', '']
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
    setDigits(next)
    const focusIdx = Math.min(pasted.length, 5)
    inputRefs.current[focusIdx]?.focus()
  }

  const handleVerify = useCallback(async () => {
    const token = digits.join('')
    if (token.length < 6) return
    setLoading(true)
    setError('')

    const supabase = getSupabase()
    const { error: otpError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })

    if (otpError) {
      setError('Invalid or expired code. Please try again.')
      setLoading(false)
      setDigits(['', '', '', '', '', ''])
      setTimeout(() => inputRefs.current[0]?.focus(), 50)
      return
    }

    router.push('/dashboard')
    router.refresh()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits, email, router])

  async function handleResend() {
    if (resendCooldown > 0) return
    setError('')
    const supabase = getSupabase()
    await supabase.auth.signInWithOtp({ email })
    setDigits(['', '', '', '', '', ''])
    setResendCooldown(RESEND_COOLDOWN)
    setResentMsg(true)
    setTimeout(() => setResentMsg(false), 4000)
    setTimeout(() => inputRefs.current[0]?.focus(), 50)
  }

  const allFilled = digits.every(d => d !== '')

  return (
    <>
      <LuxuryBackground />
      <ParticleSystem count={20} />

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative',
        zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ width: '100%', maxWidth: 440 }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 48,
                fontWeight: 700,
                background: 'linear-gradient(135deg, var(--gold-600), var(--gold-400), var(--plat-300), var(--gold-400))',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'goldShimmer 4s linear infinite',
                display: 'block',
              }}>
                XERON
              </span>
            </Link>
          </div>

          {/* Modal card */}
          <div className="lg-modal" style={{ padding: '40px 36px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              {/* Email icon */}
              <div style={{
                width: 56, height: 56, borderRadius: 18,
                background: 'rgba(212,160,23,0.10)',
                border: '1px solid rgba(212,160,23,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 18px',
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--gold-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <h1 className="t-headline" style={{ fontSize: 22, marginBottom: 8 }}>Check your email</h1>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--t-3)', lineHeight: 1.6 }}>
                We sent a 6-digit code to{' '}
                {email && <strong style={{ color: 'var(--t-2)' }}>{email}</strong>}
              </p>
            </div>

            {/* 6-digit input */}
            <div
              style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}
              onPaste={handlePaste}
            >
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  style={{
                    width: 52,
                    height: 60,
                    textAlign: 'center',
                    fontSize: 26,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 700,
                    color: 'var(--t-1)',
                    background: d ? 'rgba(212,160,23,0.06)' : 'rgba(255,255,255,0.03)',
                    border: `1.5px solid ${d ? 'rgba(212,160,23,0.40)' : 'var(--glass-border)'}`,
                    borderRadius: 14,
                    outline: 'none',
                    transition: 'border-color 0.2s, background 0.2s',
                    caretColor: 'var(--gold-400)',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = 'rgba(212,160,23,0.55)'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,160,23,0.10)'
                  }}
                  onBlur={e => {
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.borderColor = d ? 'rgba(212,160,23,0.40)' : 'var(--glass-border)'
                  }}
                />
              ))}
            </div>

            {/* Feedback messages */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 16 }}>
                <span className="lg-badge-red" style={{ display: 'flex', width: '100%', borderRadius: 12, padding: '10px 16px', fontSize: 13, letterSpacing: 0 }}>
                  {error}
                </span>
              </motion.div>
            )}
            {resentMsg && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 16 }}>
                <span className="lg-badge-green" style={{ display: 'flex', width: '100%', borderRadius: 12, padding: '10px 16px', fontSize: 13, letterSpacing: 0 }}>
                  New code sent — check your inbox.
                </span>
              </motion.div>
            )}

            {/* Verify button */}
            <button
              className="btn-luxury"
              onClick={handleVerify}
              disabled={loading || !allFilled}
              style={{
                width: '100%',
                opacity: (loading || !allFilled) ? 0.5 : 1,
                cursor: (loading || !allFilled) ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
                marginBottom: 16,
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Verifying…
                </span>
              ) : 'Verify Code'}
            </button>

            {/* Resend */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0}
                style={{
                  background: 'none', border: 'none', cursor: resendCooldown > 0 ? 'default' : 'pointer',
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                  color: resendCooldown > 0 ? 'var(--t-4)' : 'var(--gold-400)',
                  transition: 'color 0.2s',
                }}
              >
                {resendCooldown > 0
                  ? `Resend code in ${resendCooldown}s`
                  : "Didn't receive a code? Resend"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}

export default function VerifyCodePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="lg-modal" style={{ padding: 40 }}>
          <span style={{ color: 'var(--t-3)', fontFamily: "'DM Sans', sans-serif" }}>Loading…</span>
        </div>
      </div>
    }>
      <VerifyCodeContent />
    </Suspense>
  )
}
