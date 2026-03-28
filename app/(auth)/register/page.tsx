'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const NightHorizonBackground = dynamic(() => import('@/components/backgrounds/NightHorizonBackground').then(m => ({ default: m.NightHorizonBackground })), { ssr: false })

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [newsletter, setNewsletter] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function getSupabase() {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    const supabase = getSupabase()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || undefined,
          newsletter_opted_in: newsletter,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Persist newsletter preference to profile if user row already exists
    if (data.user && newsletter) {
      await supabase
        .from('profiles')
        .update({ newsletter_opted_in: true } as never)
        .eq('id', data.user.id)
    }

    router.push(`/auth/verify-code?email=${encodeURIComponent(email)}`)
  }

  return (
    <>
      <NightHorizonBackground />

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
            <p className="t-label" style={{ marginTop: 4 }}>Create your account — it&apos;s free</p>
          </div>

          {/* Modal card */}
          <div className="lg-modal" style={{ padding: '40px 36px' }}>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: 20 }}
              >
                <span className="lg-badge-red" style={{ display: 'flex', width: '100%', borderRadius: 12, padding: '10px 16px', fontSize: 13, letterSpacing: 0 }}>
                  {error}
                </span>
              </motion.div>
            )}

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Email */}
              <div>
                <label className="t-label" style={{ display: 'block', marginBottom: 8 }}>Email</label>
                <input
                  type="email"
                  className="lg-input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <label className="t-label" style={{ display: 'block', marginBottom: 8 }}>Password</label>
                <input
                  type="password"
                  className="lg-input"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>

              {/* Username (optional) */}
              <div>
                <label className="t-label" style={{ display: 'block', marginBottom: 8 }}>
                  Username <span style={{ color: 'var(--t-4)', textTransform: 'none', fontWeight: 400 }}>(optional)</span>
                </label>
                <input
                  type="text"
                  className="lg-input"
                  placeholder="YourUsername"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>

              {/* Newsletter opt-in */}
              <label style={{
                display: 'flex', gap: 12, cursor: 'pointer', alignItems: 'flex-start',
                padding: '12px 14px',
                background: 'rgba(212,160,23,0.04)',
                border: '1px solid rgba(212,160,23,0.10)',
                borderRadius: 14,
                transition: 'border-color 0.2s',
              }}>
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={e => setNewsletter(e.target.checked)}
                  style={{ marginTop: 2, width: 16, height: 16, accentColor: 'var(--gold-500)', flexShrink: 0, cursor: 'pointer' }}
                />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--t-3)', lineHeight: 1.6 }}>
                  Keep me updated with product news, tips, and exclusive offers.
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                className="btn-luxury"
                disabled={loading}
                style={{ width: '100%', marginTop: 4, opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s' }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Creating account…
                  </span>
                ) : 'Create Account'}
              </button>
            </form>

            {/* Mandatory legal text — always visible, no checkbox */}
            <p style={{
              marginTop: 20,
              fontFamily: "'Tenor Sans', sans-serif",
              fontSize: 12,
              color: 'var(--t-3)',
              lineHeight: 1.65,
              textAlign: 'center',
            }}>
              By registering, you agree to our{' '}
              <a href="/agb" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-400)', textDecoration: 'underline' }}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/datenschutz" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-400)', textDecoration: 'underline' }}>
                Privacy Policy
              </a>.
            </p>

            {/* Sign in link */}
            <p style={{
              marginTop: 20, textAlign: 'center',
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--t-3)',
            }}>
              Already have an account?{' '}
              <Link href="/login" style={{
                color: 'var(--gold-400)', textDecoration: 'none', fontWeight: 600,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.7'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}
