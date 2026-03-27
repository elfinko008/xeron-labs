import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { LuxuryBackground } from '@/components/landing/LuxuryBackground'

export const metadata = {
  title: 'Privacy Policy — XERON Engine',
  description: 'Privacy Policy for XERON Engine pursuant to GDPR (EU) 2016/679.',
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="lg-card" style={{ padding: '32px 36px' }}>
      <h2 className="t-headline" style={{ fontSize: '1.1rem', marginBottom: '14px', color: 'var(--gold-400)' }}>
        {title}
      </h2>
      <div className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.85' }}>
        {children}
      </div>
    </section>
  )
}

export default function DatenschutzPage() {
  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <LuxuryBackground />
      <Navbar />

      <main style={{ position: 'relative', zIndex: 1, paddingBottom: '80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px 0' }}>

          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <span className="lg-badge" style={{ marginBottom: '16px' }}>Privacy</span>
            <h1 className="t-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '12px', marginBottom: '10px' }}>
              Privacy Policy
            </h1>
            <p className="t-body" style={{ fontSize: '14px', color: 'var(--t-3)' }}>
              As of March 2026 | Pursuant to GDPR (EU) 2016/679
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <Section id="verantwortlicher" title="1. Verantwortlicher">
              <p>
                Verantwortlicher im Sinne der DSGVO für die Verarbeitung personenbezogener Daten auf dieser
                Plattform ist:
              </p>
              <p style={{ marginTop: '10px' }}>
                <strong style={{ color: 'var(--t-1)' }}>XERON Labs</strong><br />
                Website: xeron-labs.com<br />
                E-Mail: support@xeron-labs.com
              </p>
            </Section>

            <Section id="grundsaetze" title="2. Grundsätze der Datenverarbeitung">
              <p>
                Wir verarbeiten personenbezogene Daten nur, wenn eine Rechtsgrundlage nach Art. 6 DSGVO vorliegt:
              </p>
              <ul style={{ marginTop: '10px', marginLeft: '20px', lineHeight: '2.2' }}>
                <li><strong style={{ color: 'var(--t-1)' }}>Art. 6 Abs. 1 lit. a DSGVO</strong> — Einwilligung (z. B. Cookies, Marketing)</li>
                <li><strong style={{ color: 'var(--t-1)' }}>Art. 6 Abs. 1 lit. b DSGVO</strong> — Vertragserfüllung (Konto, Abonnements, Zahlungen)</li>
                <li><strong style={{ color: 'var(--t-1)' }}>Art. 6 Abs. 1 lit. c DSGVO</strong> — Rechtliche Verpflichtung (Buchführung, Steuerrecht)</li>
                <li><strong style={{ color: 'var(--t-1)' }}>Art. 6 Abs. 1 lit. f DSGVO</strong> — Berechtigte Interessen (Sicherheit, Missbrauchsprävention)</li>
              </ul>
            </Section>

            <Section id="erhobene-daten" title="3. Erhobene Daten und Zwecke">
              <p><strong style={{ color: 'var(--t-1)' }}>Registrierung und Konto:</strong></p>
              <ul style={{ marginTop: '6px', marginLeft: '20px', lineHeight: '2' }}>
                <li>E-Mail-Adresse, Passwort (gehasht), Registrierungsdatum</li>
                <li>Nutzungsdaten: gewählter Plan, Credits, generierte Projekte</li>
                <li>Zweck: Vertragserfüllung, Kontoverwaltung</li>
              </ul>
              <p style={{ marginTop: '12px' }}><strong style={{ color: 'var(--t-1)' }}>Zahlungen:</strong></p>
              <ul style={{ marginTop: '6px', marginLeft: '20px', lineHeight: '2' }}>
                <li>Zahlungsdaten werden ausschließlich von Stripe verarbeitet (wir erhalten keine Kartendaten)</li>
                <li>Stripe-Kunden-ID, Transaktions-IDs, Rechnungsbelege</li>
                <li>Zweck: Zahlungsabwicklung, Rechnungsstellung, gesetzliche Aufbewahrungspflichten</li>
              </ul>
              <p style={{ marginTop: '12px' }}><strong style={{ color: 'var(--t-1)' }}>Generierungen und Projekte:</strong></p>
              <ul style={{ marginTop: '6px', marginLeft: '20px', lineHeight: '2' }}>
                <li>Eingaben (Prompts), generierte Inhalte, Zeitstempel</li>
                <li>Zweck: Bereitstellung des Dienstes, Verbesserung der KI-Modelle</li>
              </ul>
              <p style={{ marginTop: '12px' }}><strong style={{ color: 'var(--t-1)' }}>Server-Logs:</strong></p>
              <ul style={{ marginTop: '6px', marginLeft: '20px', lineHeight: '2' }}>
                <li>IP-Adresse, Browser-Typ, Betriebssystem, Uhrzeit, aufgerufene URLs</li>
                <li>Zweck: Sicherheit, Fehlerdiagnose, Missbrauchsprävention</li>
                <li>Speicherdauer: 30 Tage</li>
              </ul>
            </Section>

            <Section id="auftragsverarbeiter" title="4. Auftragsverarbeiter und Drittländertransfers">
              <p>Wir nutzen folgende Dienstleister als Auftragsverarbeiter (Art. 28 DSGVO):</p>

              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  {
                    name: 'Supabase Inc.',
                    purpose: 'Datenbankhosting, Authentifizierung, Nutzerkonten',
                    location: 'Frankfurt, Deutschland (EU)',
                    sccs: false,
                    url: 'https://supabase.com/privacy',
                  },
                  {
                    name: 'Stripe Inc.',
                    purpose: 'Zahlungsverarbeitung, Abonnementverwaltung',
                    location: 'Irland (EU)',
                    sccs: false,
                    url: 'https://stripe.com/privacy',
                  },
                  {
                    name: 'Anthropic PBC',
                    purpose: 'KI-Sprachmodelle (Claude Haiku, Sonnet)',
                    location: 'USA — Transfer auf Basis der EU-Standardvertragsklauseln (SCCs)',
                    sccs: true,
                    url: 'https://www.anthropic.com/privacy',
                  },
                  {
                    name: 'Google LLC (Gemini)',
                    purpose: 'KI-Sprachmodelle (Gemini Flash, Flash Lite)',
                    location: 'USA — Transfer auf Basis der EU-Standardvertragsklauseln (SCCs)',
                    sccs: true,
                    url: 'https://policies.google.com/privacy',
                  },
                  {
                    name: 'Vercel Inc.',
                    purpose: 'Hosting der Web-Applikation, CDN, Edge-Funktionen',
                    location: 'USA — Transfer auf Basis der EU-Standardvertragsklauseln (SCCs)',
                    sccs: true,
                    url: 'https://vercel.com/legal/privacy-policy',
                  },
                  {
                    name: 'Discord Inc.',
                    purpose: 'Community-Kommunikation, optionale Discord-Integration',
                    location: 'USA — Transfer auf Basis der EU-Standardvertragsklauseln (SCCs)',
                    sccs: true,
                    url: 'https://discord.com/privacy',
                  },
                ].map((p) => (
                  <div
                    key={p.name}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '14px',
                      padding: '14px 18px',
                    }}
                  >
                    <p style={{ fontWeight: 700, color: 'var(--t-1)', marginBottom: '4px' }}>{p.name}</p>
                    <p style={{ marginBottom: '2px' }}><strong style={{ color: 'var(--t-1)' }}>Zweck:</strong> {p.purpose}</p>
                    <p style={{ marginBottom: '2px' }}><strong style={{ color: 'var(--t-1)' }}>Standort:</strong> {p.location}</p>
                    {p.sccs && (
                      <p style={{ color: 'var(--gold-400)', fontSize: '13px' }}>
                        ⚠ Drittlandtransfer — gesichert durch EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO)
                      </p>
                    )}
                    <a href={p.url} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: '12px', color: 'var(--t-3)', textDecoration: 'none' }}>
                      Datenschutzerklärung →
                    </a>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="cookies" title="5. Cookies und Tracking">
              <p><strong style={{ color: 'var(--t-1)' }}>Notwendige Cookies (keine Einwilligung erforderlich):</strong></p>
              <ul style={{ marginTop: '8px', marginLeft: '20px', lineHeight: '2' }}>
                <li><code style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--t-1)', fontSize: '12px' }}>sb-auth-token</code> — Supabase Authentifizierungstoken (Session)</li>
                <li><code style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--t-1)', fontSize: '12px' }}>xeron-theme</code> — Farbschema-Einstellung (hell/dunkel)</li>
                <li><code style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--t-1)', fontSize: '12px' }}>xeron-lang</code> — Spracheinstellung</li>
              </ul>
              <p style={{ marginTop: '12px' }}><strong style={{ color: 'var(--t-1)' }}>Funktionale Cookies (mit Einwilligung):</strong></p>
              <ul style={{ marginTop: '8px', marginLeft: '20px', lineHeight: '2' }}>
                <li>Stripe-Cookies zur Zahlungsabwicklung</li>
                <li>Widerrufsverzicht-Dokumentation (lokaler Zeitstempel bei Kaufabschluss)</li>
              </ul>
              <p style={{ marginTop: '12px' }}>
                Wir nutzen kein Google Analytics, keine Werbe-Tracker oder sonstige Drittanbieter-Tracking-Tools.
              </p>
            </Section>

            <Section id="consent" title="6. Einwilligungsverwaltung">
              <p>
                Beim ersten Besuch der Website wird ein Cookie-Banner angezeigt. Notwendige Cookies werden ohne
                Einwilligung gesetzt. Für alle weiteren Cookies ist eine aktive Einwilligung erforderlich.
              </p>
              <p style={{ marginTop: '10px' }}>
                Ihre Einwilligungen werden mit Zeitstempel gespeichert. Sie können Ihre Einwilligung jederzeit
                widerrufen, indem Sie den Cookie-Banner erneut aufrufen (Link im Footer: „Cookie-Einstellungen")
                oder uns per E-Mail kontaktieren.
              </p>
            </Section>

            <Section id="widerruf-einwilligung" title="7. Recht auf Widerruf der Einwilligung">
              <p>
                Soweit die Verarbeitung Ihrer Daten auf einer Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO beruht,
                haben Sie das Recht, diese Einwilligung jederzeit ohne Angabe von Gründen zu widerrufen.
              </p>
              <p style={{ marginTop: '10px' }}>
                Der Widerruf der Einwilligung berührt nicht die Rechtmäßigkeit der aufgrund der Einwilligung bis
                zum Widerruf erfolgten Verarbeitung.
              </p>
              <p style={{ marginTop: '10px' }}>
                Widerruf per E-Mail an:{' '}
                <a href="mailto:support@xeron-labs.com" style={{ color: 'var(--gold-400)', textDecoration: 'none' }}>
                  support@xeron-labs.com
                </a>
              </p>
            </Section>

            <Section id="rechte" title="8. Ihre Rechte als betroffene Person">
              <p>Sie haben gemäß DSGVO folgende Rechte:</p>
              <ul style={{ marginTop: '10px', marginLeft: '20px', lineHeight: '2.2' }}>
                <li><strong style={{ color: 'var(--t-1)' }}>Art. 15 DSGVO</strong> — Auskunftsrecht über gespeicherte Daten</li>
                <li><strong style={{ color: 'var(--t-1)' }}>Art. 16 DSGVO</strong> — Recht auf Berichtigung unrichtiger Daten</li>
                <li><strong style={{ color: 'var(--t-1)' }}>Art. 17 DSGVO</strong> — Recht auf Löschung („Recht auf Vergessenwerden")</li>
                <li><strong style={{ color: 'var(--t-1)' }}>Art. 18 DSGVO</strong> — Recht auf Einschränkung der Verarbeitung</li>
                <li><strong style={{ color: 'var(--t-1)' }}>Art. 20 DSGVO</strong> — Recht auf Datenübertragbarkeit</li>
                <li><strong style={{ color: 'var(--t-1)' }}>Art. 21 DSGVO</strong> — Widerspruchsrecht gegen bestimmte Verarbeitungen</li>
                <li><strong style={{ color: 'var(--t-1)' }}>Art. 77 DSGVO</strong> — Beschwerderecht bei einer Aufsichtsbehörde</li>
              </ul>
              <p style={{ marginTop: '12px' }}>
                Zuständige Aufsichtsbehörde: Der Bundesbeauftragte für den Datenschutz und die Informationsfreiheit
                (BfDI), https://www.bfdi.bund.de
              </p>
              <p style={{ marginTop: '10px' }}>
                Für die Ausübung Ihrer Rechte wenden Sie sich bitte an:{' '}
                <a href="mailto:support@xeron-labs.com" style={{ color: 'var(--gold-400)', textDecoration: 'none' }}>
                  support@xeron-labs.com
                </a>
              </p>
            </Section>

            <Section id="speicherdauer" title="9. Speicherdauer">
              <ul style={{ marginLeft: '20px', lineHeight: '2.2' }}>
                <li>Kontodaten: bis zur Löschung des Kontos + 30 Tage Karenzzeit</li>
                <li>Zahlungsdaten / Rechnungen: 10 Jahre (gesetzliche Aufbewahrungspflicht, §§ 147 AO, 257 HGB)</li>
                <li>Server-Logs: 30 Tage</li>
                <li>Widerrufsverzicht-Dokumentation: 3 Jahre ab Kaufdatum</li>
                <li>Generierte Projekte: bis zur manuellen Löschung durch den Nutzer</li>
              </ul>
            </Section>

            <Section id="aenderungen" title="10. Änderungen dieser Datenschutzerklärung">
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung bei Änderungen der Datenverarbeitung oder bei
                neuen rechtlichen Anforderungen anzupassen. Die aktuelle Version ist stets unter
                xeron-labs.com/datenschutz abrufbar. Wesentliche Änderungen werden per E-Mail an registrierte
                Nutzer kommuniziert.
              </p>
            </Section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
