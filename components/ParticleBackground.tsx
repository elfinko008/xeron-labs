'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  duration: number
  delay: number
  size: number
  opacity: number
}

export default function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const generated = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 5,
      size: 2 + Math.random() * 4,
      opacity: 0.2 + Math.random() * 0.4,
    }))
    setParticles(generated)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `rgba(124,58,237,${p.opacity})`,
            '--duration': `${p.duration}s`,
            '--delay': `${p.delay}s`,
            animation: `float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
      {/* Secondary blue particles */}
      {particles.slice(0, 8).map((p) => (
        <div
          key={`blue-${p.id}`}
          className="absolute rounded-full"
          style={{
            left: `${(p.x + 30) % 100}%`,
            top: `${(p.y + 20) % 100}%`,
            width: `${p.size * 0.6}px`,
            height: `${p.size * 0.6}px`,
            background: `rgba(59,130,246,${p.opacity * 0.6})`,
            animation: `float ${p.duration * 1.3}s ease-in-out infinite`,
            animationDelay: `${p.delay + 1}s`,
          }}
        />
      ))}
    </div>
  )
}
