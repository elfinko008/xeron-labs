import Link from 'next/link'

export const metadata = {
  title: 'Tutorial — XERON Engine',
  description: 'Lerne wie du perfekte Prompts für maximale Spielqualität schreibst.',
}

const sections = [
  {
    title: '1. Spieltyp angeben',
    content: (
      <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
        <p>Starte immer mit dem Spieltyp:</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {['Obby', 'Roleplay', 'Horror', 'Racing', 'Shooter', 'Sandbox'].map((t) => (
            <span key={t} className="glass-badge">{t}</span>
          ))}
        </div>
        <p className="mt-3">Beispiel: <code className="text-white">"Erstelle ein Roleplay-Spiel..."</code></p>
      </div>
    ),
  },
  {
    title: '2. Größe in Studs angeben',
    content: (
      <div className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
        <p>Roblox verwendet Studs als Einheit. Empfohlene Größen:</p>
        <ul className="space-y-1 mt-2">
          <li>• Klein: <span className="text-white">100x100 Studs</span> (Obby, Mini-Spiel)</li>
          <li>• Mittel: <span className="text-white">300x300 Studs</span> (Roleplay, Horror)</li>
          <li>• Groß: <span className="text-white">500x500 Studs</span> (Open World, Racing)</li>
        </ul>
      </div>
    ),
  },
  {
    title: '3. Biom wählen',
    content: (
      <div className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
        <p>Das Terrain-Biom bestimmt Aussehen und Atmosphäre:</p>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {[
            { name: 'Wald', desc: 'Bäume, Hügel, grünes Terrain' },
            { name: 'Stadt', desc: 'Flaches Terrain, urbane Gebäude' },
            { name: 'Wüste', desc: 'Sand, Felsen, weite Flächen' },
            { name: 'Space', desc: 'Dunkles Terrain, Krater, Sterne' },
            { name: 'Unterwasser', desc: 'Korallen, Sand, Meeresgrund' },
            { name: 'Schnee', desc: 'Weiße Landschaft, Eis, Berge' },
          ].map((b) => (
            <div key={b.name} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="font-medium text-white text-xs mb-1">{b.name}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: '4. Assets beschreiben',
    content: (
      <div className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
        <p>Nenne konkret welche Objekte du möchtest:</p>
        <ul className="space-y-1 mt-2">
          <li>• <span className="text-white">Fahrzeuge:</span> "3 Autos, 1 Motorrad, 2 Trucks"</li>
          <li>• <span className="text-white">Gebäude:</span> "5 Häuser, 1 Krankenhaus, 1 Polizeiwache"</li>
          <li>• <span className="text-white">NPCs:</span> "10 zufällig laufende NPCs"</li>
          <li>• <span className="text-white">Waffen:</span> "Pistole, Rifle, Granate mit Damage-System"</li>
        </ul>
      </div>
    ),
  },
  {
    title: '5. Spielmechaniken',
    content: (
      <div className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
        <p>Definiere die Spiellogik:</p>
        <ul className="space-y-1 mt-2">
          <li>• <span className="text-white">Leaderboard:</span> "Leaderboard mit Geld und Level"</li>
          <li>• <span className="text-white">Teams:</span> "2 Teams: Polizei vs. Gangster"</li>
          <li>• <span className="text-white">Checkpoints:</span> "Checkpoint-System mit Respawn"</li>
          <li>• <span className="text-white">Shops:</span> "Fahrzeug-Shop mit DataStore"</li>
          <li>• <span className="text-white">Jobs:</span> "Taxifahrer, Polizist, Arzt Jobs"</li>
        </ul>
      </div>
    ),
  },
  {
    title: '6. Atmosphäre & Lighting',
    content: (
      <div className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
        <p>Steuere die visuelle Stimmung:</p>
        <ul className="space-y-1 mt-2">
          <li>• <span className="text-white">Tageszeit:</span> "Sonnenuntergang (18:00 Uhr)"</li>
          <li>• <span className="text-white">Wetter:</span> "Leichter Regen, Nebel"</li>
          <li>• <span className="text-white">Bloom:</span> "Bloom-Effekt aktiviert"</li>
          <li>• <span className="text-white">Atmosphäre:</span> "Haze: 0.3, Density: 0.5"</li>
        </ul>
      </div>
    ),
  },
]

const ROLEPLAY_EXAMPLE = `Erstelle ein Roleplay-Spiel in einer mittelalterlichen Fantasiestadt.
Terrain: 400x400 Studs, Wald-Biom mit Hügeln, Fluss durch die Mitte.
Atmosphäre: Abendrot (19:00 Uhr), leichter Nebel, Bloom-Effekt.
Gebäude: Schloss auf einem Hügel, Marktplatz mit 8 Ständen, Taverne, Schmiede, Kirche, 15 Häuser.
NPCs: 20 Bürger die zufällig durch die Stadt laufen.
Scripts: Leaderboard (Gold, Level, Ruf), Shop-System im Marktplatz (DataStore), Tür-Script für alle Gebäude.
GUI: Hauptmenü mit Spieler-Stats, Minimap, Benachrichtigungen.
Spawnpoints: 5 verschiedene Spawn-Punkte in der Stadt.`

const OBBY_EXAMPLE = `Erstelle einen Obby mit 30 Stages.
Terrain: 150x800 Studs, Wolken-Biom, fliegende Inseln.
Atmosphäre: Tag, klarer Himmel, leichter Fog-Effekt.
Stages: Progressiv schwieriger. Stage 1-10: Grundsprünge. Stage 11-20: Bewegliche Plattformen. Stage 21-30: Rotierende Objekte, Kill-Bricks.
Scripts: Checkpoint-System mit DataStore (Fortschritt wird gespeichert), Leaderboard (Stages abgeschlossen), Respawn am letzten Checkpoint.
GUI: Stage-Anzeige, Timer, "Stage X abgeschlossen!" Benachrichtigung.
Spawnpoints: Checkpoint pro Stage.`

export default function TutorialPage() {
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
            Dashboard öffnen
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="glass-badge mb-4 inline-block">Tutorial</div>
          <h1 className="font-display text-4xl mb-4">Bessere Prompts schreiben</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            So bekommst du maximale Spielqualität von XERON Engine
          </p>
        </div>

        {/* Was kostet was? */}
        <div className="glass-card p-6 mb-8">
          <h2 className="font-display text-xl mb-4">Was kostet was?</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th className="text-left pb-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Aktion</th>
                  <th className="text-left pb-3 font-medium" style={{ color: 'var(--accent-red)' }}>Credits</th>
                  <th className="text-left pb-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Mindest-Plan</th>
                  <th className="text-left pb-3 font-medium" style={{ color: 'var(--text-secondary)' }}>KI-Modell</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { action: 'Script / UI',       credits: '10',  plan: 'Free',     model: 'Gemini Flash-Lite' },
                  { action: 'Kleines Spiel',      credits: '25',  plan: 'Starter+', model: 'Claude Haiku' },
                  { action: 'Normales Spiel',     credits: '50',  plan: 'Starter+', model: 'Claude Haiku' },
                  { action: 'High-End Spiel',     credits: '200', plan: 'Pro+',     model: 'Claude Sonnet' },
                  { action: 'Fix klein',          credits: '15',  plan: 'Starter+', model: 'Claude Haiku' },
                  { action: 'Fix groß',           credits: '50',  plan: 'Starter+', model: 'Claude Sonnet' },
                ].map((row) => (
                  <tr key={row.action} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="py-2.5 pr-4 text-white">{row.action}</td>
                    <td className="py-2.5 pr-4 font-display" style={{ color: 'var(--accent-red)' }}>{row.credits}</td>
                    <td className="py-2.5 pr-4" style={{ color: 'var(--text-secondary)' }}>{row.plan}</td>
                    <td className="py-2.5" style={{ color: 'var(--text-muted)' }}>{row.model}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
            💡 Gekaufte Credit-Pakete funktionieren nur für Scripts &amp; UI — Spiele benötigen ein aktives Abo.
          </p>
        </div>

        {/* Spieltypen erklärt */}
        <div className="glass-card p-6 mb-4">
          <h2 className="font-display text-lg mb-4">Spieltypen erklärt</h2>
          <div className="grid grid-cols-2 gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {[
              { type: 'Obby', desc: 'Hindernisparcours mit Checkpoints' },
              { type: 'Roleplay', desc: 'Offene Welt mit Jobs & NPCs' },
              { type: 'Horror', desc: 'Grusige Atmosphäre, Jumpscares' },
              { type: 'Racing', desc: 'Fahrzeuge, Strecken, Leaderboard' },
              { type: 'Shooter', desc: 'Teams, Waffen, Kill-System' },
              { type: 'Sandbox', desc: 'Freies Bauen & Erkunden' },
            ].map((s) => (
              <div key={s.type} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="font-medium text-white mb-1">{s.type}</div>
                <div className="text-xs">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Der perfekte Prompt */}
        <div className="glass-card p-6 mb-4">
          <h2 className="font-display text-lg mb-4">Der perfekte Prompt</h2>
          <div className="text-sm space-y-3" style={{ color: 'var(--text-secondary)' }}>
            <p>Ein guter Prompt enthält immer diese 5 Elemente:</p>
            <ol className="space-y-2 list-decimal list-inside">
              <li><strong className="text-white">Spieltyp</strong> — z.B. &quot;Roleplay-Spiel&quot;</li>
              <li><strong className="text-white">Terrain-Größe</strong> — z.B. &quot;400x400 Studs, Wald-Biom&quot;</li>
              <li><strong className="text-white">Assets</strong> — konkrete Objekte, Gebäude, Fahrzeuge</li>
              <li><strong className="text-white">Spielmechaniken</strong> — Leaderboard, DataStore, Teams</li>
              <li><strong className="text-white">Atmosphäre</strong> — Tageszeit, Wetter, Lighting</li>
            </ol>
            <p className="mt-3">Je detaillierter dein Prompt, desto besser das Ergebnis. Nutze die Beispiel-Prompts unten als Vorlage.</p>
          </div>
        </div>

        {/* Terrain & High-End */}
        <div className="glass-card p-6 mb-4">
          <h2 className="font-display text-lg mb-4">Terrain &amp; High-End Grafik</h2>
          <div className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
            <p>High-End Generierungen (200 Credits, Pro+) verwenden Claude Sonnet und erzeugen:</p>
            <ul className="space-y-1 list-disc list-inside mt-2">
              <li>Detailliertes Multi-Biom Terrain</li>
              <li>Erweiterte Lighting-Einstellungen (Bloom, Atmosphere, ColorCorrection)</li>
              <li>Komplexere Script-Architektur mit DataStore</li>
              <li>Optimierten Code für mehr Spieler-Performance</li>
            </ul>
            <p className="mt-3">Für normale Spiele reicht Standard (50 Credits) völlig aus.</p>
          </div>
        </div>

        {/* Fix-Modus */}
        <div className="glass-card p-6 mb-4">
          <h2 className="font-display text-lg mb-4">Fix-Modus richtig einsetzen</h2>
          <div className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
            <p><strong className="text-white">Fix klein (15 Credits):</strong> Für einzelne Bugs, Script-Fehler oder kleine Anpassungen an bestehendem Code.</p>
            <p><strong className="text-white">Fix groß (50 Credits):</strong> Für komplette Überarbeitungen, Performance-Optimierungen oder strukturelle Änderungen.</p>
            <p className="mt-2">Beschreibe beim Fix immer genau: Was funktioniert nicht? Was soll es stattdessen tun?</p>
          </div>
        </div>

        {/* Plugin Schritt für Schritt */}
        <div className="glass-card p-6 mb-8">
          <h2 className="font-display text-lg mb-4">Plugin Schritt für Schritt</h2>
          <ol className="text-sm space-y-3 list-decimal list-inside" style={{ color: 'var(--text-secondary)' }}>
            <li>Im Dashboard auf <strong className="text-white">&quot;Plugin herunterladen&quot;</strong> klicken</li>
            <li>Die <code className="text-white">.rbxm</code> Datei speichern</li>
            <li>Roblox Studio öffnen → <strong className="text-white">Plugins → Manage Plugins → Install from File</strong></li>
            <li>Plugin mit deinem XERON-Account verbinden (Token aus Dashboard)</li>
            <li>Nach der Generierung im Plugin auf <strong className="text-white">&quot;Sync&quot;</strong> klicken</li>
            <li>Der Code erscheint automatisch im ServerScriptService</li>
          </ol>
        </div>

        {/* Sektionen */}
        <div className="space-y-4">
          {sections.map((s) => (
            <div key={s.title} className="glass-card p-6">
              <h2 className="font-display text-lg mb-4">{s.title}</h2>
              {s.content}
            </div>
          ))}
        </div>

        {/* Beispiel-Prompts */}
        <div className="mt-10 space-y-6">
          <h2 className="font-display text-2xl">Beispiel-Prompts</h2>

          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="glass-badge">Roleplay</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Komplex · 15 Credits</span>
            </div>
            <pre className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
              {ROLEPLAY_EXAMPLE}
            </pre>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="glass-badge">Obby</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Mittel · 5–15 Credits</span>
            </div>
            <pre className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
              {OBBY_EXAMPLE}
            </pre>
          </div>
        </div>

        {/* Do's & Don'ts */}
        <div className="mt-10">
          <h2 className="font-display text-2xl mb-6">Do&apos;s &amp; Don&apos;ts</h2>
          <div className="glass-card p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th className="text-left pb-3 font-display" style={{ color: '#00ff80' }}>Do ✓</th>
                  <th className="text-left pb-3 font-display" style={{ color: 'var(--accent-red)' }}>Don&apos;t ✗</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {[
                  ['Spieltyp + Terrain-Größe angeben', 'Nur "mach ein Spiel" schreiben'],
                  ['Konkrete Gebäude & Assets benennen', 'Vage bleiben ("viele Sachen")'],
                  ['Mechaniken detailliert beschreiben', 'Zu viele Features auf einmal'],
                  ['Atmosphäre & Tageszeit festlegen', 'Widersprüchliche Anforderungen'],
                  ['Leaderboard/DataStore explizit nennen', 'Englische Prompts mischen'],
                ].map(([do_, dont], i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="py-2.5 pr-6" style={{ color: 'var(--text-secondary)' }}>{do_}</td>
                    <td className="py-2.5" style={{ color: 'var(--text-muted)' }}>{dont}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bild-Platzhalter */}
        <div className="mt-10">
          <h2 className="font-display text-2xl mb-6">Beispiel-Ergebnisse</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2].map((n) => (
              <div key={n} className="glass-card aspect-video flex items-center justify-center"
                   style={{ minHeight: 180 }}>
                <div className="text-center">
                  <div className="text-2xl mb-2">🖼️</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Beispiel {n} · /images/tutorial/beispiel{n}.png
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/register" className="glass-button-primary px-8 py-4 rounded-2xl font-semibold inline-block">
            Jetzt kostenlos ausprobieren →
          </Link>
        </div>
      </div>
    </div>
  )
}
