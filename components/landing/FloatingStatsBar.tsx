'use client'
import { useEffect, useState, useRef } from 'react'

function useAnimatedCounter(target: number, duration = 2000) {
  const [value, setValue] = useState(0)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    startRef.current = null
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [target, duration])

  return value
}

interface StatItem { emoji: string; label: string; count: number; suffix?: string }

const STATS: StatItem[] = [
  { emoji: '🎮', label: 'games generated today', count: 47, suffix: '' },
  { emoji: '⚡', label: 'scripts created', count: 312, suffix: '' },
  { emoji: '🪙', label: 'credits used', count: 4891, suffix: '' },
  { emoji: '👾', label: 'active builders', count: 23, suffix: '' },
]

function LiveStat({ stat, active }: { stat: StatItem; active: boolean }) {
  const [live, setLive] = useState(stat.count)
  const displayed = useAnimatedCounter(active ? live : 0, active ? 1800 : 0)

  useEffect(() => {
    if (!active) return
    const interval = setInterval(() => {
      setLive(v => v + Math.floor(Math.random() * 3))
    }, 3000 + Math.random() * 4000)
    return () => clearInterval(interval)
  }, [active])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 28px', borderRight: '0.5px solid rgba(212,146,15,0.12)' }}>
      <span style={{ fontSize: 18 }}>{stat.emoji}</span>
      <div>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 28,
          color: 'var(--gold-bright)',
          letterSpacing: '0.04em',
          lineHeight: 1,
          display: 'block',
        }}>
          {displayed.toLocaleString()}{stat.suffix}
        </span>
        <span style={{
          fontFamily: "'Tenor Sans', sans-serif",
          fontSize: 10,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--t-3)',
        }}>
          {stat.label}
        </span>
      </div>
    </div>
  )
}

export function FloatingStatsBar() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true) }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} style={{
      background: 'rgba(3,3,12,0.80)',
      backdropFilter: 'blur(40px) saturate(160%)',
      borderTop: '0.5px solid rgba(212,146,15,0.12)',
      borderBottom: '0.5px solid rgba(212,146,15,0.12)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Shimmer top line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(242,192,80,0.40), transparent)',
        animation: 'barShimmer 3s linear infinite',
      }} />
      <div className="container-luxury" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', scrollbarWidth: 'none', justifyContent: 'center', flexWrap: 'wrap' }}>
          {/* Live indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 28px', borderRight: '0.5px solid rgba(212,146,15,0.12)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 8px #4ADE80', display: 'block', animation: 'livePulse 1.5s ease-in-out infinite' }} />
            <span style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: 10, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#4ADE80' }}>LIVE</span>
          </div>
          {STATS.map(stat => (
            <LiveStat key={stat.label} stat={stat} active={active} />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes barShimmer { 0%{transform:translateX(-100%);} 100%{transform:translateX(100%);} }
        @keyframes livePulse { 0%,100%{opacity:1;} 50%{opacity:0.5;} }
      `}</style>
    </div>
  )
}
