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
      <h2 className="t-headline" style={{ fontSize: '1.15rem', marginBottom: '16px', color: 'var(--gold-400)' }}>
        {title}
      </h2>
      <div className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.8' }}>
        {children}
      </div>
    </section>
  )
}

export default function AGBPage() {
  return (
    <div style={{ background: 'var(--void)', minHeight: '100vh' }}>
      <LuxuryBackground />
      <Navbar />

      <main style={{ position: 'relative', zIndex: 1, paddingBottom: '80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px 0' }}>
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <span className="lg-badge" style={{ marginBottom: '16px' }}>Legal</span>
            <h1 className="t-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '12px', marginBottom: '10px' }}>
              Terms of Service
            </h1>
            <p className="t-body" style={{ fontSize: '14px', color: 'var(--t-3)' }}>
              As of March 2026 | XERON Engine — xeron-labs.com
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <Section id="s1" title="§ 1 Geltungsbereich">
              <p>
                Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB") gelten für alle Verträge zwischen XERON Labs
                (nachfolgend „Anbieter") und dem Nutzer (nachfolgend „Kunde") über die Nutzung der SaaS-Plattform
                XERON Engine, erreichbar unter <strong style={{ color: 'var(--t-1)' }}>xeron-labs.com</strong>.
              </p>
              <p style={{ marginTop: '10px' }}>
                Entgegenstehende oder abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, der
                Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu. Mit der Registrierung und Nutzung der
                Plattform akzeptiert der Kunde diese AGB in ihrer jeweils aktuellen Fassung.
              </p>
              <p style={{ marginTop: '10px' }}>
                <strong style={{ color: 'var(--t-1)' }}>Anbieter:</strong> XERON Labs<br />
                <strong style={{ color: 'var(--t-1)' }}>Website:</strong> xeron-labs.com<br />
                <strong style={{ color: 'var(--t-1)' }}>E-Mail:</strong> support@xeron-labs.com
              </p>
            </Section>

            <Section id="s2" title="§ 2 Vertragsschluss">
              <p>
                Der Vertrag über die Nutzung der Plattform kommt durch die Registrierung eines Nutzerkontos zustande.
                Mit dem Absenden des Registrierungsformulars und der Bestätigung der Registrierung (z. B. per E-Mail)
                gibt der Kunde ein verbindliches Angebot zum Abschluss des Nutzungsvertrages ab.
              </p>
              <p style={{ marginTop: '10px' }}>
                Der Anbieter nimmt das Angebot durch Freischaltung des Nutzerkontos an. Ein Anspruch auf Registrierung
                besteht nicht. Der Anbieter behält sich vor, Registrierungen ohne Angabe von Gründen abzulehnen.
              </p>
              <p style={{ marginTop: '10px' }}>
                Für den Abschluss von kostenpflichtigen Abonnements oder den Erwerb von Credit-Paketen gelten
                zusätzlich die Regelungen in § 7 und § 8 dieser AGB.
              </p>
            </Section>

            <Section id="s3" title="§ 3 Leistungsangebot">
              <p>
                XERON Engine stellt eine KI-gesteuerte SaaS-Plattform zur automatisierten Generierung von Lua-Code,
                User Interfaces und vollständigen Roblox-Spielwelten bereit. Die Leistungen umfassen:
              </p>
              <ul style={{ marginTop: '10px', marginLeft: '20px', lineHeight: '2' }}>
                <li>Nutzung des Web-Dashboards</li>
                <li>KI-Generierungsmodi: Game Generation, Script, UI, Fix, Clean, Diagnose</li>
                <li>REST-API-Zugang (planabhängig)</li>
                <li>Roblox Studio Plugin zur Synchronisierung generierter Inhalte</li>
                <li>Credit-System zur nutzungsbasierten Abrechnung</li>
              </ul>
              <p style={{ marginTop: '10px' }}>
                Die Plattform wird als Software-as-a-Service (SaaS) bereitgestellt. Ein Anspruch auf ununterbrochene
                Verfügbarkeit besteht nicht. Geplante Wartungsarbeiten werden nach Möglichkeit im Voraus angekündigt.
                Der Anbieter strebt eine Verfügbarkeit von 99 % pro Monat an (exklusive geplanter Wartungsfenster).
              </p>
            </Section>

            <Section id="s4" title="§ 4 Nutzungsbedingungen">
              <p>
                Der Kunde ist verpflichtet, die Plattform ausschließlich für rechtmäßige Zwecke zu nutzen. Insbesondere
                ist es untersagt:
              </p>
              <ul style={{ marginTop: '10px', marginLeft: '20px', lineHeight: '2' }}>
                <li>Die Plattform zur Erstellung von schädlichem, illegalem oder anstößigem Inhalt zu verwenden</li>
                <li>Automatisierte Abfragen (Scraping, Bots) durchzuführen, die über die vorgesehene API-Nutzung hinausgehen</li>
                <li>Sicherheitsmechanismen zu umgehen oder die Infrastruktur des Anbieters zu gefährden</li>
                <li>Zugangsdaten an Dritte weiterzugeben oder Konten zu teilen</li>
                <li>Generierten Code ohne Genehmigung kommerziell weiterzuverkaufen</li>
              </ul>
              <p style={{ marginTop: '10px' }}>
                Bei Verstößen gegen diese Nutzungsbedingungen ist der Anbieter berechtigt, den Account des Kunden
                unverzüglich zu sperren oder zu löschen, ohne dass Ansprüche auf Rückerstattung bereits genutzter
                Credits entstehen.
              </p>
            </Section>

            <Section id="s5" title="§ 5 Urheberrecht">
              <p>
                Der durch XERON Engine generierte Lua-Code und die generierten UI-Elemente werden dem Kunden zur
                ausschließlichen Verwendung in eigenen Roblox-Projekten überlassen. Der Kunde erwirbt an den generierten
                Inhalten ein einfaches, nicht-exklusives Nutzungsrecht.
              </p>
              <p style={{ marginTop: '10px' }}>
                Die kommerzielle Weitergabe, der Weiterverkauf oder die Lizenzierung des generierten Codes an Dritte
                ist ohne ausdrückliche schriftliche Genehmigung des Anbieters nicht gestattet.
              </p>
              <p style={{ marginTop: '10px' }}>
                Alle Rechte an der Plattform selbst, dem Design, dem Quellcode der Website sowie den eingesetzten
                KI-Modellen und Infrastrukturkomponenten verbleiben beim Anbieter oder den jeweiligen Lizenzgebern.
              </p>
            </Section>

            <Section id="s6" title="§ 6 Haftung">
              <p>
                Der Anbieter haftet nicht für Schäden, die durch die Nutzung oder Nicht-Nutzung des generierten Codes
                entstehen. Der generierte Code dient als Ausgangspunkt und erhebt keinen Anspruch auf fehlerfreie
                Funktionalität in allen Roblox-Szenarien oder -Versionen.
              </p>
              <p style={{ marginTop: '10px' }}>
                Eine Haftung für mittelbare Schäden, entgangenen Gewinn, Datenverlust oder Schäden durch Dritte ist
                ausgeschlossen, soweit keine grobe Fahrlässigkeit oder vorsätzliches Handeln des Anbieters oder seiner
                Erfüllungsgehilfen vorliegt.
              </p>
              <p style={{ marginTop: '10px' }}>
                Die Haftung für Schäden aus der Verletzung von Leben, Körper oder Gesundheit sowie die Haftung nach
                dem Produkthaftungsgesetz bleiben unberührt.
              </p>
            </Section>

            <Section id="s7" title="§ 7 Preise und Zahlungsbedingungen">
              <p>
                Alle Preise verstehen sich in Euro (EUR) und enthalten die gesetzliche Mehrwertsteuer.
                Die Zahlungsabwicklung erfolgt über <strong style={{ color: 'var(--t-1)' }}>Stripe</strong>.
                Akzeptierte Zahlungsmethoden: Kreditkarte (Visa, Mastercard, American Express), SEPA-Lastschrift
                sowie weitere von Stripe angebotene Methoden.
              </p>
              <p style={{ marginTop: '10px' }}>
                <strong style={{ color: 'var(--t-1)' }}>Abo-Pläne (monatlich, automatisch verlängernd):</strong>
              </p>
              <ul style={{ marginTop: '8px', marginLeft: '20px', lineHeight: '2' }}>
                <li>Free: 10 Credits/Monat, kostenlos</li>
                <li>Starter: 75 Credits/Monat, 4,99 €/Monat</li>
                <li>Pro: 500 Credits/Monat, 14,99 €/Monat</li>
                <li>Enterprise: 2.000 Credits/Monat, 39,99 €/Monat</li>
              </ul>
              <p style={{ marginTop: '10px' }}>
                <strong style={{ color: 'var(--t-1)' }}>Credit-Pakete (Einmalkauf, verfallen nicht):</strong>
              </p>
              <ul style={{ marginTop: '8px', marginLeft: '20px', lineHeight: '2' }}>
                <li>Mini: 50 Credits — 1,99 €</li>
                <li>Starter: 150 Credits — 4,99 €</li>
                <li>Value: 400 Credits — 11,99 €</li>
                <li>Power: 1.000 Credits — 24,99 €</li>
                <li>Mega: 3.000 Credits — 64,99 €</li>
              </ul>
              <p style={{ marginTop: '10px' }}>
                Abo-Zahlungen werden monatlich automatisch vom hinterlegten Zahlungsmittel eingezogen. Bei
                fehlgeschlagener Zahlung behält sich der Anbieter vor, den Zugang zu kostenpflichtigen Funktionen
                vorübergehend zu sperren.
              </p>
            </Section>

            {/* § 8 with full withdrawal waiver text */}
            <section id="s8" className="lg-card" style={{ padding: '32px 36px', border: '1px solid var(--glass-border-gold)' }}>
              <h2 className="t-headline" style={{ fontSize: '1.15rem', marginBottom: '16px', color: 'var(--gold-400)' }}>
                § 8 Digitale Inhalte und Widerrufsrecht
              </h2>
              <div className="t-body" style={{ fontSize: '14px', color: 'var(--t-2)', lineHeight: '1.8' }}>
                <p>
                  <strong style={{ color: 'var(--t-1)' }}>8.1 Credits als digitale Einheiten</strong><br />
                  Credits sind virtuelle Einheiten, die ausschließlich für die Nutzung von KI-Funktionen auf der
                  XERON-Plattform bestimmt sind. Sie haben keinen Geldwert und sind nicht übertragbar oder auszahlbar.
                  Credit-Pakete (Einmalkauf) sind dauerhaft gültig und verfallen nicht. Monatliche Abo-Credits
                  werden bei jeder Verlängerung zurückgesetzt.
                </p>
                <p style={{ marginTop: '12px' }}>
                  <strong style={{ color: 'var(--t-1)' }}>8.2 Digitale Inhalte nicht auf körperlichem Datenträger</strong><br />
                  Beim Kauf von Credits oder Abonnements handelt es sich um den Erwerb digitaler Inhalte, die nicht
                  auf einem körperlichen Datenträger geliefert werden, sondern unmittelbar nach Zahlungseingang dem
                  Nutzerkonto gutgeschrieben werden.
                </p>
                <p style={{ marginTop: '12px' }}>
                  <strong style={{ color: 'var(--t-1)' }}>8.3 Erlöschen des Widerrufsrechts gemäß § 356 Abs. 5 BGB</strong><br />
                  Das Widerrufsrecht erlischt bei einem Vertrag über die Lieferung von digitalen Inhalten, die nicht
                  auf einem körperlichen Datenträger geliefert werden (§ 312f Abs. 3 BGB), wenn der Anbieter mit der
                  Ausführung des Vertrags begonnen hat, nachdem der Verbraucher
                </p>
                <ul style={{ marginTop: '8px', marginLeft: '20px', lineHeight: '2' }}>
                  <li>ausdrücklich zugestimmt hat, dass der Anbieter mit der Ausführung des Vertrags vor Ablauf der
                    Widerrufsfrist beginnt, und</li>
                  <li>seine Kenntnis davon bestätigt hat, dass er durch seine Zustimmung mit Beginn der Ausführung
                    des Vertrags sein Widerrufsrecht verliert (§ 356 Abs. 5 BGB).</li>
                </ul>
                <p style={{ marginTop: '12px' }}>
                  <strong style={{ color: 'var(--t-1)' }}>8.4 Zustimmung des Nutzers</strong><br />
                  Vor dem Abschluss eines Kaufs von Credits oder eines Abonnements wird der Nutzer ausdrücklich
                  aufgefordert, der sofortigen Ausführung des Vertrags und dem damit verbundenen Erlöschen des
                  Widerrufsrechts zuzustimmen. Diese Zustimmung erfolgt durch aktives Setzen eines Häkchens
                  (Checkbox). Zeitpunkt, IP-Adresse und Zustimmungsstatus werden dokumentiert und gespeichert.
                </p>
                <p style={{ marginTop: '12px' }}>
                  <strong style={{ color: 'var(--t-1)' }}>8.5 Sofortige Gutschrift — kein Rückgaberecht für gutgeschriebene Credits</strong><br />
                  Credits werden unmittelbar nach Zahlungseingang dem Nutzerkonto gutgeschrieben und stehen sofort
                  zur Nutzung bereit. Bereits gutgeschriebene Credits können nicht zurückerstattet werden, da die
                  sofortige Lieferung auf ausdrücklichen Wunsch des Nutzers erfolgt ist und das Widerrufsrecht
                  gemäß § 356 Abs. 5 BGB erloschen ist.
                </p>
              </div>
            </section>

            <Section id="s9" title="§ 9 Abonnements">
              <p>
                Abonnements werden monatlich automatisch verlängert, sofern sie nicht rechtzeitig gekündigt werden.
                Die Kündigung ist jederzeit zum Ende des aktuellen Abrechnungszeitraums möglich. Nach der Kündigung
                bleibt das Abonnement bis zum Ende des bezahlten Zeitraums aktiv.
              </p>
              <p style={{ marginTop: '10px' }}>
                <strong style={{ color: 'var(--t-1)' }}>Kündigung:</strong> Die Kündigung erfolgt ausschließlich
                über die Profileinstellungen im Dashboard (Dashboard → Account → Plan → Abo kündigen) oder über
                das Stripe Billing Portal. Eine Kündigung per E-Mail ist nicht möglich.
              </p>
              <p style={{ marginTop: '10px' }}>
                Bei Kündigung oder Downgrade auf den Free-Plan verfallen nicht verbrauchte Abo-Credits am Ende des
                Abrechnungszeitraums. Einmalkauf-Credits (Credit Packs) bleiben hiervon unberührt und verfallen nicht.
              </p>
            </Section>

            <Section id="s10" title="§ 10 API-Nutzung">
              <p>
                Der Zugriff auf die XERON-API ist planabhängig. Pro-Kunden erhalten bis zu 100 API-Anfragen pro
                Stunde, Enterprise-Kunden bis zu 500 API-Anfragen pro Stunde. Die API darf ausschließlich für eigene
                Anwendungen und nicht für Dienste genutzt werden, die mit XERON Engine in direktem Wettbewerb stehen.
              </p>
              <p style={{ marginTop: '10px' }}>
                Der Anbieter behält sich vor, API-Zugänge bei Missbrauch (z. B. automatisiertem Massenzugriff,
                Reverse Engineering) ohne Vorankündigung zu sperren.
              </p>
            </Section>

            <Section id="s11" title="§ 11 Affiliate-Programm">
              <p>
                Pro- und Enterprise-Kunden können am XERON-Affiliate-Programm teilnehmen. Einzelheiten (Provisionsrate,
                Auszahlungsbedingungen, Mindestbetrag) werden im Dashboard unter „Affiliate" kommuniziert. Der
                Anbieter behält sich vor, das Affiliate-Programm jederzeit zu ändern oder einzustellen, ohne dass
                bereits erworbene, ausgezahlungsreife Guthaben verloren gehen.
              </p>
            </Section>

            <Section id="s12" title="§ 12 Schlussbestimmungen">
              <p>
                Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts (CISG). Gerichtsstand für alle
                Streitigkeiten mit Kaufleuten, juristischen Personen des öffentlichen Rechts oder
                öffentlich-rechtlichen Sondervermögen ist der Sitz des Anbieters. Bei Verbrauchern gilt der
                allgemeine Gerichtsstand.
              </p>
              <p style={{ marginTop: '10px' }}>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
                <br />
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer"
                  style={{ color: 'var(--gold-400)', textDecoration: 'none' }}>
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
              <p style={{ marginTop: '10px' }}>
                Der Anbieter ist nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
              <p style={{ marginTop: '10px' }}>
                Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der
                übrigen Bestimmungen unberührt. An die Stelle der unwirksamen Bestimmung tritt die gesetzlich
                zulässige Regelung, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.
              </p>
              <p style={{ marginTop: '10px' }}>
                Der Anbieter behält sich vor, diese AGB jederzeit mit Wirkung für die Zukunft zu ändern. Änderungen
                werden dem Nutzer per E-Mail oder durch einen Hinweis beim nächsten Login mitgeteilt. Widerspricht
                der Nutzer der Änderung nicht innerhalb von 14 Tagen nach Mitteilung, gelten die geänderten AGB
                als angenommen.
              </p>
            </Section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
