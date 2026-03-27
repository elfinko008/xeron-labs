'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { motion } from 'framer-motion'
import { LuxuryBackground } from '@/components/landing/LuxuryBackground'
import { ParticleSystem } from '@/components/landing/ParticleSystem'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function getSupabase() {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = getSupabase()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError('Incorrect email or password. Please try again.')
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  async function handleDiscord() {
    setError('')
    setLoading(true)
    const supabase = getSupabase()
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: `${window.location.origin}/auth/confirm` },
    })
    if (authError) {
      setError(authError.message)
      setLoading(false)
    }
  }

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
            <p className="t-label" style={{ marginTop: 4 }}>Welcome back</p>
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

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label className="t-label">Password</label>
                  <Link href="/auth/reset" style={{
                    color: 'var(--gold-400)', fontSize: 12, textDecoration: 'none',
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.7'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  className="lg-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

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
                    Signing in…
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
              <div className="lg-divider" style={{ flex: 1 }} />
              <span className="t-label" style={{ fontSize: 11 }}>OR</span>
              <div className="lg-divider" style={{ flex: 1 }} />
            </div>

            {/* Discord */}
            <button
              type="button"
              className="btn-glass"
              onClick={handleDiscord}
              disabled={loading}
              style={{ width: '100%', gap: 10 }}
            >
              <svg width="18" height="14" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.44077 45.4204 0.52529C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.52529C25.5141 0.44359 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C7.41476 50.7566 14.2217 53.9748 20.8975 56.0864C20.9899 56.1147 21.0878 56.0807 21.1466 56.0031C22.7063 53.8682 24.1015 51.6156 25.2964 49.2516C25.3580 49.1291 25.3002 48.9836 25.1715 48.9357C22.9969 48.1173 20.9272 47.1128 18.9318 45.9691C18.7889 45.8858 18.7777 45.6826 18.9094 45.5844C19.3258 45.2746 19.742 44.9535 20.1386 44.6297C20.2034 44.5757 20.2926 44.5644 20.3682 44.5983C32.2027 49.7565 44.9725 49.7565 56.6629 44.5983C56.7385 44.5616 56.8277 44.5729 56.8953 44.6269C57.2919 44.9507 57.7082 45.2746 58.1273 45.5844C58.2590 45.6826 58.2506 45.8858 58.1077 45.9691C56.1123 47.1298 54.0426 48.1173 51.865 48.9329C51.7363 48.9809 51.6813 49.1291 51.7430 49.2516C52.9604 51.6128 54.3556 53.8654 55.8899 56.0003C55.9459 56.0807 56.0466 56.1147 56.1390 56.0864C62.8401 53.9748 69.6470 50.7566 76.676 45.5576C76.7292 45.5182 76.7628 45.4590 76.7684 45.3942C78.2681 30.1193 74.1775 16.8226 66.1068 4.9823C66.0873 4.9429 66.0537 4.9147 66.0145 4.8978C61.4836 2.8186 56.6309 1.2888 51.5599 0.41542Z" fill="#5865F2"/>
              </svg>
              Sign in with Discord
            </button>

            {/* Register link */}
            <p style={{
              marginTop: 24, textAlign: 'center',
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--t-3)',
            }}>
              Don&apos;t have an account?{' '}
              <Link href="/register" style={{
                color: 'var(--gold-400)', textDecoration: 'none', fontWeight: 600,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.7'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
              >
                Start Free →
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
