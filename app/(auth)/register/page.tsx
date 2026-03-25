'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwörter stimmen nicht überein.')
      return
    }
    if (password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen lang sein.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="glass-modal p-10">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                 style={{ background: 'rgba(0,255,128,0.1)', border: '1px solid rgba(0,255,128,0.3)' }}>
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#00ff80' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-2xl mb-3">Fast geschafft!</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Wir haben eine Bestätigungs-E-Mail an <strong className="text-white">{email}</strong> gesendet.
              Bitte klicke auf den Link um deinen Account zu aktivieren.
            </p>
            <Link href="/login" className="glass-button-primary px-6 py-3 rounded-xl text-sm font-semibold inline-block">
              Zur Anmeldung
            </Link>
          </div>
        </div>
      </div>
    )
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
          <h1 className="font-display text-2xl mb-2">Account erstellen</h1>
          <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
            Starte kostenlos mit 10 Credits
          </p>
          <div className="glass-badge mb-8 inline-block">Kein Credit-Card nötig</div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                E-Mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@email.com"
                required
                className="glass-input w-full px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mindestens 8 Zeichen"
                required
                className="glass-input w-full px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                Passwort bestätigen
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                required
                className="glass-input w-full px-4 py-3 text-sm"
              />
            </div>

            {error && (
              <div className="text-sm px-4 py-3 rounded-xl" style={{ background: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', color: '#e94560' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="glass-button-primary w-full py-3 rounded-xl font-semibold text-sm mt-2"
            >
              {loading ? 'Account erstellen...' : 'Kostenlos registrieren'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Bereits registriert?{' '}
            <Link href="/login" style={{ color: 'var(--accent-red)' }} className="hover:opacity-80 transition-opacity">
              Anmelden →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
