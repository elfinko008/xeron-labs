'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Profile } from '@/lib/supabase'

const GAME_TYPES = [
  { value: 'obby', label: 'Obby' },
  { value: 'roleplay', label: 'Roleplay' },
  { value: 'horror', label: 'Horror' },
  { value: 'racing', label: 'Racing' },
  { value: 'shooter', label: 'Shooter' },
  { value: 'sandbox', label: 'Sandbox' },
]

const CREDIT_COSTS = {
  standard: { obby: 5, roleplay: 15, horror: 15, racing: 15, shooter: 15, sandbox: 15 },
  highend: { obby: 30, roleplay: 30, horror: 30, racing: 30, shooter: 30, sandbox: 30 },
}

const TASK_STEPS = [
  'Terrain generieren',
  'Lighting & Atmosphäre setzen',
  'Karte & Zonen aufbauen',
  'Gebäude platzieren',
  'Vegetation & Dekoration',
  'Scripts erstellen',
  'GUI aufbauen',
  'Spawnpoints setzen',
  'Explorer aufräumen',
]

type GenStatus = 'idle' | 'loading' | 'generating' | 'done' | 'error'

interface StepState {
  name: string
  status: 'pending' | 'running' | 'done'
}

export default function GenerateForm({ profile }: { profile: Profile }) {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [gameType, setGameType] = useState('roleplay')
  const [highEnd, setHighEnd] = useState(false)
  const [status, setStatus] = useState<GenStatus>('idle')
  const [projectId, setProjectId] = useState<string | null>(null)
  const [steps, setSteps] = useState<StepState[]>(TASK_STEPS.map((n) => ({ name: n, status: 'pending' })))
  const [result, setResult] = useState<{ summary: string; controls: string; luaOutput: string } | null>(null)
  const [error, setError] = useState('')
  const pollRef = useRef<NodeJS.Timeout | null>(null)
  const stepIndexRef = useRef(0)

  const quality = highEnd ? 'highend' : 'standard'
  const creditCost = CREDIT_COSTS[quality][gameType as keyof typeof CREDIT_COSTS.standard] ?? 15
  const canGenerate = profile.credits >= creditCost && prompt.trim().length >= 10

  // Fake Step-Fortschritt während Generierung
  useEffect(() => {
    if (status !== 'generating') return
    stepIndexRef.current = 0
    setSteps(TASK_STEPS.map((n) => ({ name: n, status: 'pending' })))

    const interval = setInterval(() => {
      setSteps((prev) => {
        const next = [...prev]
        const idx = stepIndexRef.current
        if (idx < next.length) {
          if (idx > 0) next[idx - 1] = { ...next[idx - 1], status: 'done' }
          next[idx] = { ...next[idx], status: 'running' }
          stepIndexRef.current++
        }
        return next
      })
    }, 8000)

    return () => clearInterval(interval)
  }, [status])

  // Polling für Status
  useEffect(() => {
    if (!projectId || status !== 'generating') return

    pollRef.current = setInterval(async () => {
      const res = await fetch(`/api/generate/status?projectId=${projectId}`)
      const data = await res.json()

      if (data.status === 'done') {
        clearInterval(pollRef.current!)
        setSteps(TASK_STEPS.map((n) => ({ name: n, status: 'done' })))
        setResult({ summary: data.summary, controls: data.controls, luaOutput: data.luaOutput })
        setStatus('done')
        router.refresh()
      } else if (data.status === 'error') {
        clearInterval(pollRef.current!)
        setError('Die Generierung ist fehlgeschlagen. Bitte versuche es erneut.')
        setStatus('error')
      }
    }, 2000)

    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [projectId, status, router])

  async function handleGenerate() {
    if (!canGenerate) return
    setError('')
    setStatus('loading')

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, gameType, quality }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Fehler beim Starten')
      setStatus('error')
      return
    }

    setProjectId(data.projectId)
    setStatus('generating')
  }

  function handleReset() {
    setStatus('idle')
    setProjectId(null)
    setResult(null)
    setError('')
    setSteps(TASK_STEPS.map((n) => ({ name: n, status: 'pending' })))
    stepIndexRef.current = 0
  }

  function downloadLua() {
    if (!result?.luaOutput) return
    const blob = new Blob([result.luaOutput], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `xeron-${gameType}-${Date.now()}.lua`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── RESULT VIEW ──────────────────────────────────────────
  if (status === 'done' && result) {
    return (
      <div className="space-y-4">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                 style={{ background: 'rgba(0,255,128,0.15)', border: '1px solid rgba(0,255,128,0.3)' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#00ff80' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-xl">Spiel generiert!</h2>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-xs mb-1 font-medium" style={{ color: 'var(--text-muted)' }}>Zusammenfassung</div>
              <p style={{ color: 'var(--text-secondary)' }}>{result.summary}</p>
            </div>
            <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-xs mb-1 font-medium" style={{ color: 'var(--text-muted)' }}>Steuerung</div>
              <p style={{ color: 'var(--accent-cyan)' }}>{result.controls}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={downloadLua} className="glass-button-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Lua herunterladen
            </button>
            <button onClick={handleReset} className="glass-button px-5 py-2.5 rounded-xl text-sm font-semibold">
              Neu generieren
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── GENERATING VIEW ───────────────────────────────────────
  if (status === 'generating' || status === 'loading') {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0"
               style={{ borderColor: 'var(--accent-red)', borderTopColor: 'transparent' }} />
          <h2 className="font-display text-xl">KI generiert dein Spiel...</h2>
        </div>

        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl text-sm transition-all"
                 style={{
                   background: step.status === 'running' ? 'rgba(233,69,96,0.08)' : 'transparent',
                   border: step.status === 'running' ? '1px solid rgba(233,69,96,0.2)' : '1px solid transparent',
                 }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                   style={{
                     background: step.status === 'done' ? 'rgba(0,255,128,0.15)' :
                                 step.status === 'running' ? 'rgba(233,69,96,0.2)' : 'rgba(255,255,255,0.05)',
                     color: step.status === 'done' ? '#00ff80' :
                            step.status === 'running' ? 'var(--accent-red)' : 'var(--text-muted)',
                   }}>
                {step.status === 'done' ? '✓' : step.status === 'running' ? '●' : i + 1}
              </div>
              <span style={{
                color: step.status === 'done' ? 'var(--text-secondary)' :
                       step.status === 'running' ? '#ffffff' : 'var(--text-muted)',
              }}>
                {step.name}
              </span>
              {step.status === 'running' && (
                <span className="text-xs ml-auto animate-pulse-slow" style={{ color: 'var(--accent-red)' }}>
                  läuft...
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── INPUT FORM ────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Prompt */}
      <div className="glass-card p-6">
        <label className="block text-sm font-medium mb-3">
          Beschreibe dein Roblox-Spiel
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value.slice(0, 3000))}
          placeholder="z.B. Ein Roleplay-Spiel in einer mittelalterlichen Stadt mit 300x300 Studs Terrain, Wald-Biom, 5 Gebäuden, Fahrzeug-Script und Leaderboard..."
          rows={8}
          className="glass-input w-full px-4 py-3 text-sm resize-none leading-relaxed"
        />
        <div className="text-xs mt-2 text-right" style={{ color: prompt.length > 2800 ? 'var(--accent-red)' : 'var(--text-muted)' }}>
          {prompt.length} / 3000
        </div>
      </div>

      {/* Optionen */}
      <div className="glass-card p-6 space-y-5">
        {/* Spieltyp */}
        <div>
          <label className="block text-sm font-medium mb-3">Spieltyp</label>
          <select
            value={gameType}
            onChange={(e) => setGameType(e.target.value)}
            className="glass-input w-full px-4 py-3 text-sm"
          >
            {GAME_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* High-End Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">High-End Grafik</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Claude Sonnet · +15 Credits · Maximale Qualität
            </div>
          </div>
          <button
            onClick={() => setHighEnd(!highEnd)}
            className="relative w-12 h-6 rounded-full transition-all flex-shrink-0"
            style={{ background: highEnd ? 'var(--accent-red)' : 'rgba(255,255,255,0.1)' }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
              style={{ left: highEnd ? '26px' : '2px', boxShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
            />
          </button>
        </div>

        {/* Credit-Kosten */}
        <div className="flex items-center justify-between p-4 rounded-xl"
             style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Diese Generierung kostet:
          </span>
          <span className="font-display text-lg" style={{ color: profile.credits >= creditCost ? 'var(--accent-red)' : '#ff4444' }}>
            {creditCost} Credits
          </span>
        </div>

        {profile.credits < creditCost && (
          <div className="text-sm px-4 py-3 rounded-xl" style={{ background: 'rgba(233,69,96,0.08)', border: '1px solid rgba(233,69,96,0.2)', color: '#e94560' }}>
            Nicht genug Credits. Du hast {profile.credits} Credits, benötigst aber {creditCost}.
          </div>
        )}

        {error && (
          <div className="text-sm px-4 py-3 rounded-xl" style={{ background: 'rgba(233,69,96,0.08)', border: '1px solid rgba(233,69,96,0.2)', color: '#e94560' }}>
            {error}
          </div>
        )}
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className="glass-button-primary w-full py-4 rounded-2xl font-display text-lg"
      >
        Spiel generieren →
      </button>
    </div>
  )
}
