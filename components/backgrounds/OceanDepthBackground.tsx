'use client'
import { useEffect, useRef } from 'react'

export function OceanDepthBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let t = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Mouse parallax
    let mx = 0.5, my = 0.5
    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth
      my = e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', onMouseMove)

    // Particles
    const PARTICLE_COUNT = 200
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.00012 + 0.00004,
      opacity: Math.random() * 0.6 + 0.15,
      isTeal: Math.random() > 0.5,
      phase: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 0.00008,
    }))

    // Light rays
    const rays = [
      { x: 0.25, angle: 0.15, width: 0.08, opacity: 0.05, color: '#D4920F' },
      { x: 0.55, angle: -0.08, width: 0.12, opacity: 0.04, color: '#00CCCC' },
      { x: 0.80, angle: 0.06, width: 0.09, opacity: 0.05, color: '#D4920F' },
    ]

    let lastTime = 0
    const TARGET_FPS = 30
    const FRAME_TIME = 1000 / TARGET_FPS

    const draw = (timestamp: number) => {
      animId = requestAnimationFrame(draw)
      const delta = timestamp - lastTime
      if (delta < FRAME_TIME) return
      lastTime = timestamp - (delta % FRAME_TIME)

      const W = canvas.width, H = canvas.height
      t += 0.0001

      ctx.clearRect(0, 0, W, H)

      // Base gradient — deep ocean
      const bg = ctx.createLinearGradient(0, 0, 0, H)
      bg.addColorStop(0, '#00000D')
      bg.addColorStop(0.4, '#02020D')
      bg.addColorStop(0.7, '#020412')
      bg.addColorStop(1, '#030618')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // Parallax offset
      const px = (mx - 0.5) * 4
      const py = (my - 0.5) * 3

      // Deep current ellipses
      for (let i = 0; i < 2; i++) {
        const cx = W * (0.3 + i * 0.4) + px * 2
        const cy = H * (0.5 + Math.sin(t * 0.8 + i) * 0.08) + py
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.45)
        grad.addColorStop(0, i === 0 ? 'rgba(0,102,102,0.06)' : 'rgba(200,134,10,0.05)')
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.ellipse(cx, cy, W * 0.45, H * 0.30, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      // Light rays from top
      rays.forEach((ray, i) => {
        const rx = W * ray.x + px + Math.sin(t + i) * 10
        const opacity = ray.opacity + Math.sin(t * 1.5 + i) * 0.015

        ctx.save()
        ctx.globalAlpha = opacity
        const grad = ctx.createLinearGradient(rx, 0, rx + W * ray.angle, H)
        grad.addColorStop(0, ray.color)
        grad.addColorStop(0.5, ray.color + '44')
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad

        ctx.beginPath()
        const hw = W * ray.width
        ctx.moveTo(rx - hw * 0.3, 0)
        ctx.lineTo(rx + hw * 0.3, 0)
        ctx.lineTo(rx + W * ray.angle + hw * 2, H)
        ctx.lineTo(rx + W * ray.angle - hw * 2, H)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      })

      // Bioluminescent particles
      particles.forEach(p => {
        p.y -= p.speed * 0.8
        p.x += Math.sin(t * 300 * p.drift + p.phase) * 0.15
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W }

        const pulse = 0.5 + Math.sin(t * 400 * p.speed + p.phase) * 0.3
        ctx.globalAlpha = p.opacity * pulse
        const color = p.isTeal ? '#00CCCC' : '#D4920F'
        ctx.fillStyle = color
        ctx.shadowColor = color
        ctx.shadowBlur = p.size * 4

        ctx.beginPath()
        ctx.arc(p.x + px * 0.5, p.y + py * 0.3, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0

      // Caustic shimmer at bottom
      const causticY = H * 0.75 + py
      const causticGrad = ctx.createLinearGradient(0, causticY, 0, H)
      causticGrad.addColorStop(0, 'transparent')
      causticGrad.addColorStop(0.5, 'rgba(0,153,153,0.025)')
      causticGrad.addColorStop(1, 'rgba(0,204,204,0.04)')
      ctx.fillStyle = causticGrad
      ctx.fillRect(0, causticY, W, H - causticY)
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -2,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}
