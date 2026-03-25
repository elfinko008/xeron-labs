# XERON Engine

KI-gesteuerte SaaS-Plattform die automatisch vollständige Roblox-Spiele generiert und diese via einem Roblox Studio Plugin live in Roblox Studio einbaut.

**Website:** xeron-labs.com

---

## Tech Stack

| Bereich | Technologie |
|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript + Tailwind CSS |
| Datenbank | Supabase (PostgreSQL + Auth + Storage) |
| KI Free | Google Gemini 2.5 Flash-Lite |
| KI Normal | Anthropic Claude Haiku 4.5 |
| KI High-End | Anthropic Claude Sonnet 4.6 |
| Zahlung | Stripe (Abos + Einmalkauf Credits) |
| Hosting | Vercel |
| Plugin | Roblox Studio Plugin (Lua) |

---

## Setup

### 1. Repository klonen

```bash
git clone https://github.com/DEIN-USERNAME/xeron-engine.git
cd xeron-engine
npm install
```

### 2. Environment Variables

Kopiere `.env.example` zu `.env.local` und trage alle Werte ein:

```bash
cp .env.example .env.local
```

Benötigte Keys:
- **Supabase:** supabase.com → Settings → API
- **Anthropic:** console.anthropic.com → API Keys
- **Google Gemini:** aistudio.google.com → Get API Key
- **Stripe:** dashboard.stripe.com → Developers → API Keys

### 3. Supabase Datenbank

1. Neues Projekt auf supabase.com erstellen
2. SQL Editor öffnen
3. Inhalt von `supabase/migrations/001_initial.sql` ausführen

### 4. Entwicklungsserver starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000)

---

## Stripe Setup

1. dashboard.stripe.com → Account erstellen
2. **4 Abo-Produkte erstellen:**
   - Starter: 4,99 €/Mo
   - Pro: 14,99 €/Mo
   - Enterprise: 39,99 €/Mo
3. **5 Credit-Pakete (Einmalkauf) erstellen:**
   - Mini: 1,99 € (25 Credits)
   - Starter: 4,99 € (75 Credits)
   - Value: 11,99 € (200 Credits)
   - Power: 24,99 € (500 Credits)
   - Mega: 64,99 € (1.500 Credits)
4. Price IDs in `.env.local` eintragen (`STRIPE_PRICE_*`, `STRIPE_CREDIT_*`)
5. **Webhook einrichten:**
   - URL: `https://xeron-labs.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
6. **Testkarte:** `4242 4242 4242 4242`

---

## Roblox Studio Plugin

1. Roblox Studio öffnen
2. **Plugins → Plugin-Ordner** öffnen
3. `plugin/init.server.lua` in den Plugin-Ordner kopieren
4. Roblox Studio neu starten
5. Plugin in der Toolbar erscheint als "XERON Engine"

---

## Deployment (Vercel)

1. GitHub Repository erstellen (Private)
2. Code pushen: `git push origin main`
3. vercel.com → Import → Repository auswählen
4. Alle Environment Variables aus `.env.local` eintragen
5. Deploy
6. **DNS bei Ionos:**
   - `A @ → 76.76.21.21`
   - `CNAME www → cname.vercel-dns.com`
7. Nach Deploy: `NEXT_PUBLIC_APP_URL=https://xeron-labs.com` setzen

---

## KI-Routing

| Plan | Task | Modell | Kosten |
|---|---|---|---|
| Free | Script/UI | Gemini 2.5 Flash-Lite | Gratis |
| Alle | Normales Spiel | Claude Haiku 4.5 | 1,00 $/1M Token |
| Alle | High-End Spiel | Claude Sonnet 4.6 | 3,00 $/1M Token |

**Regel:** Immer günstigstes Modell das gut genug ist. Sonnet NUR bei explizit gewählter "High-End Grafik".

---

## Credit-System

| Aktion | Credits | Modell |
|---|---|---|
| Script/UI | 1 | Gemini |
| Kleines Spiel | 5 | Haiku |
| Normales Spiel | 15 | Haiku |
| High-End Spiel | 30 | Sonnet |
| Fix klein | 3 | Haiku |
| Fix groß | 10 | Sonnet |

---

## Sicherheit

- Alle API Routes: Server-seitige Supabase-Session-Prüfung
- `SUPABASE_SERVICE_ROLE_KEY` + `ANTHROPIC_API_KEY`: Nur server-seitig
- Credit-Check VOR jedem KI-Aufruf
- Rate-Limit: 10 Requests/User/Stunde
- Stripe Webhook-Signatur-Verifizierung
- Prompt max 3.000 Zeichen, Spieltyp-Whitelist
- `.env.local` in `.gitignore`

---

## Ordnerstruktur

```
/app
  /(public)         → Landing Page, Tutorial
  /(auth)           → Login, Register, Auth
  /(dashboard)      → Dashboard, Projekte, Account
  /api              → generate, generate/status, webhooks/stripe
                      plugin/auth, plugin/projects, plugin/sync
/components
  /dashboard        → Sidebar, GenerateForm, ProjectsGrid, AccountClient
/lib
  supabase.ts       → Browser + Server Client + Typen
  claude.ts         → Anthropic API
  gemini.ts         → Google Gemini API
  ai-router.ts      → KI-Routing Logic
  credits.ts        → Credit-System
  stripe.ts         → Stripe Integration
/supabase/migrations
  001_initial.sql
/plugin
  init.server.lua   → Roblox Studio Plugin
```

---

© 2025 XERON Engine — xeron-labs.com
