'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Code2,
  Layout,
  Wrench,
  Trash2,
  Stethoscope,
  ShoppingBag,
  TrendingUp,
  FolderOpen,
  Search,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

interface PaletteItem {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  section: string
  action: () => void
  keywords?: string[]
}

// ─── Recent projects (static demo) ───────────────────────────────────────────

const RECENT_PROJECTS = [
  { id: 'rp1', name: 'Zombie Survival RPG',  icon: '🎮' },
  { id: 'rp2', name: 'Space Shooter Pro',     icon: '🚀' },
  { id: 'rp3', name: 'Fantasy Quest Arena',   icon: '⚔️' },
]

// ─── Command Palette ──────────────────────────────────────────────────────────

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const navigate = useCallback(
    (path: string, modeOverride?: string) => {
      onClose()
      if (modeOverride) {
        router.push(`${path}?mode=${modeOverride}`)
      } else {
        router.push(path)
      }
    },
    [router, onClose],
  )

  const ALL_ITEMS: PaletteItem[] = [
    {
      id: 'generate',
      label: 'Generate Game',
      description: '50 cr — Create a complete game from a prompt',
      icon: <Sparkles size={16} />,
      section: 'Commands',
      action: () => navigate('/dashboard', 'generate'),
      keywords: ['create', 'new', 'game', 'make'],
    },
    {
      id: 'script',
      label: 'Create Script',
      description: '10 cr — Write or generate a Lua script',
      icon: <Code2 size={16} />,
      section: 'Commands',
      action: () => navigate('/dashboard', 'script'),
      keywords: ['lua', 'code', 'write'],
    },
    {
      id: 'ui',
      label: 'Create UI',
      description: '10 cr — Build a UI layout',
      icon: <Layout size={16} />,
      section: 'Commands',
      action: () => navigate('/dashboard', 'ui'),
      keywords: ['interface', 'layout', 'frame', 'gui'],
    },
    {
      id: 'fix',
      label: 'Fix Game',
      description: '15–50 cr — Diagnose and fix issues',
      icon: <Wrench size={16} />,
      section: 'Commands',
      action: () => navigate('/dashboard', 'fix'),
      keywords: ['repair', 'debug', 'error', 'bug'],
    },
    {
      id: 'clean',
      label: 'Clean Explorer',
      description: '10 cr — Tidy up your project hierarchy',
      icon: <Trash2 size={16} />,
      section: 'Commands',
      action: () => navigate('/dashboard', 'clean'),
      keywords: ['tidy', 'organize', 'remove', 'delete'],
    },
    {
      id: 'diagnose',
      label: 'Diagnose',
      description: '5 cr — Scan project for issues',
      icon: <Stethoscope size={16} />,
      section: 'Commands',
      action: () => navigate('/dashboard', 'diagnose'),
      keywords: ['scan', 'check', 'inspect'],
    },
    {
      id: 'buy-credits',
      label: 'Buy Credits',
      description: 'Top up your credit balance',
      icon: <ShoppingBag size={16} />,
      section: 'Quick Actions',
      action: () => navigate('/shop'),
      keywords: ['purchase', 'topup', 'coins'],
    },
    {
      id: 'upgrade',
      label: 'Upgrade Plan',
      description: 'Get Pro+ for unlimited power',
      icon: <TrendingUp size={16} />,
      section: 'Quick Actions',
      action: () => navigate('/shop'),
      keywords: ['pro', 'premium', 'plan'],
    },
  ]

  // Filter items by query
  const filtered = query.trim()
    ? ALL_ITEMS.filter(item => {
        const q = query.toLowerCase()
        return (
          item.label.toLowerCase().includes(q) ||
          (item.description ?? '').toLowerCase().includes(q) ||
          (item.keywords ?? []).some(k => k.includes(q))
        )
      })
    : ALL_ITEMS

  // Group items by section
  const sections = filtered.reduce<Record<string, PaletteItem[]>>((acc, item) => {
    if (!acc[item.section]) acc[item.section] = []
    acc[item.section].push(item)
    return acc
  }, {})

  const flatItems = filtered

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(i => Math.min(i + 1, flatItems.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        flatItems[activeIndex]?.action()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, activeIndex, flatItems, onClose])

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`) as HTMLElement | null
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [activeIndex])

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [isOpen])

  // Reset active when filter changes
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  // Global shortcut Cmd/Ctrl+K handled upstream, but also bind here as fallback
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) onClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  let itemCounter = 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9000,
              background: 'rgba(0,0,0,0.70)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.94, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -16 }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            className="lg-modal"
            style={{
              position: 'fixed',
              top: '15%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9001,
              width: '100%',
              maxWidth: 620,
              maxHeight: '70vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Search input */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexShrink: 0,
              }}
            >
              <Search size={18} style={{ color: 'var(--t-3)', flexShrink: 0 }} />
              <input
                ref={inputRef}
                className="lg-input"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Type a command..."
                style={{
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                  padding: 0,
                  fontSize: 16,
                  outline: 'none',
                }}
              />
              <kbd
                style={{
                  fontSize: 11,
                  color: 'var(--t-3)',
                  background: 'var(--glass-1)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 6,
                  padding: '3px 7px',
                  flexShrink: 0,
                }}
              >
                Esc
              </kbd>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              style={{ overflowY: 'auto', flex: 1, padding: '8px 0' }}
            >
              {/* Grouped command sections */}
              {Object.entries(sections).map(([sectionName, items]) => (
                <div key={sectionName}>
                  <div
                    className="t-label"
                    style={{
                      fontSize: 10,
                      padding: '8px 20px 4px',
                      color: 'var(--t-3)',
                    }}
                  >
                    {sectionName}
                  </div>
                  {items.map(item => {
                    const idx = itemCounter++
                    const active = activeIndex === idx
                    return (
                      <button
                        key={item.id}
                        data-index={idx}
                        onClick={item.action}
                        onMouseEnter={() => setActiveIndex(idx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          width: '100%',
                          padding: '10px 20px',
                          background: active ? 'rgba(212,160,23,0.08)' : 'transparent',
                          borderLeft: active ? '2px solid var(--gold-400)' : '2px solid transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          color: active ? 'var(--t-1)' : 'var(--t-2)',
                          transition: 'background 0.12s, border-color 0.12s',
                        }}
                      >
                        <span
                          style={{
                            flexShrink: 0,
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: active ? 'rgba(212,160,23,0.15)' : 'var(--glass-1)',
                            border: '1px solid var(--glass-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: active ? 'var(--gold-400)' : 'var(--t-3)',
                          }}
                        >
                          {item.icon}
                        </span>
                        <span style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</div>
                          {item.description && (
                            <div style={{ fontSize: 12, color: 'var(--t-3)', marginTop: 2 }}>
                              {item.description}
                            </div>
                          )}
                        </span>
                        {active && (
                          <kbd
                            style={{
                              fontSize: 10,
                              color: 'var(--gold-400)',
                              background: 'rgba(212,160,23,0.08)',
                              border: '1px solid rgba(212,160,23,0.25)',
                              borderRadius: 5,
                              padding: '2px 7px',
                            }}
                          >
                            Enter
                          </kbd>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}

              {/* Recent Projects section (only when no query) */}
              {!query.trim() && (
                <div>
                  <div
                    className="t-label"
                    style={{ fontSize: 10, padding: '8px 20px 4px', color: 'var(--t-3)' }}
                  >
                    Recent Projects
                  </div>
                  {RECENT_PROJECTS.map(proj => {
                    const idx = itemCounter++
                    const active = activeIndex === idx
                    return (
                      <button
                        key={proj.id}
                        data-index={idx}
                        onClick={() => {
                          onClose()
                          router.push(`/dashboard/projects/${proj.id}`)
                        }}
                        onMouseEnter={() => setActiveIndex(idx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          width: '100%',
                          padding: '10px 20px',
                          background: active ? 'rgba(212,160,23,0.08)' : 'transparent',
                          borderLeft: active ? '2px solid var(--gold-400)' : '2px solid transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          color: active ? 'var(--t-1)' : 'var(--t-2)',
                          transition: 'background 0.12s',
                        }}
                      >
                        <span
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: active ? 'rgba(212,160,23,0.15)' : 'var(--glass-1)',
                            border: '1px solid var(--glass-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 16,
                            flexShrink: 0,
                          }}
                        >
                          {proj.icon}
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{proj.name}</span>
                        {active && (
                          <FolderOpen size={14} style={{ marginLeft: 'auto', color: 'var(--gold-400)' }} />
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Empty state */}
              {filtered.length === 0 && (
                <div
                  style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: 'var(--t-3)',
                    fontSize: 14,
                  }}
                >
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div
              style={{
                padding: '10px 20px',
                borderTop: '1px solid var(--glass-border)',
                display: 'flex',
                gap: 16,
                flexShrink: 0,
              }}
            >
              {[
                ['↑↓', 'navigate'],
                ['↵', 'select'],
                ['Esc', 'close'],
              ].map(([key, hint]) => (
                <span key={key} style={{ fontSize: 11, color: 'var(--t-3)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <kbd
                    style={{
                      background: 'var(--glass-1)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: 4,
                      padding: '2px 6px',
                      fontSize: 11,
                      color: 'var(--t-2)',
                    }}
                  >
                    {key}
                  </kbd>
                  {hint}
                </span>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
