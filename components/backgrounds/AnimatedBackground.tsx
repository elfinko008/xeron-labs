'use client'

import { useEffect, useRef } from 'react'

// ── AnimatedBackground ────────────────────────────────────────────────────────
// Canvas fixed full-viewport, z-index: -2, always running
// 30fps target (battery friendly)
// Layer 1: Deep navy gradient (CSS)
// Layer 2: Canvas — 6 drifting orbs with simplex-ish noise movement
// Layer 3: Floating particles (80 desktop / 20 mobile)
// Layer 4: Shooting stars (every 15-25s)

interface Orb {
  x: number; y: number
  vx: number; vy: number
  radius: number
  color: string
  opacity: number
  phase: number
  speed: number
}

interface Particle {
  x: number; y: number
  vy: number
  radius: number
  color: string
  opacity: number
}

interface ShootingStar {
  x: number; y: number
  progress: number
  length: number
  angle: number
  active: boolean
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const lastFrameRef = useRef<number>(0)
  const orbsRef = useRef<Orb[]>([])
  const particlesRef = useRef<Particle[]>([])
  const starRef = useRef<ShootingStar>({ x: 0, y: 0, progress: 0, length: 180, angle: 35, active: false })
  const nextStarTimeRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isMobile = window.innerWidth < 768
    if (isMobile) return // CSS only on mobile

    let w = window.innerWidth
    let h = window.innerHeight

    function resize() {
      w = window.innerWidth
      h = window.innerHeight
      canvas!.width = w
      canvas!.height = h
    }
    resize()
    window.addEventListener('resize', resize)

    // Initialize orbs
    const ORB_COLORS = [
      'rgba(14,45,74,',   // navy-600
      'rgba(0,30,80,',    // blue-900
      'rgba(7,24,40,',    // navy-800
      'rgba(0,50,120,',   // deep blue
      'rgba(10,35,60,',   // dark navy
      'rgba(0,20,60,',    // midnight blue
    ]
    orbsRef.current = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 200 + Math.random() * 200,
      color: ORB_COLORS[i],
      opacity: 0.06 + Math.random() * 0.04,
      phase: Math.random() * Math.PI * 2,
      speed: 0.0001 + Math.random() * 0.0002,
    }))

    // Initialize particles
    const PARTICLE_COUNT = 80
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => {
      const rand = Math.random()
      if (rand < 0.7) {
        // tiny white dots
        return { x: Math.random() * w, y: Math.random() * h, vy: -(0.1 + Math.random() * 0.2), radius: 0.5 + Math.random() * 0.5, color: 'rgba(255,255,255,', opacity: 0.3 + Math.random() * 0.4 }
      } else if (rand < 0.9) {
        // small blue dots
        return { x: Math.random() * w, y: Math.random() * h, vy: -(0.1 + Math.random() * 0.2), radius: 1 + Math.random(), color: 'rgba(102,178,255,', opacity: 0.3 + Math.random() * 0.3 }
      } else {
        // slightly larger with glow
        return { x: Math.random() * w, y: Math.random() * h, vy: -(0.08 + Math.random() * 0.15), radius: 2 + Math.random(), color: 'rgba(0,128,255,', opacity: 0.4 + Math.random() * 0.3 }
      }
    })

    nextStarTimeRef.current = performance.now() + 15000 + Math.random() * 10000

    function spawnStar() {
      const s = starRef.current
      s.x = Math.random() * w * 0.7
      s.y = Math.random() * h * 0.4
      s.progress = 0
      s.active = true
      s.length = 150 + Math.random() * 50
      s.angle = 30 + Math.random() * 15
    }

    function draw(now: number) {
      // 30fps cap
      if (now - lastFrameRef.current < 33) {
        frameRef.current = requestAnimationFrame(draw)
        return
      }
      lastFrameRef.current = now

      ctx!.clearRect(0, 0, w, h)

      // Draw orbs
      for (const orb of orbsRef.current) {
        orb.phase += orb.speed
        orb.x += orb.vx + Math.sin(orb.phase) * 0.4
        orb.y += orb.vy + Math.cos(orb.phase * 0.7) * 0.3
        // Wrap
        if (orb.x < -orb.radius) orb.x = w + orb.radius
        if (orb.x > w + orb.radius) orb.x = -orb.radius
        if (orb.y < -orb.radius) orb.y = h + orb.radius
        if (orb.y > h + orb.radius) orb.y = -orb.radius

        const g = ctx!.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius)
        g.addColorStop(0, orb.color + orb.opacity + ')')
        g.addColorStop(1, orb.color + '0)')
        ctx!.fillStyle = g
        ctx!.beginPath()
        ctx!.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2)
        ctx!.fill()
      }

      // Draw particles
      for (const p of particlesRef.current) {
        p.y += p.vy
        if (p.y < -4) {
          p.y = h + 4
          p.x = Math.random() * w
        }
        // Larger particles get glow
        if (p.radius > 1.5) {
          ctx!.shadowBlur = 6
          ctx!.shadowColor = p.color + '0.6)'
        } else {
          ctx!.shadowBlur = 0
        }
        ctx!.fillStyle = p.color + p.opacity + ')'
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx!.fill()
      }
      ctx!.shadowBlur = 0

      // Shooting star
      if (now >= nextStarTimeRef.current && !starRef.current.active) {
        spawnStar()
        nextStarTimeRef.current = now + 15000 + Math.random() * 10000
      }
      const s = starRef.current
      if (s.active) {
        s.progress = Math.min(s.progress + 0.045, 1)
        const rad = (s.angle * Math.PI) / 180
        const dx = Math.cos(rad)
        const dy = Math.sin(rad)
        const tailX = s.x + dx * s.length * s.progress
        const tailY = s.y + dy * s.length * s.progress
        const headOpacity = 1 - s.progress
        const grad = ctx!.createLinearGradient(s.x, s.y, tailX, tailY)
        grad.addColorStop(0, `rgba(200,230,255,0)`)
        grad.addColorStop(0.6, `rgba(200,230,255,${headOpacity * 0.6})`)
        grad.addColorStop(1, `rgba(255,255,255,${headOpacity})`)
        ctx!.strokeStyle = grad
        ctx!.lineWidth = 1.5
        ctx!.beginPath()
        ctx!.moveTo(s.x, s.y)
        ctx!.lineTo(tailX, tailY)
        ctx!.stroke()
        if (s.progress >= 1) s.active = false
      }

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <>
      {/* CSS background layer (visible on all devices) */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: -2, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse at 30% 20%, rgba(14,45,74,0.4), transparent 60%),
          radial-gradient(ellipse at 70% 80%, rgba(0,60,120,0.3), transparent 60%),
          #020B18
        `,
      }} />
      {/* Canvas layer (desktop only via CSS) */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none',
          display: 'none',
        }}
        className="animated-bg-canvas"
      />
      <style>{`
        @media (min-width: 769px) {
          .animated-bg-canvas { display: block !important; }
        }
      `}</style>
    </>
  )
}

export default AnimatedBackground
