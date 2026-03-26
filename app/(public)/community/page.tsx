import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase'

export const metadata = {
  title: 'Community — XERON Engine',
  description: 'Join the XERON Community auf TikTok, YouTube, Discord, Instagram und X.',
}

type PublicProject = { id: string; name: string; game_type: string; created_at: string; user_id: string }

async function getPublicProjects(): Promise<PublicProject[]> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('projects')
      .select('id, name, game_type, created_at, user_id')
      .eq('is_public', true)
      .eq('status', 'done')
      .order('created_at', { ascending: false })
      .limit(12)
    return (data as PublicProject[]) ?? []
  } catch {
    return []
  }
}

export default async function CommunityPage() {
  const projects = await getPublicProjects()

  const socials = [
    {
      name: 'TikTok',
      handle: '@xeron.labs',
      color: '#EE1D52',
      bg: 'rgba(238,29,82,0.1)',
      border: 'rgba(238,29,82,0.3)',
      btn: 'Jetzt folgen',
      href: 'https://tiktok.com/@xeron.labs?_r=1&_t=ZG-94zR7vuK4jh',
      badge: null,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.85 4.85 0 01-1.01-.08z"/>
        </svg>
      ),
    },
    {
      name: 'YouTube',
      handle: '@xeron-labs',
      color: '#FF0000',
      bg: 'rgba(255,0,0,0.1)',
      border: 'rgba(255,0,0,0.3)',
      btn: 'Kanal abonnieren',
      href: 'https://youtube.com/@xeron-labs?si=61ILouunLCDwjwWC',
      badge: null,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
    {
      name: 'Discord',
      handle: 'XERON Community',
      color: '#5865F2',
      bg: 'rgba(88,101,242,0.1)',
      border: 'rgba(88,101,242,0.3)',
      btn: 'Discord verbinden & 10 Credits erhalten',
      href: '/api/discord/connect',
      badge: '10 Credits Bonus!',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/>
        </svg>
      ),
    },
    {
      name: 'Instagram',
      handle: '@xeron.labs',
      color: '#E1306C',
      bg: 'rgba(225,48,108,0.1)',
      border: 'rgba(225,48,108,0.3)',
      btn: 'Folgen',
      href: 'https://www.instagram.com/xeron.labs?igsh=d2lqOGFwZnN3cnpv&utm_source=qr',
      badge: null,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
        </svg>
      ),
    },
    {
      name: 'X (Twitter)',
      handle: '@xer0nlabs',
      color: '#ffffff',
      bg: 'rgba(255,255,255,0.05)',
      border: 'rgba(255,255,255,0.15)',
      btn: 'Folgen',
      href: 'https://x.com/xer0nlabs?s=21',
      badge: null,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl">
            <span className="text-gradient-red">XERON</span>
            <span className="text-white"> Engine</span>
          </Link>
          <Link href="/dashboard" className="glass-button-primary px-5 py-2 rounded-xl text-sm font-medium">
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="glass-badge mb-4 inline-block">Community</div>
          <h1 className="font-display text-4xl md:text-5xl mb-4">
            Join the <span className="text-gradient-red">XERON</span> Community
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Teile deine Spiele, lerne von anderen und bleib auf dem neuesten Stand
          </p>
        </div>

        {/* Social Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {socials.map((s) => (
            <div key={s.name} className="glass-card p-6 flex flex-col"
                 style={{ border: `1px solid ${s.border}`, background: s.bg }}>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ color: s.color }}>{s.icon}</div>
                <div>
                  <div className="font-display text-lg">{s.name}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.handle}</div>
                </div>
                {s.badge && (
                  <span className="ml-auto text-xs px-2 py-1 rounded-lg font-bold"
                        style={{ background: 'rgba(0,255,128,0.15)', color: '#00ff80', border: '1px solid rgba(0,255,128,0.3)' }}>
                    {s.badge}
                  </span>
                )}
              </div>
              <div className="flex-1" />
              <a
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-center transition-all hover:opacity-90 block"
                style={{ background: s.color, color: s.name === 'X (Twitter)' ? '#000000' : '#ffffff' }}
              >
                {s.btn}
              </a>
            </div>
          ))}
        </div>

        {/* Community Showcase */}
        <div>
          <h2 className="font-display text-2xl mb-6">Community Showcase</h2>
          {projects.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="text-4xl mb-4">🎮</div>
              <p style={{ color: 'var(--text-muted)' }}>Sei der Erste, der sein Spiel teilt!</p>
              <Link href="/dashboard" className="glass-button-primary px-6 py-2.5 rounded-xl text-sm font-medium inline-block mt-4">
                Spiel generieren
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((p) => (
                <div key={p.id} className="glass-card p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-white truncate flex-1 mr-2">{p.name}</h3>
                    <span className="glass-badge text-xs flex-shrink-0 capitalize">{p.game_type}</span>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(p.created_at).toLocaleDateString('de-DE')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
