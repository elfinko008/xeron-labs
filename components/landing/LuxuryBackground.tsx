'use client'
import { useEffect, useRef } from 'react'

interface Orb {
  x: number; y: number; vx: number; vy: number
  r: number; color: string; opacity: number
}

const ORBS: Array<{ color: string; opacity: number; size: number }> = [
  { color: '212,160,23',  opacity: 0.12, size: 600 },
  { color: '30,64,128',   opacity: 0.10, size: 700 },
  { color: '200,205,230', opacity: 0.07, size: 500 },
  { color: '212,160,23',  opacity: 0.08, size: 400 },
  { color: '30,64,128',   opacity: 0.09, size: 650 },
  { color: '212,160,23',  opacity: 0.06, size: 350 },
  { color: '200,205,230', opacity: 0.08, size: 550 },
  { color: '30,64,128',   opacity: 0.07, size: 480 },
]

export function LuxuryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = window.innerWidth
    let H = window.innerHeight
    canvas.width = W; canvas.height = H

    const orbs: Orb[] = ORBS.map(o => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: o.size,
      color: o.color,
      opacity: o.opacity,
    }))

    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      for (const orb of orbs) {
        orb.x += orb.vx; orb.y += orb.vy
        if (orb.x < -orb.r) orb.x = W + orb.r
        if (orb.x > W + orb.r) orb.x = -orb.r
        if (orb.y < -orb.r) orb.y = H + orb.r
        if (orb.y > H + orb.r) orb.y = -orb.r
        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r)
        g.addColorStop(0, `rgba(${orb.color},${orb.opacity})`)
        g.addColorStop(1, `rgba(${orb.color},0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    const resize = () => {
      W = window.innerWidth; H = window.innerHeight
      canvas.width = W; canvas.height = H
    }
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}
      aria-hidden
    />
  )
}
