'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import CreditDisplay from '@/components/dashboard/CreditDisplay'
import ActionHistory from '@/components/dashboard/ActionHistory'
import NotificationBell from '@/components/NotificationBell'
import LanguageSelector from '@/components/LanguageSelector'
import ScriptEditor from '@/components/dashboard/ScriptEditor'
import DiagnosisCard from '@/components/dashboard/DiagnosisCard'

type Mode = 'generate' | 'script' | 'ui' | 'fix' | 'clean' | 'diagnose'

interface Profile {
  id: string
  email: string
  plan: string
  credits: number
  purchased_credits: number
  credits_reset_at: string | null
  discord_credits_claimed: boolean
  referral_code: string | null
}

interface Project {
  id: string
  name: string
  mode: string
  status: string
  created_at: string
}

interface GenerationTask {
  id: number
  name: string
  status: 'pending' | 'active' | 'done'
  lua?: string
}

const GAME_TEMPLATES = [
  { label: '🏙️ Roleplay City', prompt: 'A detailed roleplay city map 300x300 with a police station, hospital, shopping mall, 5 stores, parking lots, traffic lights, NPC spawns, and a day/night cycle.' },
  { label: '👻 Horror Map', prompt: 'A dark horror obby map with fog, spooky ambient sounds, flickering lights, abandoned hospital setting, 30 stages with increasing difficulty, and jump scare elements.' },
  { label: '🏃 Obby', prompt: 'A colorful classic obby with 50 stages, checkpoints every 10 stages, glowing checkpoint orbs, varying difficulty from easy to extreme, and a victory platform.' },
  { label: '🏎️ Racing', prompt: 'A racing game with a circuit track 400x400, 4 different car spawns, lap timer HUD, position display, finish line detection, and a winner announcement.' },
  { label: '🔫 Shooter', prompt: 'A 3v3 shooter arena map with cover objects, 3 weapon spawns (pistol, rifle, shotgun), kill counter GUI, respawn system, and a scoreboard.' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('generate')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Generate mode state
  const [prompt, setPrompt] = useState('')
  const [gameType, setGameType] = useState('obby')
  const [quality, setQuality] = useState<'standard' | 'highend'>('standard')
  const [generating, setGenerating] = useState(false)
  const [tasks, setTasks] = useState<GenerationTask[]>([])
  const [generationDone, setGenerationDone] = useState(false)
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)
  const [summary, setSummary] = useState('')
  const [luaOutput, setLuaOutput] = useState('')

  // Script/UI mode state
  const [scriptPrompt, setScriptPrompt] = useState('')
  const [scriptType, setScriptType] = useState('ServerScript')
  const [uiType, setUiType] = useState('Shop')
  const [scriptResult, setScriptResult] = useState<{ lua: string; description: string } | null>(null)
  const [scriptGenerating, setScriptGenerating] = useState(false)
  const [showScriptPreview, setShowScriptPreview] = useState(false)

  // Fix mode state
  const [fixPrompt, setFixPrompt] = useState('')
  const [fixType, setFixType] = useState<'quick' | 'deep'>('quick')
  const [fixing, setFixing] = useState(false)

  // Diagnosis state
  const [diagnosisResult, setDiagnosisResult] = useState<{ issues: Array<{severity: 'critical'|'warning'|'info'; description: string; suggestedFix: string}>; summary: string } | null>(null)
  const [diagnosing, setDiagnosing] = useState(false)

  useEffect(() => {
    fetchData()
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark'
    setTheme(savedTheme)
  }, [])

  async function fetchData() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const [{ data: prof }, { data: projects }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('projects').select('id,name,mode,status,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(3),
    ])

    if (prof) setProfile(prof as Profile)
    if (projects) setRecentProjects(projects as Project[])
    setLoading(false)
  }

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    if (next === 'light') document.documentElement.setAttribute('data-theme', 'light')
    else document.documentElement.removeAttribute('data-theme')
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const creditCost = quality === 'highend' ? 200 :
    gameType === 'obby' || gameType === 'racing' ? 25 : 50

  async function handleGenerate() {
    if (!prompt.trim() || prompt.length < 10) return
    setGenerating(true)
    setGenerationDone(false)
    setTasks([])
    setSummary('')
    setLuaOutput('')

    const GAME_TASKS = ['Generate Terrain', 'Set Lighting', 'Create Zones', 'Place Buildings', 'Add Vegetation', 'Spawn NPCs/Vehicles', 'Write Scripts', 'Build GUI', 'Set Spawnpoints', 'Final Cleanup']
    setTasks(GAME_TASKS.map((name, i) => ({ id: i + 1, name, status: i === 0 ? 'active' : 'pending' })))

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, gameType, quality }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error || 'Generation failed'); setGenerating(false); return }

      setCurrentProjectId(data.projectId)
      pollStatus(data.projectId)
    } catch {
      alert('Network error')
      setGenerating(false)
    }
  }

  async function pollStatus(projectId: string) {
    const supabase = createClient()
    let taskIndex = 1
    const interval = setInterval(async () => {
      const { data } = await supabase.from('projects').select('status,lua_output,summary').eq('id', projectId).single() as { data: { status: string; lua_output: string; summary: string } | null }
      if (!data) return

      // Animate tasks
      if (taskIndex < 10) {
        setTasks((prev) => prev.map((t, i) => ({
          ...t,
          status: i < taskIndex ? 'done' : i === taskIndex ? 'active' : 'pending'
        })))
        taskIndex++
      }

      if (data.status === 'done') {
        clearInterval(interval)
        setTasks((prev) => prev.map((t) => ({ ...t, status: 'done' })))
        setSummary(data.summary || '')
        setLuaOutput(data.lua_output || '')
        setGenerating(false)
        setGenerationDone(true)
        playCompletionSound()
        triggerConfetti()
        fetchData()
      } else if (data.status === 'error') {
        clearInterval(interval)
        setGenerating(false)
        alert('Generation failed. Please try again.')
      }
    }, 2000)
  }

  function playCompletionSound() {
    try {
      const ctx = new (window.AudioContext || (window as unknown as {webkitAudioContext: typeof AudioContext}).webkitAudioContext)()
      ;[440, 550, 660].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.15)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.1)
        osc.start(ctx.currentTime + i * 0.15)
        osc.stop(ctx.currentTime + i * 0.15 + 0.1)
      })
      if (navigator.vibrate) navigator.vibrate([100, 50, 200])
    } catch {}
  }

  function triggerConfetti() {
    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 150,
        spread: 70,
        colors: ['#7c3aed', '#3b82f6', '#ffffff', '#a78bfa'],
        origin: { y: 0.6 },
      })
    }).catch(() => {})
  }

  async function handleScript() {
    if (!scriptPrompt.trim()) return
    setScriptGenerating(true)
    setScriptResult(null)
    setShowScriptPreview(false)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: scriptPrompt, gameType: 'script', quality: 'standard', mode: 'script', scriptType }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error); setScriptGenerating(false); return }

      // Poll for result
      const supabase = createClient()
      const interval = setInterval(async () => {
        const { data: proj } = await supabase.from('projects').select('status,lua_output,script_description').eq('id', data.projectId).single() as { data: { status: string; lua_output: string; script_description: string } | null }
        if (proj?.status === 'done') {
          clearInterval(interval)
          setScriptResult({ lua: proj.lua_output || '', description: proj.script_description || '' })
          setShowScriptPreview(true)
          setScriptGenerating(false)
          fetchData()
        } else if (proj?.status === 'error') {
          clearInterval(interval)
          setScriptGenerating(false)
          alert('Script generation failed')
        }
      }, 2000)
    } catch {
      setScriptGenerating(false)
    }
  }

  async function handleFix() {
    if (!fixPrompt.trim()) return
    setFixing(true)
    try {
      const res = await fetch('/api/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fixPrompt, fixType }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error); setFixing(false); return }
      setFixing(false)
      fetchData()
      alert('Fix completed! Check your projects.')
    } catch {
      setFixing(false)
    }
  }

  async function handleClean() {
    setGenerating(true)
    try {
      const res = await fetch('/api/clean', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { alert(data.error); setGenerating(false); return }
      setGenerating(false)
      fetchData()
      alert('Explorer cleaned!')
    } catch {
      setGenerating(false)
    }
  }

  async function handleDiagnose() {
    setDiagnosing(true)
    try {
      const res = await fetch('/api/diagnose', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { alert(data.error); setDiagnosing(false); return }
      setDiagnosisResult(data.result)
      setDiagnosing(false)
      fetchData()
    } catch {
      setDiagnosing(false)
    }
  }

  const NAV_ITEMS: Array<{ mode: Mode; label: string; icon: string; cost: number | null }> = [
    { mode: 'generate', label: 'Generate Game', icon: '✨', cost: null },
    { mode: 'script', label: 'Create Script', icon: '📝', cost: 10 },
    { mode: 'ui', label: 'Create UI', icon: '🖼️', cost: 10 },
    { mode: 'fix', label: 'Fix Game', icon: '🔧', cost: null },
    { mode: 'clean', label: 'Clean Explorer', icon: '🧹', cost: 10 },
    { mode: 'diagnose', label: 'Diagnose Game', icon: '🔍', cost: 5 },
  ]

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 16, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</div>
          <p style={{ color: 'var(--text-muted)' }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <aside className="glass-sidebar" style={{
        width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 40,
        padding: '0 0 24px',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/" className="font-display" style={{ fontSize: 20, textDecoration: 'none' }}>
            <span style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>XERON</span>
            <span style={{ color: 'var(--text-primary)' }}> Engine</span>
          </Link>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }} className="scrollbar-thin">
          {/* Credit Display */}
          {profile && (
            <div style={{ marginBottom: 16 }}>
              <CreditDisplay
                credits={profile.credits}
                purchasedCredits={profile.purchased_credits}
                plan={profile.plan}
                creditsResetAt={profile.credits_reset_at}
              />
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            <Link href="/dashboard/account?tab=credits" className="glass-button-primary" style={{ padding: '10px', fontSize: 13, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
              💳 Buy Credits
            </Link>
            <Link href="/dashboard/account?tab=plan" className="glass-button" style={{ padding: '10px', fontSize: 13, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
              ⬆️ Upgrade Plan
            </Link>
          </div>

          {/* Discord bonus */}
          {profile && !profile.discord_credits_claimed && (
            <a href="/api/discord/connect" className="glass-card" style={{
              display: 'block', padding: 14, marginBottom: 16, textDecoration: 'none',
              border: '1px solid rgba(88,101,242,0.3)', background: 'rgba(88,101,242,0.08)',
              borderRadius: 16,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#818cf8', marginBottom: 4 }}>🎁 Discord Bonus</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Connect Discord → +10 Credits</div>
            </a>
          )}
          {profile?.discord_credits_claimed && (
            <div style={{ padding: 14, marginBottom: 16, borderRadius: 16, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <span className="glass-badge-green" style={{ fontSize: 11 }}>✓ Discord connected</span>
            </div>
          )}

          {/* Referral */}
          {profile?.referral_code && (
            <div className="glass-card" style={{ padding: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Earn 5 Credits per referral</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <code style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '4px 8px', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {`xeron-labs.com/register?ref=${profile.referral_code}`}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(`https://xeron-labs.com/register?ref=${profile.referral_code}`)}
                  className="glass-button" style={{ padding: '4px 8px', fontSize: 11, flexShrink: 0 }}
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {/* Nav items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 20 }}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.mode}
                onClick={() => setMode(item.mode)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                  borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: mode === item.mode ? 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(59,130,246,0.2))' : 'transparent',
                  color: mode === item.mode ? '#a78bfa' : 'var(--text-secondary)',
                  fontWeight: mode === item.mode ? 600 : 400,
                  fontSize: 14, width: '100%', textAlign: 'left',
                  transition: 'all 0.2s',
                  borderLeft: mode === item.mode ? '2px solid #7c3aed' : '2px solid transparent',
                }}
                onMouseEnter={(e) => { if (mode !== item.mode) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={(e) => { if (mode !== item.mode) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.cost && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.cost}cr</span>}
              </button>
            ))}
            <div style={{ margin: '8px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }} />
            <Link href="/dashboard/projects" style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              borderRadius: 12, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14,
            }}>
              <span>📁</span> My Projects
            </Link>
            <Link href="/dashboard/account" style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              borderRadius: 12, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14,
            }}>
              <span>👤</span> Account
            </Link>
          </div>

          {/* Plugin status */}
          <div style={{ padding: 14, borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Studio Plugin</div>
            <span className="glass-badge" style={{ fontSize: 11 }}>📦 Install Plugin</span>
          </div>

          {/* Action history */}
          {profile && <ActionHistory userId={profile.id} />}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* TOP NAVBAR */}
        <nav className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 30, padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            {NAV_ITEMS.find((n) => n.mode === mode)?.icon}{' '}
            {NAV_ITEMS.find((n) => n.mode === mode)?.label || 'Dashboard'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <LanguageSelector />
            {/* Theme toggle */}
            <button onClick={toggleTheme} className="glass-button" style={{ padding: '8px', display: 'flex', alignItems: 'center' }}>
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
            {profile && <NotificationBell userId={profile.id} />}
            <button onClick={handleSignOut} style={{ fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
              Sign out
            </button>
          </div>
        </nav>

        {/* PAGE CONTENT */}
        <div style={{ flex: 1, padding: 24, maxWidth: 900, width: '100%', margin: '0 auto' }}>

          {/* ====== MODE: GENERATE GAME ====== */}
          {mode === 'generate' && (
            <div>
              {/* Templates */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {GAME_TEMPLATES.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => setPrompt(t.prompt)}
                    className="glass-button"
                    style={{ padding: '8px 14px', fontSize: 12, borderRadius: 999 }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => { if (e.ctrlKey && e.key === 'Enter') handleGenerate() }}
                  placeholder="Describe your Roblox game in detail..."
                  className="glass-input"
                  style={{ minHeight: 180, resize: 'vertical', width: '100%', fontFamily: 'Inter, sans-serif', fontSize: 15, lineHeight: 1.6 }}
                  maxLength={3000}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Ctrl+Enter to generate</span>
                  <span style={{ fontSize: 12, color: prompt.length > 2700 ? '#f87171' : 'var(--text-muted)' }}>{prompt.length} / 3000</span>
                </div>
              </div>

              <div className="glass-card" style={{ padding: 20, marginBottom: 20, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Game Type</label>
                  <select value={gameType} onChange={(e) => setGameType(e.target.value)} className="glass-input" style={{ width: 'auto', padding: '8px 12px' }}>
                    {['obby', 'roleplay', 'horror', 'racing', 'shooter', 'sandbox', 'custom'].map((t) => (
                      <option key={t} value={t} style={{ background: '#0d0d1f' }}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Quality</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setQuality('standard')} className={quality === 'standard' ? 'glass-button-primary' : 'glass-button'} style={{ padding: '8px 16px', fontSize: 13 }}>Standard</button>
                    <button onClick={() => {
                      if (profile?.plan !== 'pro' && profile?.plan !== 'enterprise') { alert('High-End requires Pro plan or higher'); return }
                      setQuality('highend')
                    }} className={quality === 'highend' ? 'glass-button-primary' : 'glass-button'} style={{ padding: '8px 16px', fontSize: 13 }}>
                      ✨ High-End +150cr
                    </button>
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Cost</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#a78bfa' }}>{creditCost} Credits</div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating || prompt.length < 10}
                className="glass-button-primary"
                style={{ width: '100%', padding: '14px', fontSize: 16, marginBottom: 24 }}
              >
                {generating ? '⚙️ Generating...' : 'Generate Game →'}
              </button>

              {/* PROGRESS */}
              {(generating || generationDone) && tasks.length > 0 && (
                <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
                  {/* Progress bar */}
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 20, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #7c3aed, #3b82f6)',
                      borderRadius: 2,
                      width: `${(tasks.filter((t) => t.status === 'done').length / tasks.length) * 100}%`,
                      transition: 'width 0.5s ease',
                    }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {tasks.map((task) => (
                      <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: task.status === 'pending' ? 0.4 : 1, transition: 'opacity 0.3s' }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: task.status === 'done' ? 'rgba(34,197,94,0.2)' : task.status === 'active' ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${task.status === 'done' ? 'rgba(34,197,94,0.5)' : task.status === 'active' ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.1)'}`,
                        }}>
                          {task.status === 'done' ? <span style={{ color: '#4ade80', fontSize: 12 }}>✓</span> :
                           task.status === 'active' ? <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', color: '#a78bfa', fontSize: 10 }}>◉</span> :
                           <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>○</span>}
                        </div>
                        <span style={{ fontSize: 14, color: task.status === 'active' ? '#a78bfa' : task.status === 'done' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                          {task.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* COMPLETION SUMMARY */}
              {generationDone && summary && (
                <div className="glass-card" style={{ padding: 24, marginBottom: 20, border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <span style={{ fontSize: 28 }}>🎉</span>
                    <div>
                      <h3 className="font-display" style={{ fontSize: 20, color: '#4ade80' }}>Game Generated!</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Load it in Roblox Studio with the plugin</p>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{summary}</p>
                  {currentProjectId && (
                    <Link href={`/dashboard/projects`} className="glass-button-primary" style={{ padding: '10px 24px', fontSize: 14, textDecoration: 'none', display: 'inline-block' }}>
                      View Project →
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ====== MODE: CREATE SCRIPT ====== */}
          {mode === 'script' && (
            <div>
              <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
                  Describe what your script should do. Costs 10 credits. Uses Gemini Flash AI.
                </p>
                <textarea
                  value={scriptPrompt}
                  onChange={(e) => setScriptPrompt(e.target.value)}
                  placeholder="e.g. Add a leaderboard that tracks kills and deaths, updates in real-time, and shows top 10 players..."
                  className="glass-input"
                  style={{ minHeight: 140, width: '100%', fontFamily: 'Inter, sans-serif', fontSize: 14 }}
                />
                <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Script type</label>
                    <select value={scriptType} onChange={(e) => setScriptType(e.target.value)} className="glass-input" style={{ width: 'auto', padding: '8px 12px' }}>
                      {['ServerScript', 'LocalScript', 'ModuleScript'].map((t) => (
                        <option key={t} value={t} style={{ background: '#0d0d1f' }}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <button onClick={handleScript} disabled={scriptGenerating || !scriptPrompt.trim()}
                    className="glass-button-primary" style={{ padding: '10px 24px', fontSize: 14, marginTop: 16 }}>
                    {scriptGenerating ? 'Generating...' : 'Create Script → (10 cr)'}
                  </button>
                </div>
              </div>

              {scriptResult && showScriptPreview && (
                <ScriptEditor
                  code={scriptResult.lua}
                  description={scriptResult.description}
                  filename={`${scriptType}.lua`}
                  onInsert={() => alert('Use the Studio Plugin to insert code into Roblox Studio')}
                  onRegenerate={() => { setScriptResult(null); setShowScriptPreview(false) }}
                />
              )}
            </div>
          )}

          {/* ====== MODE: CREATE UI ====== */}
          {mode === 'ui' && (
            <div>
              <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
                  Describe the UI element you want to create. Costs 10 credits.
                </p>
                <textarea
                  value={scriptPrompt}
                  onChange={(e) => setScriptPrompt(e.target.value)}
                  placeholder="e.g. Create a shop GUI with 3 items, coin display, buy buttons that change color on hover..."
                  className="glass-input"
                  style={{ minHeight: 140, width: '100%', fontFamily: 'Inter, sans-serif', fontSize: 14 }}
                />
                <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>UI Type</label>
                    <select value={uiType} onChange={(e) => setUiType(e.target.value)} className="glass-input" style={{ width: 'auto', padding: '8px 12px' }}>
                      {['Shop', 'HUD', 'Main Menu', 'Inventory', 'Custom'].map((t) => (
                        <option key={t} value={t} style={{ background: '#0d0d1f' }}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <button onClick={handleScript} disabled={scriptGenerating || !scriptPrompt.trim()}
                    className="glass-button-primary" style={{ padding: '10px 24px', fontSize: 14, marginTop: 16 }}>
                    {scriptGenerating ? 'Generating...' : 'Create UI → (10 cr)'}
                  </button>
                </div>
              </div>

              {scriptResult && showScriptPreview && (
                <ScriptEditor
                  code={scriptResult.lua}
                  description={scriptResult.description}
                  filename="UI_Script.lua"
                  onInsert={() => alert('Use the Studio Plugin to insert code into Roblox Studio')}
                  onRegenerate={() => { setScriptResult(null); setShowScriptPreview(false) }}
                />
              )}
            </div>
          )}

          {/* ====== MODE: FIX GAME ====== */}
          {mode === 'fix' && (
            <div>
              <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
                  Describe what is broken, or just say &quot;Fix everything&quot;. The AI will analyze and repair your game.
                </p>
                <textarea
                  value={fixPrompt}
                  onChange={(e) => setFixPrompt(e.target.value)}
                  placeholder="e.g. Players fall through the floor, the leaderboard doesn't update, Fix all script errors..."
                  className="glass-input"
                  style={{ minHeight: 140, width: '100%', fontFamily: 'Inter, sans-serif', fontSize: 14 }}
                />
                <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {([
                    { type: 'quick' as const, label: 'Quick Fix', desc: '15 credits', color: '#3b82f6' },
                    { type: 'deep' as const, label: 'Deep Fix', desc: '50 credits', color: '#7c3aed' },
                  ]).map((ft) => (
                    <button key={ft.type} onClick={() => setFixType(ft.type)}
                      style={{
                        padding: '12px 20px', borderRadius: 14, border: `1px solid ${fixType === ft.type ? ft.color : 'rgba(255,255,255,0.1)'}`,
                        background: fixType === ft.type ? `${ft.color}22` : 'transparent',
                        color: fixType === ft.type ? ft.color : 'var(--text-secondary)',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{ft.label}</div>
                      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{ft.desc}</div>
                    </button>
                  ))}
                </div>
                <button onClick={handleFix} disabled={fixing || !fixPrompt.trim()}
                  className="glass-button-primary" style={{ marginTop: 16, padding: '12px 32px', fontSize: 15 }}>
                  {fixing ? 'Fixing...' : `Fix Game → (${fixType === 'quick' ? '15' : '50'} cr)`}
                </button>
              </div>
            </div>
          )}

          {/* ====== MODE: CLEAN EXPLORER ====== */}
          {mode === 'clean' && (
            <div>
              <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
                <div style={{ fontSize: 48, marginBottom: 16, textAlign: 'center' }}>🧹</div>
                <h2 className="font-display" style={{ fontSize: 24, textAlign: 'center', marginBottom: 20 }}>Clean Explorer</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
                  {[
                    '📁 Sorts Workspace structure',
                    '🗑️ Removes duplicate parts',
                    '✏️ Renames unnamed objects',
                    '📦 Groups related objects',
                    '🔧 Cleans ServerScriptService',
                    '🖼️ Organizes StarterGui',
                  ].map((item) => (
                    <div key={item} style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontSize: 13, color: 'var(--text-secondary)' }}>
                      {item}
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>Cost: 10 credits</div>
                  <button onClick={handleClean} disabled={generating} className="glass-button-primary" style={{ padding: '12px 40px', fontSize: 16 }}>
                    {generating ? '🧹 Cleaning...' : 'Clean Now →'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ====== MODE: DIAGNOSE ====== */}
          {mode === 'diagnose' && (
            <div>
              {!diagnosisResult ? (
                <div className="glass-card" style={{ padding: 28, textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                  <h2 className="font-display" style={{ fontSize: 24, marginBottom: 12 }}>Diagnose Game</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
                    AI analyzes your game and lists all problems with severity ratings and fix suggestions.
                    Make sure your Studio Plugin is connected first.
                  </p>
                  <div style={{ padding: 16, borderRadius: 14, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', marginBottom: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
                    📌 Connect your Roblox Studio plugin first to get the best diagnosis
                  </div>
                  <button onClick={handleDiagnose} disabled={diagnosing} className="glass-button-primary" style={{ padding: '12px 40px', fontSize: 16 }}>
                    {diagnosing ? '🔍 Diagnosing...' : 'Run Diagnosis → (5 cr)'}
                  </button>
                </div>
              ) : (
                <DiagnosisCard
                  result={diagnosisResult}
                  onFixAll={() => { setMode('fix'); setFixPrompt('Fix all diagnosed issues'); setDiagnosisResult(null) }}
                  onFixSelected={(issues) => { setMode('fix'); setFixPrompt(`Fix these issues:\n${issues.map((i) => `- ${i.description}`).join('\n')}`); setDiagnosisResult(null) }}
                />
              )}
            </div>
          )}

          {/* RECENT PROJECTS */}
          {recentProjects.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 className="font-display" style={{ fontSize: 20 }}>Recent Projects</h2>
                <Link href="/dashboard/projects" style={{ fontSize: 13, color: '#a78bfa', textDecoration: 'none' }}>View all →</Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                {recentProjects.map((p) => (
                  <div key={p.id} className="glass-card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 500, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: 8 }}>{p.name}</span>
                      <span className="glass-badge" style={{ fontSize: 11, textTransform: 'capitalize', flexShrink: 0 }}>{p.mode}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(p.created_at).toLocaleDateString()}</span>
                      <Link href="/dashboard/projects" style={{ fontSize: 12, color: '#a78bfa', textDecoration: 'none' }}>Open →</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
