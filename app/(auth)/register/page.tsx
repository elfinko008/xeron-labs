'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { isBlockedEmail } from '@/lib/blocked-domains'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleOAuth(provider: 'google' | 'discord') {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/confirm` },
    })
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (isBlockedEmail(email)) {
      setError('Bitte nutze eine echte E-Mail-Adresse.')
      return
    }
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

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(`/auth/verify-code?email=${encodeURIComponent(email)}`)
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
          <div className="glass-badge mb-6 inline-block">Kein Credit-Card nötig</div>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuth('google')}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-medium text-sm transition-all"
              style={{ background: '#ffffff', color: '#1a1a1a', border: 'none' }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Mit Google registrieren
            </button>

            <button
              onClick={() => handleOAuth('discord')}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-medium text-sm transition-all"
              style={{ background: '#5865F2', color: '#ffffff', border: 'none' }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/>
              </svg>
              Mit Discord registrieren
            </button>
          </div>

          {/* Trennlinie */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>oder</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>E-Mail</label>
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
              <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Passwort</label>
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
              <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Passwort bestätigen</label>
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
            <button type="submit" disabled={loading} className="glass-button-primary w-full py-3 rounded-xl font-semibold text-sm mt-2">
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
