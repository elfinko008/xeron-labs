import Link from 'next/link'

export const metadata = {
  title: 'Datenschutz — XERON Engine',
  description: 'Datenschutzerklärung der XERON Engine gemäß DSGVO.',
}

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen">
      <nav className="glass-nav sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl">
            <span className="text-gradient-red">XERON</span>
            <span className="text-white"> Engine</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display text-4xl mb-2">Datenschutzerklärung</h1>
        <p className="text-sm mb-10" style={{ color: 'var(--text-muted)' }}>Stand: März 2026 · DSGVO-konform</p>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>

          <section className="glass-card p-6">
            <h2 className="font-display text-xl text-white mb-3">1. Verantwortlicher</h2>
            <p>XERON Engine<br/>E-Mail: support@xeron-labs.com</p>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-xl text-white mb-3">2. Erhobene Daten</h2>
            <p>Wir erheben und verarbeiten folgende personenbezogene Daten:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong className="text-white">E-Mail-Adresse:</strong> Zur Kontoerstellung und Kommunikation</li>
              <li><strong className="text-white">Name:</strong> Optional, bei OAuth-Anmeldung</li>
              <li><strong className="text-white">Zahlungsdaten:</strong> Über Stripe (wir speichern keine Kartendaten direkt)</li>
              <li><strong className="text-white">Prompts:</strong> Deine Spielbeschreibungen für die KI-Generierung</li>
              <li><strong className="text-white">IP-Adresse:</strong> Für Sicherheit und Rate-Limiting</li>
              <li><strong className="text-white">Discord-ID:</strong> Bei Verknüpfung des Discord-Kontos</li>
            </ul>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-xl text-white mb-3">3. Rechtsgrundlagen</h2>
            <p>Die Verarbeitung erfolgt auf Basis von:</p>
            <ul className="mt-3 space-y-1 list-disc list-inside">
              <li>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</li>
              <li>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung, z.B. Marketing)</li>
              <li>Art. 6 Abs. 1 lit. f DSGVO (berechtigte Interessen, z.B. Sicherheit)</li>
            </ul>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-xl text-white mb-3">4. Drittanbieter und Datenübermittlung</h2>
            <div className="space-y-3">
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <strong className="text-white">Supabase</strong> (Frankfurt, EU) — Datenbank und Authentifizierung. Daten werden innerhalb der EU gespeichert.
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <strong className="text-white">Stripe</strong> (USA) — Zahlungsabwicklung. Datenübermittlung auf Basis von EU-Standardvertragsklauseln (SCCs).
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <strong className="text-white">Anthropic</strong> (USA) — KI-Verarbeitung (Claude). Prompts werden zur Generierung übermittelt. Datenübermittlung per SCCs.
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <strong className="text-white">Google</strong> (USA) — Gemini KI und OAuth-Login. Datenübermittlung per SCCs.
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <strong className="text-white">Discord</strong> (USA) — OAuth-Login und Community-Integration. Datenübermittlung per SCCs.
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <strong className="text-white">Vercel</strong> (USA) — Hosting. Datenübermittlung per SCCs.
              </div>
            </div>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-xl text-white mb-3">5. Deine Rechte</h2>
            <p>Du hast folgende Rechte bezüglich deiner personenbezogenen Daten:</p>
            <ul className="mt-3 space-y-1 list-disc list-inside">
              <li><strong className="text-white">Auskunft</strong> (Art. 15 DSGVO)</li>
              <li><strong className="text-white">Berichtigung</strong> (Art. 16 DSGVO)</li>
              <li><strong className="text-white">Löschung</strong> (Art. 17 DSGVO) — Account-Löschung per E-Mail</li>
              <li><strong className="text-white">Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)</li>
              <li><strong className="text-white">Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
              <li><strong className="text-white">Widerspruch</strong> (Art. 21 DSGVO)</li>
            </ul>
            <p className="mt-3">Zur Ausübung dieser Rechte: support@xeron-labs.com</p>
            <p className="mt-3">Du hast außerdem das Recht, Beschwerde bei einer Datenschutzaufsichtsbehörde einzulegen.</p>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-xl text-white mb-3">6. Cookies</h2>
            <p>Wir verwenden ausschließlich technisch notwendige Cookies (Session-Cookies für die Authentifizierung). Es werden keine Tracking- oder Werbe-Cookies eingesetzt.</p>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-xl text-white mb-3">7. Datensicherheit</h2>
            <p>Deine Daten werden mit branchenüblichen Sicherheitsmaßnahmen geschützt. Die Übertragung erfolgt ausschließlich über HTTPS. Passwörter werden gehasht gespeichert (via Supabase Auth).</p>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-xl text-white mb-3">8. Kontakt</h2>
            <p>Bei Fragen zum Datenschutz: support@xeron-labs.com</p>
          </section>

        </div>
      </div>
    </div>
  )
}
