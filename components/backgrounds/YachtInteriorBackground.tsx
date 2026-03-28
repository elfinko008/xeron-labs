'use client'
import { useEffect, useRef } from 'react'

export function YachtInteriorBackground() {
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

    // Warm gold motes
    const motes = Array.from({ length: 30 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.2 + 0.4,
      speed: Math.random() * 0.00008 + 0.00003,
      opacity: Math.random() * 0.4 + 0.1,
      phase: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 0.00006,
    }))

    // Lamp positions (corners + center)
    const lamps = [
      { x: 0.1, y: 0.1 },
      { x: 0.9, y: 0.1 },
      { x: 0.1, y: 0.9 },
      { x: 0.9, y: 0.9 },
      { x: 0.5, y: 0.4 },
    ]

    let glintTimer = 0
    let glintX = 0, glintY = 0, glintLife = 0

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

      // Base — very dark warm black
      const bg = ctx.createLinearGradient(0, 0, 0, H)
      bg.addColorStop(0, '#020108')
      bg.addColorStop(0.5, '#030210')
      bg.addColorStop(1, '#020108')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // Subtle wood grain lines
      ctx.globalAlpha = 0.018
      for (let i = 0; i < 60; i++) {
        const y = (i / 60) * H + Math.sin(t * 50 + i) * 2
        ctx.strokeStyle = '#8B6914'
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(W, y + Math.sin(i * 0.3) * 3)
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      // Lamp glows breathing
      lamps.forEach((lamp, i) => {
        const breathe = 0.04 + Math.sin(t * 800 + i * 1.3) * 0.025
        const cx = W * lamp.x
        const cy = H * lamp.y
        const r = Math.max(W, H) * 0.4
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        grad.addColorStop(0, `rgba(200, 130, 10, ${breathe})`)
        grad.addColorStop(0.5, `rgba(180, 100, 5, ${breathe * 0.4})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, W, H)
      })

      // Gold motes
      motes.forEach(p => {
        p.y -= p.speed * 0.6
        p.x += Math.sin(t * 300 * p.drift + p.phase) * 0.12
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W }

        const pulse = 0.5 + Math.sin(t * 400 * p.speed + p.phase) * 0.3
        ctx.globalAlpha = p.opacity * pulse
        ctx.fillStyle = '#D4920F'
        ctx.shadowColor = '#E8A820'
        ctx.shadowBlur = p.size * 3
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0

      // Occasional glint
      glintTimer += 0.0001
      if (glintTimer > 0.15 + Math.random() * 0.05) {
        glintTimer = 0
        glintX = Math.random() * W
        glintY = Math.random() * H * 0.5
        glintLife = 1
      }
      if (glintLife > 0) {
        ctx.globalAlpha = glintLife * 0.8
        ctx.fillStyle = '#FDF0CC'
        ctx.shadowColor = '#F2C050'
        ctx.shadowBlur = 20
        ctx.beginPath()
        ctx.arc(glintX, glintY, 2, 0, Math.PI * 2)
        ctx.fill()
        glintLife -= 0.04
        ctx.globalAlpha = 1
        ctx.shadowBlur = 0
      }

      // Chrome top line
      const topLine = ctx.createLinearGradient(0, 0, W, 0)
      topLine.addColorStop(0, 'transparent')
      topLine.addColorStop(0.3, 'rgba(242,192,80,0.35)')
      topLine.addColorStop(0.5, 'rgba(242,192,80,0.50)')
      topLine.addColorStop(0.7, 'rgba(242,192,80,0.35)')
      topLine.addColorStop(1, 'transparent')
      ctx.strokeStyle = topLine
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, 1)
      ctx.lineTo(W, 1)
      ctx.stroke()
    }

    animId = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
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
