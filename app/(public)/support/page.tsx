import Link from 'next/link'

export const metadata = {
  title: 'Support — XERON Engine',
  description: 'Hilfe und Support für XERON Engine.',
}

const BETREFF_TABLE = [
  { problem: 'Login Problem',      betreff: '[LOGIN] Problem + deine Email' },
  { problem: 'Generierungsfehler', betreff: '[GENERIERUNG] Fehler + deine Email' },
  { problem: 'Credits fehlen',     betreff: '[CREDITS] Problem + deine Email' },
  { problem: 'Zahlungsproblem',    betreff: '[ZAHLUNG] Problem + deine Email' },
  { problem: 'Plugin Problem',     betreff: '[PLUGIN] Problem + deine Email' },
  { problem: 'Sonstiges',          betreff: '[SUPPORT] Kurze Beschreibung + deine Email' },
]

export default function SupportPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl">
            <span className="text-gradient-red">XERON</span>
            <span className="text-white"> Engine</span>
          </Link>
          <Link href="/dashboard" className="glass-button-primary px-5 py-2 rounded-xl text-sm font-medium">
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="glass-badge mb-4 inline-block">Support</div>
          <h1 className="font-display text-4xl mb-4">Support &amp; Hilfe</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Wir helfen dir so schnell wie möglich weiter
          </p>
        </div>

        {/* 3 Kontaktwege */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {/* Discord */}
          <div className="glass-card p-6 flex flex-col">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                 style={{ background: 'rgba(88,101,242,0.15)', border: '1px solid rgba(88,101,242,0.3)' }}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" style={{ color: '#5865F2' }}>
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/>
              </svg>
            </div>
            <h3 className="font-display text-lg mb-1">Discord</h3>
            <p className="text-sm mb-4 flex-1" style={{ color: 'var(--text-secondary)' }}>
              Schnellste Antwort! Tritt bei, gehe zu #support und schreibe <code className="text-white">/ticket</code>.
            </p>
            <a href="https://discord.gg/u5HF4CQPug" target="_blank" rel="noopener noreferrer"
               className="glass-button py-2.5 rounded-xl text-sm font-medium text-center block">
              discord.gg/u5HF4CQPug
            </a>
          </div>

          {/* Email */}
          <div className="glass-card p-6 flex flex-col">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                 style={{ background: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6" style={{ color: 'var(--accent-red)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h3 className="font-display text-lg mb-1">E-Mail</h3>
            <p className="text-sm mb-4 flex-1" style={{ color: 'var(--text-secondary)' }}>
              Schreibe uns direkt an. Antwortzeit: 24–48 Stunden (Werktage).
            </p>
            <a href="mailto:support@xeron-labs.com"
               className="glass-button-primary py-2.5 rounded-xl text-sm font-medium text-center block">
              support@xeron-labs.com
            </a>
          </div>

          {/* FAQ */}
          <div className="glass-card p-6 flex flex-col">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                 style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6" style={{ color: '#00d4ff' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="font-display text-lg mb-1">FAQ</h3>
            <p className="text-sm mb-4 flex-1" style={{ color: 'var(--text-secondary)' }}>
              Viele Fragen sind schon beantwortet — schau erst in die FAQ.
            </p>
            <Link href="/#faq" className="glass-button py-2.5 rounded-xl text-sm font-medium text-center block">
              FAQ ansehen
            </Link>
          </div>
        </div>

        {/* Email-Anleitung */}
        <div className="glass-card p-6">
          <h2 className="font-display text-xl mb-4">E-Mail richtig schreiben</h2>
          <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
            Nutze den richtigen Betreff, damit wir dir schneller helfen können:
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th className="text-left pb-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Problem</th>
                  <th className="text-left pb-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Betreff</th>
                </tr>
              </thead>
              <tbody>
                {BETREFF_TABLE.map((row) => (
                  <tr key={row.problem} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="py-2.5 pr-6" style={{ color: 'var(--text-secondary)' }}>{row.problem}</td>
                    <td className="py-2.5">
                      <code className="text-xs" style={{ color: 'var(--accent-red)' }}>{row.betreff}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 rounded-xl text-sm space-y-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>📧 Immer angeben: deine <strong className="text-white">Registrierungs-E-Mail</strong></p>
            <p style={{ color: 'var(--text-secondary)' }}>📸 Screenshot anhängen falls möglich</p>
            <p style={{ color: 'var(--text-secondary)' }}>📝 Beschreiben was passiert ist und was du erwartet hast</p>
          </div>
        </div>
      </div>
    </div>
  )
}
