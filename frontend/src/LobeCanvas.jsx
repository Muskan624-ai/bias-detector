import React, { useEffect, useRef } from 'react'

/**
 * LobeCanvas — flowing neon ribbon wave background.
 * `closing` prop drives the inward-merge transition (0 = open, 1 = closed).
 */
export default function LobeCanvas({ closing }) {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    lobeProgress: 0,  // 0 = ribbons spread apart, 1 = ribbons merged at center
    lobeTarget: 0,
    rafId: null,
    lastTime: 0,
    t: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const s = stateRef.current

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Ribbon definitions ──────────────────────────────────────────────────
    const RIBBONS = [
      // LEFT SIDE
      {
        side: 'left',
        yBase: 0.28,
        amp: 0.12,
        freq: 0.8,
        phase: 0,
        colorA: '#B266FF',
        colorB: '#7B2FFF',
        width: 2.8,
        glowColor: 'rgba(178,102,255,0.35)',
        glowBlur: 38,
        particleColor: 'rgba(200,160,255,0.9)',
      },
      {
        side: 'left',
        yBase: 0.38,
        amp: 0.09,
        freq: 0.65,
        phase: 1.2,
        colorA: '#9B44FF',
        colorB: '#58E6FF',
        width: 1.6,
        glowColor: 'rgba(150,80,255,0.25)',
        glowBlur: 28,
        particleColor: 'rgba(180,220,255,0.85)',
      },
      {
        side: 'left',
        yBase: 0.55,
        amp: 0.07,
        freq: 1.1,
        phase: 2.5,
        colorA: '#58E6FF',
        colorB: '#2299CC',
        width: 1.2,
        glowColor: 'rgba(88,230,255,0.22)',
        glowBlur: 22,
        particleColor: 'rgba(160,240,255,0.8)',
      },
      {
        side: 'left',
        yBase: 0.68,
        amp: 0.06,
        freq: 0.9,
        phase: 3.8,
        colorA: '#7B2FFF',
        colorB: '#B266FF',
        width: 1.0,
        glowColor: 'rgba(120,60,255,0.18)',
        glowBlur: 20,
        particleColor: 'rgba(190,140,255,0.75)',
      },
      // RIGHT SIDE
      {
        side: 'right',
        yBase: 0.22,
        amp: 0.10,
        freq: 0.75,
        phase: 0.6,
        colorA: '#58E6FF',
        colorB: '#B266FF',
        width: 2.4,
        glowColor: 'rgba(88,230,255,0.32)',
        glowBlur: 35,
        particleColor: 'rgba(160,240,255,0.9)',
      },
      {
        side: 'right',
        yBase: 0.42,
        amp: 0.08,
        freq: 0.85,
        phase: 1.9,
        colorA: '#3AB8FF',
        colorB: '#9B44FF',
        width: 1.5,
        glowColor: 'rgba(58,184,255,0.22)',
        glowBlur: 26,
        particleColor: 'rgba(140,200,255,0.8)',
      },
      {
        side: 'right',
        yBase: 0.60,
        amp: 0.11,
        freq: 0.6,
        phase: 3.1,
        colorA: '#B266FF',
        colorB: '#58E6FF',
        width: 1.8,
        glowColor: 'rgba(178,102,255,0.28)',
        glowBlur: 30,
        particleColor: 'rgba(210,170,255,0.85)',
      },
      {
        side: 'right',
        yBase: 0.75,
        amp: 0.06,
        freq: 1.0,
        phase: 4.4,
        colorA: '#2299CC',
        colorB: '#7B2FFF',
        width: 1.0,
        glowColor: 'rgba(34,153,204,0.18)',
        glowBlur: 18,
        particleColor: 'rgba(120,210,255,0.75)',
      },
    ]

    // Each ribbon gets its own set of particles
    const ribbonParticles = RIBBONS.map(() =>
      Array.from({ length: 12 }, () => ({
        t: Math.random(),
        speed: 0.012 + Math.random() * 0.018,
        size: 1.2 + Math.random() * 2.0,
        opacity: 0.4 + Math.random() * 0.6,
      }))
    )

    // ── Ribbon geometry ─────────────────────────────────────────────────────
    function getRibbonPoint(r, u, W, H, time, compress) {
      const isLeft = r.side === 'left'

      // Horizontal extents pull toward center as compress → 1
      const xStart = isLeft
        ? -0.05 * W + compress * 0.55 * W
        : 1.05 * W - compress * 0.55 * W
      const xEnd = isLeft
        ? (0.55 + compress * 0.05) * W
        : (0.45 - compress * 0.05) * W

      const x = xStart + (xEnd - xStart) * u

      // Sinusoidal vertical wave — flattens when closing
      const waveScale = 1 - compress * 0.7
      const y =
        r.yBase * H +
        Math.sin(u * Math.PI * r.freq * 2 + time * 0.6 + r.phase) *
          r.amp * H * waveScale +
        Math.sin(u * Math.PI * r.freq + time * 0.35 + r.phase * 1.3) *
          r.amp * 0.4 * H * waveScale

      return { x, y }
    }

    // ── Render one ribbon ───────────────────────────────────────────────────
    function drawRibbon(ctx, r, particles, W, H, time, compress) {
      const STEPS = 80
      const pts = []
      for (let i = 0; i <= STEPS; i++) {
        pts.push(getRibbonPoint(r, i / STEPS, W, H, time, compress))
      }

      const buildPath = () => {
        ctx.beginPath()
        ctx.moveTo(pts[0].x, pts[0].y)
        for (let i = 1; i < pts.length - 1; i++) {
          const mx = (pts[i].x + pts[i + 1].x) / 2
          const my = (pts[i].y + pts[i + 1].y) / 2
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my)
        }
        ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y)
      }

      // Glow pass
      ctx.save()
      ctx.lineWidth = r.width * 5
      ctx.strokeStyle = r.glowColor
      ctx.shadowColor = r.glowColor
      ctx.shadowBlur = r.glowBlur
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.globalAlpha = 0.55 + 0.2 * Math.sin(time * 0.8 + r.phase)
      buildPath()
      ctx.stroke()
      ctx.restore()

      // Sharp neon ribbon with color gradient
      ctx.save()
      ctx.lineWidth = r.width
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.shadowColor = r.glowColor
      ctx.shadowBlur = r.glowBlur * 0.6

      const grad = ctx.createLinearGradient(
        pts[0].x, pts[0].y,
        pts[pts.length - 1].x, pts[pts.length - 1].y
      )
      grad.addColorStop(0, r.colorA)
      grad.addColorStop(0.5, r.colorB)
      grad.addColorStop(1, r.colorA)
      ctx.strokeStyle = grad
      ctx.globalAlpha = 0.75 + 0.15 * Math.sin(time * 1.1 + r.phase)
      buildPath()
      ctx.stroke()
      ctx.restore()

      // Particles travelling along the ribbon
      particles.forEach((p) => {
        p.t += p.speed * (1 / 60)
        if (p.t > 1) p.t -= 1

        const pos = getRibbonPoint(r, p.t, W, H, time, compress)
        const edgeFade = Math.min(p.t * 8, (1 - p.t) * 8, 1)
        const alpha = p.opacity * edgeFade * (0.7 + 0.3 * Math.sin(time * 3 + p.t * 20))

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.shadowColor = r.particleColor
        ctx.shadowBlur = 8
        ctx.fillStyle = r.particleColor
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })
    }

    // ── Render loop ─────────────────────────────────────────────────────────
    function frame(ts) {
      s.rafId = requestAnimationFrame(frame)

      const dt = Math.min((ts - s.lastTime) / 1000, 0.05)
      s.lastTime = ts
      s.t += dt

      const diff = s.lobeTarget - s.lobeProgress
      s.lobeProgress += diff * Math.min(3.2 * dt, 1)

      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      // Subtle radial vignette
      const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, H * 0.85)
      vignette.addColorStop(0, 'rgba(8,10,24,0)')
      vignette.addColorStop(1, 'rgba(4,6,16,0.65)')
      ctx.fillStyle = vignette
      ctx.fillRect(0, 0, W, H)

      const compress = s.lobeProgress

      RIBBONS.forEach((r, i) => {
        drawRibbon(ctx, r, ribbonParticles[i], W, H, s.t, compress)
      })

      // Center convergence glow during transitions
      if (compress > 0.05) {
        const cAlpha = compress * 0.45
        const cg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.22)
        cg.addColorStop(0, `rgba(178,102,255,${cAlpha})`)
        cg.addColorStop(0.4, `rgba(88,230,255,${cAlpha * 0.5})`)
        cg.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.save()
        ctx.globalAlpha = 1
        ctx.fillStyle = cg
        ctx.beginPath()
        ctx.arc(W / 2, H / 2, W * 0.22, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    s.rafId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(s.rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    stateRef.current.lobeTarget = closing ? 1 : 0
  }, [closing])

  return (
    <canvas
      ref={canvasRef}
      id="lobe-canvas"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
