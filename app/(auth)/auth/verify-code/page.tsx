'use client'

import { useState, useRef, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const EXPIRE_SECONDS = 600 // 10 Minuten

function VerifyCodeContent() {
  const router = useRouter()
  const params = useSearchParams()
  const email = params.get('email') ?? ''

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [resent, setResent] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(EXPIRE_SECONDS)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [secondsLeft])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return
    const newDigits = [...digits]
    newDigits[index] = value
    setDigits(newDigits)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newDigits = [...digits]
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i]
    }
    setDigits(newDigits)
    const next = Math.min(pasted.length, 5)
    inputRefs.current[next]?.focus()
  }

  const handleVerify = useCallback(async () => {
    const token = digits.join('')
    if (token.length < 6) return
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })

    if (error) {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      if (newAttempts >= 3) {
        setError('Zu viele Fehlversuche. Bitte fordere einen neuen Code an.')
      } else {
        setError(`Falscher Code. Noch ${3 - newAttempts} Versuch${3 - newAttempts === 1 ? '' : 'e'}.`)
      }
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }, [digits, email, attempts, router])

  async function handleResend() {
    const supabase = createClient()
    await supabase.auth.signInWithOtp({ email })
    setSecondsLeft(EXPIRE_SECONDS)
    setAttempts(0)
    setError('')
    setDigits(['', '', '', '', '', ''])
    setResent(true)
    setTimeout(() => setResent(false), 4000)
    inputRefs.current[0]?.focus()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-2xl">
            <span className="text-gradient-red">XERON</span>
            <span className="text-white"> Engine</span>
          </Link>
        </div>

        <div className="glass-modal p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                 style={{ background: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)' }}>
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--accent-red)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h1 className="font-display text-2xl mb-2">Code bestätigen</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Wir haben einen Code an <strong className="text-white">{email}</strong> gesendet
            </p>
          </div>

          {/* 6 Digit-Inputs */}
          <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="glass-input text-center font-display text-2xl"
                style={{ width: 52, height: 60, fontSize: 24 }}
              />
            ))}
          </div>

          {/* Timer */}
          <div className="text-center text-sm mb-4" style={{ color: secondsLeft < 60 ? 'var(--accent-red)' : 'var(--text-muted)' }}>
            {secondsLeft > 0
              ? `Code läuft ab in ${formatTime(secondsLeft)}`
              : 'Code abgelaufen — bitte neuen anfordern'}
          </div>

          {error && (
            <div className="text-sm px-4 py-3 rounded-xl mb-4" style={{ background: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', color: '#e94560' }}>
              {error}
            </div>
          )}
          {resent && (
            <div className="text-sm px-4 py-3 rounded-xl mb-4" style={{ background: 'rgba(0,255,128,0.1)', border: '1px solid rgba(0,255,128,0.3)', color: '#00ff80' }}>
              Neuer Code wurde gesendet!
            </div>
          )}

          <button
            onClick={handleVerify}
            disabled={loading || digits.join('').length < 6 || attempts >= 3}
            className="glass-button-primary w-full py-3 rounded-xl font-semibold text-sm mb-4"
          >
            {loading ? 'Prüfen...' : 'Code bestätigen'}
          </button>

          <button
            onClick={handleResend}
            className="w-full text-sm transition-colors hover:text-white"
            style={{ color: 'var(--text-muted)' }}
          >
            Code nicht erhalten? Neu senden
          </button>
        </div>
      </div>
    </div>
  )
}

export default function VerifyCodePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="glass-modal p-8">Laden...</div></div>}>
      <VerifyCodeContent />
    </Suspense>
  )
}
