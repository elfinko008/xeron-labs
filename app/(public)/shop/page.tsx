'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Zap, Star, Building2, AlertTriangle, Tag } from 'lucide-react'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { WithdrawalWaiverModal } from '@/components/shared/WithdrawalWaiverModal'

// ─── Plan data ─────────────────────────────────────────────────────────────────

interface Plan {
  id: string
  name: string
  monthlyPrice: number
  yearlyPrice: number
  credits: number
  projects: string
  model: string
  features: string[]
  popular?: boolean
  cta: string
  isFree?: boolean
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    credits: 10,
    projects: '3 projects',
    model: 'Gemini Flash Lite',
    features: [
      '10 credits / month',
      '3 projects',
      'Gemini Flash Lite',
      'Script & UI generation',
      'Community support',
    ],
    cta: 'Get Started Free',
    isFree: true,
  },
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 4.99,
    yearlyPrice: 47.90,
    credits: 75,
    projects: '15 projects',
    model: 'Gemini Flash',
    features: [
      '75 credits / month',
      '15 projects',
      'Gemini Flash',
      'Script & UI generation',
      'Priority support',
      'Project history',
    ],
    cta: 'Start Starter',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 14.99,
    yearlyPrice: 143.90,
    credits: 500,
    projects: 'Unlimited',
    model: 'Claude Haiku / Sonnet',
    features: [
      '500 credits / month',
      'Unlimited projects',
      'Claude Haiku & Sonnet',
      'Script, UI & Game generation',
      'Priority queue',
      'Advanced analytics',
      'Discord role',
    ],
    popular: true,
    cta: 'Go Pro',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 39.99,
    yearlyPrice: 383.90,
    credits: 2000,
    projects: 'Unlimited',
    model: 'Claude Sonnet 4.6',
    features: [
      '2 000 credits / month',
      'Unlimited projects',
      'Claude Sonnet 4.6',
      'Script, UI & Game generation',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'Invoice billing',
    ],
    cta: 'Contact Sales',
  },
]

// ─── Credit packs ──────────────────────────────────────────────────────────────

interface CreditPack {
  id: string
  name: string
  credits: number
  price: number
  badge?: string
}

const CREDIT_PACKS: CreditPack[] = [
  { id: 'mini',    name: 'Mini',    credits: 50,   price: 1.99 },
  { id: 'starter', name: 'Starter', credits: 150,  price: 4.99 },
  { id: 'value',   name: 'Value',   credits: 400,  price: 11.99, badge: 'Best Value' },
  { id: 'power',   name: 'Power',   credits: 1000, price: 24.99 },
  { id: 'mega',    name: 'Mega',    credits: 3000, price: 64.99, badge: 'Most Credits' },
]

// ─── Helper ────────────────────────────────────────────────────────────────────

function formatPrice(price: number) {
  return price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

// ─── Section header ────────────────────────────────────────────────────────────

function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
      <div className="lg-divider" style={{ flex: 1 }} />
      <span className="t-label" style={{ whiteSpace: 'nowrap', color: 'var(--gold-500)', fontSize: 12 }}>{label}</span>
      <div className="lg-divider" style={{ flex: 1 }} />
    </div>
  )
}

// ─── Plan card ─────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  yearly,
  onBuy,
}: {
  plan: Plan
  yearly: boolean
  onBuy: (name: string, price: number) => void
}) {
  const price = yearly ? plan.yearlyPrice : plan.monthlyPrice
  const displayPrice = yearly ? plan.yearlyPrice / 12 : plan.monthlyPrice

  return (
    <motion.div
      layout
      className={`lg-card${plan.popular ? ' plan-card-active' : ''}`}
      style={{
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        position: 'relative',
      }}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
          <span className="lg-badge-pulse" style={{ whiteSpace: 'nowrap' }}>
            <Star size={10} />
            Most Popular
          </span>
        </div>
      )}

      {/* Plan name */}
      <div style={{ marginBottom: 16 }}>
        <h3 className="t-headline" style={{ fontSize: 18, marginBottom: 4 }}>{plan.name}</h3>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'var(--t-3)' }}>{plan.model}</p>
      </div>

      {/* Price */}
      <div style={{ marginBottom: 20 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${plan.id}-${yearly}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}
          >
            {plan.isFree ? (
              <span className="t-display" style={{ fontSize: 36 }}>Free</span>
            ) : (
              <>
                <span className="t-display" style={{ fontSize: 36 }}>{formatPrice(displayPrice)}</span>
                <span style={{ color: 'var(--t-3)', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>/mo</span>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {yearly && !plan.isFree && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'var(--t-3)', marginTop: 2 }}
          >
            {formatPrice(price)} billed yearly
          </motion.p>
        )}
      </div>

      {/* CTA */}
      {plan.isFree ? (
        <a href="/register" className="btn-glass" style={{ width: '100%', marginBottom: 20, textAlign: 'center' }}>
          {plan.cta}
        </a>
      ) : (
        <button
          className={`btn-luxury${plan.popular ? ' btn-luxury-pulse' : ''}`}
          style={{ width: '100%', marginBottom: 20 }}
          onClick={() => onBuy(plan.name, plan.isFree ? 0 : price)}
        >
          {plan.cta}
        </button>
      )}

      {/* Feature list */}
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {plan.features.map(f => (
          <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <Check size={14} color="var(--gold-400)" style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--t-2)', lineHeight: 1.5 }}>{f}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

// ─── Credit pack card ──────────────────────────────────────────────────────────

function CreditPackCard({ pack, onBuy }: { pack: CreditPack; onBuy: (name: string, price: number) => void }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.005 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="lg-card"
      style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', cursor: 'pointer' }}
      onClick={() => onBuy(pack.name + ' Pack', pack.price)}
    >
      {pack.badge && (
        <div style={{ position: 'absolute', top: -12, right: 16 }}>
          <span className="lg-badge" style={{ fontSize: 10 }}>{pack.badge}</span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'rgba(212,160,23,0.10)', border: '1px solid rgba(212,160,23,0.20)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Zap size={18} color="var(--gold-400)" />
        </div>
        <div>
          <div className="t-headline" style={{ fontSize: 15 }}>{pack.name}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'var(--t-3)' }}>
            {pack.credits.toLocaleString()} credits
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="text-gold-gradient" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700 }}>
          {formatPrice(pack.price)}
        </span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'var(--t-4)' }}>
          {(pack.price / pack.credits * 100).toFixed(2)}¢ / cr
        </span>
      </div>
    </motion.div>
  )
}

// ─── Coupon field ──────────────────────────────────────────────────────────────

function CouponSection() {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle')
  const [message, setMessage] = useState('')

  async function handleApply() {
    if (!code.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/coupon/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      })
      const data = await res.json()
      if (res.ok && data.valid) {
        setStatus('valid')
        setMessage(data.message ?? `Coupon applied: ${data.discount}`)
      } else {
        setStatus('invalid')
        setMessage(data.error ?? 'Invalid or expired coupon code.')
      }
    } catch {
      setStatus('invalid')
      setMessage('Could not validate coupon. Please try again.')
    }
  }

  return (
    <div>
      <SectionDivider label="COUPON CODE" />
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Tag size={16} color="var(--t-3)" style={{
              position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
            }} />
            <input
              type="text"
              className="lg-input"
              placeholder="Enter coupon code"
              value={code}
              onChange={e => { setCode(e.target.value.toUpperCase()); setStatus('idle'); setMessage('') }}
              onKeyDown={e => e.key === 'Enter' && handleApply()}
              style={{ paddingLeft: 44, letterSpacing: '0.08em', fontFamily: "'JetBrains Mono', monospace", fontSize: 14 }}
            />
          </div>
          <button
            className="btn-luxury"
            onClick={handleApply}
            disabled={status === 'loading' || !code.trim()}
            style={{ whiteSpace: 'nowrap', opacity: (!code.trim() || status === 'loading') ? 0.6 : 1 }}
          >
            {status === 'loading' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            ) : 'Apply'}
          </button>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ marginTop: 10 }}
            >
              <span
                className={status === 'valid' ? 'lg-badge-green' : 'lg-badge-red'}
                style={{ display: 'inline-flex', borderRadius: 10, padding: '8px 14px', fontSize: 13, letterSpacing: 0 }}
              >
                {message}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ShopPage() {
  const [yearly, setYearly] = useState(false)
  const [waiverOpen, setWaiverOpen] = useState(false)
  const [pendingProduct, setPendingProduct] = useState<{ name: string; price: number } | null>(null)

  function openWaiver(name: string, price: number) {
    setPendingProduct({ name, price })
    setWaiverOpen(true)
  }

  async function handleWaiverAccept(waiverText: string) {
    setWaiverOpen(false)
    if (!pendingProduct) return

    try {
      const res = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: pendingProduct.name,
          amountEur: pendingProduct.price,
          waiverText,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      // silently fail — stripe redirect handles error states
    }
  }

  return (
    <>
      <Navbar />

      <main style={{ paddingTop: 68 }}>
        {/* Hero */}
        <section style={{ padding: '80px 0 60px', textAlign: 'center' }}>
          <div className="container-luxury">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <span className="lg-badge" style={{ marginBottom: 18 }}>
                <Star size={10} />
                Simple, transparent pricing
              </span>
              <h1 className="t-display" style={{ fontSize: 'clamp(40px, 6vw, 72px)', marginBottom: 16, marginTop: 12 }}>
                XERON{' '}
                <span className="text-gold-gradient">Shop</span>
              </h1>
              <p className="t-body" style={{ maxWidth: 540, margin: '0 auto', fontSize: 17 }}>
                Pick the plan that fits your workflow, or top up with credits whenever you need them.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container-luxury" style={{ paddingBottom: 100 }}>

          {/* ── Subscriptions ── */}
          <div style={{ marginBottom: 80 }}>
            <SectionDivider label="SUBSCRIPTIONS" />

            {/* Monthly / Yearly toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
              <div style={{
                display: 'inline-flex',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--glass-border)',
                borderRadius: 999,
                padding: 4,
                gap: 2,
              }}>
                <button
                  onClick={() => setYearly(false)}
                  style={{
                    padding: '8px 22px',
                    borderRadius: 999,
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    transition: 'all 0.25s ease',
                    background: !yearly ? 'var(--glass-3)' : 'transparent',
                    color: !yearly ? 'var(--t-1)' : 'var(--t-3)',
                    boxShadow: !yearly ? '0 2px 8px rgba(0,0,0,0.18)' : 'none',
                  }}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setYearly(true)}
                  style={{
                    padding: '8px 22px',
                    borderRadius: 999,
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    transition: 'all 0.25s ease',
                    background: yearly ? 'var(--glass-3)' : 'transparent',
                    color: yearly ? 'var(--t-1)' : 'var(--t-3)',
                    boxShadow: yearly ? '0 2px 8px rgba(0,0,0,0.18)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  Yearly
                  <span className="lg-badge" style={{ padding: '2px 8px', fontSize: 10 }}>-20%</span>
                </button>
              </div>
            </div>

            {/* Plan grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 20,
              alignItems: 'stretch',
            }}>
              {PLANS.map(plan => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  yearly={yearly}
                  onBuy={openWaiver}
                />
              ))}
            </div>
          </div>

          {/* ── Credit packs ── */}
          <div style={{ marginBottom: 80 }}>
            <SectionDivider label="CREDIT PACKS" />

            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <span className="lg-badge-plat" style={{ fontSize: 12 }}>
                <Building2 size={10} />
                Scripts &amp; UI Only
              </span>
            </div>

            {/* Pack grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 16,
              marginBottom: 24,
            }}>
              {CREDIT_PACKS.map(pack => (
                <CreditPackCard key={pack.id} pack={pack} onBuy={openWaiver} />
              ))}
            </div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                background: 'rgba(212,160,23,0.05)',
                border: '1px solid rgba(212,160,23,0.15)',
                borderRadius: 16,
                padding: '14px 18px',
                maxWidth: 680,
                margin: '0 auto',
              }}
            >
              <AlertTriangle size={16} color="var(--gold-500)" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--t-3)', lineHeight: 1.65, margin: 0 }}>
                <strong style={{ color: 'var(--t-2)', fontWeight: 600 }}>Credit Packs</strong> work for{' '}
                <strong style={{ color: 'var(--t-2)', fontWeight: 600 }}>Scripts &amp; UI</strong> only.{' '}
                Game Generation requires a <strong style={{ color: 'var(--gold-400)', fontWeight: 600 }}>Pro</strong> or{' '}
                <strong style={{ color: 'var(--gold-400)', fontWeight: 600 }}>Enterprise</strong> plan.
              </p>
            </motion.div>
          </div>

          {/* ── Coupon code ── */}
          <CouponSection />

        </div>
      </main>

      <Footer />

      {/* Withdrawal waiver modal */}
      {pendingProduct && (
        <WithdrawalWaiverModal
          isOpen={waiverOpen}
          onClose={() => { setWaiverOpen(false); setPendingProduct(null) }}
          onAccept={handleWaiverAccept}
          productName={pendingProduct.name}
          amountEur={pendingProduct.price}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .plan-grid { grid-template-columns: 1fr 1fr !important; }
          .credit-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 400px) {
          .plan-grid, .credit-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
