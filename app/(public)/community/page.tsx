import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { LuxuryBackground } from '@/components/landing/LuxuryBackground'
import { ParticleSystem } from '@/components/landing/ParticleSystem'

export const metadata = {
  title: 'Community — XERON Engine',
  description: 'Join the XERON Community on TikTok, YouTube, Discord, Instagram and X. Earn free credits by following us.',
}

const SOCIALS = [
  {
    name: 'TikTok',
    handle: '@xeron.labs',
    tagline: 'Watch AI build in real time',
    color: '#EE1D52',
    bg: 'rgba(238,29,82,0.08)',
    border: 'rgba(238,29,82,0.25)',
    badge: null,
    href: 'https://tiktok.com/@xeron.labs?_r=1&_t=ZG-94zR7vuK4jh',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.85 4.85 0 01-1.01-.08z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    handle: '@xeron-labs',
    tagline: 'Tutorials, Demos, Deep Dives',
    color: '#FF0000',
    bg: 'rgba(255,0,0,0.08)',
    border: 'rgba(255,0,0,0.25)',
    badge: null,
    href: 'https://youtube.com/@xeron-labs?si=61ILouunLCDwjwWC',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'Discord',
    handle: 'XERON Community',
    tagline: 'Get help, share games, join events',
    color: '#5865F2',
    bg: 'rgba(88,101,242,0.08)',
    border: 'rgba(88,101,242,0.25)',
    badge: '🪙 10 Credits Bonus',
    href: 'https://discord.gg/u5HF4CQPug',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    handle: '@xeron.labs',
    tagline: 'Behind the scenes & updates',
    color: '#E1306C',
    bg: 'rgba(225,48,108,0.08)',
    border: 'rgba(225,48,108,0.25)',
    badge: null,
    href: 'https://www.instagram.com/xeron.labs',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'X',
    handle: '@xer0nlabs',
    tagline: 'Latest news & announcements',
    color: '#ffffff',
    bg: 'rgba(255,255,255,0.04)',
    border: 'rgba(255,255,255,0.12)',
    badge: null,
    href: 'https://x.com/xer0nlabs?s=21',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
]

export default function CommunityPage() {
  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <LuxuryBackground />
      <ParticleSystem count={20} />

      <Navbar />

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <section className="section-pad-sm" style={{ paddingTop: '80px' }}>
          <div className="container-luxury" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
            <span className="lg-badge" style={{ marginBottom: '20px' }}>Community</span>
            <h1 className="t-display" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', marginTop: '16px', marginBottom: '20px' }}>
              Join The{' '}
              <span className="text-gold-gradient">XERON</span>{' '}
              Community
            </h1>
            <p className="t-body" style={{ maxWidth: '560px', margin: '0 auto', fontSize: '17px', color: 'var(--t-2)' }}>
              Follow us across platforms, get exclusive content, and earn free credits for your support.
            </p>
          </div>
        </section>

        {/* Social Cards */}
        <section className="section-pad-sm">
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}>
              {SOCIALS.map((s) => (
                <div
                  key={s.name}
                  className="lg-card-holo"
                  style={{
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    background: s.bg,
                    borderColor: s.border,
                  }}
                >
                  {/* Icon + Name row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ color: s.color }}>{s.icon}</div>
                      <div>
                        <div className="t-headline" style={{ fontSize: '18px' }}>{s.name}</div>
                        <div style={{ fontSize: '13px', color: 'var(--t-3)' }}>{s.handle}</div>
                      </div>
                    </div>
                    {s.badge && (
                      <span className="lg-badge-green" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                        {s.badge}
                      </span>
                    )}
                  </div>

                  {/* Tagline */}
                  <p className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', flexGrow: 1, margin: 0 }}>
                    {s.tagline}
                  </p>

                  {/* Button */}
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-luxury"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Follow on {s.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Free Credits Section */}
        <section className="section-pad-sm">
          <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px 80px' }}>
            <div className="lg-card" style={{ padding: '40px' }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2 className="t-headline" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>
                  🪙 Earn 10 Credits Per Platform You Follow
                </h2>
                <p className="t-body" style={{ color: 'var(--t-2)', fontSize: '15px' }}>
                  Support us and get rewarded — up to 50 free credits total.
                </p>
              </div>

              {/* Steps */}
              <div
                style={{
                  background: 'rgba(212,160,23,0.04)',
                  border: '1px solid var(--glass-border-gold)',
                  borderRadius: '20px',
                  padding: '24px 28px',
                  marginBottom: '24px',
                }}
              >
                <p className="t-label" style={{ marginBottom: '16px', color: 'var(--gold-400)' }}>How it works</p>
                <ol style={{ paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    'Follow us on one or more platforms',
                    'Join our Discord: discord.gg/u5HF4CQPug',
                    'Create a ticket in the #apply-for-credits channel',
                    'Select which platforms you followed',
                    'Include your username for each platform',
                    'Our team reviews manually',
                    'Credits credited within 24 hours!',
                  ].map((step, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <span
                        style={{
                          minWidth: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: 'rgba(212,160,23,0.15)',
                          border: '1px solid rgba(212,160,23,0.30)',
                          color: 'var(--gold-400)',
                          fontSize: '12px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {i + 1}
                      </span>
                      <span className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.6' }}>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Example message box */}
              <div
                style={{
                  background: 'rgba(0,0,0,0.25)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  marginBottom: '20px',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '13px',
                  color: 'var(--t-2)',
                  lineHeight: '1.8',
                }}
              >
                <p style={{ color: 'var(--t-3)', fontSize: '11px', fontFamily: 'DM Sans, sans-serif', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Example ticket message
                </p>
                Platforms: TikTok (@myname), YouTube (@myname)<br />
                My XERON Account: my@email.com
              </div>

              {/* Limit note */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  marginBottom: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <p className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', margin: 0 }}>
                  <strong style={{ color: 'var(--t-1)' }}>Maximum: 50 Credits</strong> (5 platforms × 10 Credits)
                </p>
                <p className="t-body" style={{ fontSize: '13px', color: 'var(--t-3)', margin: 0 }}>
                  Each platform can only be redeemed once.
                </p>
              </div>

              {/* CTA */}
              <div style={{ textAlign: 'center' }}>
                <a
                  href="https://discord.gg/u5HF4CQPug"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass"
                >
                  Go to Discord
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
