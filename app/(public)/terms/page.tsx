import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { LuxuryBackground } from '@/components/landing/LuxuryBackground'

export const metadata = {
  title: 'Terms of Service — XERON Engine',
  description: 'Terms of Service for the XERON Engine SaaS platform.',
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="lg-card" style={{ padding: '32px 36px' }}>
      <h2 className="t-headline" style={{ fontSize: '1.15rem', marginBottom: '16px', color: 'var(--gold-400)' }}>{title}</h2>
      <div className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.8' }}>{children}</div>
    </section>
  )
}

export default function TermsPage() {
  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <LuxuryBackground />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1, paddingBottom: '80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px 0' }}>
          <div style={{ marginBottom: '40px' }}>
            <span className="lg-badge" style={{ marginBottom: '16px' }}>Legal</span>
            <h1 className="t-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '12px', marginBottom: '10px' }}>Terms of Service</h1>
            <p className="t-body" style={{ fontSize: '14px', color: 'var(--t-3)' }}>As of March 2026 | XERON Engine — xeron-labs.com</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <Section id="s1" title="1. Scope of Application">
              <p>These Terms of Service ("Terms") govern all agreements between XERON Engine ("Provider") and the user ("Customer") regarding the use of the SaaS platform XERON Engine, accessible at <strong style={{ color: 'var(--t-1)' }}>xeron-labs.com</strong>.</p>
              <p style={{ marginTop: '10px' }}>Conflicting or deviating terms of the Customer shall not be recognized unless the Provider expressly agrees in writing. By registering and using the platform, the Customer accepts these Terms in their current version.</p>
              <p style={{ marginTop: '10px' }}><strong style={{ color: 'var(--t-1)' }}>Provider:</strong> XERON Engine | <strong style={{ color: 'var(--t-1)' }}>Website:</strong> xeron-labs.com | <strong style={{ color: 'var(--t-1)' }}>Email:</strong> support@xeron-labs.com</p>
            </Section>

            <Section id="s2" title="2. Contract Formation">
              <p>The agreement for use of the platform is formed upon registration of a user account. By submitting the registration form and confirming registration (e.g. via email), the Customer makes a binding offer to enter into a usage agreement. The Provider accepts by activating the account. There is no right to registration.</p>
            </Section>

            <Section id="s3" title="3. Service Offering">
              <p>XERON Engine provides an AI-powered platform for generating Roblox game content. Depending on the plan, the following features are available:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>AI-based generation of game scripts, game worlds, UI elements and other game content (Lua code)</li>
                <li>Credit-based billing system for AI generations</li>
                <li>Roblox Studio plugin for importing generated content</li>
                <li>Project management for generated content</li>
                <li>API access for integration into own workflows (Pro+ plans)</li>
              </ul>
              <p style={{ marginTop: '10px' }}>The Provider reserves the right to extend, modify, or discontinue services at any time, provided that the core service remains available to paying customers during their billing period.</p>
            </Section>

            <Section id="s4" title="4. Terms of Use">
              <p>The Customer agrees to use the platform only in accordance with applicable law. The following uses are prohibited:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Generating content that violates the Roblox Terms of Service</li>
                <li>Creating malware, exploit scripts, or cheats for other users</li>
                <li>Attempting to circumvent, overload or harm the platform</li>
                <li>Unauthorized access to other users' accounts or data</li>
                <li>Reselling AI-generated content as a service without permission</li>
                <li>Using automated systems to bypass credit restrictions</li>
              </ul>
              <p style={{ marginTop: '10px' }}>Violations may result in immediate account suspension without refund.</p>
            </Section>

            <Section id="s5" title="5. Copyright">
              <p>The generated content (Lua scripts, game structures) is assigned to the Customer upon complete payment. The Provider retains the right to use anonymized generation data to improve the AI model.</p>
              <p style={{ marginTop: '10px' }}>The XERON Engine platform, its brand, logo, and proprietary technology remain the intellectual property of the Provider. Customers receive a non-exclusive, non-transferable right to use the platform during their subscription period.</p>
            </Section>

            <Section id="s6" title="6. Liability">
              <p>The Provider's liability for damages is limited to cases of intent and gross negligence. Liability for indirect damages, lost profits, or data loss is excluded to the extent permitted by law.</p>
              <p style={{ marginTop: '10px' }}>The Provider does not guarantee that AI-generated content will function perfectly in every Roblox project or will comply with all Roblox guidelines. Users are responsible for reviewing generated content before use.</p>
            </Section>

            <Section id="s7" title="7. Prices and Payment">
              <p>All prices are in euros (€) and include applicable VAT where required by law. Subscriptions are billed in advance for the chosen billing period (monthly or annually). Credit packs are billed as one-time payments.</p>
              <p style={{ marginTop: '10px' }}>Payment is processed via Stripe. Accepted payment methods include credit/debit cards and other Stripe-supported methods. The Provider reserves the right to adjust prices with 30 days advance notice to existing subscribers.</p>
            </Section>

            <Section id="s8" title="8. Digital Content and Right of Withdrawal">
              <p>Credits and AI generations are digital content that is made available immediately upon purchase. In accordance with <strong style={{ color: 'var(--t-1)' }}>§356 para. 5 of the German Civil Code (BGB)</strong>, the 14-day right of withdrawal expires upon delivery of digital content if the customer has expressly consented to immediate delivery and acknowledged the loss of the right of withdrawal prior to purchase.</p>
              <p style={{ marginTop: '10px' }}>This consent is collected via a mandatory checkbox before every purchase. Without this consent, no purchase can be completed.</p>
              <p style={{ marginTop: '10px' }}>This does not affect statutory rights for defective digital content.</p>
            </Section>

            <Section id="s9" title="9. Subscriptions">
              <p>Subscriptions automatically renew at the end of each billing period unless cancelled. Cancellation can be performed at any time via Dashboard → Account → Plan → Cancel Plan. The subscription remains active until the end of the current billing period.</p>
              <p style={{ marginTop: '10px' }}>Monthly credits reset at the start of each billing cycle. Unused monthly credits do not carry over. Purchased credit packs do not expire and accumulate separately.</p>
            </Section>

            <Section id="s10" title="10. API Usage">
              <p>API access is available on Pro and Enterprise plans. API usage is subject to rate limits (Pro: 100 req/h, Enterprise: 500 req/h). Exceeding rate limits may result in temporary throttling.</p>
              <p style={{ marginTop: '10px' }}>API keys must be kept confidential. The Customer is responsible for all usage under their API key. Abuse of the API (e.g. scraping, automated mass generation) may result in account suspension.</p>
            </Section>

            <Section id="s11" title="11. Affiliate Program">
              <p>Eligible users (Pro+ plans) may participate in the affiliate program. Referred users who complete a paid purchase earn the referrer a commission (in credits or monetary reward, as specified in the affiliate dashboard).</p>
              <p style={{ marginTop: '10px' }}>The Provider reserves the right to modify or terminate the affiliate program at any time with 14 days' notice.</p>
            </Section>

            <Section id="s12" title="12. Governing Law">
              <p>These Terms are governed by the laws of the Federal Republic of Germany. The UN Convention on Contracts for the International Sale of Goods (CISG) does not apply.</p>
              <p style={{ marginTop: '10px' }}>For consumers in the EU, the applicable mandatory consumer protection provisions of the consumer's country of residence also apply.</p>
            </Section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
