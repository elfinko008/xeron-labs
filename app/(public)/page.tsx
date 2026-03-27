import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Sparkles, Code2, Layout, Zap, Globe, Star, ChevronDown, Play } from 'lucide-react'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { LuxuryBackground } from '@/components/landing/LuxuryBackground'
import { ParticleSystem } from '@/components/landing/ParticleSystem'
import PromoBanner from '@/components/landing/PromoBanner'
import { ScrollReveal } from '@/components/landing/ScrollReveal'
import StylePresetsShowcase from '@/components/landing/StylePresetsShowcase'
import { LandingClientSection } from '@/components/landing/LandingClientSection'

const PricingCalculator = dynamic(() => import('@/components/landing/PricingCalculator'))
const FeatureCard3D = dynamic(() => import('@/components/landing/FeatureCard3D'))
const AIThinkingVisualizer = dynamic(() => import('@/components/landing/AIThinkingVisualizer'))
const ComparisonSlider = dynamic(() => import('@/components/landing/ComparisonSlider'))
const DemoTerminal = dynamic(() => import('@/components/landing/DemoTerminal'))

const PLANS = [
  {
    name: 'Free', price: 0, color: 'var(--t-3)',
    credits: 10, model: 'Gemini Flash Lite',
    features: ['10 Credits/month', '3 Projects', 'Scripts & UI', 'Gemini AI', 'Community support'],
    disabled: ['Game generation', 'API access', 'Export bundle'],
  },
  {
    name: 'Starter', price: 4.99, color: 'var(--plat-400)',
    credits: 75, model: 'Gemini Flash',
    features: ['75 Credits/month', '15 Projects', 'Prompt templates', '2x faster queue', 'Batch scripts'],
    disabled: ['Game generation', 'AI Chat', 'API access'],
  },
  {
    name: 'Pro', price: 14.99, color: 'var(--gold-400)', popular: true,
    credits: 500, model: 'Claude Haiku/Sonnet',
    features: ['500 Credits/month', 'Unlimited projects', 'Game generation ✦', 'High-End Graphics', 'AI Chat', 'API (100/h)', 'Affiliate program'],
    disabled: [],
  },
  {
    name: 'Enterprise', price: 39.99, color: 'var(--gold-300)',
    credits: 2000, model: 'Claude Sonnet 4.6',
    features: ['2000 Credits/month', 'Unlimited projects', 'Dedicated support', 'Custom API keys', 'White-label', 'API (500/h)'],
    disabled: [],
  },
]

const CREDIT_PACKS = [
  { name: 'Mini',    credits: 50,   price: 1.99  },
  { name: 'Starter', credits: 150,  price: 4.99  },
  { name: 'Value',   credits: 400,  price: 11.99 },
  { name: 'Power',   credits: 1000, price: 24.99 },
  { name: 'Mega',    credits: 3000, price: 64.99 },
]

const FAQ = [
  { q: 'What is XERON Engine?', a: 'XERON Engine is the most advanced AI-powered Roblox game builder. Describe your game in plain text and our AI generates professional Lua scripts, 3D game worlds, UI elements, and more — within minutes.' },
  { q: 'Who is it for?', a: 'XERON is designed for Roblox developers of all levels — from beginners who don\'t know Lua to professionals who want to accelerate their workflow.' },
  { q: 'Do I need programming knowledge?', a: 'No! Describe your game in plain language. Our AI handles all the code. Experienced developers will find advanced features like Script Fix and Diagnose incredibly powerful too.' },
  { q: 'What are Credits and how do they work?', a: 'Credits are the currency for AI generations. Each mode costs a certain amount: Scripts (10cr), UI (10cr), Fix (15-50cr), Clean (10cr), Diagnose (5cr), Game Generation (50cr). Your plan includes monthly credits that reset automatically.' },
  { q: 'What can I do with Credit Packs?', a: 'Credit Packs can ONLY be used for Scripts, UI, Fix, Clean and Diagnose modes. Game Generation requires an active Pro or Enterprise subscription.' },
  { q: 'How much does each generation cost?', a: 'Diagnose: 5cr | Script/UI/Clean: 10cr | Fix: 15-50cr | Game Generation: 50cr' },
  { q: 'Do Credits expire?', a: 'Monthly plan credits reset each billing cycle. Purchased Credit Packs never expire.' },
  { q: 'Is there a free version?', a: 'Yes! The Free plan includes 10 credits/month for Scripts, UI, Fix, Clean and Diagnose. Game Generation requires Pro or Enterprise.' },
  { q: 'How do I install the plugin?', a: 'Go to Dashboard → any generated project → click "Open in Roblox Studio". Or search "XERON Engine" on the Roblox Plugin Marketplace.' },
  { q: 'What does Fix mode do?', a: 'Fix mode analyzes broken Lua scripts and repairs them. Quick Fix uses Claude Haiku, Deep Fix uses Claude Sonnet for complex issues.' },
  { q: 'How long does generation take?', a: 'Diagnose: under 30 seconds. Scripts: under 60 seconds. Full game generation: 1-3 minutes. High-End Graphics: 2-5 minutes.' },
  { q: 'Can the AI create custom 3D models?', a: 'No. XERON works with Roblox Toolbox assets and primitives. It intelligently selects and positions assets from the Toolbox library.' },
  { q: 'How do I cancel my subscription?', a: 'Cancel anytime from Dashboard → Account → Plan → Cancel Plan. Your plan stays active until end of the billing period.' },
  { q: 'Can I get a refund?', a: 'Digital content (Credits) is delivered immediately after purchase. By accepting the withdrawal waiver during purchase, the 14-day right of withdrawal expires upon immediate delivery per §356 Abs. 5 BGB.' },
  { q: 'What languages does XERON support?', a: 'XERON is available in 7 languages: English, German, French, Spanish, Portuguese, Japanese, and Chinese. Your browser language is automatically detected.' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Write Your Prompt', desc: 'Describe your game in plain language. Be as detailed or as vague as you like.' },
  { step: '02', title: 'AI Plans Systematically', desc: 'Watch our AI create a detailed plan: terrain, buildings, scripts, lighting, assets.' },
  { step: '03', title: 'Watch Live Progress', desc: 'A live terminal shows every step. See your game come to life in real time.' },
  { step: '04', title: 'Import to Studio', desc: 'Click Import in the XERON plugin. Your complete game appears in Roblox Studio.' },
]

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <LuxuryBackground />
      <ParticleSystem count={40} />
      <PromoBanner />
      <Navbar />

      {/* ── HERO ──────────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 'calc(var(--promo-h, 0px) + 68px + 52px)' as any, paddingBottom: 80, position: 'relative' }}>
        <LandingClientSection />

        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 1 }}>
          <div style={{ color: 'var(--t-3)', fontSize: 12, letterSpacing: '0.1em', marginBottom: 8 }}>DISCOVER XERON</div>
          <ChevronDown size={20} color="var(--gold-400)" style={{ margin: '0 auto', display: 'block' }} />
        </div>
      </section>

      {/* ── AI THINKING VISUALIZER ─────────────────── */}
      <section className="section-pad" style={{ position: 'relative' }}>
        <div className="container-luxury">
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div className="lg-badge" style={{ marginBottom: 16, display: 'inline-flex' }}><Sparkles size={12} />  Under The Hood</div>
              <h2 className="t-headline" style={{ fontSize: 'clamp(32px,4vw,52px)', marginBottom: 16 }}>Watch the AI Think</h2>
              <p className="t-body" style={{ maxWidth: 480, margin: '0 auto' }}>Our AI systematically plans every aspect of your game before writing a single line of code.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <AIThinkingVisualizer />
          </ScrollReveal>
        </div>
      </section>

      {/* ── LIVE DEMO ─────────────────────────────── */}
      <section id="demo" className="section-pad">
        <div className="container-luxury">
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div className="lg-badge" style={{ marginBottom: 16, display: 'inline-flex' }}><Play size={12} />  Try It Now</div>
              <h2 className="t-headline" style={{ fontSize: 'clamp(32px,4vw,52px)', marginBottom: 16 }}>See It In Action</h2>
              <p className="t-body" style={{ maxWidth: 480, margin: '0 auto' }}>Select a preset and watch XERON plan and generate a complete Roblox game in real time.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <DemoTerminal />
          </ScrollReveal>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────── */}
      <section className="section-pad-sm">
        <div className="container-luxury">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
            {[
              { value: '150+', label: 'Games Created', icon: '✦' },
              { value: '2 Min', label: 'Avg. Generation', icon: '⚡' },
              { value: '6', label: 'AI Modes', icon: '◈' },
              { value: '7', label: 'Languages', icon: '🌐' },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.08}>
                <div className="lg-card-holo" style={{ padding: 32, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 8, color: 'var(--gold-400)' }}>{stat.icon}</div>
                  <div className="t-display" style={{ fontSize: 42 }}>{stat.value}</div>
                  <div className="t-label" style={{ marginTop: 8 }}>{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────── */}
      <section id="features" className="section-pad">
        <div className="container-luxury">
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div className="lg-badge" style={{ marginBottom: 16, display: 'inline-flex' }}><Sparkles size={12} />  Everything You Need</div>
              <h2 className="t-headline" style={{ fontSize: 'clamp(32px,4vw,52px)', marginBottom: 16 }}>Built To Build</h2>
              <p className="t-body" style={{ maxWidth: 520, margin: '0 auto' }}>Six powerful AI modes. One platform. Every Roblox creation you can imagine.</p>
            </div>
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 24 }}>
            {[
              { icon: '✦', title: 'AI Game Builder', desc: 'Describe any game world and our AI generates a complete, playable Roblox game — terrain, buildings, scripts, spawn points and all.', badge: 'Pro+' },
              { icon: '◈', title: 'High-End Graphics', desc: 'Atmospheric lighting, dynamic shadows, weather systems, and cinematic post-processing. Games that look unlike anything in Roblox.', badge: 'Pro+' },
              { icon: '⚡', title: 'Live Studio Plugin', desc: 'Our Roblox Studio plugin imports AI-generated content with one click. No copy-paste, no file transfers. Pure magic.', badge: 'All Plans' },
              { icon: '⊞', title: '6 AI Modes', desc: 'Generate, Script, UI, Fix, Clean, Diagnose — a complete AI toolkit for every stage of Roblox development.', badge: 'All Plans' },
            ].map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 0.1}>
                <FeatureCard3D icon={f.icon} title={f.title} desc={f.desc} badge={f.badge} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON SLIDER ─────────────────────── */}
      <section className="section-pad">
        <div className="container-luxury">
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 className="t-headline" style={{ fontSize: 'clamp(32px,4vw,52px)', marginBottom: 16 }}>The XERON Difference</h2>
              <p className="t-body" style={{ maxWidth: 480, margin: '0 auto' }}>Drag the slider to see what AI-powered game building looks like.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div style={{ borderRadius: 32, overflow: 'hidden', maxWidth: 800, margin: '0 auto' }}>
              <ComparisonSlider />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────── */}
      <section className="section-pad">
        <div className="container-luxury">
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <h2 className="t-headline" style={{ fontSize: 'clamp(32px,4vw,52px)', marginBottom: 16 }}>From Idea to Game in 2 Minutes</h2>
            </div>
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
            {HOW_IT_WORKS.map((step, i) => (
              <ScrollReveal key={step.step} delay={i * 0.12}>
                <div className="lg-card" style={{ padding: 28, textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, fontWeight: 700, color: 'var(--gold-400)', opacity: 0.4, marginBottom: 12, lineHeight: 1 }}>{step.step}</div>
                  <div className="t-headline" style={{ fontSize: 17, marginBottom: 10 }}>{step.title}</div>
                  <p className="t-body" style={{ fontSize: 14 }}>{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STYLE PRESETS ─────────────────────────── */}
      <section className="section-pad-sm">
        <div className="container-luxury">
          <ScrollReveal>
            <h2 className="t-headline" style={{ fontSize: 32, marginBottom: 24, textAlign: 'center' }}>Style Presets</h2>
          </ScrollReveal>
          <StylePresetsShowcase />
        </div>
      </section>

      {/* ── ROI CALCULATOR ────────────────────────── */}
      <section className="section-pad">
        <div className="container-luxury">
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 className="t-headline" style={{ fontSize: 'clamp(32px,4vw,52px)', marginBottom: 16 }}>See Your Savings</h2>
              <p className="t-body" style={{ maxWidth: 480, margin: '0 auto' }}>Calculate how much time and money XERON saves your studio every month.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
              <PricingCalculator />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────── */}
      <section id="pricing" className="section-pad">
        <div className="container-luxury">
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div className="lg-badge" style={{ marginBottom: 16, display: 'inline-flex' }}><Star size={12} />  Simple Pricing</div>
              <h2 className="t-headline" style={{ fontSize: 'clamp(32px,4vw,52px)', marginBottom: 16 }}>Start Free, Scale As You Grow</h2>
            </div>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 48 }}>
            {PLANS.map((plan, i) => (
              <ScrollReveal key={plan.name} delay={i * 0.08}>
                <div className={`lg-card${plan.popular ? ' plan-card-active' : ''}`} style={{ padding: 28, position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {plan.popular && (
                    <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
                      <span className="lg-badge" style={{ background: 'var(--gold-500)', color: '#0A0900', borderColor: 'transparent' }}>Most Popular</span>
                    </div>
                  )}
                  <div style={{ marginBottom: 20 }}>
                    <div className="t-label" style={{ marginBottom: 8 }}>{plan.name}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, fontWeight: 700, color: plan.color }}>
                        {plan.price === 0 ? 'Free' : `${plan.price.toFixed(2).replace('.', ',')}€`}
                      </span>
                      {plan.price > 0 && <span className="t-body" style={{ fontSize: 13 }}>/mo</span>}
                    </div>
                    <div style={{ color: 'var(--t-3)', fontSize: 13, marginTop: 4 }}>{plan.credits} cr/month · {plan.model}</div>
                  </div>
                  <div style={{ flex: 1, marginBottom: 24 }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8, fontSize: 13, color: 'var(--t-2)' }}>
                        <span style={{ color: 'var(--gold-400)', flexShrink: 0 }}>✓</span> {f}
                      </div>
                    ))}
                    {plan.disabled.map(f => (
                      <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8, fontSize: 13, color: 'var(--t-4)' }}>
                        <span style={{ flexShrink: 0 }}>✗</span> {f}
                      </div>
                    ))}
                  </div>
                  <Link href="/shop" className={plan.popular ? 'btn-luxury' : 'btn-glass'} style={{ textAlign: 'center', fontSize: 14 }}>
                    {plan.price === 0 ? 'Start Free' : `Get ${plan.name}`}
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Credit packs */}
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h3 className="t-headline" style={{ fontSize: 24, marginBottom: 8 }}>Credit Packs</h3>
              <p style={{ color: 'var(--t-3)', fontSize: 14 }}>Top-up for Scripts & UI. No subscription required.</p>
            </div>
          </ScrollReveal>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
            {CREDIT_PACKS.map(pack => (
              <ScrollReveal key={pack.name}>
                <Link href="/shop" style={{ textDecoration: 'none' }}>
                  <div className="lg-card" style={{ padding: '20px 24px', textAlign: 'center', minWidth: 140 }}>
                    <div style={{ color: 'var(--gold-400)', fontSize: 18, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>🪙 {pack.credits}</div>
                    <div className="t-label" style={{ margin: '6px 0 10px' }}>{pack.name} Pack</div>
                    <div style={{ color: 'var(--t-1)', fontSize: 16, fontWeight: 600 }}>{pack.price.toFixed(2).replace('.', ',')}€</div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
          <div style={{ textAlign: 'center', padding: '12px 16px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 12, maxWidth: 600, margin: '0 auto 32px' }}>
            <span style={{ color: '#F87171', fontSize: 13 }}>
              ⚠ Credit Packs are only usable for Scripts & UI. Game Generation requires a Pro or Enterprise plan.
            </span>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────── */}
      <section id="faq" className="section-pad">
        <div className="container-luxury" style={{ maxWidth: 800 }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <h2 className="t-headline" style={{ fontSize: 'clamp(32px,4vw,48px)', marginBottom: 16 }}>Frequently Asked Questions</h2>
            </div>
          </ScrollReveal>
          <FAQAccordion faq={FAQ} />
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────── */}
      <section className="section-pad">
        <div className="container-luxury">
          <ScrollReveal>
            <div className="lg-card-holo" style={{ padding: '80px 48px', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
              <div className="lg-badge-pulse" style={{ marginBottom: 24, display: 'inline-flex' }}><Sparkles size={12} />  The Future of Roblox</div>
              <h2 className="t-display" style={{ fontSize: 'clamp(36px,5vw,64px)', marginBottom: 24 }}>
                Start Building.<br />
                <span className="text-gold-gradient">Start Free.</span>
              </h2>
              <p className="t-body" style={{ fontSize: 18, maxWidth: 480, margin: '0 auto 40px' }}>
                Join thousands of creators who build better games, faster with XERON.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/register" className="btn-luxury btn-luxury-pulse" style={{ fontSize: 16, padding: '16px 44px' }}>
                  <Sparkles size={18} /> Get Started Free
                </Link>
                <Link href="/tutorial" className="btn-glass" style={{ fontSize: 16, padding: '16px 32px' }}>
                  View Tutorial
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function FAQAccordion({ faq }: { faq: Array<{ q: string; a: string }> }) {
  // Server-side render as static list
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {faq.map((item, i) => (
        <ScrollReveal key={i} delay={i * 0.03}>
          <details className="lg-card-static" style={{ overflow: 'hidden' }}>
            <summary style={{ padding: '18px 24px', cursor: 'pointer', color: 'var(--t-1)', fontSize: 15, fontFamily: "'DM Sans',sans-serif", fontWeight: 500, display: 'flex', justifyContent: 'space-between', alignItems: 'center', listStyle: 'none' }}>
              {item.q}
              <span style={{ color: 'var(--gold-400)', flexShrink: 0, fontSize: 20, lineHeight: 1, marginLeft: 12 }}>+</span>
            </summary>
            <div style={{ padding: '0 24px 18px', color: 'var(--t-2)', fontSize: 14, lineHeight: 1.7 }}>{item.a}</div>
          </details>
        </ScrollReveal>
      ))}
    </div>
  )
}
