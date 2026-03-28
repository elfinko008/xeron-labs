'use client'
import { useEffect, useRef } from 'react'

export function NightHorizonBackground() {
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

    // Stars
    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 0.7,
      size: Math.random() * 1.2 + 0.2,
      opacity: Math.random() * 0.7 + 0.1,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.003 + 0.001,
    }))

    let shootingStarTimer = 0
    let ss = { active: false, x: 0, y: 0, dx: 0, dy: 0, life: 0 }

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

      // Deep navy gradient
      const bg = ctx.createLinearGradient(0, 0, 0, H)
      bg.addColorStop(0, '#00000A')
      bg.addColorStop(0.6, '#010110')
      bg.addColorStop(1, '#00000A')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // Stars with twinkle
      stars.forEach(star => {
        star.twinkle += star.twinkleSpeed
        const opacity = star.opacity * (0.6 + Math.sin(star.twinkle) * 0.4)
        ctx.globalAlpha = opacity
        ctx.fillStyle = '#FEFCF8'
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1

      // Horizon glow
      const horizonY = H * 0.72
      const horizon = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY + 80)
      horizon.addColorStop(0, 'transparent')
      horizon.addColorStop(0.4, 'rgba(200,134,10,0.06)')
      horizon.addColorStop(0.6, 'rgba(200,134,10,0.10)')
      horizon.addColorStop(0.8, 'rgba(200,134,10,0.06)')
      horizon.addColorStop(1, 'transparent')
      ctx.fillStyle = horizon
      ctx.fillRect(0, horizonY - 40, W, 120)

      // Thin gold horizon line
      const horizonLine = ctx.createLinearGradient(0, 0, W, 0)
      horizonLine.addColorStop(0, 'transparent')
      horizonLine.addColorStop(0.2, 'rgba(200,134,10,0.15)')
      horizonLine.addColorStop(0.5, 'rgba(232,168,32,0.30)')
      horizonLine.addColorStop(0.8, 'rgba(200,134,10,0.15)')
      horizonLine.addColorStop(1, 'transparent')
      ctx.strokeStyle = horizonLine
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, horizonY)
      ctx.lineTo(W, horizonY)
      ctx.stroke()

      // Shooting star
      shootingStarTimer += 0.0001
      if (shootingStarTimer > 0.20 + Math.random() * 0.02 && !ss.active) {
        shootingStarTimer = 0
        ss = {
          active: true,
          x: Math.random() * W * 0.6 + W * 0.1,
          y: Math.random() * H * 0.3,
          dx: (Math.random() + 0.5) * 8,
          dy: (Math.random() * 0.4 + 0.2) * 4,
          life: 1,
        }
      }
      if (ss.active) {
        ctx.globalAlpha = ss.life
        const ssGrad = ctx.createLinearGradient(ss.x - ss.dx * 8, ss.y - ss.dy * 8, ss.x, ss.y)
        ssGrad.addColorStop(0, 'transparent')
        ssGrad.addColorStop(1, '#E8A820')
        ctx.strokeStyle = ssGrad
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(ss.x - ss.dx * 8, ss.y - ss.dy * 8)
        ctx.lineTo(ss.x, ss.y)
        ctx.stroke()
        ctx.globalAlpha = 1

        ss.x += ss.dx
        ss.y += ss.dy
        ss.life -= 0.025
        if (ss.life <= 0) ss.active = false
      }
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
