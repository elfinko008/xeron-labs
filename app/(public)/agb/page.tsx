import Link from 'next/link'

export const metadata = {
  title: 'AGB — XERON Engine',
  description: 'Allgemeine Geschäftsbedingungen der XERON Engine.',
}

export default function AGBPage() {
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
        <h1 className="font-display text-4xl mb-2">Allgemeine Geschäftsbedingungen</h1>
        <p className="text-sm mb-10" style={{ color: 'var(--text-muted)' }}>Stand: März 2026</p>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>

          <section className="glass-card p-6">
            <h2 className="font-display text-xl text-white mb-3">§ 1 Anbieter und Geltungsbereich</h2>
            <p>Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der SaaS-Plattform XERON Engine, erreichbar unter xeron-labs.com.</p>
            <p className="mt-3"><strong className="text-white">Anbieter:</strong> XERON Engine<br/>
            <strong className="text-white">E-Mail:</strong> support@xeron-labs.com</p>
            <p className="mt-3">Mit der Registrierung und Nutzung der Plattform akzeptierst du diese AGB.</p>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-xl text-white mb-3">§ 2 Leistungsbeschreibung</h2>
            <p>XERON Engine stellt eine KI-gesteuerte Plattform zur automatisierten Generierung von Lua-Code für Roblox-Spiele bereit. Die Leistung umfasst die Nutzung des Web-Dashboards, der API und des Roblox Studio Plugins.</p>
            <p className="mt-3">Die Plattform wird als Software-as-a-Service (SaaS) bereitgestellt. Ein Anspruch auf ununterbrochene Verfügbarkeit besteht nicht. Wartungsarbeiten werden nach Möglichkeit angekündigt.</p>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-xl text-white mb-3">§ 3 Vertragsschluss</h2>
            <p>Der Vertrag kommt durch die Registrierung eines Nutzerkontos zustande. Durch Bestätigung der Registrierung erklärt der Nutzer sein Einverständnis mit diesen AGB.</p>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-xl text-white mb-3">§ 4 Abo-Pläne und Credit-System</h2>
            <p><strong className="text-white">Abo-Pläne</strong> (monatlich, automatisch verlängernd):</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Free: 10 Credits/Monat, kostenlos</li>
              <li>Starter: 100 Credits/Monat, 4,99 €/Mo</li>
              <li>Pro: 500 Credits/Monat, 14,99 €/Mo</li>
              <li>Enterprise: 1.000 Credits/Monat, 39,99 €/Mo</li>
            </ul>
            <p className="mt-3"><strong className="text-white">Credit-Pakete</strong> (Einmalkauf, verfallen nicht):</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Mini: 50 Credits, 1,99 €</li>
              <li>Starter: 150 Credits, 4,99 €</li>
              <li>Value: 400 Credits, 11,99 €</li>
              <li>Power: 1.000 Credits, 24,99 €</li>
              <li>Mega: 3.000 Credits, 64,99 €</li>
            </ul>
            <p className="mt-3">Einmalkauf-Credits sind ausschließlich für Scripts &amp; UI verwendbar. Für die Generierung von Spielen ist ein aktives Abo erforderlich.</p>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-xl text-white mb-3">§ 5 Widerrufsrecht</h2>
            <p>Als Verbraucher hast du das Recht, innerhalb von 14 Tagen ohne Angabe von Gründen vom Vertrag zurückzutreten. Die Widerrufsfrist beginnt mit dem Tag des Vertragsabschlusses.</p>
            <p className="mt-3">Das Widerrufsrecht erlischt bei digitalen Inhalten, wenn die Ausführung des Vertrags begonnen hat und du ausdrücklich zugestimmt hast, dass wir vor Ablauf der Widerrufsfrist mit der Ausführung beginnen.</p>
            <p className="mt-3">Widerruf per E-Mail an: support@xeron-labs.com</p>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-xl text-white mb-3">§ 6 Zahlung</h2>
            <p>Die Zahlungsabwicklung erfolgt über Stripe. Akzeptierte Zahlungsmethoden: Kreditkarte (Visa, Mastercard, Amex), SEPA-Lastschrift und weitere von Stripe angebotene Methoden.</p>
            <p className="mt-3">Abo-Zahlungen werden monatlich automatisch eingezogen. Bei fehlgeschlagener Zahlung behält sich XERON Engine vor, den Account vorübergehend zu sperren.</p>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-xl text-white mb-3">§ 7 Nutzungsrechte am generierten Code</h2>
            <p>Der durch XERON Engine generierte Lua-Code wird dem Nutzer zur ausschließlichen Verwendung in eigenen Roblox-Projekten überlassen. Eine kommerzielle Weitergabe oder der Weiterverkauf des generierten Codes ist ohne ausdrückliche Genehmigung nicht gestattet.</p>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-xl text-white mb-3">§ 8 Haftungsbeschränkung</h2>
            <p>XERON Engine haftet nicht für Schäden, die durch die Nutzung des generierten Codes entstehen. Der generierte Code dient als Ausgangspunkt und erhebt keinen Anspruch auf fehlerfreie Funktionalität in allen Roblox-Szenarien.</p>
            <p className="mt-3">Eine Haftung für mittelbare Schäden, entgangenen Gewinn oder Datenverlust ist ausgeschlossen, soweit keine grobe Fahrlässigkeit oder Vorsatz vorliegt.</p>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-xl text-white mb-3">§ 9 Kündigung</h2>
            <p>Abonnements können jederzeit zum Ende des aktuellen Abrechnungszeitraums über das Stripe Billing Portal (erreichbar im Dashboard) gekündigt werden.</p>
          </section>

          <section className="glass-card p-6">
            <h2 className="font-display text-xl text-white mb-3">§ 10 Geltendes Recht und Gerichtsstand</h2>
            <p>Es gilt deutsches Recht. Gerichtsstand ist Deutschland. Bei Streitigkeiten mit Verbrauchern gilt der Wohnsitz des Verbrauchers als Gerichtsstand.</p>
            <p className="mt-3">EU-Streitschlichtung: Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr</p>
          </section>

        </div>
      </div>
    </div>
  )
}
