'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Suspense } from 'react'

interface Profile {
  id: string
  email: string
  plan: string
  credits: number
  purchased_credits: number
  credits_reset_at: string | null
  referral_code: string | null
  referral_credits_earned: number
}

const PLAN_CREDITS: Record<string, number> = { free: 10, starter: 100, pro: 500, enterprise: 1000 }
const PLAN_PRICES: Record<string, string> = { free: '€0/mo', starter: '€4.99/mo', pro: '€14.99/mo', enterprise: '€39.99/mo' }

const CREDIT_PACKAGES = [
  { key: 'mini', label: 'Mini', credits: 50, price: '€1.99', priceId: process.env.NEXT_PUBLIC_STRIPE_CREDIT_MINI || '' },
  { key: 'starter', label: 'Starter', credits: 150, price: '€4.99', priceId: process.env.NEXT_PUBLIC_STRIPE_CREDIT_STARTER || '' },
  { key: 'value', label: 'Value', credits: 400, price: '€11.99', priceId: process.env.NEXT_PUBLIC_STRIPE_CREDIT_VALUE || '' },
  { key: 'power', label: 'Power', credits: 1000, price: '€24.99', priceId: process.env.NEXT_PUBLIC_STRIPE_CREDIT_POWER || '' },
  { key: 'mega', label: 'Mega', credits: 3000, price: '€64.99', priceId: process.env.NEXT_PUBLIC_STRIPE_CREDIT_MEGA || '' },
]

function AccountContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState(searchParams.get('tab') || 'overview')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [transactions, setTransactions] = useState<Array<{id: string; type: string; amount: number; description: string; created_at: string}>>([])
  const [loading, setLoading] = useState(true)
  const [purchaseLoading, setPurchaseLoading] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const [{ data: prof }, { data: txns }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('credit_transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(30),
    ])
    if (prof) setProfile(prof as Profile)
    if (txns) setTransactions(txns)
    setLoading(false)
  }

  async function handlePurchase(pkg: typeof CREDIT_PACKAGES[0]) {
    if (!pkg.priceId) { alert('Payment not configured yet. Please check back soon.'); return }
    setPurchaseLoading(pkg.key)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: pkg.priceId, mode: 'payment', credits: pkg.credits }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch { alert('Error starting checkout') }
    setPurchaseLoading('')
  }

  async function handleUpgrade(plan: string) {
    alert(`Upgrade to ${plan} — Stripe integration coming soon. Contact support@xeron-labs.com`)
  }

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--text-muted)' }}>Loading...</p></div>

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14 }}>← Dashboard</Link>
          <h1 className="font-display" style={{ fontSize: 20 }}>Account</h1>
          <span />
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 32, background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 4, width: 'fit-content' }}>
          {[['overview', 'Overview'], ['credits', 'Buy Credits'], ['plan', 'Plan'], ['history', 'History']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{
                padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: tab === key ? 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(59,130,246,0.3))' : 'transparent',
                color: tab === key ? '#a78bfa' : 'var(--text-secondary)',
                fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && profile && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="glass-card" style={{ padding: 28 }}>
              <h2 className="font-display" style={{ fontSize: 22, marginBottom: 20 }}>Account Info</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Email</span>
                  <span>{profile.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Plan</span>
                  <span className="glass-badge" style={{ fontSize: 12 }}>{profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Sub Credits</span>
                  <span style={{ color: '#a78bfa', fontWeight: 600 }}>{profile.credits}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Bonus Credits</span>
                  <span style={{ color: '#4ade80', fontWeight: 600 }}>{profile.purchased_credits}</span>
                </div>
              </div>
            </div>

            {profile.referral_code && (
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 className="font-display" style={{ fontSize: 18, marginBottom: 12 }}>Referral Program</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
                  Earn 5 credits for every friend who signs up. They also get 5 credits!
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input readOnly value={`https://xeron-labs.com/register?ref=${profile.referral_code}`} className="glass-input" style={{ fontSize: 13 }} />
                  <button onClick={() => navigator.clipboard.writeText(`https://xeron-labs.com/register?ref=${profile.referral_code}`)}
                    className="glass-button" style={{ padding: '0 16px', flexShrink: 0 }}>Copy</button>
                </div>
                {profile.referral_credits_earned > 0 && (
                  <p style={{ fontSize: 13, color: '#4ade80', marginTop: 12 }}>+{profile.referral_credits_earned} credits earned from referrals</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* CREDITS TAB */}
        {tab === 'credits' && (
          <div>
            <div className="glass-card" style={{ padding: 20, marginBottom: 24, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                💡 Purchased credits work for <strong style={{ color: '#a78bfa' }}>Scripts & UI only</strong>. For game generation, you need an active subscription.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
              {CREDIT_PACKAGES.map((pkg) => (
                <div key={pkg.key} className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
                  <div className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#a78bfa', marginBottom: 4 }}>{pkg.credits}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Credits</div>
                  <div className="glass-badge" style={{ marginBottom: 16 }}>{pkg.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>{pkg.price}</div>
                  <button onClick={() => handlePurchase(pkg)} disabled={purchaseLoading === pkg.key}
                    className="glass-button-primary" style={{ width: '100%', padding: '10px', fontSize: 13 }}>
                    {purchaseLoading === pkg.key ? '...' : 'Buy'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PLAN TAB */}
        {tab === 'plan' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {[
              { plan: 'free', name: 'Free', price: '€0', note: 'Scripts only' },
              { plan: 'starter', name: 'Starter', price: '€4.99', note: 'All games' },
              { plan: 'pro', name: 'Pro', price: '€14.99', note: 'High-End + Sonnet' },
              { plan: 'enterprise', name: 'Enterprise', price: '€39.99', note: 'Max credits' },
            ].map((p) => (
              <div key={p.plan} className="glass-card" style={{ padding: 24, border: profile?.plan === p.plan ? '1px solid rgba(124,58,237,0.5)' : undefined }}>
                <h3 className="font-display" style={{ fontSize: 20, marginBottom: 4 }}>{p.name}</h3>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#a78bfa', marginBottom: 4 }}>{p.price}<span style={{ fontSize: 14, color: 'var(--text-muted)' }}>/mo</span></div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{PLAN_CREDITS[p.plan]} credits/mo</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>{p.note}</div>
                {profile?.plan === p.plan ? (
                  <span className="glass-badge-green" style={{ display: 'block', textAlign: 'center', padding: '8px' }}>✓ Current Plan</span>
                ) : (
                  <button onClick={() => handleUpgrade(p.plan)} className="glass-button-primary" style={{ width: '100%', padding: '10px', fontSize: 13 }}>
                    {p.plan === 'free' ? 'Downgrade' : 'Upgrade'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* HISTORY TAB */}
        {tab === 'history' && (
          <div className="glass-card" style={{ padding: 24 }}>
            <h2 className="font-display" style={{ fontSize: 22, marginBottom: 20 }}>Credit History</h2>
            {transactions.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 32 }}>No transactions yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {transactions.map((t) => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.03)' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{t.description}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(t.created_at).toLocaleDateString()} • {t.type}</div>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 16, color: t.amount > 0 ? '#4ade80' : '#f87171' }}>
                      {t.amount > 0 ? '+' : ''}{t.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--text-muted)' }}>Loading...</p></div>}>
      <AccountContent />
    </Suspense>
  )
}
