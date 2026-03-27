import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { LuxuryBackground } from '@/components/landing/LuxuryBackground'
import { ParticleSystem } from '@/components/landing/ParticleSystem'

export const metadata = {
  title: 'FAQ — XERON Engine',
  description: 'Frequently asked questions about XERON Engine — credits, pricing, technical details and more.',
}

const CATEGORIES = [
  {
    name: 'General',
    items: [
      {
        q: 'What is XERON Engine?',
        a: 'XERON Engine is the most advanced AI-powered Roblox game builder. Describe your game in plain text and our AI generates professional Lua scripts, 3D game worlds, UI elements, and more — within minutes.',
      },
      {
        q: 'Who is XERON for?',
        a: "XERON is designed for Roblox developers of all levels — from beginners who don't know Lua to professionals who want to accelerate their workflow.",
      },
      {
        q: 'Do I need programming knowledge?',
        a: 'No! Describe your game in plain language. Our AI handles all the code. Experienced developers will find advanced features like Script Fix and Diagnose incredibly powerful too.',
      },
      {
        q: 'What languages does XERON support?',
        a: 'XERON is available in 7 languages: English, German, French, Spanish, Portuguese, Japanese, and Chinese. Your browser language is automatically detected.',
      },
    ],
  },
  {
    name: 'Credits & Pricing',
    items: [
      {
        q: 'What are Credits and how do they work?',
        a: 'Credits are the currency for AI generations. Each mode costs a certain amount: Diagnose (5cr), Scripts/UI/Clean (10cr), Fix (15–50cr), Game Generation (50cr). Your plan includes monthly credits that reset automatically.',
      },
      {
        q: 'How much does each generation cost?',
        a: 'Diagnose: 5cr | Script / UI / Clean: 10cr | Quick Fix: 15cr | Deep Fix: 50cr | Game Generation: 50cr',
      },
      {
        q: 'Do Credits expire?',
        a: 'Monthly plan credits reset each billing cycle. Purchased Credit Packs never expire.',
      },
      {
        q: 'What can I do with Credit Packs?',
        a: 'Credit Packs can be used for Scripts, UI, Fix, Clean and Diagnose modes. Game Generation requires an active Pro or Enterprise subscription.',
      },
      {
        q: 'Is there a free version?',
        a: 'Yes! The Free plan includes 10 credits/month for Scripts, UI, Fix, Clean and Diagnose. Game Generation requires Pro or Enterprise.',
      },
    ],
  },
  {
    name: 'Technical',
    items: [
      {
        q: 'How do I install the Roblox plugin?',
        a: 'Go to Dashboard → any generated project → click "Open in Roblox Studio". Or search "XERON Engine" on the Roblox Plugin Marketplace.',
      },
      {
        q: 'What does Fix mode do?',
        a: 'Fix mode analyzes broken Lua scripts and repairs them. Quick Fix uses Claude Haiku for simple issues, Deep Fix uses Claude Sonnet for complex problems.',
      },
      {
        q: 'How long does generation take?',
        a: 'Diagnose: under 30 seconds. Scripts/UI: under 60 seconds. Full game generation: 1–3 minutes. High-End Graphics: 2–5 minutes.',
      },
      {
        q: 'Can the AI create custom 3D models?',
        a: 'No. XERON works with Roblox Toolbox assets and primitives. It intelligently selects and positions assets from the Toolbox library.',
      },
    ],
  },
  {
    name: 'Account & Payment',
    items: [
      {
        q: 'How do I cancel my subscription?',
        a: 'Cancel anytime from Dashboard → Account → Plan → Cancel Plan. Your plan stays active until the end of the billing period.',
      },
      {
        q: 'Can I get a refund?',
        a: 'Digital content (Credits) is delivered immediately after purchase. By accepting the withdrawal waiver during purchase, the 14-day right of withdrawal expires upon immediate delivery per §356 Abs. 5 BGB.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <LuxuryBackground />
      <ParticleSystem count={20} />

      <Navbar />

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <section className="section-pad-sm" style={{ paddingTop: '80px' }}>
          <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
            <span className="lg-badge" style={{ marginBottom: '20px' }}>FAQ</span>
            <h1 className="t-display" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', marginTop: '16px', marginBottom: '20px' }}>
              Frequently Asked{' '}
              <span className="text-gold-gradient">Questions</span>
            </h1>
            <p className="t-body" style={{ maxWidth: '480px', margin: '0 auto', fontSize: '16px', color: 'var(--t-2)' }}>
              Everything you need to know about XERON Engine. Can&apos;t find your answer? Join our Discord.
            </p>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="section-pad-sm" style={{ paddingTop: 0, paddingBottom: '80px' }}>
          <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {CATEGORIES.map((cat) => (
              <div key={cat.name}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <h2 className="t-headline" style={{ fontSize: '1.1rem' }}>{cat.name}</h2>
                  <span className="lg-badge-plat">{cat.items.length} questions</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {cat.items.map((item) => (
                    <details
                      key={item.q}
                      style={{
                        background: 'var(--glass-1)',
                        backdropFilter: 'blur(60px)',
                        border: '1px solid var(--glass-border)',
                        borderTop: '1px solid var(--specular-top)',
                        borderRadius: '18px',
                        overflow: 'hidden',
                        transition: 'border-color 0.3s',
                      }}
                    >
                      <summary
                        style={{
                          padding: '18px 24px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px',
                          listStyle: 'none',
                          userSelect: 'none',
                        }}
                      >
                        <span className="t-headline" style={{ fontSize: '15px', fontWeight: 600 }}>{item.q}</span>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          style={{ width: '16px', height: '16px', color: 'var(--t-3)', flexShrink: 0 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div
                        style={{
                          padding: '0 24px 18px',
                          borderTop: '1px solid var(--glass-border)',
                        }}
                      >
                        <p className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.7', margin: '14px 0 0' }}>
                          {item.a}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}

            {/* Still have questions */}
            <div
              className="lg-card-static"
              style={{
                padding: '32px',
                textAlign: 'center',
                borderColor: 'var(--glass-border-gold)',
              }}
            >
              <h3 className="t-headline" style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Still Have Questions?</h3>
              <p className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', marginBottom: '20px' }}>
                Our team is available on Discord and by email.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="https://discord.gg/u5HF4CQPug"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-luxury"
                  style={{ padding: '12px 28px', fontSize: '14px' }}
                >
                  Join Discord
                </a>
                <a
                  href="mailto:support@xeron-labs.com"
                  className="btn-glass"
                  style={{ padding: '12px 28px', fontSize: '14px' }}
                >
                  Send Email
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
