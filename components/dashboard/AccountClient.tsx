'use client'

import { useState } from 'react'
import { createClient, type Profile, type CreditTransaction } from '@/lib/supabase'

const PLAN_LABELS: Record<string, { label: string; credits: number; price: string }> = {
  free:       { label: 'Free',       credits: 10,    price: '0 €/Mo' },
  starter:    { label: 'Starter',    credits: 100,   price: '4,99 €/Mo' },
  pro:        { label: 'Pro',        credits: 500,   price: '14,99 €/Mo' },
  enterprise: { label: 'Enterprise', credits: 1000,  price: '39,99 €/Mo' },
}

const CREDIT_PACKAGES = [
  { credits: 50,   price: '1,99 €',  label: 'Mini' },
  { credits: 150,  price: '4,99 €',  label: 'Starter' },
  { credits: 400,  price: '11,99 €', label: 'Value' },
  { credits: 1000, price: '24,99 €', label: 'Power' },
  { credits: 3000, price: '64,99 €', label: 'Mega' },
]

const TYPE_LABELS: Record<string, string> = {
  purchase:      'Kauf',
  usage:         'Verbrauch',
  monthly_reset: 'Monatl. Reset',
  bonus:         'Bonus',
}

export default function AccountClient({
  profile,
  transactions,
}: {
  profile: Profile
  transactions: CreditTransaction[]
}) {
  const [pwCurrent, setPwCurrent] = useState('')
  const [pwNew, setPwNew] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  const planInfo = PLAN_LABELS[profile.plan]

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    if (pwNew.length < 8) {
      setPwMsg('Neues Passwort muss mindestens 8 Zeichen haben.')
      return
    }
    setPwLoading(true)
    setPwMsg('')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: pwNew })
    setPwMsg(error ? 'Fehler beim Ändern.' : 'Passwort erfolgreich geändert!')
    setPwLoading(false)
    setPwCurrent('')
    setPwNew('')
  }

  return (
    <div className="space-y-6">
      {/* Plan */}
      <div className="glass-card p-6">
        <h2 className="font-display text-xl mb-4">Aktueller Plan</h2>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-display text-2xl">{planInfo.label}</span>
              {profile.plan === 'pro' && <span className="glass-badge-red">Beliebt</span>}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {planInfo.credits} Credits/Monat · {planInfo.price}
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-3xl" style={{ color: 'var(--accent-red)' }}>
              {profile.credits}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Abo-Credits</div>
            {(profile.purchased_credits ?? 0) > 0 && (
              <div className="mt-1">
                <span className="font-display text-lg" style={{ color: '#00d4ff' }}>{profile.purchased_credits}</span>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Gekaufte Credits</div>
              </div>
            )}
          </div>
        </div>
        {profile.plan !== 'enterprise' && (
          <button className="glass-button px-5 py-2.5 rounded-xl text-sm font-medium">
            Plan upgraden
          </button>
        )}
      </div>

      {/* Credit-Pakete */}
      <div className="glass-card p-6">
        <h2 className="font-display text-xl mb-4">Credits kaufen</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CREDIT_PACKAGES.map((pkg) => (
            <button
              key={pkg.credits}
              className="glass-card p-4 text-center hover:border-red-500 transition-all cursor-pointer"
              style={{ borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <div className="font-display text-xl mb-1" style={{ color: 'var(--accent-red)' }}>
                {pkg.credits}
              </div>
              <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Credits</div>
              <div className="glass-badge text-xs">{pkg.price}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{pkg.label}</div>
            </button>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
          Gekaufte Credits verfallen nicht. Nur für Scripts &amp; UI verwendbar — Spiele benötigen ein Abo.
        </p>
      </div>

      {/* Credit-Verlauf */}
      <div className="glass-card p-6">
        <h2 className="font-display text-xl mb-4">Credit-Verlauf</h2>
        {transactions.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Noch keine Transaktionen.</p>
        ) : (
          <div className="space-y-2">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2 px-3 rounded-xl text-sm"
                   style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <span className="font-medium">{TYPE_LABELS[t.type] ?? t.type}</span>
                  {t.description && (
                    <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>
                      {t.description}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span style={{ color: t.amount > 0 ? '#00ff80' : 'var(--accent-red)' }}>
                    {t.amount > 0 ? '+' : ''}{t.amount}
                  </span>
                  <span className="text-xs w-16 text-right" style={{ color: 'var(--text-muted)' }}>
                    = {t.balance_after}
                  </span>
                  <span className="text-xs w-20 text-right" style={{ color: 'var(--text-muted)' }}>
                    {new Date(t.created_at).toLocaleDateString('de-DE')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Passwort ändern */}
      <div className="glass-card p-6">
        <h2 className="font-display text-xl mb-4">Passwort ändern</h2>
        <form onSubmit={handlePasswordChange} className="space-y-3 max-w-sm">
          <input
            type="password"
            value={pwCurrent}
            onChange={(e) => setPwCurrent(e.target.value)}
            placeholder="Aktuelles Passwort"
            className="glass-input w-full px-4 py-3 text-sm"
          />
          <input
            type="password"
            value={pwNew}
            onChange={(e) => setPwNew(e.target.value)}
            placeholder="Neues Passwort (min. 8 Zeichen)"
            className="glass-input w-full px-4 py-3 text-sm"
          />
          {pwMsg && (
            <p className="text-sm" style={{ color: pwMsg.includes('erfolgreich') ? '#00ff80' : 'var(--accent-red)' }}>
              {pwMsg}
            </p>
          )}
          <button type="submit" disabled={pwLoading} className="glass-button px-5 py-2.5 rounded-xl text-sm font-medium">
            {pwLoading ? 'Ändern...' : 'Passwort ändern'}
          </button>
        </form>
      </div>
    </div>
  )
}
