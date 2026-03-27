import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { LuxuryBackground } from '@/components/landing/LuxuryBackground'
import { ParticleSystem } from '@/components/landing/ParticleSystem'
import { createAdminClient } from '@/lib/supabase'

export const metadata = {
  title: 'Changelog — XERON Engine',
  description: 'Track every update, improvement and new feature in XERON Engine.',
}

interface ChangelogEntry {
  id: string
  version: string
  title: string
  description: string
  type: string
  created_at: string
}

const FALLBACK_ENTRIES: ChangelogEntry[] = [
  {
    id: '1',
    version: 'v7.0.0',
    title: 'XERON Engine v7 — Ultra-Luxury Edition',
    description:
      'Major overhaul with Liquid Glass design system, support for 7 languages, improved AI routing between Claude Haiku, Claude Sonnet and Gemini, new Ultra-Luxury UI, particle system, holographic card effects, and complete design token rework.',
    type: 'major',
    created_at: '2026-03-01T00:00:00Z',
  },
  {
    id: '2',
    version: 'v6.5.0',
    title: 'High-End Graphics Mode',
    description:
      'New Pro-only High-End Graphics generation mode powered by Claude Sonnet. Generates photorealistic lighting setups, advanced material configurations, and high-detail asset placement for premium Roblox experiences.',
    type: 'feature',
    created_at: '2026-01-15T00:00:00Z',
  },
  {
    id: '3',
    version: 'v6.0.0',
    title: 'Multi-Language Support',
    description:
      'Platform now available in 7 languages: English, German, French, Spanish, Portuguese, Japanese, and Chinese. Your browser language is automatically detected and applied on first visit.',
    type: 'feature',
    created_at: '2025-11-20T00:00:00Z',
  },
]

const TYPE_BADGE: Record<string, { label: string; cls: string }> = {
  major:   { label: 'Major',   cls: 'lg-badge' },
  feature: { label: 'Feature', cls: 'lg-badge-plat' },
  fix:     { label: 'Fix',     cls: 'lg-badge-green' },
  patch:   { label: 'Patch',   cls: 'lg-badge-green' },
}

async function getEntries(): Promise<ChangelogEntry[]> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('changelog')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    if (error || !data || data.length === 0) return FALLBACK_ENTRIES
    return data as ChangelogEntry[]
  } catch {
    return FALLBACK_ENTRIES
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function ChangelogPage() {
  const entries = await getEntries()

  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <LuxuryBackground />
      <ParticleSystem count={20} />

      <Navbar />

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <section className="section-pad-sm" style={{ paddingTop: '80px' }}>
          <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
            <span className="lg-badge" style={{ marginBottom: '20px' }}>Changelog</span>
            <h1 className="t-display" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', marginTop: '16px', marginBottom: '20px' }}>
              What&apos;s New in{' '}
              <span className="text-gold-gradient">XERON</span>
            </h1>
            <p className="t-body" style={{ maxWidth: '480px', margin: '0 auto', fontSize: '16px', color: 'var(--t-2)' }}>
              Every update, improvement and new feature — tracked in one place.
            </p>
          </div>
        </section>

        {/* Entries */}
        <section className="section-pad-sm" style={{ paddingTop: 0, paddingBottom: '80px' }}>
          <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ position: 'relative' }}>
              {/* Timeline line */}
              <div
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '0',
                  bottom: '0',
                  width: '1px',
                  background: 'linear-gradient(to bottom, var(--glass-border-gold), transparent)',
                  opacity: 0.4,
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingLeft: '52px' }}>
                {entries.map((entry) => {
                  const badge = TYPE_BADGE[entry.type] ?? TYPE_BADGE.feature
                  return (
                    <div key={entry.id} style={{ position: 'relative' }}>
                      {/* Timeline dot */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '-40px',
                          top: '28px',
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: 'var(--gold-400)',
                          border: '2px solid var(--void)',
                          boxShadow: '0 0 10px rgba(212,160,23,0.5)',
                        }}
                      />

                      <div className="lg-card" style={{ padding: '28px 32px' }}>
                        {/* Version + badges + date */}
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                          <span
                            style={{
                              fontFamily: '"JetBrains Mono", monospace',
                              fontSize: '13px',
                              fontWeight: 700,
                              color: 'var(--gold-400)',
                              background: 'rgba(212,160,23,0.10)',
                              border: '1px solid rgba(212,160,23,0.25)',
                              borderRadius: '8px',
                              padding: '3px 10px',
                            }}
                          >
                            {entry.version}
                          </span>
                          <span className={badge.cls}>{badge.label}</span>
                          <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--t-3)', fontFamily: 'DM Sans, sans-serif' }}>
                            {formatDate(entry.created_at)}
                          </span>
                        </div>

                        <h3 className="t-headline" style={{ fontSize: '18px', marginBottom: '10px' }}>
                          {entry.title}
                        </h3>
                        <p className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.7', margin: 0 }}>
                          {entry.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
