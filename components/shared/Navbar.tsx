'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, LayoutDashboard, LogOut, User } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { useAuth } from '@/components/AuthProvider'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/shop' },
  { label: 'Tutorial', href: '/tutorial' },
  { label: 'Community', href: '/community' },
  { label: 'Changelog', href: '/changelog' },
  { label: 'Status', href: '/status' },
]

function UserMenu({ profile, signOut }: { profile: NonNullable<ReturnType<typeof useAuth>['profile']>; signOut: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const initial = profile.username?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase() || '?'

  useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,var(--gold-700),var(--gold-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#060300', fontWeight: 700, fontSize: 14, border: '2px solid rgba(212,146,15,0.4)', transition: 'border-color 0.2s', fontFamily: "'Tenor Sans', sans-serif" }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold-bright)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(212,146,15,0.4)')}
      >
        {initial}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, zIndex: 200, background: 'rgba(3,3,12,0.98)', backdropFilter: 'blur(40px)', border: '0.5px solid rgba(212,146,15,0.25)', borderRadius: 16, padding: 8, minWidth: 180, boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
          >
            <div style={{ padding: '8px 12px 10px', borderBottom: '0.5px solid rgba(212,146,15,0.10)' }}>
              <div style={{ fontSize: 13, fontFamily: "'Tenor Sans', sans-serif", color: 'var(--t-1)', letterSpacing: '0.05em' }}>{profile.username || 'User'}</div>
              <div style={{ fontSize: 11, color: 'var(--t-4)', fontFamily: "'DM Sans', sans-serif" }}>{profile.email}</div>
            </div>
            <Link href="/dashboard" onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 10, textDecoration: 'none', color: 'var(--t-2)', fontSize: 12, fontFamily: "'Tenor Sans', sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,146,15,0.06)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <LayoutDashboard size={14} /> Dashboard
            </Link>
            <Link href="/dashboard/account" onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 10, textDecoration: 'none', color: 'var(--t-2)', fontSize: 12, fontFamily: "'Tenor Sans', sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,146,15,0.06)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <User size={14} /> Account
            </Link>
            <button onClick={signOut} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 10, background: 'none', border: 'none', color: 'var(--t-3)', fontSize: 12, fontFamily: "'Tenor Sans', sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'background 0.2s, color 0.2s' }}
              onMouseEnter={e => { (e.currentTarget.style.background = 'rgba(239,68,68,0.08)'); (e.currentTarget.style.color = '#F87171') }}
              onMouseLeave={e => { (e.currentTarget.style.background = 'transparent'); (e.currentTarget.style.color = 'var(--t-3)') }}>
              <LogOut size={14} /> Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Navbar({ locale = 'en' }: { locale?: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [promoH, setPromoH] = useState(0)
  const { user, profile, signOut } = useAuth()

  useEffect(() => {
    const readPromoH = () => {
      const h = getComputedStyle(document.documentElement).getPropertyValue('--promo-h')
      setPromoH(parseInt(h) || 0)
    }
    readPromoH()
    const obs = new MutationObserver(readPromoH)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] })

    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      const doc = document.documentElement
      const scroll = doc.scrollTop
      const height = doc.scrollHeight - doc.clientHeight
      setProgress(height > 0 ? (scroll / height) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); obs.disconnect() }
  }, [])

  return (
    <>
      <nav
        className="lg-nav"
        style={{
          position: 'fixed', top: promoH, left: 0, right: 0, zIndex: 1000,
          height: 64, display: 'flex', alignItems: 'center',
          transition: 'top 0.3s ease, border-bottom-color 0.3s ease',
          borderBottomColor: scrolled ? 'rgba(212,146,15,0.18)' : 'rgba(212,146,15,0.10)',
        }}
      >
        {/* Scroll progress */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1 }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,var(--gold-base),var(--gold-bright))', transition: 'width 0.1s' }} />
        </div>

        <div className="container-luxury" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Image src="/logo.png" alt="XERON" width={36} height={36} style={{ objectFit: 'contain' }} priority onError={() => {}} />
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, background: 'linear-gradient(135deg,var(--gold-base),var(--gold-bright),var(--chrome-pale),var(--gold-bright))', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'goldShimmer 4s linear infinite', letterSpacing: '0.04em' }}>
              XERON
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="hidden-mobile">
            {/* Dashboard link — gold tinted */}
            <Link href="/dashboard" style={{ color: 'var(--gold-bright)', fontSize: 13, fontFamily: "'Tenor Sans',sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: 10, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.2s', background: 'rgba(212,146,15,0.06)', border: '0.5px solid rgba(212,146,15,0.15)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,146,15,0.12)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,146,15,0.06)' }}>
              <LayoutDashboard size={14} /> Dashboard
            </Link>
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href}
                style={{ color: 'var(--t-3)', fontSize: 13, fontFamily: "'Tenor Sans',sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: 10, textDecoration: 'none', transition: 'color 0.2s, background 0.2s', position: 'relative' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--gold-bright)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--t-3)' }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="hidden-mobile"><ThemeToggle /></div>
            {user && profile ? (
              <div className="hidden-mobile">
                <UserMenu profile={profile} signOut={signOut} />
              </div>
            ) : (
              <>
                <div className="hidden-mobile">
                  <Link href="/login" className="btn-glass" style={{ padding: '9px 20px', fontSize: 13 }}>Sign In</Link>
                </div>
                <Link href="/register" className="btn-luxury btn-luxury-pulse" style={{ padding: '9px 20px', fontSize: 13 }}>
                  Start Free
                </Link>
              </>
            )}
            <button className="show-mobile" onClick={() => setMobileOpen(o => !o)}
              style={{ background: 'rgba(5,4,15,0.60)', border: '0.5px solid rgba(212,146,15,0.20)', borderRadius: 10, padding: 8, cursor: 'pointer', color: 'var(--t-1)', display: 'none' }}
              aria-label="Menu">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'fixed', top: promoH + 64, left: 0, right: 0, bottom: 0, zIndex: 999, background: 'rgba(2,2,9,0.97)', backdropFilter: 'blur(40px)', padding: '24px', display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
            <Link href="/dashboard" onClick={() => setMobileOpen(false)} style={{ color: 'var(--gold-bright)', fontSize: 16, fontFamily: "'Tenor Sans',sans-serif", letterSpacing: '0.10em', textTransform: 'uppercase', padding: '14px 16px', borderRadius: 16, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(212,146,15,0.08)', border: '0.5px solid rgba(212,146,15,0.25)' }}>
              <LayoutDashboard size={20} /> Dashboard
            </Link>
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} style={{ color: 'var(--t-2)', fontSize: 16, fontFamily: "'Tenor Sans',sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', padding: '14px 16px', borderRadius: 16, textDecoration: 'none', display: 'block', background: 'rgba(5,4,15,0.55)', border: '0.5px solid rgba(212,146,15,0.12)' }}>
                {link.label}
              </Link>
            ))}
            <div style={{ height: 1, background: 'rgba(212,146,15,0.10)', margin: '8px 0' }} />
            {user ? (
              <button onClick={() => { setMobileOpen(false); signOut() }} className="btn-glass" style={{ textAlign: 'center' }}>Sign Out</button>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-glass" style={{ textAlign: 'center' }}>Sign In</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="btn-luxury" style={{ textAlign: 'center' }}>Start Free →</Link>
              </>
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 8, justifyContent: 'center' }}>
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </>
  )
}
