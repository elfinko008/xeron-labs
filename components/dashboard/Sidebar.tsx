'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient, type Profile } from '@/lib/supabase'

const PLAN_MAX_CREDITS: Record<string, number> = {
  free: 10,
  starter: 100,
  pro: 500,
  enterprise: 1000,
}

export default function DashboardSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  const router = useRouter()
  const maxCredits = PLAN_MAX_CREDITS[profile.plan] ?? 10
  const creditPct = Math.min((profile.credits / maxCredits) * 100, 100)
  const purchasedCredits = profile.purchased_credits ?? 0
  const discordClaimed = profile.discord_credits_claimed ?? false

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navLinks = [
    {
      href: '/dashboard',
      label: 'Generieren',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      ),
    },
    {
      href: '/dashboard/projects',
      label: 'Projekte',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
      ),
    },
    {
      href: '/dashboard/account',
      label: 'Account',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
    },
  ]

  return (
    <aside className="glass-sidebar w-70 flex-shrink-0 flex flex-col" style={{ width: 280 }}>
      {/* Logo */}
      <div className="px-6 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <Link href="/" className="font-display text-xl">
          <span className="text-gradient-red">XERON</span>
          <span className="text-white"> Engine</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto">
        {/* Navigation */}
        <nav className="space-y-1">
          {navLinks.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all"
                style={{
                  background: active ? 'rgba(233,69,96,0.15)' : 'transparent',
                  color: active ? '#ffffff' : 'var(--text-secondary)',
                  border: active ? '1px solid rgba(233,69,96,0.3)' : '1px solid transparent',
                }}
              >
                {link.icon}
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="my-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />

        {/* Credits */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Abo-Credits</span>
            <span className="text-sm font-display" style={{ color: 'var(--accent-red)' }}>
              {profile.credits}
            </span>
          </div>
          <div className="progress-bar mb-3">
            <div className="progress-bar-fill" style={{ width: `${creditPct}%` }} />
          </div>
          {purchasedCredits > 0 && (
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Gekaufte Credits</span>
              <span className="text-xs font-medium" style={{ color: '#00d4ff' }}>{purchasedCredits}</span>
            </div>
          )}
          <div className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
            Plan: <span className="capitalize text-white">{profile.plan}</span>
            {' · '}{profile.credits} / {maxCredits}
          </div>
          <Link
            href="/dashboard/account?tab=credits"
            className="glass-button-primary w-full py-2 rounded-xl text-xs font-semibold text-center block"
          >
            Credits kaufen
          </Link>
          <Link
            href="/dashboard/account?tab=plan"
            className="glass-button w-full py-2 rounded-xl text-xs font-semibold text-center block mt-2"
          >
            Plan upgraden
          </Link>
        </div>

        {/* Discord Bonus */}
        <div className="glass-card p-4">
          <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Bonusse</div>
          {discordClaimed ? (
            <div className="flex items-center gap-2 text-xs" style={{ color: '#00ff80' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Discord verbunden ✓
            </div>
          ) : (
            <a
              href="/api/discord/connect"
              className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl transition-all"
              style={{ background: '#5865F2', color: '#ffffff' }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/>
              </svg>
              Discord beitreten +10 Credits
            </a>
          )}
        </div>

        {/* Plugin */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Roblox Plugin</span>
            <span className="glass-badge-green text-xs">Bereit</span>
          </div>
          <a
            href="/plugin/init.server.lua"
            download
            className="flex items-center gap-2 text-xs transition-colors hover:text-white"
            style={{ color: 'var(--text-muted)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Plugin herunterladen
          </a>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="text-xs mb-3 truncate" style={{ color: 'var(--text-muted)' }}>
          {profile.email}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm transition-colors hover:text-white w-full"
          style={{ color: 'var(--text-secondary)' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Abmelden
        </button>
      </div>
    </aside>
  )
}
