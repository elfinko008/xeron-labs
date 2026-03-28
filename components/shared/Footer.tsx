'use client'
import Link from 'next/link'
import Image from 'next/image'

const SOCIAL = [
  { label: 'TikTok', href: 'https://tiktok.com/@xeron.labs?_r=1&_t=ZG-94zR7vuK4jh', svg: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.99a8.22 8.22 0 0 0 4.82 1.55V7.1a4.85 4.85 0 0 1-1.05-.41z"/></svg>
  )},
  { label: 'YouTube', href: 'https://youtube.com/@xeron-labs?si=61ILouunLCDwjwWC', svg: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.63 31.63 0 0 0 0 12a31.63 31.63 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.63 31.63 0 0 0 24 12a31.63 31.63 0 0 0-.5-5.81zM9.75 15.52V8.48L15.82 12l-6.07 3.52z"/></svg>
  )},
  { label: 'Discord', href: 'https://discord.gg/u5HF4CQPug', svg: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.114 18.1.135 18.112a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
  )},
  { label: 'Instagram', href: 'https://www.instagram.com/xeron.labs', svg: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
  )},
  { label: 'X', href: 'https://x.com/xer0nlabs?s=21', svg: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.259 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
  )},
]

const COLS = [
  { title: 'Product', links: [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/shop' },
    { label: 'Tutorial', href: '/tutorial' },
    { label: 'Changelog', href: '/changelog' },
    { label: 'Status', href: '/status' },
    { label: 'API Docs', href: '/api-docs' },
  ]},
  { title: 'Company', links: [
    { label: 'Community', href: '/community' },
    { label: 'Support', href: '/support' },
    { label: 'Affiliate', href: '/affiliate' },
    { label: 'FAQ', href: '/faq' },
  ]},
  { title: 'Legal', links: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Legal Notice', href: '/legal' },
    { label: 'Withdrawal', href: '/withdrawal' },
  ]},
]

export function Footer() {
  return (
    <footer className="lg-nav" style={{ borderBottom: 'none', borderTop: 'none', marginTop: 0, position: 'relative' }}>
      {/* Animated shimmer top border */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, transparent, rgba(242,192,80,0.50), transparent)', animation: 'footerShimmer 4s linear infinite' }} />
      </div>
      <div className="container-luxury" style={{ padding: '60px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Image src="/logo.png" alt="XERON" width={28} height={28} style={{ objectFit: 'contain' }} onError={() => {}} />
              <span style={{
                fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700,
                background: 'linear-gradient(135deg,var(--gold-base),var(--gold-bright),var(--chrome-pale))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>XERON</span>
            </div>
            <p style={{ color: 'var(--t-3)', fontSize: 14, lineHeight: 1.7, marginBottom: 24, maxWidth: 280 }}>
              The most advanced AI-powered Roblox game builder. Create professional games with zero code.
            </p>
            {/* Social links */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {SOCIAL.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 38, height: 38, borderRadius: 10, background: 'var(--glass-2)',
                    border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', textDecoration: 'none', color: 'var(--gold-400)',
                    transition: 'border-color 0.3s, transform 0.3s, color 0.3s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border-gold)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.color = 'var(--gold-bright)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)'; (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.color = 'var(--gold-400)' }}
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLS.map(col => (
            <div key={col.title}>
              <div className="t-label" style={{ marginBottom: 16 }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(link => (
                  <Link key={link.href} href={link.href} style={{
                    color: 'var(--t-3)', fontSize: 14, textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--gold-400)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--t-3)'}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="lg-divider" style={{ marginBottom: 24 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ color: 'var(--t-4)', fontSize: 13 }}>
            © {new Date().getFullYear()} XERON Engine — xeron-labs.com
          </span>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Link href="/terms" style={{ color: 'var(--t-4)', fontSize: 13, textDecoration: 'none' }}>Terms</Link>
            <Link href="/privacy" style={{ color: 'var(--t-4)', fontSize: 13, textDecoration: 'none' }}>Privacy</Link>
            <button
              onClick={() => { try { localStorage.removeItem('xeron_cookie_consent'); window.location.reload() } catch {} }}
              style={{ background: 'none', border: 'none', color: 'var(--t-4)', fontSize: 13, cursor: 'pointer' }}
            >
              Cookie Settings
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes footerShimmer { 0%{transform:translateX(-100%);} 100%{transform:translateX(200%);} }
        @media (max-width: 768px) {
          footer .container-luxury > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          footer .container-luxury > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}
