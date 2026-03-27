'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, AlertTriangle, X } from 'lucide-react'
import CreditPill from './CreditPill'

// ─── Types ────────────────────────────────────────────────────────────────────

interface GenerateModeProps {
  plan: string
  credits: number
  onGenerate: (prompt: string, quality: string) => void
}

// ─── Style Presets ─────────────────────────────────────────────────────────────

const STYLE_PRESETS = [
  { id: 'rpg',      label: '⚔️ RPG',            prompt: 'an epic fantasy RPG' },
  { id: 'shooter',  label: '🔫 Shooter',         prompt: 'a fast-paced shooter' },
  { id: 'survival', label: '🌲 Survival',        prompt: 'a survival crafting game' },
  { id: 'racing',   label: '🏎️ Racing',          prompt: 'a competitive racing game' },
  { id: 'horror',   label: '👻 Horror',          prompt: 'a psychological horror experience' },
  { id: 'tycoon',   label: '💼 Tycoon',          prompt: 'a tycoon management sim' },
  { id: 'obby',     label: '🏃 Obby',            prompt: 'a challenging obstacle course' },
  { id: 'battle',   label: '💥 Battle Royale',   prompt: 'a battle royale game' },
  { id: 'sandbox',  label: '🏗️ Sandbox',         prompt: 'an open-world sandbox experience' },
  { id: 'puzzle',   label: '🧩 Puzzle',          prompt: 'a mind-bending puzzle game' },
]

const CHAR_LIMIT = 3000

const PLAN_CAN_GENERATE = (plan: string) =>
  ['pro', 'enterprise'].includes(plan.toLowerCase())

const PLAN_HAS_HIGHEND = (plan: string) =>
  ['pro', 'enterprise'].includes(plan.toLowerCase())

// ─── Upgrade Modal ────────────────────────────────────────────────────────────

function UpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 8000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 360, damping: 36 }}
        className="lg-modal"
        onClick={e => e.stopPropagation()}
        style={{ padding: 40, maxWidth: 440, width: '90%', textAlign: 'center' }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--t-3)',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ fontSize: 48, marginBottom: 16 }}>✦</div>
        <div className="t-headline" style={{ fontSize: 22, marginBottom: 8 }}>
          Upgrade to Pro+
        </div>
        <div className="t-body" style={{ fontSize: 14, marginBottom: 28 }}>
          Generate complete games, access High-End quality, and unlock unlimited creative power.
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <a
            href="/shop"
            className="btn-luxury btn-luxury-pulse"
            style={{ padding: '13px 32px', borderRadius: 14, fontSize: 14 }}
          >
            View Plans
          </a>
          <button
            className="btn-glass"
            style={{ padding: '13px 24px', borderRadius: 14, fontSize: 14 }}
            onClick={onClose}
          >
            Maybe Later
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Prompt Builder Tab ───────────────────────────────────────────────────────

function PromptBuilder({
  onApply,
}: {
  onApply: (prompt: string) => void
}) {
  const [genre, setGenre]       = useState('')
  const [setting, setSetting]   = useState('')
  const [mechanics, setMechanics] = useState('')
  const [mood, setMood]         = useState('')

  const build = () => {
    const parts = [genre, setting, mechanics, mood].filter(Boolean)
    if (parts.length > 0) {
      onApply(
        `Create ${genre || 'a game'} set in ${setting || 'a unique world'} with ${mechanics || 'engaging mechanics'}, ${mood || 'with a compelling atmosphere'}.`,
      )
    }
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--glass-border)',
    borderRadius: 12,
    padding: '10px 14px',
    color: 'var(--t-1)',
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}
      >
        {[
          { label: 'Genre', value: genre, set: setGenre, placeholder: 'e.g. RPG, Shooter, Tycoon' },
          { label: 'Setting / World', value: setting, set: setSetting, placeholder: 'e.g. futuristic city, dark forest' },
          { label: 'Core Mechanics', value: mechanics, set: setMechanics, placeholder: 'e.g. crafting, PvP, stealth' },
          { label: 'Mood / Tone', value: mood, set: setMood, placeholder: 'e.g. epic, horror, chill' },
        ].map(field => (
          <div key={field.label}>
            <div className="t-label" style={{ fontSize: 11, marginBottom: 6 }}>{field.label}</div>
            <input
              className="lg-input"
              style={{ ...fieldStyle, padding: '9px 14px' }}
              value={field.value}
              onChange={e => field.set(e.target.value)}
              placeholder={field.placeholder}
            />
          </div>
        ))}
      </div>

      <button
        className="btn-glass"
        style={{ padding: '11px 20px', borderRadius: 12, fontSize: 14, alignSelf: 'flex-start' }}
        onClick={build}
      >
        Apply to Prompt
      </button>
    </div>
  )
}

// ─── GenerateMode ─────────────────────────────────────────────────────────────

export default function GenerateMode({ plan, credits, onGenerate }: GenerateModeProps) {
  const [activeTab, setActiveTab]     = useState<'quick' | 'builder'>('quick')
  const [prompt, setPrompt]           = useState('')
  const [selectedPreset, setPreset]   = useState<string | null>(null)
  const [quality, setQuality]         = useState<'standard' | 'highend'>('standard')
  const [showUpgrade, setShowUpgrade] = useState(false)
  const textareaRef                   = useRef<HTMLTextAreaElement>(null)

  const canGenerate  = PLAN_CAN_GENERATE(plan)
  const hasHighEnd   = PLAN_HAS_HIGHEND(plan)
  const charCount    = prompt.length
  const wordCount    = prompt.trim() ? prompt.trim().split(/\s+/).length : 0
  const isOverLimit  = charCount > CHAR_LIMIT

  const creditCost = quality === 'highend' ? 200 : 50

  const handlePreset = (preset: (typeof STYLE_PRESETS)[0]) => {
    setPreset(prev => (prev === preset.id ? null : preset.id))
    if (selectedPreset !== preset.id) {
      setPrompt(prev =>
        prev ? `${prev.trimEnd()} — ${preset.prompt}` : `Create ${preset.prompt}`,
      )
    }
  }

  const handleGenerate = useCallback(() => {
    if (!canGenerate) { setShowUpgrade(true); return }
    if (!prompt.trim() || isOverLimit) return
    onGenerate(prompt, quality)
  }, [canGenerate, prompt, isOverLimit, quality, onGenerate])

  // Ctrl+Enter handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleGenerate()
    }
  }

  const applyBuilderPrompt = (p: string) => {
    setPrompt(p)
    setActiveTab('quick')
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  const tabStyle = (tab: 'quick' | 'builder'): React.CSSProperties => ({
    padding: '8px 20px',
    fontSize: 13,
    fontWeight: activeTab === tab ? 600 : 400,
    color: activeTab === tab ? 'var(--gold-300)' : 'var(--t-3)',
    background: activeTab === tab ? 'rgba(212,160,23,0.10)' : 'transparent',
    border: activeTab === tab ? '1px solid rgba(212,160,23,0.22)' : '1px solid transparent',
    borderRadius: 10,
    cursor: 'pointer',
    transition: 'all 0.18s',
  })

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={tabStyle('quick')}   onClick={() => setActiveTab('quick')}>Quick Prompt</button>
          <button style={tabStyle('builder')} onClick={() => setActiveTab('builder')}>Prompt Builder</button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'quick' ? (
            <motion.div
              key="quick"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {/* Style presets */}
              <div>
                <div className="t-label" style={{ fontSize: 11, marginBottom: 8 }}>Style Preset</div>
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    overflowX: 'auto',
                    paddingBottom: 4,
                    scrollbarWidth: 'none',
                  }}
                >
                  {STYLE_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => handlePreset(preset)}
                      style={{
                        flexShrink: 0,
                        padding: '7px 14px',
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: selectedPreset === preset.id ? 600 : 400,
                        color: selectedPreset === preset.id ? 'var(--gold-300)' : 'var(--t-2)',
                        background:
                          selectedPreset === preset.id
                            ? 'rgba(212,160,23,0.12)'
                            : 'var(--glass-1)',
                        border:
                          selectedPreset === preset.id
                            ? '1px solid rgba(212,160,23,0.30)'
                            : '1px solid var(--glass-border)',
                        cursor: 'pointer',
                        transition: 'all 0.18s',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div style={{ position: 'relative' }}>
                {/* Credit pill — top right of textarea */}
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 5,
                  }}
                >
                  <CreditPill credits={credits} />
                </div>

                <textarea
                  ref={textareaRef}
                  className="lg-input"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value.slice(0, CHAR_LIMIT + 50))}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your game idea in detail...&#10;&#10;e.g. A fast-paced zombie survival RPG set in a post-apocalyptic city with looting, crafting, and cooperative PvE gameplay for up to 4 players."
                  rows={10}
                  style={{
                    resize: 'vertical',
                    minHeight: 200,
                    paddingTop: 48,
                    lineHeight: 1.65,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />

                {/* Char + word count */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 6,
                    fontSize: 11,
                    color: isOverLimit ? '#F87171' : 'var(--t-3)',
                  }}
                >
                  <span>
                    {wordCount} word{wordCount !== 1 ? 's' : ''}
                  </span>
                  <span>
                    {charCount.toLocaleString()} / {CHAR_LIMIT.toLocaleString()} chars
                    {isOverLimit && (
                      <span style={{ marginLeft: 6, color: '#F87171' }}>⚠ Over limit</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Quality toggle */}
              <div>
                <div className="t-label" style={{ fontSize: 11, marginBottom: 8 }}>Generation Quality</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['standard', 'highend'] as const).map(q => {
                    const isSelected = quality === q
                    const disabled   = q === 'highend' && !hasHighEnd
                    return (
                      <button
                        key={q}
                        disabled={disabled}
                        onClick={() => !disabled && setQuality(q)}
                        style={{
                          padding: '9px 18px',
                          borderRadius: 12,
                          fontSize: 13,
                          fontWeight: isSelected ? 600 : 400,
                          color: disabled
                            ? 'var(--t-4)'
                            : isSelected
                            ? 'var(--gold-300)'
                            : 'var(--t-2)',
                          background: isSelected
                            ? 'rgba(212,160,23,0.10)'
                            : 'var(--glass-1)',
                          border: isSelected
                            ? '1px solid rgba(212,160,23,0.30)'
                            : '1px solid var(--glass-border)',
                          cursor: disabled ? 'not-allowed' : 'pointer',
                          opacity: disabled ? 0.5 : 1,
                          transition: 'all 0.18s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        {q === 'standard' ? 'Standard' : 'High-End (+150 cr)'}
                        {q === 'highend' && (
                          <span className="lg-badge" style={{ fontSize: 9, padding: '1px 6px' }}>Pro+</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Disabled plan warning */}
              {!canGenerate && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: 'rgba(251,191,36,0.06)',
                    border: '1px solid rgba(251,191,36,0.20)',
                    fontSize: 13,
                    color: 'var(--gold-300)',
                  }}
                >
                  <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                  Game generation requires a Pro+ plan.{' '}
                  <button
                    onClick={() => setShowUpgrade(true)}
                    style={{
                      color: 'var(--gold-400)',
                      textDecoration: 'underline',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Upgrade
                  </button>
                </div>
              )}

              {/* Generate button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  className={`btn-luxury${canGenerate ? ' btn-luxury-pulse' : ''}`}
                  disabled={!canGenerate || !prompt.trim() || isOverLimit}
                  onClick={handleGenerate}
                  style={{
                    padding: '14px 32px',
                    borderRadius: 16,
                    fontSize: 15,
                    opacity: (!canGenerate || !prompt.trim() || isOverLimit) ? 0.6 : 1,
                    cursor: (!canGenerate || !prompt.trim() || isOverLimit) ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Sparkles size={16} />
                  ✦ Generate Game [{creditCost} cr]
                </button>

                <span style={{ fontSize: 11, color: 'var(--t-3)' }}>
                  Ctrl+Enter
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="builder"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <PromptBuilder onApply={applyBuilderPrompt} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Upgrade modal */}
      <AnimatePresence>
        {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      </AnimatePresence>
    </>
  )
}
