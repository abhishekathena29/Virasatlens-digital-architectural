import { useEffect, useRef } from 'react'

const GAPS = [0.16, 0.32, 0.48, 0.64, 0.8]

interface Particle {
  x: number
  y: number
  speed: number
}

/**
 * A small ambient canvas that runs the same jaali/Venturi idea as the live
 * Simulation component, but stripped of controls — just a looping backdrop
 * for the homepage hero so "watch air move through a jaali" is true immediately.
 */
export default function HeroFlow() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      canvas.width = r.width * dpr
      canvas.height = r.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random(),
      y: GAPS[(Math.random() * GAPS.length) | 0] + (Math.random() - 0.5) * 0.05,
      speed: 0.35 + Math.random() * 0.45,
    }))

    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)

      const wx = 0.44
      const ww = 0.1
      ctx.fillStyle = 'rgba(199, 91, 57, 0.24)'
      let prev = 0.06
      GAPS.forEach((g) => {
        ctx.fillRect(wx * w, prev * h, ww * w, (g - 0.028 - prev) * h)
        prev = g + 0.028
      })
      ctx.fillRect(wx * w, prev * h, ww * w, (0.94 - prev) * h)

      particles.forEach((p) => {
        const inWall = p.x > wx && p.x < wx + ww
        const sp = inWall ? p.speed * 2.4 : p.speed
        p.x += sp * dt * 0.5
        if (p.x > 1.06) {
          p.x = -0.06
          p.y = GAPS[(Math.random() * GAPS.length) | 0] + (Math.random() - 0.5) * 0.05
        }
        const fast = inWall || (p.x > wx + ww && p.x < wx + ww + 0.16)
        ctx.strokeStyle = fast ? '#2f86a8' : 'rgba(45, 58, 94, 0.32)'
        ctx.lineWidth = fast ? 2 : 1.2
        const len = (fast ? 0.05 : 0.026) * w
        ctx.beginPath()
        ctx.moveTo(p.x * w - len, p.y * h)
        ctx.lineTo(p.x * w, p.y * h)
        ctx.stroke()
      })

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="hero-flow-canvas" aria-hidden />
}
