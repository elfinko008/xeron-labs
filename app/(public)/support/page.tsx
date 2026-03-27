import Link from 'next/link'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { LuxuryBackground } from '@/components/landing/LuxuryBackground'
import { ParticleSystem } from '@/components/landing/ParticleSystem'

export const metadata = {
  title: 'Support — XERON Engine',
  description: 'Get help with XERON Engine. Contact us via Discord, Email, or check our Documentation and FAQ.',
}

export default function SupportPage() {
  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <LuxuryBackground />
      <ParticleSystem count={20} />

      <Navbar />

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <section className="section-pad-sm" style={{ paddingTop: '80px' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
            <span className="lg-badge" style={{ marginBottom: '20px' }}>Support</span>
            <h1 className="t-display" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', marginTop: '16px', marginBottom: '20px' }}>
              How Can We Help?
            </h1>
            <p className="t-body" style={{ maxWidth: '500px', margin: '0 auto', fontSize: '17px', color: 'var(--t-2)' }}>
              We&apos;re here to help you get the most out of XERON Engine.
            </p>
          </div>
        </section>

        {/* Status banner */}
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px 32px' }}>
          <Link href="/status" style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: 'rgba(34,197,94,0.06)',
                border: '1px solid rgba(34,197,94,0.20)',
                borderRadius: '16px',
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'border-color 0.3s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#4ADE80',
                    display: 'inline-block',
                    boxShadow: '0 0 8px rgba(74,222,128,0.6)',
                  }}
                />
                <span className="t-body" style={{ fontSize: '14px', color: 'var(--t-1)' }}>
                  All Systems Operational
                </span>
              </div>
              <span className="lg-badge-green">View Status</span>
            </div>
          </Link>
        </div>

        {/* Contact Cards */}
        <section className="section-pad-sm" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>

              {/* Discord Support */}
              <div className="lg-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                  style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: 'rgba(88,101,242,0.12)', border: '1px solid rgba(88,101,242,0.28)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px', height: '24px', color: '#5865F2' }}>
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
                  </svg>
                </div>
                <div style={{ flexGrow: 1 }}>
                  <h3 className="t-headline" style={{ fontSize: '17px', marginBottom: '8px' }}>Discord Support</h3>
                  <p className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.6' }}>
                    Fastest response. Join our server and open a support ticket in #support.
                  </p>
                </div>
                <a
                  href="https://discord.gg/u5HF4CQPug"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-luxury"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px 20px', fontSize: '14px' }}
                >
                  Join Discord
                </a>
              </div>

              {/* Email Support */}
              <div className="lg-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                  style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: 'rgba(212,160,23,0.10)', border: '1px solid rgba(212,160,23,0.24)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: '24px', height: '24px', color: 'var(--gold-400)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div style={{ flexGrow: 1 }}>
                  <h3 className="t-headline" style={{ fontSize: '17px', marginBottom: '8px' }}>Email Support</h3>
                  <p className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.6' }}>
                    Send us an email. Response time: 24–48 hours on business days.
                  </p>
                </div>
                <a
                  href="mailto:support@xeron-labs.com"
                  className="btn-luxury"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px 20px', fontSize: '14px' }}
                >
                  support@xeron-labs.com
                </a>
              </div>

              {/* Documentation */}
              <div className="lg-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                  style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: 'rgba(200,205,230,0.08)', border: '1px solid rgba(200,205,230,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ width: '24px', height: '24px', color: 'var(--plat-400)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <div style={{ flexGrow: 1 }}>
                  <h3 className="t-headline" style={{ fontSize: '17px', marginBottom: '8px' }}>Documentation</h3>
                  <p className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.6' }}>
                    Step-by-step guides, tutorials and full API reference documentation.
                  </p>
                </div>
                <Link
                  href="/tutorial"
                  className="btn-glass"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px 20px', fontSize: '14px' }}
                >
                  View Tutorial
                </Link>
              </div>
            </div>

            {/* FAQ Link */}
            <div
              className="lg-card-static"
              style={{ padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}
            >
              <div>
                <h3 className="t-headline" style={{ fontSize: '18px', marginBottom: '6px' }}>Frequently Asked Questions</h3>
                <p className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', margin: 0 }}>
                  Find answers to the most common questions about XERON Engine.
                </p>
              </div>
              <Link href="/faq" className="btn-glass" style={{ padding: '12px 28px', fontSize: '14px' }}>
                Browse FAQ
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
