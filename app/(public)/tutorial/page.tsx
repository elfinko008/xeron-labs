import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { LuxuryBackground } from '@/components/landing/LuxuryBackground'
import { ParticleSystem } from '@/components/landing/ParticleSystem'

export const metadata = {
  title: 'Tutorial — XERON Engine',
  description: 'Step-by-step guide for using XERON Engine. Learn how to generate games, scripts, and earn free credits.',
}

const STEPS = [
  {
    step: '01',
    title: 'Create Your Account',
    description:
      'Sign up at xeron-labs.com. The Free plan gives you 10 credits/month immediately — no credit card required.',
  },
  {
    step: '02',
    title: 'Choose Your Generation Mode',
    description:
      'Navigate to the Dashboard and select a mode: Game Generation (Pro+), Script, UI, Fix, Clean, or Diagnose. Each has different credit costs.',
  },
  {
    step: '03',
    title: 'Write Your Prompt',
    description:
      'Describe what you want in plain language. Include game type, size in Studs, visual style, gameplay mechanics, and any special features. The more detail, the better the result.',
  },
  {
    step: '04',
    title: 'Watch the AI Work',
    description:
      'A live terminal shows every step of the generation. The AI creates a detailed plan — terrain, buildings, scripts, lighting, assets — and executes it in real time.',
  },
  {
    step: '05',
    title: 'Import to Roblox Studio',
    description:
      'Once done, click "Open in Roblox Studio" or use the XERON Plugin. Search "XERON Engine" in the Roblox Plugin Marketplace to install it.',
  },
  {
    step: '06',
    title: 'Iterate & Refine',
    description:
      'Use Fix mode to repair scripts, Script mode to add features, and Diagnose to understand what each part does. Build on top of the AI output.',
  },
]

const MODES = [
  { name: 'Game Generation', cost: '50 credits', plan: 'Pro+', desc: 'Full game world with terrain, buildings, scripts, lighting and assets.' },
  { name: 'Script', cost: '10 credits', plan: 'All', desc: 'Generate Lua scripts for any gameplay mechanic.' },
  { name: 'UI', cost: '10 credits', plan: 'All', desc: 'Create complete UI layouts with buttons, frames and menus.' },
  { name: 'Fix', cost: '15–50 credits', plan: 'All', desc: 'Analyze and repair broken Lua scripts. Quick Fix (Haiku) or Deep Fix (Sonnet).' },
  { name: 'Clean', cost: '10 credits', plan: 'All', desc: 'Optimize and refactor existing code for readability and performance.' },
  { name: 'Diagnose', cost: '5 credits', plan: 'All', desc: 'Get a plain-language explanation of what any script does.' },
]

const CREDIT_COSTS = [
  { action: 'Diagnose', credits: 5 },
  { action: 'Script / UI / Clean', credits: 10 },
  { action: 'Quick Fix', credits: 15 },
  { action: 'Deep Fix', credits: 50 },
  { action: 'Game Generation', credits: 50 },
]

export default function TutorialPage() {
  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <LuxuryBackground />
      <ParticleSystem count={20} />

      <Navbar />

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <section className="section-pad-sm" style={{ paddingTop: '80px' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
            <span className="lg-badge" style={{ marginBottom: '20px' }}>Tutorial</span>
            <h1 className="t-display" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', marginTop: '16px', marginBottom: '20px' }}>
              Get Started with{' '}
              <span className="text-gold-gradient">XERON Engine</span>
            </h1>
            <p className="t-body" style={{ maxWidth: '520px', margin: '0 auto', fontSize: '17px', color: 'var(--t-2)' }}>
              From zero to a complete Roblox game in minutes. Follow this guide to master XERON Engine.
            </p>
          </div>
        </section>

        {/* Step-by-step guide */}
        <section className="section-pad-sm" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>
            <h2 className="t-headline" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Step-by-Step Guide</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {STEPS.map((step) => (
                <div key={step.step} className="lg-card" style={{ padding: '24px 28px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <span
                    style={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontSize: '2.5rem',
                      fontWeight: 700,
                      color: 'var(--gold-400)',
                      lineHeight: 1,
                      opacity: 0.5,
                      flexShrink: 0,
                    }}
                  >
                    {step.step}
                  </span>
                  <div>
                    <h3 className="t-headline" style={{ fontSize: '17px', marginBottom: '8px' }}>{step.title}</h3>
                    <p className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.7', margin: 0 }}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Generation Modes */}
        <section className="section-pad-sm" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>
            <h2 className="t-headline" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Generation Modes</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              {MODES.map((mode) => (
                <div key={mode.name} className="lg-card-holo" style={{ padding: '22px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span className="t-headline" style={{ fontSize: '15px' }}>{mode.name}</span>
                    <span className="lg-badge">{mode.cost}</span>
                  </div>
                  <p className="t-body" style={{ fontSize: '13px', color: 'var(--t-2)', marginBottom: '10px', lineHeight: '1.6' }}>{mode.desc}</p>
                  <span className="t-label" style={{ fontSize: '11px', color: 'var(--t-3)' }}>Requires: {mode.plan}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Credit Costs */}
        <section className="section-pad-sm" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>
            <div className="lg-card" style={{ padding: '28px 32px' }}>
              <h2 className="t-headline" style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Credit Cost Reference</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {CREDIT_COSTS.map((item, i) => (
                  <div
                    key={item.action}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom: i < CREDIT_COSTS.length - 1 ? '1px solid var(--glass-border)' : 'none',
                    }}
                  >
                    <span className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)' }}>{item.action}</span>
                    <span
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '13px',
                        color: 'var(--gold-400)',
                        fontWeight: 700,
                      }}
                    >
                      {item.credits} cr
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FREE CREDITS Section */}
        <section className="section-pad-sm" style={{ paddingTop: 0, paddingBottom: '80px' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>
            <div
              className="lg-card"
              style={{
                padding: '40px',
                border: '1px solid var(--glass-border-gold)',
              }}
            >
              {/* Section header */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <span className="lg-badge" style={{ marginBottom: '16px' }}>Free Credits</span>
                <h2 className="t-headline" style={{ fontSize: '1.6rem', marginBottom: '10px' }}>
                  FREE CREDITS — How to Get Free Credits
                </h2>
                <p className="t-body" style={{ fontSize: '15px', color: 'var(--t-2)', maxWidth: '520px', margin: '0 auto' }}>
                  Earn 10 free credits for every social platform you follow. Maximum 50 credits total.
                </p>
              </div>

              {/* Platforms */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '12px',
                  marginBottom: '28px',
                }}
              >
                {[
                  { name: 'TikTok', handle: '@xeron.labs', color: '#EE1D52' },
                  { name: 'YouTube', handle: '@xeron-labs', color: '#FF0000' },
                  { name: 'Discord', handle: 'XERON Server', color: '#5865F2' },
                  { name: 'Instagram', handle: '@xeron.labs', color: '#E1306C' },
                  { name: 'X', handle: '@xer0nlabs', color: '#ffffff' },
                ].map((p) => (
                  <div
                    key={p.name}
                    style={{
                      background: 'rgba(212,160,23,0.04)',
                      border: '1px solid rgba(212,160,23,0.15)',
                      borderRadius: '14px',
                      padding: '14px 16px',
                      textAlign: 'center',
                    }}
                  >
                    <p style={{ fontSize: '14px', fontWeight: 700, color: p.color, marginBottom: '4px' }}>{p.name}</p>
                    <p style={{ fontSize: '11px', color: 'var(--t-3)', fontFamily: 'JetBrains Mono, monospace' }}>{p.handle}</p>
                    <p style={{ fontSize: '12px', color: 'var(--gold-400)', fontWeight: 700, marginTop: '6px' }}>+10 Credits</p>
                  </div>
                ))}
              </div>

              {/* Max note */}
              <div
                style={{
                  background: 'rgba(212,160,23,0.06)',
                  border: '1px solid rgba(212,160,23,0.20)',
                  borderRadius: '14px',
                  padding: '14px 20px',
                  marginBottom: '28px',
                  textAlign: 'center',
                }}
              >
                <p className="t-body" style={{ fontSize: '14px', color: 'var(--t-1)', margin: 0 }}>
                  <strong>Maximum: 50 Credits</strong> (5 platforms × 10 Credits) — Each platform can only be redeemed once.
                </p>
              </div>

              {/* Steps */}
              <div style={{ marginBottom: '28px' }}>
                <p className="t-label" style={{ marginBottom: '14px', color: 'var(--t-3)' }}>How to claim</p>
                <ol style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    'Follow us on one or more platforms above',
                    'Join our Discord: discord.gg/u5HF4CQPug',
                    'Create a ticket in the #credits-beantragen channel',
                    'Select which platforms you followed',
                    'Write your username for each platform',
                    'Wait up to 24 hours — our team reviews manually',
                  ].map((s, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span
                        style={{
                          minWidth: '22px', height: '22px', borderRadius: '50%',
                          background: 'rgba(212,160,23,0.12)', border: '1px solid rgba(212,160,23,0.28)',
                          color: 'var(--gold-400)', fontSize: '11px', fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </span>
                      <span className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.6' }}>{s}</span>
                    </li>
                  ))}
                </ol>
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
