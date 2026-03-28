'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CITIES = ['Berlin', 'London', 'New York', 'Paris', 'Amsterdam', 'Stockholm', 'Toronto', 'Vienna', 'Zürich', 'Copenhagen', 'Los Angeles', 'Sydney', 'Tokyo', 'Singapore', 'Dubai']
const GAMES = ['Horror Maze', 'Space Shooter', 'Fantasy RPG', 'Zombie Survival', 'Racing League', 'Dungeon Crawler', 'Battle Royale', 'Tycoon World', 'Obstacle Course', 'Murder Mystery', 'Simulator Game', 'Tower Defense']
const TYPES = ['generated a', 'completed a', 'just built a', 'exported a', 'published a']
const FLAGS: Record<string, string> = {
  Berlin: '🇩🇪', London: '🇬🇧', 'New York': '🇺🇸', Paris: '🇫🇷', Amsterdam: '🇳🇱',
  Stockholm: '🇸🇪', Toronto: '🇨🇦', Vienna: '🇦🇹', Zürich: '🇨🇭', Copenhagen: '🇩🇰',
  'Los Angeles': '🇺🇸', Sydney: '🇦🇺', Tokyo: '🇯🇵', Singapore: '🇸🇬', Dubai: '🇦🇪',
}

interface Activity { id: number; city: string; type: string; game: string }
let idCounter = 0

function randomActivity(): Activity {
  return {
    id: ++idCounter,
    city: CITIES[Math.floor(Math.random() * CITIES.length)],
    type: TYPES[Math.floor(Math.random() * TYPES.length)],
    game: GAMES[Math.floor(Math.random() * GAMES.length)],
  }
}

export function LiveActivityFeed() {
  const [item, setItem] = useState<Activity | null>(null)

  useEffect(() => {
    // Initial delay before first appearance
    const initial = setTimeout(() => {
      setItem(randomActivity())
    }, 4000)

    return () => clearTimeout(initial)
  }, [])

  useEffect(() => {
    if (!item) return

    // Auto-dismiss after 5s then show next after 8-14s
    const dismiss = setTimeout(() => setItem(null), 5000)
    const next = setTimeout(() => setItem(randomActivity()), 5000 + 8000 + Math.random() * 6000)

    return () => { clearTimeout(dismiss); clearTimeout(next) }
  }, [item?.id])

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 500, pointerEvents: 'none' }}>
      <AnimatePresence>
        {item && (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 60, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            style={{
              background: 'rgba(3,3,12,0.92)',
              backdropFilter: 'blur(40px)',
              border: '0.5px solid rgba(212,146,15,0.25)',
              borderTop: '0.5px solid rgba(242,192,80,0.35)',
              borderRadius: 16,
              padding: '12px 16px',
              maxWidth: 280,
              boxShadow: '0 8px 32px rgba(0,0,0,0.50), 0 0 0 0.5px rgba(212,146,15,0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              {/* Live indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, paddingTop: 3 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', display: 'block', boxShadow: '0 0 6px #4ADE80', animation: 'livePulse 1.5s ease-in-out infinite' }} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--t-2)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--gold-bright)' }}>
                    {FLAGS[item.city] || '🌐'} {item.city}
                  </span>
                  {' '}{item.type}{' '}
                  <span style={{ color: 'var(--t-1)', fontWeight: 500 }}>{item.game}</span>
                  {' '}⚡
                </div>
                <div style={{ fontSize: 10, color: 'var(--t-4)', fontFamily: "'Tenor Sans', sans-serif", letterSpacing: '0.08em', marginTop: 3, textTransform: 'uppercase' }}>
                  Just now · xeron-labs.com
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }
      `}</style>
    </div>
  )
}
