'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Code2,
  Layout,
  Wrench,
  Trash2,
  Stethoscope,
  FolderOpen,
  Trophy,
  ShoppingBag,
  Zap,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Circle,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface SidebarProps {
  activeMode: string
  onModeChange: (mode: string) => void
  credits: number
  plan: string
  streakDays: number
}

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  creditCost?: string
  badge?: string
  badgeVariant?: 'default' | 'pro' | 'new'
  separator?: false
}

interface SeparatorItem {
  separator: true
  id: string
}

type NavEntry = NavItem | SeparatorItem

// ─── Recent Projects ─────────────────────────────────────────────────────────

const RECENT_PROJECTS = [
  { id: '1', name: 'Zombie Survival RPG', icon: '🎮', status: 'active' },
  { id: '2', name: 'Space Shooter Pro', icon: '🚀', status: 'building' },
  { id: '3', name: 'Fantasy Quest Arena', icon: '⚔️', status: 'active' },
  { id: '4', name: 'Neon Racing League', icon: '🏎️', status: 'paused' },
  { id: '5', name: 'Mystery Dungeon', icon: '🗺️', status: 'draft' },
]

const STATUS_COLORS: Record<string, string> = {
  active:   '#4ADE80',
  building: 'var(--gold-400)',
  paused:   'var(--plat-400)',
  draft:    'var(--t-3)',
}

// ─── Nav Items ────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavEntry[] = [
  { id: 'generate',   label: 'Generate Game', icon: <Sparkles size={18} />, creditCost: '50 cr',   badge: 'Pro+', badgeVariant: 'pro' },
  { id: 'script',     label: 'Script',         icon: <Code2    size={18} />, creditCost: '10 cr' },
  { id: 'ui',         label: 'UI',             icon: <Layout   size={18} />, creditCost: '10 cr' },
  { id: 'fix',        label: 'Fix',            icon: <Wrench   size={18} />, creditCost: '15–50 cr' },
  { id: 'clean',      label: 'Clean',          icon: <Trash2   size={18} />, creditCost: '10 cr' },
  { id: 'diagnose',   label: 'Diagnose',       icon: <Stethoscope size={18} />, creditCost: '5 cr' },
  { separator: true, id: 'sep1' },
  { id: 'projects',   label: 'My Projects',    icon: <FolderOpen  size={18} /> },
  { id: 'achievements', label: 'Achievements', icon: <Trophy      size={18} /> },
  { id: 'shop',       label: 'Shop',           icon: <ShoppingBag size={18} />, badge: 'New', badgeVariant: 'new' },
  { id: 'api',        label: 'API',            icon: <Zap         size={18} />, badge: 'Pro+', badgeVariant: 'pro' },
  { id: 'account',    label: 'Account',        icon: <BarChart2   size={18} /> },
]

const PLAN_MAX_CREDITS: Record<string, number> = {
  free: 10, starter: 100, pro: 500, enterprise: 2000,
}

// ─── Animated Credit Counter ──────────────────────────────────────────────────

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  const prevRef = useRef(0)

  useEffect(() => {
    const from = prevRef.current
    const to = value
    prevRef.current = value

    if (from === to) { setDisplay(to); return }

    const duration = 900
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(from + (to - from) * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [value])

  return <>{display.toLocaleString()}</>
}

// ─── Credit Widget ────────────────────────────────────────────────────────────

function CreditWidget({
  credits,
  plan,
  streakDays,
  collapsed,
}: {
  credits: number
  plan: string
  streakDays: number
  collapsed: boolean
}) {
  const router = useRouter()
  const maxCredits = PLAN_MAX_CREDITS[plan.toLowerCase()] ?? 100
  const pct = Math.min((credits / maxCredits) * 100, 100)

  if (collapsed) {
    return (
      <div
        className="flex flex-col items-center gap-2 px-2 py-4 cursor-pointer"
        style={{ borderTop: '1px solid var(--glass-border)' }}
        onClick={() => router.push('/shop')}
        title="Credits & Plans"
      >
        <span style={{ fontSize: 22 }}>🪙</span>
        <span className="credit-number" style={{ fontSize: 12 }}>
          <AnimatedNumber value={credits} />
        </span>
      </div>
    )
  }

  return (
    <div
      style={{
        borderTop: '1px solid var(--glass-border)',
        padding: '16px',
      }}
    >
      {/* Coin + count — click goes to /shop */}
      <div
        className="flex items-center gap-3 cursor-pointer mb-3"
        onClick={() => router.push('/shop')}
        style={{ borderRadius: 14, padding: '10px 12px', background: 'var(--glass-1)', border: '1px solid var(--glass-border-gold)', transition: 'background 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--glass-2)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'var(--glass-1)')}
      >
        <span className="credit-coin" style={{ fontSize: 28, lineHeight: 1 }}>🪙</span>
        <div>
          <div className="credit-number" style={{ fontSize: 22, lineHeight: 1 }}>
            <AnimatedNumber value={credits} />
          </div>
          <div className="t-label" style={{ fontSize: 10, marginTop: 2 }}>credits available</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <span className="lg-badge" style={{ fontSize: 10, padding: '2px 8px', textTransform: 'uppercase' }}>
            {plan}
          </span>
          {streakDays > 0 && (
            <span style={{ fontSize: 11, color: 'var(--gold-400)' }}>
              🔥 {streakDays}d
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar" style={{ marginBottom: 12 }}>
        <div
          className="progress-fill"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div style={{ fontSize: 11, color: 'var(--t-3)', marginBottom: 12, textAlign: 'right' }}>
        {credits} / {maxCredits}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className="btn-luxury"
          style={{ flex: 1, padding: '10px 12px', fontSize: 12, borderRadius: 12 }}
          onClick={() => router.push('/shop')}
        >
          Buy Credits
        </button>
        <button
          className="btn-glass"
          style={{ flex: 1, padding: '10px 12px', fontSize: 12, borderRadius: 12 }}
          onClick={() => router.push('/shop')}
        >
          Upgrade
        </button>
      </div>
    </div>
  )
}

// ─── Sidebar Component ────────────────────────────────────────────────────────

export default function Sidebar({
  activeMode,
  onModeChange,
  credits,
  plan,
  streakDays,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()

  const EXPANDED_W = 268
  const COLLAPSED_W = 72

  return (
    <motion.aside
      className="lg-sidebar"
      initial={false}
      animate={{ width: collapsed ? COLLAPSED_W : EXPANDED_W }}
      transition={{ type: 'spring', stiffness: 320, damping: 38 }}
      style={{
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        minWidth: collapsed ? COLLAPSED_W : EXPANDED_W,
      }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(v => !v)}
        style={{
          position: 'absolute',
          top: 22,
          right: -12,
          zIndex: 50,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'var(--depth-3)',
          border: '1px solid var(--glass-border-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          color: 'var(--gold-400)',
        }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed
          ? <ChevronRight size={12} />
          : <ChevronLeft  size={12} />
        }
      </button>

      {/* Inner scroll container */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

        {/* Logo row */}
        <div
          style={{
            padding: collapsed ? '16px 0' : '16px 16px',
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            minHeight: 60,
            flexShrink: 0,
          }}
        >
          <AnimatePresence mode="wait">
            {collapsed ? (
              <motion.span
                key="icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ fontSize: 20, color: 'var(--gold-400)' }}
              >
                ✦
              </motion.span>
            ) : (
              <motion.span
                key="text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="t-headline"
                style={{ fontSize: 17, whiteSpace: 'nowrap' }}
              >
                <span className="text-gold-gradient">XERON</span>
                <span style={{ color: 'var(--t-2)', fontWeight: 400 }}> Engine</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* New Project button */}
        <div
          style={{
            padding: collapsed ? '12px 10px' : '12px 12px',
            flexShrink: 0,
            borderBottom: '1px solid var(--glass-border)',
          }}
        >
          {collapsed ? (
            <button
              className="btn-luxury"
              style={{ width: '100%', padding: '10px 0', borderRadius: 12, justifyContent: 'center' }}
              onClick={() => router.push('/dashboard/new')}
              title="New Project"
            >
              <Plus size={16} />
            </button>
          ) : (
            <button
              className="btn-luxury btn-luxury-pulse"
              style={{ width: '100%', padding: '12px 16px', borderRadius: 14, fontSize: 14, justifyContent: 'center' }}
              onClick={() => router.push('/dashboard/new')}
            >
              ✦ New Project
            </button>
          )}
        </div>

        {/* Recent Projects */}
        {!collapsed && (
          <div
            style={{
              padding: '10px 12px 6px',
              flexShrink: 0,
            }}
          >
            <div className="t-label" style={{ fontSize: 10, marginBottom: 6, paddingLeft: 4 }}>
              Recent Projects
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', maxHeight: 140 }}>
              {RECENT_PROJECTS.map(proj => (
                <button
                  key={proj.id}
                  onClick={() => router.push(`/dashboard/projects/${proj.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 8px',
                    borderRadius: 10,
                    background: 'transparent',
                    border: '1px solid transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s, border-color 0.15s',
                    width: '100%',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--glass-1)'
                    e.currentTarget.style.borderColor = 'var(--glass-border)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'transparent'
                  }}
                >
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{proj.icon}</span>
                  <span
                    style={{
                      fontSize: 12,
                      color: 'var(--t-2)',
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {proj.name}
                  </span>
                  <Circle
                    size={7}
                    fill={STATUS_COLORS[proj.status] ?? 'var(--t-3)'}
                    stroke="none"
                    style={{ flexShrink: 0 }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="lg-divider" style={{ margin: '4px 0', flexShrink: 0 }} />

        {/* Navigation */}
        <nav
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: collapsed ? '8px 8px' : '8px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {NAV_ITEMS.map(entry => {
            if ('separator' in entry && entry.separator) {
              return (
                <div
                  key={entry.id}
                  className="lg-divider"
                  style={{ margin: '6px 0' }}
                />
              )
            }

            const item = entry as NavItem
            const isActive = activeMode === item.id

            return (
              <button
                key={item.id}
                onClick={() => onModeChange(item.id)}
                title={collapsed ? `${item.label}${item.creditCost ? ` [${item.creditCost}]` : ''}` : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: collapsed ? 0 : 10,
                  padding: collapsed ? '10px 0' : '9px 10px',
                  borderRadius: 12,
                  background: isActive ? 'rgba(212,160,23,0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(212,160,23,0.20)' : '1px solid transparent',
                  borderLeft: isActive ? '3px solid var(--gold-400)' : '3px solid transparent',
                  cursor: 'pointer',
                  color: isActive ? 'var(--gold-300)' : 'var(--t-2)',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  transition: 'all 0.2s',
                  width: '100%',
                  minHeight: 38,
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--glass-1)'
                    e.currentTarget.style.color = 'var(--t-1)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--t-2)'
                  }
                }}
              >
                {/* Icon */}
                <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                </span>

                {/* Label + badges */}
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        overflow: 'hidden',
                        flex: 1,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400 }}>
                        {item.label}
                      </span>

                      {item.creditCost && (
                        <span style={{ fontSize: 10, color: 'var(--t-3)', marginLeft: 'auto' }}>
                          [{item.creditCost}]
                        </span>
                      )}

                      {item.badge && (
                        <span
                          className={item.badgeVariant === 'pro' ? 'lg-badge' : 'lg-badge-pulse'}
                          style={{ fontSize: 9, padding: '2px 6px', marginLeft: item.creditCost ? 4 : 'auto' }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )
          })}
        </nav>

        {/* Credit Widget */}
        <CreditWidget
          credits={credits}
          plan={plan}
          streakDays={streakDays}
          collapsed={collapsed}
        />
      </div>
    </motion.aside>
  )
}
