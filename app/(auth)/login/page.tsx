'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('E-Mail oder Passwort falsch.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-2xl">
            <span className="text-gradient-red">XERON</span>
            <span className="text-white"> Engine</span>
          </Link>
        </div>

        <div className="glass-modal p-8">
          <h1 className="font-display text-2xl mb-2">Willkommen zurück</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            Melde dich in deinem Account an
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
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
              {loading ? 'Anmelden...' : 'Anmelden'}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm" style={{ color: 'var(--text-muted)' }}>
            <Link href="/auth/reset" className="hover:text-white transition-colors">
              Passwort vergessen?
            </Link>
            <Link href="/register" className="hover:text-white transition-colors" style={{ color: 'var(--accent-red)' }}>
              Registrieren →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
