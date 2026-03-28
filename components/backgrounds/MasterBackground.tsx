'use client'
import { useEffect, useRef } from 'react'

export function MasterBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let t = 0
    let scrollY = 0
    let mx = 0.5, my = 0.5
    let lastTime = 0
    const FRAME_TIME = 1000 / 30

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const onMouse = (e: MouseEvent) => { mx = e.clientX / window.innerWidth; my = e.clientY / window.innerHeight }
    const onScroll = () => { scrollY = window.scrollY }
    window.addEventListener('mousemove', onMouse, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    // ── Layer C: Particles ────────────────────────────────────────────────────
    const PARTICLES = 300
    interface Particle { x: number; y: number; size: number; speed: number; opacity: number; phase: number; drift: number; type: 'ivory' | 'gold' | 'teal' }
    const particles: Particle[] = Array.from({ length: PARTICLES }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: i < 210 ? Math.random() * 0.6 + 0.3 : i < 270 ? Math.random() * 1.2 + 0.8 : Math.random() * 2.5 + 1.5,
      speed: Math.random() * 0.00015 + 0.00005,
      opacity: Math.random() * 0.55 + 0.15,
      phase: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 0.00010,
      type: i < 210 ? 'ivory' : i < 270 ? 'gold' : 'teal',
    }))

    // ── Layer F: Background stars ─────────────────────────────────────────────
    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random(), y: Math.random() * 0.7,
      size: Math.random() * 0.8 + 0.2,
      baseOpacity: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.0005 + 0.0002,
    }))

    // ── Layer B: Light rays ───────────────────────────────────────────────────
    const rays = [
      { x: 0.12, angle: 0.18, w: 0.09, baseOp: 0.052, color: '#D4920F', phase: 0 },
      { x: 0.28, angle: -0.05, w: 0.13, baseOp: 0.040, color: '#00CCCC', phase: 1.1 },
      { x: 0.45, angle: 0.12, w: 0.10, baseOp: 0.048, color: '#D4920F', phase: 2.2 },
      { x: 0.60, angle: -0.14, w: 0.11, baseOp: 0.038, color: '#9090C8', phase: 0.7 },
      { x: 0.75, angle: 0.08, w: 0.09, baseOp: 0.045, color: '#00CCCC', phase: 1.8 },
      { x: 0.90, angle: -0.10, w: 0.10, baseOp: 0.042, color: '#D4920F', phase: 3.0 },
    ]

    const draw = (ts: number) => {
      animId = requestAnimationFrame(draw)
      const delta = ts - lastTime
      if (delta < FRAME_TIME) return
      lastTime = ts - (delta % FRAME_TIME)

      const W = canvas.width, H = canvas.height
      t += 0.0001

      ctx.clearRect(0, 0, W, H)

      // ── Layer A: Ocean depth base gradient (color-cycling) ──────────────────
      const cycle = (Math.sin(t * 0.3) + 1) * 0.5
      const r1 = Math.round(0 + cycle * 2), g1 = Math.round(0 + cycle * 4), b1 = Math.round(13 + cycle * 10)
      const bg = ctx.createLinearGradient(0, 0, 0, H)
      bg.addColorStop(0, `rgb(${r1},${g1},${b1 + 5})`)
      bg.addColorStop(0.35, `rgb(${r1 + 1},${g1 + 1},${b1 + 8})`)
      bg.addColorStop(0.7, `rgb(${r1},${g1 + 2},${b1 + 12})`)
      bg.addColorStop(1, `rgb(${r1 + 2},${g1 + 3},${b1 + 6})`)
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // Parallax offsets
      const px = (mx - 0.5) * 5
      const py = (my - 0.5) * 3 - scrollY * 0.003

      // ── Layer F: Stars ──────────────────────────────────────────────────────
      stars.forEach(s => {
        s.phase += s.speed
        const op = s.baseOpacity * (0.5 + Math.sin(s.phase) * 0.5)
        ctx.globalAlpha = op
        ctx.fillStyle = '#FEFCF8'
        ctx.beginPath()
        ctx.arc(s.x * W + px * 0.2, s.y * H + py * 0.1, s.size, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1

      // ── Layer D: Deep sine wave paths ───────────────────────────────────────
      const waveColors = ['rgba(200,130,10,0.04)', 'rgba(0,153,153,0.035)', 'rgba(144,144,200,0.03)']
      for (let wi = 0; wi < 3; wi++) {
        ctx.beginPath()
        ctx.strokeStyle = waveColors[wi]
        ctx.lineWidth = 80
        ctx.globalAlpha = 1
        for (let x = 0; x <= W; x += 4) {
          const y = H * (0.4 + wi * 0.18) + Math.sin(x * 0.003 + t * (0.8 + wi * 0.3) + wi) * (60 + Math.sin(t * 0.5 + wi) * 20)
          if (x === 0) ctx.moveTo(x + px, y + py); else ctx.lineTo(x + px, y + py)
        }
        ctx.stroke()
      }

      // ── Layer B: Volumetric light rays ──────────────────────────────────────
      rays.forEach((ray, i) => {
        const drift = Math.sin(t * 0.5 + ray.phase) * W * 0.025
        const rx = W * ray.x + drift + px * 0.3
        const op = ray.baseOp + Math.sin(t * 1.2 + ray.phase) * 0.015

        ctx.save()
        ctx.globalAlpha = op
        const hw = W * ray.w
        const grad = ctx.createLinearGradient(rx, 0, rx + W * ray.angle * 0.5, H * 0.8)
        grad.addColorStop(0, ray.color + 'FF')
        grad.addColorStop(0.4, ray.color + '66')
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad

        ctx.beginPath()
        ctx.moveTo(rx - hw * 0.15, 0)
        ctx.lineTo(rx + hw * 0.15, 0)
        ctx.lineTo(rx + W * ray.angle + hw * 1.8, H)
        ctx.lineTo(rx + W * ray.angle - hw * 1.8, H)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      })

      // ── Layer E: Caustic overlay (simplified CSS-driven) ────────────────────
      const causticOp = 0.025 + Math.sin(t * 0.7) * 0.010
      const causticGrad = ctx.createRadialGradient(W * 0.5 + px, H * 0.6, 0, W * 0.5 + px, H * 0.6, H * 0.6)
      causticGrad.addColorStop(0, `rgba(0,153,153,${causticOp})`)
      causticGrad.addColorStop(0.5, `rgba(0,102,102,${causticOp * 0.5})`)
      causticGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = causticGrad
      ctx.fillRect(0, 0, W, H)

      // ── Deep current ellipses ───────────────────────────────────────────────
      for (let i = 0; i < 2; i++) {
        const cx = W * (0.25 + i * 0.5) + px * 2 + Math.sin(t * 0.6 + i * 1.5) * 30
        const cy = H * (0.5 + Math.sin(t * 0.4 + i) * 0.06) + py
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.42)
        grad.addColorStop(0, i === 0 ? 'rgba(0,102,102,0.06)' : 'rgba(200,130,10,0.05)')
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.ellipse(cx, cy, W * 0.42, H * 0.28, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      // ── Layer C: Bioluminescent particles ───────────────────────────────────
      particles.forEach(p => {
        // Mouse proximity acceleration
        const dx = (mx * W) - p.x, dy = (my * H) - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const accel = dist < 120 ? (1 - dist / 120) * 0.00008 : 0

        p.y -= (p.speed + accel) * 0.7
        p.x += Math.sin(t * 350 * p.drift + p.phase) * 0.14
        if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W }

        const pulse = 0.5 + Math.sin(t * 400 * p.speed + p.phase) * 0.35
        ctx.globalAlpha = p.opacity * pulse

        const color = p.type === 'ivory' ? '#F0EDE8' : p.type === 'gold' ? '#D4920F' : '#00CCCC'
        ctx.fillStyle = color
        if (p.type !== 'ivory') {
          ctx.shadowColor = color
          ctx.shadowBlur = p.size * 5
        }

        ctx.beginPath()
        ctx.arc(p.x + px * 0.4, p.y + py * 0.25, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
    }

    animId = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: -3, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}
