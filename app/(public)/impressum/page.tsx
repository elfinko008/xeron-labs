import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { LuxuryBackground } from '@/components/landing/LuxuryBackground'

export const metadata = {
  title: 'Impressum — XERON Engine',
  description: 'Impressum der XERON Engine gemäß § 5 TMG.',
}

export default function ImpressumPage() {
  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <LuxuryBackground />
      <Navbar />

      <main style={{ position: 'relative', zIndex: 1, paddingBottom: '80px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '80px 24px 0' }}>

          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <span className="lg-badge" style={{ marginBottom: '16px' }}>Rechtliches</span>
            <h1 className="t-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '12px', marginBottom: '10px' }}>
              Impressum
            </h1>
            <p className="t-body" style={{ fontSize: '14px', color: 'var(--t-3)' }}>
              Angaben gemäß § 5 TMG
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Anbieter */}
            <div className="lg-card" style={{ padding: '32px 36px' }}>
              <h2 className="t-headline" style={{ fontSize: '1.1rem', marginBottom: '14px', color: 'var(--gold-400)' }}>
                Anbieter
              </h2>
              <div className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.9' }}>
                <p><strong style={{ color: 'var(--t-1)' }}>XERON Labs</strong></p>
                <p>[Straße und Hausnummer]</p>
                <p>[PLZ] [Stadt]</p>
                <p>Deutschland</p>
              </div>
            </div>

            {/* Kontakt */}
            <div className="lg-card" style={{ padding: '32px 36px' }}>
              <h2 className="t-headline" style={{ fontSize: '1.1rem', marginBottom: '14px', color: 'var(--gold-400)' }}>
                Kontakt
              </h2>
              <div className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.9' }}>
                <p>
                  <strong style={{ color: 'var(--t-1)' }}>E-Mail:</strong>{' '}
                  <a href="mailto:support@xeron-labs.com" style={{ color: 'var(--gold-400)', textDecoration: 'none' }}>
                    support@xeron-labs.com
                  </a>
                </p>
                <p>
                  <strong style={{ color: 'var(--t-1)' }}>Website:</strong>{' '}
                  <a href="https://xeron-labs.com" style={{ color: 'var(--gold-400)', textDecoration: 'none' }}>
                    xeron-labs.com
                  </a>
                </p>
              </div>
            </div>

            {/* Vertreter / Verantwortlich */}
            <div className="lg-card" style={{ padding: '32px 36px' }}>
              <h2 className="t-headline" style={{ fontSize: '1.1rem', marginBottom: '14px', color: 'var(--gold-400)' }}>
                Verantwortlich für den Inhalt
              </h2>
              <div className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.9' }}>
                <p>Gemäß § 18 Abs. 2 MStV:</p>
                <p style={{ marginTop: '8px' }}>
                  [Vorname Nachname]<br />
                  [Straße und Hausnummer]<br />
                  [PLZ] [Stadt]<br />
                  Deutschland
                </p>
              </div>
            </div>

            {/* EU-Streitschlichtung */}
            <div className="lg-card" style={{ padding: '32px 36px' }}>
              <h2 className="t-headline" style={{ fontSize: '1.1rem', marginBottom: '14px', color: 'var(--gold-400)' }}>
                EU-Streitschlichtung
              </h2>
              <div className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.85' }}>
                <p>
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                  <a
                    href="https://ec.europa.eu/consumers/odr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--gold-400)', textDecoration: 'none' }}
                  >
                    https://ec.europa.eu/consumers/odr/
                  </a>
                </p>
                <p style={{ marginTop: '10px' }}>
                  Unsere E-Mail-Adresse lautet: support@xeron-labs.com
                </p>
                <p style={{ marginTop: '10px' }}>
                  Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer
                  Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>
            </div>

            {/* Haftungshinweis */}
            <div className="lg-card" style={{ padding: '32px 36px' }}>
              <h2 className="t-headline" style={{ fontSize: '1.1rem', marginBottom: '14px', color: 'var(--gold-400)' }}>
                Haftungshinweis
              </h2>
              <div className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.85' }}>
                <p>
                  Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer
                  Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
                </p>
              </div>
            </div>

            {/* Hinweis Platzhalter */}
            <div
              style={{
                background: 'rgba(212,160,23,0.06)',
                border: '1px solid rgba(212,160,23,0.22)',
                borderRadius: '16px',
                padding: '16px 20px',
              }}
            >
              <p className="t-body" style={{ fontSize: '13px', color: 'var(--t-3)', margin: 0 }}>
                ⚠ Hinweis: Die mit [eckigen Klammern] markierten Felder sind Platzhalter und müssen mit echten
                Angaben befüllt werden, bevor diese Seite live geht.
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
