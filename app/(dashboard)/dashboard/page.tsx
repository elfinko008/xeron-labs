'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { LuxuryBackground } from '@/components/landing/LuxuryBackground'
import Sidebar from '@/components/dashboard/Sidebar'
import CommandPalette from '@/components/dashboard/CommandPalette'
import GenerateMode from '@/components/dashboard/GenerateMode'
import ScriptEditor from '@/components/dashboard/ScriptEditor'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Code2, Layout, Wrench, Trash2, Stethoscope,
  Bell, Search, Flame, Zap, Copy, Check, ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import LanguageSelector from '@/components/LanguageSelector'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

type Mode = 'home' | 'game' | 'script' | 'ui' | 'fix' | 'clean' | 'diagnose'

interface Profile {
  credits: number
  plan: string
  streak_days: number
  username?: string
  avatar_url?: string
  email: string
  total_generations?: number
}

const MODE_META: Record<Exclude<Mode, 'home'>, { icon: React.ReactNode; label: string; desc: string; cost: number; color: string }> = {
  game:    { icon: <Sparkles size={20} />,    label: 'Generate Game',  desc: 'Build a full Roblox game world', cost: 50,  color: 'var(--gold-400)' },
  script:  { icon: <Code2 size={20} />,       label: 'Script',         desc: 'Generate Lua scripts with AI',  cost: 10,  color: '#93C5FD' },
  ui:      { icon: <Layout size={20} />,      label: 'UI Builder',     desc: 'Create UI elements and menus', cost: 10,  color: '#F9A8D4' },
  fix:     { icon: <Wrench size={20} />,      label: 'Fix Code',       desc: 'Repair broken Lua scripts',    cost: 15,  color: '#FCD34D' },
  clean:   { icon: <Trash2 size={20} />,      label: 'Clean Explorer', desc: 'Organize your workspace',      cost: 10,  color: '#6EE7B7' },
  diagnose:{ icon: <Stethoscope size={20} />, label: 'Diagnose',       desc: 'Find bugs and issues',         cost: 5,   color: '#C4B5FD' },
}

const PLACEHOLDERS: Record<Exclude<Mode, 'home'>, string> = {
  game:     'Describe your game world... e.g. "A zombie survival RPG with base building, wave-based enemies, crafting system and day/night cycle"',
  script:   'Describe the script... e.g. "A leaderboard that shows top 10 players by score with animations"',
  ui:       'Describe the UI... e.g. "A shop menu with item cards, buy buttons, and a cart sidebar"',
  fix:      'Paste your broken script and describe the issue...',
  clean:    'Paste your Explorer structure or describe what to clean up...',
  diagnose: 'Paste your script or describe the problem you\'re experiencing...',
}

export default function DashboardPage() {
  const [mode, setMode] = useState<Mode>('home')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [cmdOpen, setCmdOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadProfile()
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

  const handleModeChange = (m: string) => {
    setMode(m as Mode)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--void)', overflow: 'hidden' }}>
      <LuxuryBackground />

      {/* Sidebar */}
      <Sidebar
        activeMode={mode}
        onModeChange={handleModeChange}
        credits={profile?.credits ?? 0}
        plan={profile?.plan ?? 'free'}
        streakDays={profile?.streak_days ?? 0}
      />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Dashboard Navbar */}
        <header className="lg-nav" style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, flexShrink: 0 }}>
          {/* Command palette pill */}
          <button
            onClick={() => setCmdOpen(true)}
            style={{
              flex: 1, maxWidth: 360, display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--glass-1)', border: '1px solid var(--glass-border)', borderRadius: 14,
              padding: '8px 16px', cursor: 'pointer', color: 'var(--t-3)', fontSize: 13,
              fontFamily: "'DM Sans',sans-serif", transition: 'border-color 0.3s',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F97316', fontSize: 13, fontWeight: 600, background: 'rgba(249,115,22,0.08)', padding: '4px 10px', borderRadius: 10, border: '1px solid rgba(249,115,22,0.2)' }}>
                <Flame size={14} />
                <span>{profile?.streak_days}d streak</span>
              </div>
            )}

            {/* Notifications */}
            <button style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--glass-2)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--t-2)', position: 'relative' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border-gold)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)'}
            >
              <Bell size={16} />
            </button>

            <ThemeToggle />
            <LanguageSelector />

            {/* Avatar */}
            <div
              style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,var(--gold-700),var(--gold-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0A0900', fontWeight: 700, fontSize: 14, border: '2px solid rgba(212,160,23,0.3)', transition: 'border-color 0.3s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold-400)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,160,23,0.3)'}
            >
              {profile?.username?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || '?'}
            </div>
          </div>
        </header>

        {/* Mode content area */}
        <main style={{ flex: 1, overflow: 'auto', padding: 24, position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{ height: '100%' }}
            >
              <ModeContent
                mode={mode}
                plan={profile?.plan ?? 'free'}
                credits={profile?.credits ?? 0}
                profile={profile}
                onCreditsChange={loadProfile}
                onModeSelect={(m) => setMode(m as Mode)}
              />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  )
}

// ─── Welcome / Home ──────────────────────────────────────────────────────────

function WelcomePanel({ profile, onModeSelect }: { profile: Profile | null; onModeSelect: (m: string) => void }) {
  const modes = Object.entries(MODE_META) as [Exclude<Mode, 'home'>, typeof MODE_META[Exclude<Mode, 'home'>]][]

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 36 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <span style={{ fontSize: 28 }}>✦</span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 700, background: 'linear-gradient(135deg, var(--gold-300), var(--gold-500))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Welcome back{profile?.username ? `, ${profile.username}` : ''}
          </h1>
        </div>
        <p style={{ color: 'var(--t-3)', fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
          Select an AI mode below to start creating
        </p>
      </motion.div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Credits', value: `🪙 ${(profile?.credits ?? 0).toLocaleString()}`, sub: `${profile?.plan ?? 'free'} plan` },
          { label: 'Streak', value: `🔥 ${profile?.streak_days ?? 0}`, sub: 'days in a row' },
          { label: 'Total Projects', value: `◈ ${profile?.total_generations ?? 0}`, sub: 'generations' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="lg-card-static"
            style={{ padding: '18px 20px' }}
          >
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", color: 'var(--t-1)', marginBottom: 2 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--t-4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Mode grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {modes.map(([id, meta], i) => (
          <motion.button
            key={id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 + i * 0.07 }}
            onClick={() => onModeSelect(id)}
            style={{
              background: 'rgba(255,255,255,0.018)',
              border: '1px solid var(--glass-border)',
              borderRadius: 16,
              padding: '20px 20px',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(212,160,23,0.3)'
              e.currentTarget.style.background = 'rgba(212,160,23,0.05)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--glass-border)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.018)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ color: meta.color, display: 'flex', alignItems: 'center', gap: 8 }}>
              {meta.icon}
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: 'var(--t-1)' }}>
                {meta.label}
              </span>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'var(--t-3)', lineHeight: 1.5, margin: 0 }}>
              {meta.desc}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: 'var(--gold-400)', background: 'rgba(212,160,23,0.08)', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(212,160,23,0.2)' }}>
                🪙 {meta.cost} cr
              </span>
              <ChevronRight size={14} color="var(--t-4)" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ─── Mode Content Router ──────────────────────────────────────────────────────

function ModeContent({
  mode, plan, credits, profile, onCreditsChange, onModeSelect,
}: {
  mode: Mode; plan: string; credits: number; profile: Profile | null
  onCreditsChange: () => void; onModeSelect: (m: string) => void
}) {
  if (mode === 'home') {
    return <WelcomePanel profile={profile} onModeSelect={onModeSelect} />
  }
  if (mode === 'game') {
    return (
      <GenerateMode
        plan={plan}
        credits={credits}
        onGenerate={onCreditsChange}
      />
    )
  }
  return (
    <ScriptModePanel
      mode={mode}
      plan={plan}
      credits={credits}
      onCreditsChange={onCreditsChange}
    />
  )
}

// ─── Script / UI / Fix / Clean / Diagnose ────────────────────────────────────

function ScriptModePanel({ mode, credits, onCreditsChange }: {
  mode: Exclude<Mode, 'home' | 'game'>; plan: string; credits: number; onCreditsChange: () => void
}) {
  const meta = MODE_META[mode]
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const cost = meta.cost

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
    } catch (e: any) { setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const copyResult = () => {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{ maxWidth: 820, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ color: meta.color }}>{meta.icon}</span>
            <h1 className="t-headline" style={{ fontSize: 26 }}>{meta.label}</h1>
          </div>
          <p className="t-body" style={{ fontSize: 13 }}>{meta.desc}</p>
        </div>
        {/* Credit pill — click → shop */}
        <Link href="/shop" style={{
          display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none',
          padding: '8px 16px', borderRadius: 999,
          background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.25)',
          color: 'var(--gold-400)', fontSize: 13, fontWeight: 600,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(212,160,23,0.15)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(212,160,23,0.08)'}
        >
          🪙 {credits.toLocaleString()} <span style={{ color: 'var(--t-3)', fontSize: 11 }}>/ {cost} cr ea</span>
        </Link>
      </div>

      {/* Input card */}
      <div className="lg-card-static" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ position: 'relative' }}>
          <textarea
            className="lg-input"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder={PLACEHOLDERS[mode]}
            rows={7}
            style={{ resize: 'vertical', minHeight: 140, fontSize: 14 }}
            onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generate() }}
          />
          <div style={{ position: 'absolute', bottom: 12, right: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ color: 'var(--t-4)', fontSize: 11 }}>{prompt.length}/3000</span>
            <span style={{ color: 'var(--t-4)', fontSize: 10, background: 'var(--glass-2)', padding: '2px 8px', borderRadius: 6, border: '1px solid var(--glass-border)' }}>Ctrl+↵</span>
          </div>
        </div>

        {error && (
          <div style={{ marginTop: 12, padding: '10px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, color: '#F87171', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={14} /> {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
          <button
            className="btn-luxury"
            onClick={generate}
            disabled={!prompt.trim() || loading || credits < cost}
            style={{
              opacity: (!prompt.trim() || loading || credits < cost) ? 0.5 : 1,
              display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px',
            }}
          >
            {loading ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                {meta.icon}
                Generate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* What this does summary */}
            <div style={{ marginBottom: 12, padding: '12px 18px', background: 'rgba(212,160,23,0.05)', border: '1px solid rgba(212,160,23,0.15)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Sparkles size={14} color="var(--gold-400)" />
              <span style={{ fontSize: 13, color: 'var(--t-2)', fontFamily: "'DM Sans', sans-serif" }}>
                <strong style={{ color: 'var(--t-1)' }}>Generated:</strong> {result.split('\n').length} lines · Ready to use in Roblox Studio
              </span>
              <button onClick={copyResult} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', color: 'var(--t-3)', fontSize: 12, fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}>
                {copied ? <Check size={12} color="#4ADE80" /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <ScriptEditor code={result} language="lua" filename={`xeron_${mode}.lua`} />
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
