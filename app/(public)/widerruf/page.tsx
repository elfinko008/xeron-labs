import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { LuxuryBackground } from '@/components/landing/LuxuryBackground'

export const metadata = {
  title: 'Widerrufsbelehrung — XERON Engine',
  description: 'Widerrufsbelehrung und Muster-Widerrufsformular gemäß § 312g BGB i.V.m. Art. 246a EGBGB.',
}

export default function WiderrufPage() {
  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <LuxuryBackground />
      <Navbar />

      <main style={{ position: 'relative', zIndex: 1, paddingBottom: '80px' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '80px 24px 0' }}>

          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <span className="lg-badge" style={{ marginBottom: '16px' }}>Rechtliches</span>
            <h1 className="t-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '12px', marginBottom: '10px' }}>
              Widerrufsbelehrung
            </h1>
            <p className="t-body" style={{ fontSize: '14px', color: 'var(--t-3)' }}>
              Gemäß § 312g BGB i.V.m. Art. 246a EGBGB | Stand: März 2026
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Widerrufsrecht */}
            <div className="lg-card" style={{ padding: '32px 36px' }}>
              <h2 className="t-headline" style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--gold-400)' }}>
                Widerrufsrecht
              </h2>
              <div className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.85' }}>
                <p>
                  Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
                </p>
                <p style={{ marginTop: '12px' }}>
                  Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.
                </p>
                <p style={{ marginTop: '12px' }}>
                  Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
                </p>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    marginTop: '10px',
                    marginBottom: '10px',
                  }}
                >
                  <p><strong style={{ color: 'var(--t-1)' }}>XERON Labs</strong></p>
                  <p>E-Mail: <a href="mailto:support@xeron-labs.com" style={{ color: 'var(--gold-400)', textDecoration: 'none' }}>support@xeron-labs.com</a></p>
                  <p>Website: xeron-labs.com</p>
                </div>
                <p>
                  mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail)
                  über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das
                  beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
                </p>
                <p style={{ marginTop: '12px' }}>
                  Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des
                  Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
                </p>
              </div>
            </div>

            {/* Folgen des Widerrufs */}
            <div className="lg-card" style={{ padding: '32px 36px' }}>
              <h2 className="t-headline" style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--gold-400)' }}>
                Folgen des Widerrufs
              </h2>
              <div className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.85' }}>
                <p>
                  Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten
                  haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus
                  ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste
                  Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag
                  zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
                </p>
                <p style={{ marginTop: '12px' }}>
                  Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen
                  Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart;
                  in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
                </p>
              </div>
            </div>

            {/* WICHTIG: Ausnahme digitale Inhalte */}
            <div
              className="lg-card"
              style={{
                padding: '32px 36px',
                border: '1px solid rgba(232,188,58,0.40)',
                background: 'rgba(212,160,23,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div
                  style={{
                    minWidth: '40px', height: '40px', borderRadius: '12px',
                    background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.30)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: '20px', height: '20px', color: 'var(--gold-400)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <h2 className="t-headline" style={{ fontSize: '1.1rem', marginBottom: '12px', color: 'var(--gold-400)' }}>
                    WICHTIGER HINWEIS: Ausnahme für digitale Inhalte (Credits)
                  </h2>
                  <div className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.85' }}>
                    <p>
                      <strong style={{ color: 'var(--t-1)' }}>
                        Das Widerrufsrecht erlischt vorzeitig bei Verträgen zur Lieferung digitaler Inhalte,
                        die nicht auf einem körperlichen Datenträger geliefert werden.
                      </strong>
                    </p>
                    <p style={{ marginTop: '12px' }}>
                      Beim Kauf von Credits (einzeln oder als Paket) sowie beim Abschluss eines Abonnements
                      handelt es sich um den Erwerb digitaler Inhalte gemäß § 312f Abs. 3 BGB.
                    </p>
                    <p style={{ marginTop: '12px' }}>
                      Das Widerrufsrecht erlischt gemäß{' '}
                      <strong style={{ color: 'var(--t-1)' }}>§ 356 Abs. 5 BGB</strong>, wenn:
                    </p>
                    <ol style={{ marginTop: '10px', marginLeft: '20px', lineHeight: '2.2' }}>
                      <li>
                        Sie <strong style={{ color: 'var(--t-1)' }}>ausdrücklich zugestimmt</strong> haben, dass
                        wir mit der Ausführung des Vertrags vor Ablauf der Widerrufsfrist beginnen, <strong style={{ color: 'var(--t-1)' }}>und</strong>
                      </li>
                      <li>
                        Sie Ihre <strong style={{ color: 'var(--t-1)' }}>Kenntnis davon bestätigt</strong> haben,
                        dass Sie durch Ihre Zustimmung mit Beginn der Ausführung des Vertrags Ihr Widerrufsrecht
                        verlieren.
                      </li>
                    </ol>
                    <p style={{ marginTop: '12px' }}>
                      Beide Bedingungen werden beim Kaufvorgang durch eine entsprechende Checkbox-Bestätigung
                      erfüllt. Zeitpunkt der Zustimmung, IP-Adresse und Bestätigungsstatus werden dokumentiert.
                    </p>
                    <p style={{ marginTop: '12px' }}>
                      Da Credits nach Zahlungseingang <strong style={{ color: 'var(--t-1)' }}>sofort gutgeschrieben</strong> werden
                      und die Ausführung des Vertrags auf Ihren ausdrücklichen Wunsch unmittelbar begonnen hat,
                      besteht <strong style={{ color: 'var(--t-1)' }}>kein Anspruch auf Rückerstattung</strong> bereits
                      gutgeschriebener Credits.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Muster-Widerrufsformular */}
            <div className="lg-card" style={{ padding: '32px 36px' }}>
              <h2 className="t-headline" style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--gold-400)' }}>
                Muster-Widerrufsformular
              </h2>
              <p className="t-body" style={{ fontSize: '13px', color: 'var(--t-3)', marginBottom: '16px' }}>
                (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie dieses Formular aus und senden Sie es zurück.)
              </p>
              <div
                style={{
                  background: 'rgba(0,0,0,0.20)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '14px',
                  padding: '20px 24px',
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '14px',
                  color: 'var(--t-2)',
                  lineHeight: '2',
                }}
              >
                <p>An: XERON Labs, support@xeron-labs.com</p>
                <p style={{ marginTop: '10px' }}>
                  Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf
                  der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)
                </p>
                <p style={{ marginTop: '10px' }}>— Bestellt am (*)/erhalten am (*): ___________</p>
                <p>— Name des/der Verbraucher(s): ___________</p>
                <p>— Anschrift des/der Verbraucher(s): ___________</p>
                <p>— E-Mail-Adresse des/der Verbraucher(s): ___________</p>
                <p style={{ marginTop: '10px' }}>— Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):</p>
                <p style={{ marginTop: '10px' }}>— Datum: ___________</p>
                <p style={{ marginTop: '10px', fontSize: '12px', color: 'var(--t-3)' }}>(*) Unzutreffendes streichen.</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
