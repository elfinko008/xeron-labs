'use client'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

const SOCIAL = [
  { label: 'TikTok',     icon: '📱', href: 'https://tiktok.com/@xeron.labs?_r=1&_t=ZG-94zR7vuK4jh' },
  { label: 'YouTube',    icon: '▶️', href: 'https://youtube.com/@xeron-labs?si=61ILouunLCDwjwWC' },
  { label: 'Discord',    icon: '💬', href: 'https://discord.gg/u5HF4CQPug' },
  { label: 'Instagram',  icon: '📷', href: 'https://www.instagram.com/xeron.labs' },
  { label: 'X',          icon: '𝕏', href: 'https://x.com/xer0nlabs?s=21' },
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
    { label: 'AGB', href: '/agb' },
    { label: 'Datenschutz', href: '/datenschutz' },
    { label: 'Impressum', href: '/impressum' },
    { label: 'Widerruf', href: '/widerruf' },
  ]},
]

export function Footer() {
  return (
    <footer className="lg-nav" style={{ borderBottom: 'none', borderTop: '1px solid rgba(212,160,23,0.06)', marginTop: 0 }}>
      <div className="container-luxury" style={{ padding: '60px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,var(--gold-600),var(--gold-400))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={18} color="#0A0900" />
              </div>
              <span style={{
                fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700,
                background: 'linear-gradient(135deg,var(--gold-600),var(--gold-400),var(--plat-300))',
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
                    justifyContent: 'center', fontSize: 16, textDecoration: 'none',
                    transition: 'border-color 0.3s, transform 0.3s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border-gold)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)'; (e.currentTarget as HTMLElement).style.transform = 'none' }}
                >
                  {s.icon}
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
            <Link href="/agb" style={{ color: 'var(--t-4)', fontSize: 13, textDecoration: 'none' }}>Terms</Link>
            <Link href="/datenschutz" style={{ color: 'var(--t-4)', fontSize: 13, textDecoration: 'none' }}>Privacy</Link>
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
