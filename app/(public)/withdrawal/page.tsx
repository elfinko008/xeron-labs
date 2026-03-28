import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { LuxuryBackground } from '@/components/landing/LuxuryBackground'

export const metadata = {
  title: 'Right of Withdrawal — XERON Engine',
  description: 'Right of withdrawal notice for XERON Engine digital content purchases.',
}

export default function WithdrawalPage() {
  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <LuxuryBackground />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1, paddingBottom: '80px' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '80px 24px 0' }}>
          <div style={{ marginBottom: '40px' }}>
            <span className="lg-badge" style={{ marginBottom: '16px' }}>Legal</span>
            <h1 className="t-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '12px', marginBottom: '10px' }}>Right of Withdrawal</h1>
            <p className="t-body" style={{ fontSize: '14px', color: 'var(--t-3)' }}>Pursuant to § 312g BGB in conjunction with Art. 246a EGBGB | March 2026</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div className="lg-card" style={{ padding: '32px 36px' }}>
              <h2 className="t-headline" style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--gold-400)' }}>Right of Withdrawal</h2>
              <div className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.85' }}>
                <p>You have the right to withdraw from this contract within fourteen days without giving any reason.</p>
                <p style={{ marginTop: '10px' }}>The withdrawal period is fourteen days from the date of contract conclusion.</p>
                <p style={{ marginTop: '10px' }}>To exercise your right of withdrawal, you must inform us (XERON Engine, support@xeron-labs.com) of your decision to withdraw by means of a clear statement.</p>
              </div>
            </div>

            <div className="lg-card" style={{ padding: '32px 36px' }}>
              <h2 className="t-headline" style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--gold-400)' }}>Expiry of Right of Withdrawal for Digital Content</h2>
              <div className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.85' }}>
                <p>
                  <strong style={{ color: 'var(--t-1)' }}>Important:</strong> Digital content purchased on XERON Engine (credits, AI generations, subscriptions) is made immediately available upon payment.
                </p>
                <p style={{ marginTop: '12px' }}>
                  In accordance with <strong style={{ color: 'var(--t-1)' }}>§356 para. 5 of the German Civil Code (BGB)</strong>, by confirming your purchase you expressly waive your 14-day right of withdrawal for these digital goods. This waiver takes effect as soon as we begin performing the service with your consent.
                </p>
                <p style={{ marginTop: '12px' }}>
                  You will be asked to confirm this waiver via a mandatory checkbox before every purchase. Without this confirmation, no purchase can be completed.
                </p>
              </div>
            </div>

            <div className="lg-card" style={{ padding: '32px 36px' }}>
              <h2 className="t-headline" style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--gold-400)' }}>Sample Withdrawal Form</h2>
              <div className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.85' }}>
                <p style={{ color: 'var(--t-3)' }}>(Complete and return this form only if you wish to withdraw from the contract and the withdrawal period has not yet expired.)</p>
                <div style={{ marginTop: '16px', background: 'var(--glass-1)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '20px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', lineHeight: '2' }}>
                  <p>To: XERON Engine, support@xeron-labs.com</p>
                  <p>I hereby withdraw from the contract concluded by me for the provision of the following service:</p>
                  <p>Service: _______________</p>
                  <p>Ordered on: _______________</p>
                  <p>Name: _______________</p>
                  <p>Date: _______________</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
