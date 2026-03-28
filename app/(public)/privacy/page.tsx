import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { LuxuryBackground } from '@/components/landing/LuxuryBackground'

export const metadata = {
  title: 'Privacy Policy — XERON Engine',
  description: 'Privacy Policy for XERON Engine pursuant to GDPR.',
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="lg-card" style={{ padding: '32px 36px' }}>
      <h2 className="t-headline" style={{ fontSize: '1.1rem', marginBottom: '14px', color: 'var(--gold-400)' }}>{title}</h2>
      <div className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.85' }}>{children}</div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <LuxuryBackground />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1, paddingBottom: '80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px 0' }}>
          <div style={{ marginBottom: '40px' }}>
            <span className="lg-badge" style={{ marginBottom: '16px' }}>Privacy</span>
            <h1 className="t-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '12px', marginBottom: '10px' }}>Privacy Policy</h1>
            <p className="t-body" style={{ fontSize: '14px', color: 'var(--t-3)' }}>As of March 2026 | Pursuant to GDPR (EU) 2016/679</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <Section id="s1" title="1. Data Controller">
              <p><strong style={{ color: 'var(--t-1)' }}>XERON Engine</strong></p>
              <p>Contact: <a href="mailto:support@xeron-labs.com" style={{ color: 'var(--gold-400)', textDecoration: 'none' }}>support@xeron-labs.com</a></p>
              <p style={{ marginTop: '10px' }}>For all data protection inquiries, please contact us at the email above.</p>
            </Section>

            <Section id="s2" title="2. Principles of Data Processing">
              <p>We process personal data only to the extent necessary and in accordance with applicable law, particularly the General Data Protection Regulation (GDPR) and the German Federal Data Protection Act (BDSG). Data is processed on the following legal bases:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li><strong style={{ color: 'var(--t-1)' }}>Art. 6(1)(b) GDPR</strong> — Performance of a contract (providing the service)</li>
                <li><strong style={{ color: 'var(--t-1)' }}>Art. 6(1)(a) GDPR</strong> — Consent (e.g. cookies, marketing)</li>
                <li><strong style={{ color: 'var(--t-1)' }}>Art. 6(1)(c) GDPR</strong> — Legal obligation (e.g. invoicing records)</li>
                <li><strong style={{ color: 'var(--t-1)' }}>Art. 6(1)(f) GDPR</strong> — Legitimate interests (e.g. security, fraud prevention)</li>
              </ul>
            </Section>

            <Section id="s3" title="3. Data We Collect">
              <p><strong style={{ color: 'var(--t-1)' }}>Account Data:</strong> Email address, username, password (hashed), plan/subscription status, created date. Collected during registration. Used to provide your account.</p>
              <p style={{ marginTop: '10px' }}><strong style={{ color: 'var(--t-1)' }}>Payment Data:</strong> Billing information is processed exclusively by Stripe (our payment processor). XERON Engine only stores a Stripe Customer ID and purchase consent records. We never store full card details.</p>
              <p style={{ marginTop: '10px' }}><strong style={{ color: 'var(--t-1)' }}>Usage Data:</strong> Prompts submitted, generated content, project names, credit transactions. Used to deliver the service and improve AI quality.</p>
              <p style={{ marginTop: '10px' }}><strong style={{ color: 'var(--t-1)' }}>Server Logs:</strong> IP address, browser/device info, timestamps. Retained for 30 days for security purposes. Legal basis: Art. 6(1)(f) GDPR.</p>
              <p style={{ marginTop: '10px' }}><strong style={{ color: 'var(--t-1)' }}>Cookies:</strong> Session cookies (required), theme preference, cookie consent. See our Cookie Policy in the cookie banner.</p>
            </Section>

            <Section id="s4" title="4. Data Processors">
              <p>We use the following sub-processors who may process personal data:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong style={{ color: 'var(--t-1)' }}>Supabase (Database & Auth)</strong> — EU-hosted, GDPR compliant</li>
                <li><strong style={{ color: 'var(--t-1)' }}>Stripe (Payments)</strong> — PCI DSS Level 1 certified, EU data residency option</li>
                <li><strong style={{ color: 'var(--t-1)' }}>Anthropic (AI — Claude)</strong> — US-based; prompts processed but not retained for training without consent</li>
                <li><strong style={{ color: 'var(--t-1)' }}>Google (AI — Gemini)</strong> — US-based; subject to Google Cloud DPA</li>
                <li><strong style={{ color: 'var(--t-1)' }}>Vercel (Hosting)</strong> — US-based; EU edge network used where possible</li>
              </ul>
              <p style={{ marginTop: '10px' }}>All processors have signed Data Processing Agreements (DPAs) as required by Art. 28 GDPR.</p>
            </Section>

            <Section id="s5" title="5. Your Rights">
              <p>You have the following rights regarding your personal data:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li><strong style={{ color: 'var(--t-1)' }}>Right of Access (Art. 15 GDPR)</strong> — Request a copy of your data</li>
                <li><strong style={{ color: 'var(--t-1)' }}>Right to Rectification (Art. 16 GDPR)</strong> — Correct inaccurate data</li>
                <li><strong style={{ color: 'var(--t-1)' }}>Right to Erasure (Art. 17 GDPR)</strong> — Request deletion of your account and data</li>
                <li><strong style={{ color: 'var(--t-1)' }}>Right to Portability (Art. 20 GDPR)</strong> — Export your data in machine-readable format</li>
                <li><strong style={{ color: 'var(--t-1)' }}>Right to Object (Art. 21 GDPR)</strong> — Object to processing based on legitimate interests</li>
              </ul>
              <p style={{ marginTop: '10px' }}>To exercise your rights, contact: <a href="mailto:support@xeron-labs.com" style={{ color: 'var(--gold-400)', textDecoration: 'none' }}>support@xeron-labs.com</a></p>
            </Section>

            <Section id="s6" title="6. Data Retention">
              <p>Account data is retained for the duration of your account plus 30 days after deletion (to allow recovery). Payment and consent records are retained for 10 years as required by German tax law (§ 147 AO). Server logs are deleted after 30 days.</p>
            </Section>

            <Section id="s7" title="7. International Transfers">
              <p>Some processors (Anthropic, Google, Vercel) are based outside the EU/EEA. Transfers are conducted under Standard Contractual Clauses (SCCs) or other appropriate GDPR safeguards.</p>
            </Section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
