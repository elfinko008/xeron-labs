'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { LuxuryBackground } from '@/components/landing/LuxuryBackground'
import Sidebar from '@/components/dashboard/Sidebar'
import CommandPalette from '@/components/dashboard/CommandPalette'
import GenerateMode from '@/components/dashboard/GenerateMode'
import ScriptEditor from '@/components/dashboard/ScriptEditor'
import { Sparkles, Code2, Layout, Wrench, Trash2, Stethoscope, Bell, Search, Flame } from 'lucide-react'
import Link from 'next/link'
import LanguageSelector from '@/components/LanguageSelector'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

type Mode = 'game' | 'script' | 'ui' | 'fix' | 'clean' | 'diagnose'

interface Profile {
  credits: number
  plan: string
  streak_days: number
  username?: string
  avatar_url?: string
  email: string
}

const MODE_ICONS: Record<Mode, React.ReactNode> = {
  game: <Sparkles size={16} />,
  script: <Code2 size={16} />,
  ui: <Layout size={16} />,
  fix: <Wrench size={16} />,
  clean: <Trash2 size={16} />,
  diagnose: <Stethoscope size={16} />,
}

export default function DashboardPage() {
  const [mode, setMode] = useState<Mode>('script')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [cmdOpen, setCmdOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadProfile()
    // Daily streak check
    fetch('/api/streak/check', { method: 'POST' }).catch(() => {})
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCmdOpen(true)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (data) setProfile(data)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--void)', overflow: 'hidden' }}>
      <LuxuryBackground />

      {/* Sidebar */}
      <Sidebar
        activeMode={mode}
        onModeChange={(m: string) => setMode(m as Mode)}
        credits={profile?.credits ?? 0}
        plan={profile?.plan ?? 'free'}
        streakDays={profile?.streak_days ?? 0}
      />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Dashboard Navbar */}
        <header className="lg-nav" style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, flexShrink: 0 }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, background: 'linear-gradient(135deg,var(--gold-600),var(--gold-400))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              XERON
            </span>
          </Link>

          {/* Command palette pill */}
          <button
            onClick={() => setCmdOpen(true)}
            style={{
              flex: 1, maxWidth: 400, display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--glass-1)', border: '1px solid var(--glass-border)', borderRadius: 14,
              padding: '8px 16px', cursor: 'pointer', color: 'var(--t-3)', fontSize: 14, fontFamily: "'DM Sans',sans-serif",
              transition: 'border-color 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border-gold)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)'}
          >
            <Search size={14} />
            <span>Search commands...</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, background: 'var(--glass-2)', padding: '2px 8px', borderRadius: 6, border: '1px solid var(--glass-border)' }}>⌘K</span>
          </button>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Streak */}
            {(profile?.streak_days ?? 0) > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F97316', fontSize: 13, fontWeight: 600 }}>
                <Flame size={16} />
                <span>{profile?.streak_days} days</span>
              </div>
            )}

            {/* Notifications */}
            <button style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--glass-2)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--t-2)', position: 'relative' }}>
              <Bell size={16} />
            </button>

            <ThemeToggle />
            <LanguageSelector />

            {/* Avatar */}
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,var(--gold-700),var(--gold-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0A0900', fontWeight: 700, fontSize: 14 }}>
              {profile?.username?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || '?'}
            </div>
          </div>
        </header>

        {/* Mode content */}
        <main style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          <ModeContent
            mode={mode}
            plan={profile?.plan ?? 'free'}
            credits={profile?.credits ?? 0}
            onCreditsChange={loadProfile}
          />
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={cmdOpen}
        onClose={() => setCmdOpen(false)}
      />
    </div>
  )
}

function ModeContent({ mode, plan, credits, onCreditsChange }: { mode: Mode; plan: string; credits: number; onCreditsChange: () => void }) {
  switch (mode) {
    case 'game':
      return (
        <GenerateMode
          plan={plan}
          credits={credits}
          onGenerate={onCreditsChange}
        />
      )
    case 'script':
    case 'ui':
    case 'fix':
    case 'clean':
    case 'diagnose':
      return (
        <ScriptModeWrapper
          mode={mode}
          plan={plan}
          credits={credits}
          onCreditsChange={onCreditsChange}
        />
      )
    default:
      return null
  }
}

function ScriptModeWrapper({ mode, plan, credits, onCreditsChange }: { mode: Mode; plan: string; credits: number; onCreditsChange: () => void }) {
  const COST: Record<Mode, number> = { game: 50, script: 10, ui: 10, fix: 15, clean: 10, diagnose: 5 }
  const LABELS: Record<Mode, string> = {
    game: 'Generate Game',
    script: 'Create Script',
    ui: 'Create UI',
    fix: 'Fix Game',
    clean: 'Clean Explorer',
    diagnose: 'Diagnose',
  }
  const PLACEHOLDERS: Record<Mode, string> = {
    game: 'Describe your game...',
    script: 'Describe the script you need... e.g. "A leaderboard that shows top 10 players by score"',
    ui: 'Describe the UI... e.g. "A shop menu with item cards, buy buttons, and a cart"',
    fix: 'Paste your broken script here and describe the issue...',
    clean: 'Paste your Explorer structure or describe what to clean up...',
    diagnose: 'Paste your script or describe the problem...',
  }

  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const cost = COST[mode]

  const generate = async () => {
    if (!prompt.trim() || loading) return
    setLoading(true); setError(''); setResult('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode, quality: 'standard' }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Generation failed'); return }
      if (data.lua_output) setResult(data.lua_output)
      else if (data.project_id) {
        // Poll for completion
        let attempts = 0
        const poll = setInterval(async () => {
          attempts++
          if (attempts > 60) { clearInterval(poll); setError('Timeout'); setLoading(false); return }
          const s = await fetch(`/api/generate/status?id=${data.project_id}`).then(r => r.json())
          if (s.status === 'done') { clearInterval(poll); setResult(s.lua_output || ''); setLoading(false); onCreditsChange() }
          if (s.status === 'error') { clearInterval(poll); setError(s.error || 'Error'); setLoading(false) }
        }, 2000)
        return
      }
      onCreditsChange()
    } catch (e: any) {
      setError(e.message)
    } finally {
      if (!result) setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="t-headline" style={{ fontSize: 28, marginBottom: 4 }}>{LABELS[mode]}</h1>
          <p className="t-body" style={{ fontSize: 14 }}>{cost} credits per generation</p>
        </div>
        <Link href="/shop" className="credit-pill">
          <span className="credit-coin">🪙</span>
          <span className="credit-number">{credits}</span>
        </Link>
      </div>

      <div className="lg-card-static" style={{ padding: 24 }}>
        <div style={{ position: 'relative' }}>
          <textarea
            className="lg-input"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder={PLACEHOLDERS[mode]}
            rows={8}
            style={{ resize: 'vertical', minHeight: 160 }}
            onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generate() }}
          />
          <div style={{ position: 'absolute', bottom: 14, right: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ color: 'var(--t-4)', fontSize: 12 }}>{prompt.length}/3000</span>
            <span style={{ color: 'var(--t-4)', fontSize: 11 }}>Ctrl+Enter</span>
          </div>
        </div>

        {error && (
          <div style={{ marginTop: 12, padding: '10px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, color: '#F87171', fontSize: 13 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <button
            className="btn-luxury"
            onClick={generate}
            disabled={!prompt.trim() || loading || credits < cost}
            style={{ opacity: (!prompt.trim() || loading || credits < cost) ? 0.5 : 1 }}
          >
            {loading ? 'Generating...' : `${MODE_ICONS[mode]} Generate [${cost} cr]`}
          </button>
        </div>
      </div>

      {result && (
        <div style={{ marginTop: 24 }}>
          <ScriptEditor code={result} language="lua" filename={`xeron_${mode}.lua`} />
        </div>
      )}
    </div>
  )
}
