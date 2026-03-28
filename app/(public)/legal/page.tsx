import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { LuxuryBackground } from '@/components/landing/LuxuryBackground'

export const metadata = {
  title: 'Legal Notice — XERON Engine',
  description: 'Legal notice for XERON Engine pursuant to § 5 TMG.',
}

export default function LegalPage() {
  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <LuxuryBackground />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1, paddingBottom: '80px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '80px 24px 0' }}>
          <div style={{ marginBottom: '40px' }}>
            <span className="lg-badge" style={{ marginBottom: '16px' }}>Legal</span>
            <h1 className="t-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '12px', marginBottom: '10px' }}>Legal Notice</h1>
            <p className="t-body" style={{ fontSize: '14px', color: 'var(--t-3)' }}>Pursuant to § 5 TMG (German Telemedia Act)</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div className="lg-card" style={{ padding: '32px 36px' }}>
              <h2 className="t-headline" style={{ fontSize: '1.1rem', marginBottom: '14px', color: 'var(--gold-400)' }}>Service Provider</h2>
              <div className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.9' }}>
                <p><strong style={{ color: 'var(--t-1)' }}>XERON Engine</strong></p>
                <p>Contact via email only</p>
                <p><a href="mailto:support@xeron-labs.com" style={{ color: 'var(--gold-400)', textDecoration: 'none' }}>support@xeron-labs.com</a></p>
              </div>
            </div>

            <div className="lg-card" style={{ padding: '32px 36px' }}>
              <h2 className="t-headline" style={{ fontSize: '1.1rem', marginBottom: '14px', color: 'var(--gold-400)' }}>Contact</h2>
              <div className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.9' }}>
                <p><strong style={{ color: 'var(--t-1)' }}>Email:</strong> <a href="mailto:support@xeron-labs.com" style={{ color: 'var(--gold-400)', textDecoration: 'none' }}>support@xeron-labs.com</a></p>
                <p><strong style={{ color: 'var(--t-1)' }}>Website:</strong> <a href="https://xeron-labs.com" style={{ color: 'var(--gold-400)', textDecoration: 'none' }}>xeron-labs.com</a></p>
              </div>
            </div>

            <div className="lg-card" style={{ padding: '32px 36px' }}>
              <h2 className="t-headline" style={{ fontSize: '1.1rem', marginBottom: '14px', color: 'var(--gold-400)' }}>Person Responsible for Content</h2>
              <div className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.9' }}>
                <p>Pursuant to § 18 para. 2 MStV:</p>
                <p style={{ marginTop: '8px' }}>XERON Engine<br />Email: support@xeron-labs.com</p>
              </div>
            </div>

            <div className="lg-card" style={{ padding: '32px 36px' }}>
              <h2 className="t-headline" style={{ fontSize: '1.1rem', marginBottom: '14px', color: 'var(--gold-400)' }}>EU Dispute Resolution</h2>
              <div className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.85' }}>
                <p>The European Commission provides a platform for online dispute resolution (ODR): <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-400)', textDecoration: 'none' }}>https://ec.europa.eu/consumers/odr/</a></p>
                <p style={{ marginTop: '10px' }}>Our email address: support@xeron-labs.com</p>
                <p style={{ marginTop: '10px' }}>We are not obliged and not willing to participate in dispute resolution proceedings before a consumer arbitration board.</p>
              </div>
            </div>

            <div className="lg-card" style={{ padding: '32px 36px' }}>
              <h2 className="t-headline" style={{ fontSize: '1.1rem', marginBottom: '14px', color: 'var(--gold-400)' }}>Liability Notice</h2>
              <div className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.85' }}>
                <p>Despite careful content review, we assume no liability for the content of external links. The operators of linked pages are solely responsible for their content.</p>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
