'use client'

import { useState } from 'react'
import Link from 'next/link'

// ============================================================
// NAVBAR
// ============================================================
function Navbar() {
  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-display text-xl tracking-tight">
          <span className="text-gradient-red">XERON</span>
          <span className="text-white"> Engine</span>
        </span>
        <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#preise" className="hover:text-white transition-colors">Preise</Link>
          <Link href="/tutorial" className="hover:text-white transition-colors">Tutorial</Link>
          <Link href="/community" className="hover:text-white transition-colors">Community</Link>
          <Link href="/support" className="hover:text-white transition-colors">Support</Link>
          <Link href="#faq" className="hover:text-white transition-colors">FAQ</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm px-4 py-2 rounded-xl transition-colors hover:text-white" style={{ color: 'var(--text-secondary)' }}>
            Anmelden
          </Link>
          <Link href="/register" className="glass-button-primary text-sm px-5 py-2 rounded-xl font-medium">
            Kostenlos starten
          </Link>
        </div>
      </div>
    </nav>
  )
}

// ============================================================
// 1. HERO
// ============================================================
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Partikel */}
      <div className="particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="glass-badge mb-6 inline-block">
          KI-gesteuerte Roblox-Spielgenerierung
        </div>

        <h1 className="font-display text-5xl md:text-7xl mb-6 leading-tight">
          <span className="text-white">XERON</span>{' '}
          <span className="text-gradient-red">Engine</span>
        </h1>

        <p className="text-xl md:text-2xl mb-4" style={{ color: 'var(--text-secondary)' }}>
          Beschreibe dein Roblox-Spiel.
        </p>
        <p className="text-xl md:text-2xl mb-10 font-medium text-white">
          Wir bauen es.
        </p>

        <p className="text-base mb-12 max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Vollständige Roblox-Spiele in Minuten — KI generiert Terrain, Scripts, GUI und mehr.
          Direkt per Plugin in Roblox Studio importieren.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="glass-button-primary px-8 py-4 rounded-2xl text-lg font-semibold"
          >
            Kostenlos starten
          </Link>
          <Link
            href="/tutorial"
            className="glass-button px-8 py-4 rounded-2xl text-lg font-semibold"
          >
            Demo ansehen
          </Link>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// 2. ZAHLEN
// ============================================================
function StatsSection() {
  const stats = [
    { value: '2 Min', label: 'Durchschnittliche Generierungszeit' },
    { value: 'High-End', label: 'Grafik mit Claude Sonnet' },
    { value: 'Auto', label: 'Plugin-Sync in Roblox Studio' },
    { value: 'Plugin', label: 'Direkter Studio-Import' },
  ]

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.value} className="glass-card p-6 text-center">
            <div className="font-display text-3xl md:text-4xl text-gradient-red mb-2">
              {stat.value}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ============================================================
// 3. FEATURES
// ============================================================
function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      ),
      title: 'KI-Generierung',
      desc: 'Gemini, Claude Haiku oder Sonnet — je nach Plan und Aufgabe automatisch ausgewählt.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
      title: 'Vollständiger Lua-Code',
      desc: 'Terrain, Lighting, Scripts, GUI, NPCs — alles in einem Durchgang generiert.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
      title: 'Roblox Studio Plugin',
      desc: 'Ein Klick — und dein generiertes Spiel erscheint direkt in Roblox Studio.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
      ),
      title: 'Credit-System',
      desc: 'Faire Preise. Free-Plan inklusive. Credits kaufen oder monatlich per Abo.',
    },
  ]

  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-4xl text-center mb-4">
          Alles was du brauchst
        </h2>
        <p className="text-center mb-12" style={{ color: 'var(--text-secondary)' }}>
          Von der Idee zum spielbaren Roblox-Spiel in Minuten
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.title} className="glass-card p-8">
              <div className="text-accent-red mb-4" style={{ color: 'var(--accent-red)' }}>
                {f.icon}
              </div>
              <h3 className="font-display text-xl mb-3">{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// 4. SO FUNKTIONIERT ES
// ============================================================
function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      title: 'Spiel beschreiben',
      desc: 'Beschreibe dein Roblox-Spiel in natürlicher Sprache. Spieltyp, Terrain, Scripts, GUI — so detailliert wie du möchtest.',
    },
    {
      num: '02',
      title: 'KI generiert',
      desc: 'XERON Engine wählt automatisch die beste KI und generiert vollständigen Lua-Code für dein Spiel — in ca. 2 Minuten.',
    },
    {
      num: '03',
      title: 'In Studio laden',
      desc: 'Mit einem Klick im Roblox Studio Plugin wird dein Spiel direkt importiert und ist sofort spielbereit.',
    },
  ]

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-4xl text-center mb-4">
          So funktioniert es
        </h2>
        <p className="text-center mb-12" style={{ color: 'var(--text-secondary)' }}>
          3 Schritte zum fertigen Roblox-Spiel
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="glass-card p-8">
              <div className="font-display text-5xl text-gradient-red mb-4 opacity-60">
                {step.num}
              </div>
              <h3 className="font-display text-xl mb-3">{step.title}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// 5. PREISE
// ============================================================
function PricingSection() {
  const plans = [
    {
      name: 'Free',
      price: '0',
      credits: '10 Credits/Mo',
      features: ['10 Credits pro Monat', 'Nur Script & UI (Gemini)', 'Max. 1 Generierung/Tag', 'Roblox Studio Plugin'],
      note: null,
      cta: 'Kostenlos starten',
      href: '/register',
      isPro: false,
    },
    {
      name: 'Starter',
      price: '4,99',
      credits: '100 Credits/Mo',
      features: ['100 Credits pro Monat', 'Claude Haiku KI', 'Script, UI & kleine Spiele', 'Email Support'],
      note: null,
      cta: 'Starter wählen',
      href: '/register?plan=starter',
      isPro: false,
    },
    {
      name: 'Pro',
      price: '14,99',
      credits: '500 Credits/Mo',
      badge: 'Beliebt',
      features: ['500 Credits pro Monat', 'Claude Haiku + Sonnet', 'Alle Spieltypen', 'Priority Support', 'High-End Grafik'],
      note: null,
      cta: 'Pro wählen',
      href: '/register?plan=pro',
      isPro: true,
    },
    {
      name: 'Enterprise',
      price: '39,99',
      credits: '1.000 Credits/Mo',
      features: ['1.000 Credits pro Monat', 'Claude Sonnet (alle Tasks)', 'Roblox Studio Plugin', 'Dedizierter Support', 'API-Zugang'],
      note: null,
      cta: 'Enterprise wählen',
      href: '/register?plan=enterprise',
      isPro: false,
    },
  ]

  return (
    <section id="preise" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl text-center mb-4">Faire Preise</h2>
        <p className="text-center mb-12" style={{ color: 'var(--text-secondary)' }}>
          Starte kostenlos — upgrade wenn du mehr brauchst
        </p>
        <div className="grid md:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div key={plan.name} className={plan.isPro ? 'glass-card-pro p-8 flex flex-col' : 'glass-card p-8 flex flex-col'}>
              {plan.badge && (
                <div className="glass-badge-red mb-3 self-start">{plan.badge}</div>
              )}
              <h3 className="font-display text-2xl mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display text-4xl">{plan.price}</span>
                <span style={{ color: 'var(--text-muted)' }}>€/Mo</span>
              </div>
              <div className="glass-badge mb-6 self-start">{plan.credits}</div>
              <ul className="space-y-2 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent-red)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className={plan.isPro ? 'glass-button-primary px-6 py-3 rounded-xl text-center font-medium text-sm' : 'glass-button px-6 py-3 rounded-xl text-center font-medium text-sm'}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// 6. TUTORIAL VORSCHAU
// ============================================================
function TutorialSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="glass-card p-10 text-center">
          <div className="glass-badge mb-4 inline-block">Tutorial</div>
          <h2 className="font-display text-3xl mb-4">Lerne, bessere Prompts zu schreiben</h2>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            Unser Tutorial zeigt dir, wie du perfekte Prompts für maximale Spielqualität erstellst —
            mit Beispielen für Roleplay, Obby, Horror und mehr.
          </p>
          <Link href="/tutorial" className="glass-button-primary px-8 py-4 rounded-2xl font-semibold inline-block">
            Tutorial öffnen
          </Link>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// 7. FAQ
// ============================================================
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    // Allgemein
    {
      cat: 'Allgemein',
      q: 'Was ist XERON Engine?',
      a: 'XERON Engine ist eine KI-gesteuerte SaaS-Plattform, die automatisch vollständige Roblox-Spiele generiert. Du beschreibst dein Spiel, die KI erstellt den kompletten Lua-Code — inklusive Terrain, Scripts, GUI und mehr.',
    },
    {
      cat: 'Allgemein',
      q: 'Für wen ist XERON Engine gemacht?',
      a: 'Für alle Roblox-Enthusiasten — ob Einsteiger ohne Programmierkenntnisse oder erfahrene Developer die schneller prototypen wollen. XERON nimmt dir die mühsame Basis-Codierung ab.',
    },
    {
      cat: 'Allgemein',
      q: 'Brauche ich Programmierkenntnisse?',
      a: 'Nein! Du beschreibst dein Spiel auf Deutsch in natürlicher Sprache. XERON generiert automatisch lauffähigen Lua-Code. Optional kannst du den Code danach anpassen.',
    },
    {
      cat: 'Allgemein',
      q: 'Funktioniert es mit kostenlosem Roblox?',
      a: 'Ja. Du brauchst nur ein kostenloses Roblox-Konto und Roblox Studio (ebenfalls kostenlos). Das XERON Plugin installierst du einmalig in Studio — fertig.',
    },
    // Credits & Preise
    {
      cat: 'Credits & Preise',
      q: 'Was sind Credits und was ist der Unterschied zwischen Abo- und gekauften Credits?',
      a: 'Credits sind die Währung für Generierungen. Abo-Credits bekommst du monatlich mit deinem Plan und können für alle Features genutzt werden. Gekaufte Credits (Einmalkauf) verfallen nicht, funktionieren aber NUR für Script & UI — nicht für Spiele.',
    },
    {
      cat: 'Credits & Preise',
      q: 'Was kosten die verschiedenen Generierungen?',
      a: 'Script/UI: 10 Credits (Free) · Kleines Spiel: 25 Credits (Starter+) · Normales Spiel: 50 Credits (Starter+) · High-End Spiel: 200 Credits (Pro+) · Fix klein: 15 Credits (Starter+) · Fix groß: 50 Credits (Starter+)',
    },
    {
      cat: 'Credits & Preise',
      q: 'Verfallen Credits?',
      a: 'Abo-Credits verfallen am Monatsende (werden durch neue ersetzt). Gekaufte Credits (Einmalkauf-Pakete) verfallen nie.',
    },
    {
      cat: 'Credits & Preise',
      q: 'Kann ich Credits kaufen ohne Abo?',
      a: 'Ja! Credit-Pakete ab 1,99€: Mini (50), Starter (150), Value (400), Power (1.000), Mega (3.000). Wichtig: Einmalkauf-Credits funktionieren nur für Scripts & UI — für Spiele ist ein aktives Abo nötig.',
    },
    {
      cat: 'Credits & Preise',
      q: 'Gibt es eine kostenlose Testversion?',
      a: 'Ja! Der Free-Plan beinhaltet 10 Credits pro Monat ohne Kreditkarte. Damit kannst du Scripts und UI generieren (max. 1x pro Tag).',
    },
    // Technisches
    {
      cat: 'Technisches',
      q: 'Wie installiere ich das Plugin?',
      a: 'Im Dashboard auf "Plugin herunterladen" klicken → .rbxm Datei speichern → In Roblox Studio: Plugins → Manage Plugins → Install from File. Dann verbindest du das Plugin mit deinem XERON-Account.',
    },
    {
      cat: 'Technisches',
      q: 'Was macht der Fix-Modus?',
      a: 'Mit Fix kannst du Fehler in bestehenden Scripts korrigieren. Klein-Fix (15 Credits) für einzelne Bugs, Groß-Fix (50 Credits) für umfangreiche Überarbeitungen. Claude analysiert deinen Code und liefert eine korrigierte Version.',
    },
    {
      cat: 'Technisches',
      q: 'Wie lange dauert eine Generierung?',
      a: 'Scripts & UI: ca. 30–60 Sekunden. Kleine Spiele: 1–2 Minuten. Normale & High-End Spiele: 2–4 Minuten. Die Zeit variiert je nach Komplexität des Prompts.',
    },
    {
      cat: 'Technisches',
      q: 'Kann die KI 3D-Modelle erstellen?',
      a: 'Nein. XERON generiert ausschließlich Lua-Code und Terrain-Scripts. Für 3D-Assets empfehlen wir die Roblox Toolbox oder externe Modell-Tools.',
    },
    // Account & Zahlung
    {
      cat: 'Account & Zahlung',
      q: 'Wie kündige ich mein Abo?',
      a: 'Im Dashboard unter Account → Plan → "Abo verwalten" (Stripe Portal). Dort kannst du jederzeit kündigen. Das Abo läuft bis zum Ende der bezahlten Periode weiter.',
    },
    {
      cat: 'Account & Zahlung',
      q: 'Gibt es eine Rückerstattung?',
      a: 'Innerhalb von 14 Tagen nach Kauf kannst du per E-Mail an support@xeron-labs.com eine Rückerstattung beantragen (EU-Widerrufsrecht). Bereits verbrauchte Credits werden anteilig abgezogen.',
    },
    {
      cat: 'Account & Zahlung',
      q: 'Welche Zahlungsmethoden werden akzeptiert?',
      a: 'Alle gängigen Kreditkarten (Visa, Mastercard, Amex), SEPA-Lastschrift, PayPal und weitere — über Stripe, einem der sichersten Zahlungsanbieter weltweit.',
    },
  ]

  return (
    <section id="faq" className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-4xl text-center mb-12">Häufige Fragen</h2>
        {(['Allgemein', 'Credits & Preise', 'Technisches', 'Account & Zahlung'] as const).map((cat) => (
          <div key={cat} className="mb-8">
            <h3 className="font-display text-lg mb-3" style={{ color: 'var(--accent-red)' }}>{cat}</h3>
            <div className="space-y-3">
              {faqs.filter((f) => f.cat === cat).map((faq, i) => {
                const globalIndex = faqs.indexOf(faq)
                return (
                  <div key={i} className="glass-card overflow-hidden">
                    <button
                      onClick={() => setOpenIndex(openIndex === globalIndex ? null : globalIndex)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
                    >
                      <span className="font-medium">{faq.q}</span>
                      <svg
                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${openIndex === globalIndex ? 'rotate-180' : ''}`}
                        style={{ color: 'var(--accent-red)' }}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openIndex === globalIndex && (
                      <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ============================================================
// 8. FOOTER
// ============================================================
function Footer() {
  return (
    <footer className="glass-nav border-t mt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <span className="font-display text-lg">
            <span className="text-gradient-red">XERON</span>
            <span className="text-white"> Engine</span>
          </span>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <Link href="/agb" className="hover:text-white transition-colors">AGB</Link>
            <Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link>
            <Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link>
            <Link href="/community" className="hover:text-white transition-colors">Community</Link>
            <Link href="/support" className="hover:text-white transition-colors">Support</Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {/* TikTok */}
            <a href="https://tiktok.com/@xeron.labs?_r=1&_t=ZG-94zR7vuK4jh" target="_blank" rel="noopener noreferrer"
               className="transition-opacity hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.85 4.85 0 01-1.01-.08z"/>
              </svg>
            </a>
            {/* Discord */}
            <a href="https://discord.gg/u5HF4CQPug" target="_blank" rel="noopener noreferrer"
               className="transition-opacity hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://www.instagram.com/xeron.labs?igsh=d2lqOGFwZnN3cnpv&utm_source=qr" target="_blank" rel="noopener noreferrer"
               className="transition-opacity hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            {/* X (Twitter) */}
            <a href="https://x.com/xer0nlabs?s=21" target="_blank" rel="noopener noreferrer"
               className="transition-opacity hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 text-center text-sm" style={{ color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          © 2025 XERON Engine — xeron-labs.com
        </div>
      </div>
    </footer>
  )
}

// ============================================================
// PAGE
// ============================================================
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <TutorialSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  )
}
