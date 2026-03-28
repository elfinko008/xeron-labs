'use client'
import { useEffect, useState } from 'react'

interface StatItem { emoji: string; label: string; count: number }

const STATS: StatItem[] = [
  { emoji: '🎮', label: 'games generated today', count: 47 },
  { emoji: '⚡', label: 'scripts created',        count: 312 },
  { emoji: '🪙', label: 'credits used',            count: 4891 },
  { emoji: '👾', label: 'active builders',         count: 23 },
]

function LiveStat({ stat }: { stat: StatItem }) {
  const [count, setCount] = useState(stat.count)

  useEffect(() => {
    const tick = () => {
      setCount(v => v + Math.floor(Math.random() * 3))
      schedule()
    }
    let id: ReturnType<typeof setTimeout>
    const schedule = () => { id = setTimeout(tick, 3000 + Math.random() * 4000) }
    schedule()
    return () => clearTimeout(id)
  }, [])

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
          {count.toLocaleString()}
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
  return (
    <div style={{
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
            <LiveStat key={stat.label} stat={stat} />
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
