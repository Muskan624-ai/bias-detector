import React, { useEffect, useRef } from 'react'

/**
 * Neural network / geometric wireframe background.
 * `closing` prop → nodes converge to center during page transitions.
 */
export default function LobeCanvas({ closing }) {
  const canvasRef = useRef(null)
  const stateRef = useRef({ progress: 0, target: 0, t: 0, lastTime: 0, rafId: null })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const s = stateRef.current

    // ── Resize ──────────────────────────────────────────────────────────────
    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      buildScene()
    }

    // ── Scene data ───────────────────────────────────────────────────────────
    let nodes = [], edges = [], particles = [], hexagons = []

    function buildScene() {
      const W = canvas.width, H = canvas.height
      nodes = []
      edges = []
      particles = []
      hexagons = []

      // Balanced node count to prevent background overcrowding
      const nodeCount = Math.floor((W * H) / 18000)
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          bx: Math.random() * W,   // base x
          by: Math.random() * H,   // base y
          x: 0, y: 0,              // current (computed each frame)
          // Significantly smaller, pin-prick dot sizing for structural data styling
          r: 0.8 + Math.random() * 1.2,
          speed: 0.15 + Math.random() * 0.3,
          phase: Math.random() * Math.PI * 2,
          color: Math.random() > 0.55 ? '#B266FF' : '#58E6FF',
          pulsePhase: Math.random() * Math.PI * 2,
        })
      }

      // Slightly wider local clustering radius to ensure web connections form cleanly
      const maxDist = Math.min(W, H) * 0.14
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].bx - nodes[j].bx
          const dy = nodes[i].by - nodes[j].by
          if (Math.sqrt(dx*dx + dy*dy) < maxDist) {
            edges.push({ a: i, b: j })
          }
        }
      }

      // Edge traversal particles tuned down to blend smoothly into background web structure
      edges.forEach((e, i) => {
        if (Math.random() > 0.3) return
        particles.push({
          edgeIdx: i,
          t: Math.random(),
          speed: 0.002 + Math.random() * 0.004,
          dir: Math.random() > 0.5 ? 1 : -1,
          size: 0.8 + Math.random() * 1.0,
          color: Math.random() > 0.5 ? 'rgba(178,102,255,' : 'rgba(88,230,255,',
        })
      })

      // Hexagons returned to a subtle accent role so they aren't drowned out by noise
      const hexCount = 5 + Math.floor(W / 350)
      for (let i = 0; i < hexCount; i++) {
        hexagons.push({
          bx: 0.08 * W + Math.random() * 0.84 * W,
          by: 0.08 * H + Math.random() * 0.84 * H,
          size: 40 + Math.random() * 90,
          rot: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.004,
          phase: Math.random() * Math.PI * 2,
          opacity: 0.03 + Math.random() * 0.05,
          color: Math.random() > 0.5 ? '#B266FF' : '#58E6FF',
        })
      }
    }

    // ── Draw hexagon wireframe ───────────────────────────────────────────────
    function drawHex(ctx, x, y, size, rot, opacity, color) {
      ctx.save()
      ctx.globalAlpha = opacity
      ctx.strokeStyle = color
      ctx.lineWidth = 0.8
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const a = rot + (i / 6) * Math.PI * 2
        const px = x + Math.cos(a) * size
        const py = y + Math.sin(a) * size
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.stroke()
      // Inner smaller hex
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const a = rot + (i / 6) * Math.PI * 2
        const px = x + Math.cos(a) * size * 0.55
        const py = y + Math.sin(a) * size * 0.55
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.stroke()
      // Spokes
      for (let i = 0; i < 6; i++) {
        const a = rot + (i / 6) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + Math.cos(a) * size * 0.55, y + Math.sin(a) * size * 0.55)
        ctx.stroke()
      }
      ctx.restore()
    }

    // ── Main frame loop ─────────────────────────────────────────────────────
    function frame(ts) {
      s.rafId = requestAnimationFrame(frame)
      const dt = Math.min((ts - s.lastTime) / 1000, 0.05)
      s.lastTime = ts
      s.t += dt

      // Ease progress toward target
      s.progress += (s.target - s.progress) * Math.min(3.5 * dt, 1)

      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)

      const compress = s.progress
      const cx = W / 2, cy = H / 2

      // Update node positions — slow drift + converge on transition
      nodes.forEach(n => {
        const drift = Math.sin(s.t * n.speed + n.phase) * 18
        const driftY = Math.cos(s.t * n.speed * 0.8 + n.phase) * 14
        n.x = n.bx + drift + (cx - n.bx) * compress * 0.7
        n.y = n.by + driftY + (cy - n.by) * compress * 0.7
      })

      // ── Draw edges ────────────────────────────────────────────────────────
      edges.forEach(e => {
        const a = nodes[e.a], b = nodes[e.b]
        const dx = a.x - b.x, dy = a.y - b.y
        const dist = Math.sqrt(dx*dx + dy*dy)
        const maxD = Math.min(W, H) * 0.16 // Matches the localized constraints perfectly
        if (dist > maxD) return
        const alpha = (1 - dist / maxD) * (0.07 + 0.04 * (1 - compress))
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.strokeStyle = 'rgba(178,102,255,1)'
        ctx.lineWidth = 0.55
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
        ctx.restore()
      })

      // ── Draw floating particles along edges ───────────────────────────────
      particles.forEach(p => {
        p.t += p.speed * p.dir
        if (p.t > 1) p.t = 0
        if (p.t < 0) p.t = 1
        const e = edges[p.edgeIdx]
        if (!e) return
        const a = nodes[e.a], b = nodes[e.b]
        const px = a.x + (b.x - a.x) * p.t
        const py = a.y + (b.y - a.y) * p.t
        const alpha = 0.4 + 0.4 * Math.sin(s.t * 3 + p.t * 10)
        ctx.save()
        ctx.globalAlpha = alpha * (0.5 + 0.5 * (1 - compress))
        ctx.fillStyle = p.color + alpha.toFixed(2) + ')'
        ctx.shadowColor = p.color + '0.6)'
        ctx.shadowBlur = 3
        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // ── Draw nodes ────────────────────────────────────────────────────────
      nodes.forEach(n => {
        const pulse = 0.5 + 0.5 * Math.sin(s.t * 1.5 + n.pulsePhase)
        // Reduced baseline opacity to pull nodes back into deep background space
        const alpha = (0.15 + 0.25 * pulse) * (1 - compress * 0.3)
        const glowR = n.r * (1.5 + pulse * 1.5)

        // Dimmed glow halo
        const isP = n.color === '#B266FF'
        const gc0 = isP ? `rgba(178,102,255,${alpha * 0.2})` : `rgba(88,230,255,${alpha * 0.2})`
        const ggrad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR * 2.5)
        ggrad.addColorStop(0, gc0)
        ggrad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.save()
        ctx.globalAlpha = 1
        ctx.fillStyle = ggrad
        ctx.beginPath()
        ctx.arc(n.x, n.y, glowR * 2.5, 0, Math.PI * 2)
        ctx.fill()

        // Core dot
        ctx.globalAlpha = alpha
        ctx.fillStyle = n.color
        ctx.shadowColor = n.color
        // Reduced glow blur factor to maintain a sharp telemetry aesthetic
        ctx.shadowBlur = 4
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // ── Draw wireframe hexagons ────────────────────────────────────────────
      hexagons.forEach(h => {
        h.rot += h.rotSpeed
        const floatY = Math.sin(s.t * 0.4 + h.phase) * 12
        const hx = h.bx + (cx - h.bx) * compress * 0.8
        const hy = h.by + floatY + (cy - h.by) * compress * 0.8
        const opacity = h.opacity * (1 - compress * 0.5)
        drawHex(ctx, hx, hy, h.size, h.rot, opacity, h.color)
      })

      // ── Center convergence flash during transition ─────────────────────────
      if (compress > 0.05) {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W,H) * 0.3)
        g.addColorStop(0, `rgba(178,102,255,${compress * 0.35})`)
        g.addColorStop(0.5, `rgba(88,230,255,${compress * 0.12})`)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.save()
        ctx.globalAlpha = 1
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
        ctx.restore()
      }
    }

    window.addEventListener('resize', resize)
    resize()
    s.rafId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(s.rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    stateRef.current.target = closing ? 1 : 0
  }, [closing])

  return <canvas ref={canvasRef} id="bg-canvas" />
}
