'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { PLATFORM_CONFIG, PLATFORM_ORDER, PLATFORM_META, type PlatformKey, type GenerationMode, canUsePlatform, getPlatformCreditCost } from '@/lib/platform-router'
import dynamic from 'next/dynamic'
import Sidebar from '@/components/dashboard/Sidebar'
import CommandPalette from '@/components/dashboard/CommandPalette'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Code2, Layout, Wrench, Trash2, Stethoscope,
  Search, Flame, Copy, Check, ChevronDown, Zap, Lock,
} from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import CreditPill from '@/components/dashboard/CreditPill'

const YachtInteriorBackground = dynamic(
  () => import('@/components/backgrounds/YachtInteriorBackground').then(m => ({ default: m.YachtInteriorBackground })),
  { ssr: false }
)

const VALID_PLATFORMS = new Set<string>(PLATFORM_ORDER)

type Mode = 'home' | GenerationMode

interface Profile {
  credits: number
  plan: string
  streak_days: number
  username?: string
  avatar_url?: string
  email: string
  total_generations?: number
  active_platform?: PlatformKey
}

export default function PlatformDashboard() {
  const params = useParams()
  const router = useRouter()
  const rawPlatform = params?.platform as string
  const platform = VALID_PLATFORMS.has(rawPlatform) ? (rawPlatform as PlatformKey) : 'roblox'

  const [mode, setMode] = useState<Mode>('home')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [cmdOpen, setCmdOpen] = useState(false)
  const [platformDropOpen, setPlatformDropOpen] = useState(false)
  const supabase = createClient()
  const config = PLATFORM_CONFIG[platform]
  const meta = PLATFORM_META[platform]

  // Redirect to valid platform if needed
  useEffect(() => {
    if (!VALID_PLATFORMS.has(rawPlatform)) {
      router.replace('/dashboard/roblox')
    }
  }, [rawPlatform, router])

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

  const canUse = canUsePlatform(platform, profile?.plan ?? 'free')

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--navy-950)', overflow: 'hidden' }}>
      <YachtInteriorBackground />

      <Sidebar
        activeMode={mode}
        onModeChange={(m) => setMode(m as Mode)}
        credits={profile?.credits ?? 0}
        plan={profile?.plan ?? 'free'}
        streakDays={profile?.streak_days ?? 0}
        platform={platform}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Top bar */}
        <header className="lg-nav" style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, flexShrink: 0 }}>
          {/* Platform selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setPlatformDropOpen(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(0,128,255,0.08)', border: '0.5px solid rgba(0,128,255,0.25)',
                borderRadius: 12, padding: '7px 14px', cursor: 'pointer',
                color: 'var(--t-1)', fontSize: 13, fontFamily: "'Outfit',sans-serif", fontWeight: 600,
              }}
            >
              <span>{meta.emoji}</span>
              <span>{config.name}</span>
              <ChevronDown size={13} color="var(--t-3)" />
            </button>
            {platformDropOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 200,
                background: 'rgba(7,24,40,0.97)', border: '0.5px solid rgba(0,128,255,0.20)',
                borderRadius: 16, padding: 8, minWidth: 200,
                boxShadow: '0 16px 48px rgba(0,0,0,0.60)',
                backdropFilter: 'blur(40px)',
              }}>
                {PLATFORM_ORDER.map(p => {
                  const pm = PLATFORM_META[p]
                  const pc = PLATFORM_CONFIG[p]
                  return (
                    <button
                      key={p}
                      onClick={() => { setPlatformDropOpen(false); router.push(`/dashboard/${p}`) }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 12px', borderRadius: 10, border: 'none',
                        background: p === platform ? 'rgba(0,128,255,0.12)' : 'transparent',
                        cursor: 'pointer', color: p === platform ? '#66B2FF' : 'var(--t-2)',
                        fontSize: 13, fontFamily: "'Outfit',sans-serif",
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { if (p !== platform) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
                      onMouseLeave={e => { if (p !== platform) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                    >
                      <span>{pm.emoji}</span>
                      <span>{pc.name}</span>
                      {pc.planRequired === 'pro' && (
                        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#E0A820', background: 'rgba(224,168,32,0.12)', padding: '2px 7px', borderRadius: 6 }}>PRO+</span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Search / Command */}
          <button
            onClick={() => setCmdOpen(true)}
            style={{
              flex: 1, maxWidth: 340, display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(14,45,74,0.40)', border: '0.5px solid rgba(100,150,220,0.15)',
              borderRadius: 12, padding: '8px 16px', cursor: 'pointer',
              color: 'var(--t-3)', fontSize: 13, fontFamily: "'DM Sans',sans-serif",
            }}
          >
            <Search size={14} />
            <span>Search commands...</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, background: 'rgba(14,45,74,0.60)', padding: '2px 8px', borderRadius: 6, border: '0.5px solid rgba(100,150,220,0.15)' }}>⌘K</span>
          </button>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            {(profile?.streak_days ?? 0) > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F97316', fontSize: 13, fontWeight: 600, background: 'rgba(249,115,22,0.08)', padding: '4px 10px', borderRadius: 10, border: '1px solid rgba(249,115,22,0.2)' }}>
                <Flame size={14} />
                <span>{profile?.streak_days}d</span>
              </div>
            )}
            <CreditPill credits={profile?.credits ?? 0} />
            <ThemeToggle />
            {/* Avatar */}
            <Link href="/dashboard/account" style={{
              width: 36, height: 36, borderRadius: '50%',
              background: profile?.avatar_url ? 'transparent' : 'linear-gradient(135deg,#0066CC,#0080FF)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid rgba(0,128,255,0.30)', overflow: 'hidden', flexShrink: 0,
            }}>
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{profile?.username?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || '?'}</span>
              }
            </Link>
          </div>
        </header>

        {/* Mode content */}
        <main style={{ flex: 1, overflow: 'auto', padding: 24, position: 'relative' }}>
          {!canUse && platform === 'unreal' ? (
            <LockedPlatformPanel platform={platform} />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                style={{ height: '100%' }}
              >
                <ModeContent
                  mode={mode}
                  platform={platform}
                  plan={profile?.plan ?? 'free'}
                  credits={profile?.credits ?? 0}
                  profile={profile}
                  onCreditsChange={loadProfile}
                  onModeSelect={(m) => setMode(m as Mode)}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  )
}

// ── Locked Platform Banner ────────────────────────────────────────────────────

function LockedPlatformPanel({ platform }: { platform: PlatformKey }) {
  const config = PLATFORM_CONFIG[platform]
  return (
    <div style={{ maxWidth: 600, margin: '60px auto', textAlign: 'center' }}>
      <div className="yacht-card" style={{ padding: 48 }}>
        <Lock size={40} color="#E0A820" style={{ margin: '0 auto 20px' }} />
        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 24, fontWeight: 700, color: 'var(--t-1)', marginBottom: 12 }}>
          {config.name} requires Pro+
        </h2>
        <p style={{ color: 'var(--t-2)', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
          Unreal Engine 5 generation uses Claude Sonnet — our most powerful model. Upgrade to Pro or Enterprise to unlock UE5 C++ generation, Blueprints, and more.
        </p>
        <Link href="/shop" className="btn-primary" style={{ textDecoration: 'none' }}>
          Upgrade to Pro
        </Link>
      </div>
    </div>
  )
}

// ── Welcome Home Panel ────────────────────────────────────────────────────────

function WelcomePanel({ profile, platform, onModeSelect }: {
  profile: Profile | null; platform: PlatformKey; onModeSelect: (m: string) => void
}) {
  const config = PLATFORM_CONFIG[platform]
  const meta = PLATFORM_META[platform]

  const modes = [
    { id: 'game',    icon: <Sparkles size={20} />, label: 'Generate Game',  desc: `Build a full ${config.name} game`,        cost: config.creditCosts.game    ?? 50  },
    { id: 'script',  icon: <Code2    size={20} />, label: 'Generate Script', desc: `Write ${config.outputLanguage} code`,     cost: config.creditCosts.script  ?? 10  },
    { id: 'ui',      icon: <Layout   size={20} />, label: 'UI Builder',      desc: 'Create UI elements & menus',               cost: config.creditCosts.ui      ?? 10  },
    { id: 'fix',     icon: <Wrench   size={20} />, label: 'Fix Code',        desc: `Repair broken ${config.outputLanguage}`,  cost: config.creditCosts.fix     ?? 15  },
    { id: 'clean',   icon: <Trash2   size={20} />, label: 'Clean Project',   desc: 'Organize and clean up code',               cost: config.creditCosts.clean   ?? 10  },
    { id: 'diagnose',icon: <Stethoscope size={20} />, label: 'Diagnose',     desc: 'Find bugs and issues',                    cost: config.creditCosts.diagnose ?? 5  },
  ]

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 28 }}>{meta.emoji}</span>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800, background: 'linear-gradient(135deg,#F0F4FF,#66B2FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {config.name}
          </h1>
        </div>
        <p style={{ color: 'var(--t-2)', fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
          Select a mode to start generating {config.outputLanguage} code with AI
        </p>
      </motion.div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Credits', value: `🪙 ${(profile?.credits ?? 0).toLocaleString()}`, sub: `${profile?.plan ?? 'free'} plan` },
          { label: 'Streak',  value: `🔥 ${profile?.streak_days ?? 0}`,                sub: 'days in a row' },
          { label: 'Generations', value: `◈ ${profile?.total_generations ?? 0}`,       sub: 'total' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
            className="lg-card-static" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", color: 'var(--t-1)', marginBottom: 2 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--t-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Mode grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {modes.map((m, i) => (
          <motion.button key={m.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 + i * 0.07 }}
            onClick={() => onModeSelect(m.id)}
            style={{ background: 'rgba(14,45,74,0.25)', border: '0.5px solid rgba(100,150,220,0.15)', borderRadius: 16, padding: '20px', cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10, transition: 'all 0.2s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,128,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(0,128,255,0.35)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(14,45,74,0.25)'; e.currentTarget.style.borderColor = 'rgba(100,150,220,0.15)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{ color: '#66B2FF', display: 'flex', alignItems: 'center', gap: 8 }}>
              {m.icon}
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, color: 'var(--t-1)' }}>{m.label}</span>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'var(--t-3)', lineHeight: 1.5, margin: 0 }}>{m.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: '#0080FF', background: 'rgba(0,128,255,0.10)', padding: '3px 10px', borderRadius: 20, border: '0.5px solid rgba(0,128,255,0.25)' }}>
                🪙 {m.cost} cr
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ── Mode Content Router ────────────────────────────────────────────────────────

function ModeContent({ mode, platform, plan, credits, profile, onCreditsChange, onModeSelect }: {
  mode: Mode; platform: PlatformKey; plan: string; credits: number
  profile: Profile | null; onCreditsChange: () => void; onModeSelect: (m: string) => void
}) {
  if (mode === 'home') {
    return <WelcomePanel profile={profile} platform={platform} onModeSelect={onModeSelect} />
  }
  return (
    <GenerationPanel
      mode={mode}
      platform={platform}
      plan={plan}
      credits={credits}
      onCreditsChange={onCreditsChange}
    />
  )
}

// ── Generation Panel (all modes) ──────────────────────────────────────────────

function GenerationPanel({ mode, platform, plan, credits, onCreditsChange }: {
  mode: Exclude<Mode, 'home'>; platform: PlatformKey; plan: string; credits: number; onCreditsChange: () => void
}) {
  const config = PLATFORM_CONFIG[platform]
  const cost = getPlatformCreditCost(platform, mode as GenerationMode)

  const modeLabels: Record<string, { label: string; desc: string; icon: React.ReactNode }> = {
    game:     { label: 'Generate Game',   desc: `Build a complete ${config.name} game`,          icon: <Sparkles size={20} /> },
    script:   { label: 'Generate Script', desc: `Write ${config.outputLanguage} code with AI`,   icon: <Code2 size={20} /> },
    ui:       { label: 'UI Builder',      desc: 'Create UI elements and menus',                   icon: <Layout size={20} /> },
    fix:      { label: 'Fix Code',        desc: `Repair broken ${config.outputLanguage} scripts`, icon: <Wrench size={20} /> },
    clean:    { label: 'Clean Project',   desc: 'Organize and clean up code',                     icon: <Trash2 size={20} /> },
    diagnose: { label: 'Diagnose',        desc: 'Find bugs and issues',                           icon: <Stethoscope size={20} /> },
  }

  const meta = modeLabels[mode] ?? modeLabels.script
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const placeholders: Record<string, string> = {
    game:     `Describe your game... e.g. "A zombie survival game with crafting and wave enemies"`,
    script:   `Describe what you need... e.g. "A leaderboard showing top 10 players by score"`,
    ui:       `Describe the UI... e.g. "A shop menu with item cards and buy buttons"`,
    fix:      `Paste your broken code and describe the error...`,
    clean:    `Describe what to clean or paste your code...`,
    diagnose: `Describe the issue or paste the problematic script...`,
  }

  const generate = async () => {
    if (!prompt.trim() || loading) return
    setLoading(true); setError(''); setResult('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode, platform, quality: 'standard' }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 402) setError(`Not enough credits. Need ${data.required}, you have ${data.current}.`)
        else if (res.status === 403) setError(data.error + ' — upgrade at /shop')
        else setError(data.error || 'Generation failed')
        return
      }
      if (data.code) { setResult(data.code); onCreditsChange(); return }
      if (data.projectId) {
        let attempts = 0
        const poll = setInterval(async () => {
          attempts++
          if (attempts > 60) { clearInterval(poll); setError('Timeout — try again'); setLoading(false); return }
          const s = await fetch(`/api/generate/status?id=${data.projectId}`).then(r => r.json())
          if (s.status === 'done') { clearInterval(poll); setResult(s.code_output || s.lua_output || ''); setLoading(false); onCreditsChange() }
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
    <div style={{ maxWidth: 820, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ color: '#66B2FF' }}>{meta.icon}</span>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 26, fontWeight: 800, color: 'var(--t-1)' }}>{meta.label}</h1>
          </div>
          <p style={{ color: 'var(--t-3)', fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>{meta.desc}</p>
        </div>
        <CreditPill credits={credits} />
      </div>

      <div className="lg-card-static" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ position: 'relative' }}>
          <textarea
            className="lg-input"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder={placeholders[mode] ?? placeholders.script}
            rows={7}
            style={{ resize: 'vertical', minHeight: 140, fontSize: 14 }}
            onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generate() }}
          />
          <div style={{ position: 'absolute', bottom: 12, right: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ color: 'var(--t-3)', fontSize: 11 }}>{prompt.length}/3000</span>
          </div>
        </div>

        {error && (
          <div style={{ marginTop: 12, padding: '10px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, color: '#F87171', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={14} /> {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <span style={{ color: 'var(--t-3)', fontSize: 12 }}>
            Cost: <span style={{ color: '#E0A820' }}>🪙 {cost} credits</span> · Language: <span style={{ color: '#66B2FF' }}>{config.outputLanguage}</span>
          </span>
          <button
            className="btn-primary"
            onClick={generate}
            disabled={!prompt.trim() || loading || credits < cost}
          >
            {loading ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Generating...
              </>
            ) : (
              <>{meta.icon} Generate</>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div style={{ marginBottom: 12, padding: '12px 18px', background: 'rgba(0,128,255,0.06)', border: '0.5px solid rgba(0,128,255,0.20)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Sparkles size={14} color="#0080FF" />
              <span style={{ fontSize: 13, color: 'var(--t-2)', fontFamily: "'DM Sans',sans-serif" }}>
                <strong style={{ color: 'var(--t-1)' }}>Generated:</strong> {result.split('\n').length} lines · {config.outputLanguage}
              </span>
              <button
                onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: '0.5px solid rgba(100,150,220,0.25)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', color: 'var(--t-3)', fontSize: 12, transition: 'all 0.2s' }}
              >
                {copied ? <Check size={12} color="#4ADE80" /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre style={{ background: 'rgba(7,24,40,0.90)', border: '0.5px solid rgba(0,128,255,0.15)', borderRadius: 16, padding: 24, fontSize: 13, lineHeight: 1.7, color: '#C0D0E8', overflow: 'auto', fontFamily: "'JetBrains Mono',monospace", maxHeight: '60vh' }}>
              <code>{result}</code>
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
