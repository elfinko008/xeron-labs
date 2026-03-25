'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function ResetPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset`,
    })
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-modal p-10 text-center max-w-sm w-full">
          <h2 className="font-display text-2xl mb-3">E-Mail gesendet</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Prüfe dein Postfach für den Reset-Link.
          </p>
          <Link href="/login" className="glass-button px-6 py-3 rounded-xl text-sm inline-block">
            Zurück zum Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="glass-modal p-8">
          <h1 className="font-display text-2xl mb-2">Passwort zurücksetzen</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            Wir senden dir einen Reset-Link per E-Mail.
          </p>
          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.com"
              required
              className="glass-input w-full px-4 py-3 text-sm"
            />
            <button type="submit" disabled={loading} className="glass-button-primary w-full py-3 rounded-xl font-semibold text-sm">
              {loading ? 'Senden...' : 'Reset-Link senden'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/login" className="text-sm hover:text-white transition-colors" style={{ color: 'var(--text-muted)' }}>
              ← Zurück zum Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
