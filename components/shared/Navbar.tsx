'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Sparkles, LayoutDashboard } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import LanguageSelector from '@/components/LanguageSelector'

const NAV_LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/shop' },
  { label: 'Tutorial', href: '/tutorial' },
  { label: 'Community', href: '/community' },
  { label: 'Changelog', href: '/changelog' },
  { label: 'Status', href: '/status' },
]

export function Navbar({ locale = 'en' }: { locale?: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [promoH, setPromoH] = useState(0)

  useEffect(() => {
    // Read initial promo height from CSS variable
    const readPromoH = () => {
      const h = getComputedStyle(document.documentElement).getPropertyValue('--promo-h')
      setPromoH(parseInt(h) || 0)
    }
    readPromoH()

    // Observe CSS variable changes via MutationObserver on style attr
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
    return () => {
      window.removeEventListener('scroll', onScroll)
      obs.disconnect()
    }
  }, [])

  return (
    <>
      <nav
        className="lg-nav"
        style={{
          position: 'fixed',
          top: promoH,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 68,
          display: 'flex',
          alignItems: 'center',
          transition: 'top 0.3s ease, border-bottom-color 0.3s ease',
          borderBottomColor: scrolled ? 'rgba(212,160,23,0.15)' : 'rgba(212,160,23,0.08)',
        }}
      >
        {/* Scroll progress */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'transparent' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,var(--gold-600),var(--gold-400))', transition: 'width 0.1s' }} />
        </div>

        <div className="container-luxury" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,var(--gold-600),var(--gold-400))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Sparkles size={18} color="#0A0900" />
            </div>
            <span style={{
              fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700,
              background: 'linear-gradient(135deg,var(--gold-600),var(--gold-400),var(--plat-300),var(--gold-400))',
              backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', animation: 'goldShimmer 4s linear infinite',
            }}>
              XERON
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="hidden-mobile">
            {/* Dashboard link — first, gold tinted */}
            <Link href="/dashboard" style={{
              color: 'var(--gold-400)', fontSize: 14, fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
              padding: '6px 14px', borderRadius: 10, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
              transition: 'color 0.2s, background 0.2s',
              background: 'rgba(212,160,23,0.06)',
              border: '1px solid rgba(212,160,23,0.15)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,160,23,0.12)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,160,23,0.30)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,160,23,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,160,23,0.15)' }}
            >
              <LayoutDashboard size={14} />
              Dashboard
            </Link>
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} style={{
                color: 'var(--t-3)', fontSize: 14, fontFamily: "'DM Sans',sans-serif", fontWeight: 500,
                padding: '6px 14px', borderRadius: 10, textDecoration: 'none',
                transition: 'color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--t-1)'; (e.currentTarget as HTMLElement).style.background = 'var(--glass-1)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--t-3)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="hidden-mobile">
              <LanguageSelector currentLocale={locale} />
            </div>
            <div className="hidden-mobile">
              <ThemeToggle />
            </div>
            <div className="hidden-mobile">
              <Link href="/login" className="btn-glass" style={{ padding: '9px 20px', fontSize: 14 }}>Sign In</Link>
            </div>
            <Link href="/register" className="btn-luxury btn-luxury-pulse" style={{ padding: '9px 20px', fontSize: 14 }}>
              Start Free
            </Link>
            <button
              className="show-mobile"
              onClick={() => setMobileOpen(o => !o)}
              style={{ background: 'var(--glass-2)', border: '1px solid var(--glass-border)', borderRadius: 10, padding: 8, cursor: 'pointer', color: 'var(--t-1)', display: 'none' }}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: promoH + 68, left: 0, right: 0, bottom: 0, zIndex: 999,
          background: 'rgba(3,3,16,0.97)', backdropFilter: 'blur(40px)',
          padding: '24px', display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto',
        }}>
          {/* Dashboard first on mobile */}
          <Link href="/dashboard" onClick={() => setMobileOpen(false)} style={{
            color: 'var(--gold-400)', fontSize: 18, fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
            padding: '14px 16px', borderRadius: 16, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.25)',
          }}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} style={{
              color: 'var(--t-2)', fontSize: 18, fontFamily: "'DM Sans',sans-serif", fontWeight: 500,
              padding: '14px 16px', borderRadius: 16, textDecoration: 'none', display: 'block',
              background: 'var(--glass-1)', border: '1px solid var(--glass-border)',
            }}>
              {link.label}
            </Link>
          ))}
          <div style={{ height: 1, background: 'var(--glass-border)', margin: '8px 0' }} />
          <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-glass" style={{ textAlign: 'center' }}>Sign In</Link>
          <Link href="/register" onClick={() => setMobileOpen(false)} className="btn-luxury" style={{ textAlign: 'center' }}>Start Free →</Link>
          <div style={{ display: 'flex', gap: 10, marginTop: 8, justifyContent: 'center' }}>
            <LanguageSelector currentLocale={locale} />
            <ThemeToggle />
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </>
  )
}
