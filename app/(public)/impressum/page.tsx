import Link from 'next/link'

export const metadata = {
  title: 'Impressum — XERON Engine',
}

export default function ImpressumPage() {
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

      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-display text-4xl mb-10">Impressum</h1>

        <div className="glass-card p-8 space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <div>
            <strong className="text-white text-base">XERON Engine</strong><br/>
            xeron-labs.com
          </div>

          <div>
            <strong className="text-white">E-Mail:</strong><br/>
            support@xeron-labs.com
          </div>

          <div className="p-4 rounded-xl" style={{ background: 'rgba(233,69,96,0.05)', border: '1px solid rgba(233,69,96,0.2)' }}>
            <strong className="text-white">Hinweis:</strong><br/>
            Vollständige Angaben gemäß § 5 TMG (Name, Anschrift) folgen. Das Unternehmen befindet sich im Aufbau. Bei rechtlichen Anfragen bitte direkt per E-Mail kontaktieren.
          </div>

          <div>
            <strong className="text-white">Verantwortlich für den Inhalt:</strong><br/>
            XERON Engine · support@xeron-labs.com
          </div>

          <div>
            <strong className="text-white">Haftungsausschluss:</strong><br/>
            Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
          </div>
        </div>
      </div>
    </div>
  )
}
