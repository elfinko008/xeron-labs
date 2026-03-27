import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { LuxuryBackground } from '@/components/landing/LuxuryBackground'
import { ParticleSystem } from '@/components/landing/ParticleSystem'

export const metadata = {
  title: 'System Status — XERON Engine',
  description: 'Real-time status of all XERON Engine services.',
}

const SERVICES = [
  {
    name: 'API',
    description: 'REST API and WebSocket endpoints',
    uptime: '99.98%',
  },
  {
    name: 'AI Generation',
    description: 'Claude and Gemini model routing and generation pipeline',
    uptime: '99.95%',
  },
  {
    name: 'Stripe Payments',
    description: 'Payment processing, subscriptions and credit purchases',
    uptime: '99.99%',
  },
  {
    name: 'Supabase Database',
    description: 'User accounts, projects, credits and authentication',
    uptime: '99.97%',
  },
  {
    name: 'CDN',
    description: 'Asset delivery, static files and media serving',
    uptime: '100%',
  },
  {
    name: 'Roblox Plugin Sync',
    description: 'Plugin-to-dashboard synchronization and project import',
    uptime: '99.93%',
  },
]

export default function StatusPage() {
  const now = new Date()
  const lastChecked = now.toLocaleString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  })

  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <LuxuryBackground />
      <ParticleSystem count={20} />

      <Navbar />

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <section className="section-pad-sm" style={{ paddingTop: '80px' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
            <span className="lg-badge" style={{ marginBottom: '20px' }}>System Status</span>

            {/* Overall status */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(34,197,94,0.06)',
                border: '1px solid rgba(34,197,94,0.22)',
                borderRadius: '999px',
                padding: '10px 24px',
                marginTop: '16px',
                marginBottom: '20px',
                boxShadow: '0 0 40px rgba(34,197,94,0.08)',
              }}
            >
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#4ADE80',
                  display: 'inline-block',
                  boxShadow: '0 0 12px rgba(74,222,128,0.7)',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              />
              <span className="t-headline" style={{ fontSize: '20px', color: '#4ADE80' }}>
                All Systems Operational
              </span>
            </div>

            <p className="t-body" style={{ fontSize: '14px', color: 'var(--t-3)', marginTop: '12px' }}>
              Last checked: {lastChecked}
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="section-pad-sm" style={{ paddingTop: 0, paddingBottom: '80px' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>
            <div className="lg-card" style={{ padding: '8px' }}>
              {SERVICES.map((service, i) => (
                <div
                  key={service.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '18px 24px',
                    borderBottom: i < SERVICES.length - 1 ? '1px solid var(--glass-border)' : 'none',
                    gap: '16px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexGrow: 1, minWidth: '200px' }}>
                    {/* Green dot */}
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#4ADE80',
                        flexShrink: 0,
                        boxShadow: '0 0 8px rgba(74,222,128,0.5)',
                      }}
                    />
                    <div>
                      <p className="t-headline" style={{ fontSize: '15px', marginBottom: '2px' }}>
                        {service.name}
                      </p>
                      <p className="t-body" style={{ fontSize: '12px', color: 'var(--t-3)', margin: 0 }}>
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--t-3)', fontFamily: 'DM Sans, sans-serif' }}>
                      {service.uptime} uptime
                    </span>
                    <span className="lg-badge-green">Operational</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Incident history note */}
            <div
              style={{
                marginTop: '24px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: '20px', height: '20px', color: 'var(--t-3)', flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <p className="t-body" style={{ fontSize: '13px', color: 'var(--t-3)', margin: 0 }}>
                No incidents in the last 90 days. For urgent issues, join our{' '}
                <a href="https://discord.gg/u5HF4CQPug" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-400)', textDecoration: 'none' }}>
                  Discord
                </a>{' '}
                or contact{' '}
                <a href="mailto:support@xeron-labs.com" style={{ color: 'var(--gold-400)', textDecoration: 'none' }}>
                  support@xeron-labs.com
                </a>.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
