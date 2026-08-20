import { useEffect, useRef, useState } from 'react'
import type { SimType } from '../data'

/* ------------------------------------------------------------------ */
/*  Live, interactive canvas simulations of Rajasthan's climate logic */
/* ------------------------------------------------------------------ */

const META: Record<
  SimType,
  { sliderLabel: string; caption: string; timeBased: boolean }
> = {
  venturi: {
    sliderLabel: 'Wind speed',
    caption: 'Air squeezes through the jaali’s tiny holes and speeds up — a built-in breeze.',
    timeBased: false,
  },
  chimney: {
    sliderLabel: 'Sun heat',
    caption: 'The hot courtyard pulls air upward, drawing a cool draught through the rooms.',
    timeBased: false,
  },
  coolsink: {
    sliderLabel: 'Season  (dry → monsoon)',
    caption: 'The monsoon fills the well while cool, heavy air settles at the bottom.',
    timeBased: false,
  },
  evaporative: {
    sliderLabel: 'Air flow',
    caption: 'Air crossing the water channel loses heat to evaporation — it arrives cool.',
    timeBased: false,
  },
  rainwater: {
    sliderLabel: 'Rainfall',
    caption: 'Roofs and courtyards funnel every drop down into the underground tanka.',
    timeBased: false,
  },
  thermalmass: {
    sliderLabel: 'Time of day',
    caption: 'Thick walls delay the heat — the peak reaches inside hours after noon.',
    timeBased: true,
  },
  sundial: {
    sliderLabel: 'Time of day',
    caption: 'The gnomon’s shadow sweeps the carved scale — architecture that tells time.',
    timeBased: true,
  },
  symmetry: {
    sliderLabel: 'Reveal',
    caption: 'One mirror axis generates the whole façade — repetition you can feel.',
    timeBased: true,
  },
}

const COOL = '#2f86a8'
const WARM = '#d9622f'
const HOT = '#c43d2a'
const WATER = '#3a7bb0'
const STONE = '#cdab7d'
const INK = '#5b4b38'

const rnd = Math.random

/* ---- tiny helpers ---- */
function mix(a: string, b: string, t: number) {
  const ca = hex(a)
  const cb = hex(b)
  const r = Math.round(ca[0] + (cb[0] - ca[0]) * t)
  const g = Math.round(ca[1] + (cb[1] - ca[1]) * t)
  const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t)
  return `rgb(${r},${g},${bl})`
}
function hex(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
function arrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, c: string) {
  const a = Math.atan2(y2 - y1, x2 - x1)
  ctx.strokeStyle = c
  ctx.fillStyle = c
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - 7 * Math.cos(a - 0.4), y2 - 7 * Math.sin(a - 0.4))
  ctx.lineTo(x2 - 7 * Math.cos(a + 0.4), y2 - 7 * Math.sin(a + 0.4))
  ctx.closePath()
  ctx.fill()
}
function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, align: CanvasTextAlign = 'left') {
  ctx.font = '600 11px Inter, sans-serif'
  ctx.textAlign = align
  ctx.fillStyle = INK
  ctx.fillText(text, x, y)
}

interface Particle {
  x: number
  y: number
  base?: number
  heat?: number
  cool?: boolean
  ph?: number
  sp?: number
}
type State = { p: Particle[]; tank: number; drops: Particle[] }

function initState(type: SimType): State {
  const s: State = { p: [], tank: 0, drops: [] }
  const GAPS = [0.16, 0.29, 0.42, 0.55, 0.68, 0.81]
  switch (type) {
    case 'venturi':
      for (let i = 0; i < 110; i++) {
        const g = GAPS[(Math.random() * GAPS.length) | 0]
        s.p.push({ x: rnd(), y: g + (rnd() - 0.5) * 0.05, base: 0.5 + rnd() * 0.5 })
      }
      break
    case 'chimney':
      for (let i = 0; i < 80; i++) {
        const left = rnd() < 0.5
        s.p.push({ x: left ? 0.15 + rnd() * 0.22 : 0.63 + rnd() * 0.22, y: 0.55 + rnd() * 0.3, heat: rnd() })
      }
      break
    case 'coolsink':
      for (let i = 0; i < 70; i++)
        s.p.push({ x: 0.28 + rnd() * 0.44, y: 0.3 + rnd() * 0.55, cool: rnd() < 0.7, ph: rnd() * 6 })
      break
    case 'evaporative':
      for (let i = 0; i < 55; i++) s.p.push({ x: rnd(), y: 0.4 + rnd() * 0.14, sp: 0.5 + rnd() * 0.5 })
      break
    case 'rainwater':
      for (let i = 0; i < 140; i++) s.p.push({ x: rnd(), y: rnd(), sp: 0.6 + rnd() * 0.8 })
      break
  }
  return s
}

/* ================================================================== */

export default function Simulation({ type, color }: { type: SimType; color: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [playing, setPlaying] = useState(true)
  const [level, setLevel] = useState(META[type].timeBased ? 0.3 : 0.6)

  const playingRef = useRef(playing)
  const levelRef = useRef(level)
  const stateRef = useRef<State>(initState(type))

  useEffect(() => {
    playingRef.current = playing
  }, [playing])
  useEffect(() => {
    levelRef.current = level
  }, [level])

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    stateRef.current = initState(type)
    let raf = 0
    let last = performance.now()
    let acc = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      canvas.width = r.width * dpr
      canvas.height = r.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const meta = META[type]
      if (playingRef.current && meta.timeBased) {
        acc += dt
        if (acc > 0.04) {
          acc = 0
          const nl = (levelRef.current + dt * 1.5) % 1
          levelRef.current = nl
          setLevel(nl)
        }
      }
      draw(ctx, w, h, type, color, levelRef.current, now / 1000, stateRef.current, playingRef.current, dt)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [type, color])

  const meta = META[type]
  return (
    <div className="sim">
      <canvas ref={ref} className="sim-canvas" />
      <div className="sim-controls">
        <button className="sim-play" onClick={() => setPlaying((p) => !p)}>
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
        <label className="sim-slider-wrap">
          <span>{meta.sliderLabel}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
          />
        </label>
        <button
          className="sim-reset"
          onClick={() => {
            stateRef.current = initState(type)
            setLevel(meta.timeBased ? 0.3 : 0.6)
          }}
        >
          ↺
        </button>
      </div>
      <p className="sim-caption">{meta.caption}</p>
    </div>
  )
}

/* ================================================================== */
/*  The render loop                                                   */
/* ================================================================== */

function draw(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  type: SimType,
  color: string,
  level: number,
  t: number,
  st: State,
  playing: boolean,
  dt: number,
) {
  const step = playing ? dt : 0
  // soft sky background
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, '#fbf3e4')
  g.addColorStop(1, '#f0e2c8')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  switch (type) {
    case 'venturi':
      return venturi(ctx, w, h, color, level, st, step)
    case 'chimney':
      return chimney(ctx, w, h, level, st, step)
    case 'coolsink':
      return coolsink(ctx, w, h, level, t, st, step)
    case 'evaporative':
      return evaporative(ctx, w, h, level, t, st, step)
    case 'rainwater':
      return rainwater(ctx, w, h, level, st, step)
    case 'thermalmass':
      return thermalmass(ctx, w, h, level)
    case 'sundial':
      return sundial(ctx, w, h, level)
    case 'symmetry':
      return symmetry(ctx, w, h, color, level)
  }
}

/* ---------- 1. Venturi: air through a jaali screen ---------- */
function venturi(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, level: number, st: State, dt: number) {
  const wx = 0.46 * w
  const wW = 0.08 * w
  // draw lattice wall (slats with gaps)
  ctx.fillStyle = STONE
  const gaps = [0.16, 0.29, 0.42, 0.55, 0.68, 0.81]
  let prev = 0.05
  gaps.forEach((gp) => {
    ctx.fillRect(wx, prev * h, wW, (gp - 0.025 - prev) * h)
    prev = gp + 0.025
  })
  ctx.fillRect(wx, prev * h, wW, (0.95 - prev) * h)

  st.p.forEach((p) => {
    let sp = 0.1 + level * 0.55
    const inWall = p.x > 0.44 && p.x < 0.56
    if (inWall) sp *= 1.6 + level * 2.2
    const base = p.base ?? 1
    p.x += sp * dt * base
    if (p.x > 1.06) {
      p.x = -0.05
      p.y = gaps[(Math.random() * gaps.length) | 0] + (Math.random() - 0.5) * 0.05
    }
    const fast = inWall || (p.x > 0.56 && p.x < 0.72)
    const c = mix(COOL, color, fast ? 0.85 : 0.2)
    const len = (fast ? 0.06 : 0.03) * w * base
    ctx.strokeStyle = c
    ctx.lineWidth = fast ? 2 : 1.4
    ctx.beginPath()
    ctx.moveTo(p.x * w - len, p.y * h)
    ctx.lineTo(p.x * w, p.y * h)
    ctx.stroke()
  })
  label(ctx, 'cooler air drawn in', 0.02 * w, 0.07 * h)
  arrow(ctx, 0.05 * w, 0.9 * h, 0.18 * w, 0.9 * h, COOL)
  label(ctx, 'jaali screen', wx + wW / 2, 0.99 * h, 'center')
  label(ctx, 'fast cool jet →', 0.6 * w, 0.07 * h)
}

/* ---------- 2. Chimney: courtyard convection ---------- */
function chimney(ctx: CanvasRenderingContext2D, w: number, h: number, level: number, st: State, dt: number) {
  // building cross-section
  ctx.fillStyle = '#e9d4ad'
  ctx.fillRect(0.12 * w, 0.32 * h, 0.31 * w, 0.58 * h) // left room
  ctx.fillRect(0.57 * w, 0.32 * h, 0.31 * w, 0.58 * h) // right room
  ctx.fillStyle = STONE
  ctx.fillRect(0.12 * w, 0.28 * h, 0.31 * w, 0.05 * h) // roofs
  ctx.fillRect(0.57 * w, 0.28 * h, 0.31 * w, 0.05 * h)
  // sun
  const sr = 0.03 * h + level * 0.03 * h
  ctx.fillStyle = mix('#f4c542', HOT, level)
  ctx.beginPath()
  ctx.arc(0.5 * w, 0.12 * h, sr, 0, 7)
  ctx.fill()

  st.p.forEach((p) => {
    const inCourt = p.x > 0.43 && p.x < 0.57
    if (inCourt) {
      p.y -= (0.12 + level * 0.55) * dt
      p.x += (0.5 - p.x) * dt * 1.2
      p.heat = Math.min(1, (p.heat ?? 0) + dt * (0.4 + level))
    } else if (p.x < 0.43) {
      if (p.y < 0.8) p.y += 0.25 * dt
      p.x += (0.1 + level * 0.25) * dt
    } else {
      if (p.y < 0.8) p.y += 0.25 * dt
      p.x -= (0.1 + level * 0.25) * dt
    }
    if (p.y < 0.1) {
      const left = Math.random() < 0.5
      p.x = left ? 0.16 + Math.random() * 0.2 : 0.64 + Math.random() * 0.2
      p.y = 0.82
      p.heat = 0
    }
    ctx.fillStyle = mix(COOL, WARM, p.heat ?? 0)
    ctx.beginPath()
    ctx.arc(p.x * w, p.y * h, 2.6, 0, 7)
    ctx.fill()
  })
  arrow(ctx, 0.2 * w, 0.86 * h, 0.42 * w, 0.7 * h, COOL)
  arrow(ctx, 0.8 * w, 0.86 * h, 0.58 * w, 0.7 * h, COOL)
  arrow(ctx, 0.5 * w, 0.28 * h, 0.5 * w, 0.06 * h, HOT)
  label(ctx, 'hot air out', 0.5 * w, 0.05 * h, 'center')
  label(ctx, 'cool draught', 0.14 * w, 0.95 * h)
  label(ctx, 'courtyard', 0.5 * w, 0.95 * h, 'center')
}

/* ---------- 3. Cool sink: the stepwell ---------- */
function coolsink(ctx: CanvasRenderingContext2D, w: number, h: number, level: number, t: number, st: State, dt: number) {
  // inverted stepped pyramid
  ctx.fillStyle = STONE
  const steps = 6
  for (let i = 0; i < steps; i++) {
    const inset = 0.07 + i * 0.05
    ctx.fillRect(inset * w, (0.18 + i * 0.1) * h, (1 - inset * 2) * w, 0.05 * h)
  }
  // water at the base
  const top = 0.86 - level * 0.4
  const wg = ctx.createLinearGradient(0, top * h, 0, h)
  wg.addColorStop(0, WATER)
  wg.addColorStop(1, '#1f4e74')
  ctx.fillStyle = wg
  ctx.fillRect(0.3 * w, top * h, 0.4 * w, (0.95 - top) * h)
  // shimmer
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let x = 0.3; x < 0.7; x += 0.02) {
    const yy = top + 0.008 * Math.sin(x * 60 + t * 3)
    if (x === 0.3) ctx.moveTo(x * w, yy * h)
    else ctx.lineTo(x * w, yy * h)
  }
  ctx.stroke()

  st.p.forEach((p) => {
    const ph = p.ph ?? 0
    if (p.cool) {
      p.y += (0.04 + 0.02 * Math.sin(t + ph)) * dt
      p.x += 0.01 * Math.sin(t * 0.7 + ph) * dt
      if (p.y > top - 0.01) {
        p.y = 0.3
        p.x = 0.3 + Math.random() * 0.4
      }
      ctx.fillStyle = 'rgba(47,134,168,0.7)'
      ctx.beginPath()
      ctx.arc(p.x * w, p.y * h, 2, 0, 7)
      ctx.fill()
    } else {
      p.y -= 0.02 * dt
      if (p.y < 0.18) p.y = 0.35
      ctx.fillStyle = 'rgba(212,98,47,0.35)'
      ctx.beginPath()
      ctx.arc(p.x * w, p.y * h, 1.8, 0, 7)
      ctx.fill()
    }
  })
  // temperature scale
  const sg = ctx.createLinearGradient(0, 0.18 * h, 0, 0.86 * h)
  sg.addColorStop(0, WARM)
  sg.addColorStop(1, COOL)
  ctx.fillStyle = sg
  ctx.fillRect(0.9 * w, 0.18 * h, 0.04 * w, 0.68 * h)
  label(ctx, 'surface +0°', 0.88 * w, 0.16 * h, 'right')
  label(ctx, 'base −6°C', 0.88 * w, 0.9 * h, 'right')
  label(ctx, 'stored monsoon water', 0.5 * w, 0.99 * h, 'center')
}

/* ---------- 4. Evaporative cooling channel ---------- */
function evaporative(ctx: CanvasRenderingContext2D, w: number, h: number, level: number, t: number, st: State, dt: number) {
  // water channel band
  ctx.fillStyle = '#e6d3ab'
  ctx.fillRect(0, 0.6 * h, w, 0.22 * h)
  ctx.fillStyle = WATER
  ctx.fillRect(0, 0.63 * h, w, 0.13 * h)
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'
  ctx.lineWidth = 1
  for (let k = 0; k < 3; k++) {
    ctx.beginPath()
    for (let x = 0; x <= 1; x += 0.02) {
      const yy = 0.66 + 0.012 * Math.sin(x * 40 - t * 4 + k) + k * 0.03
      if (x === 0) ctx.moveTo(x * w, yy * h)
      else ctx.lineTo(x * w, yy * h)
    }
    ctx.stroke()
  }
  // air crossing
  st.p.forEach((p) => {
    p.x += (0.12 + level * 0.5) * dt * (p.sp ?? 1)
    if (p.x > 1.05) {
      p.x = -0.05
      p.y = 0.4 + Math.random() * 0.14
    }
    const cooled = Math.min(1, Math.max(0, (p.x - 0.2) / 0.6))
    ctx.strokeStyle = mix(WARM, COOL, cooled)
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(p.x * w - 0.05 * w, p.y * h)
    ctx.lineTo(p.x * w, p.y * h)
    ctx.stroke()
  })
  // rising evaporation
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  for (let i = 0; i < 14; i++) {
    const x = (i / 14 + (t * 0.05) % 1) % 1
    const yy = 0.63 - ((t * 0.3 + i) % 1) * 0.18
    ctx.beginPath()
    ctx.arc(x * w, yy * h, 1.5, 0, 7)
    ctx.fill()
  }
  label(ctx, 'warm air 34°', 0.02 * w, 0.36 * h)
  label(ctx, 'cool air 24° →', 0.98 * w, 0.36 * h, 'right')
  label(ctx, 'water channel (Sukh Niwas)', 0.5 * w, 0.99 * h, 'center')
}

/* ---------- 5. Rainwater harvesting ---------- */
function rainwater(ctx: CanvasRenderingContext2D, w: number, h: number, level: number, st: State, dt: number) {
  // sloped roof
  ctx.fillStyle = STONE
  ctx.beginPath()
  ctx.moveTo(0.2 * w, 0.55 * h)
  ctx.lineTo(0.5 * w, 0.4 * h)
  ctx.lineTo(0.8 * w, 0.55 * h)
  ctx.lineTo(0.8 * w, 0.6 * h)
  ctx.lineTo(0.2 * w, 0.6 * h)
  ctx.closePath()
  ctx.fill()
  // downspout + underground tank
  ctx.fillStyle = '#d8c19a'
  ctx.fillRect(0.47 * w, 0.6 * h, 0.06 * w, 0.18 * h)
  ctx.strokeStyle = INK
  ctx.lineWidth = 2
  ctx.strokeRect(0.34 * w, 0.78 * h, 0.32 * w, 0.18 * h)
  // tank fill
  st.tank = Math.min(1, st.tank + level * dt * 0.12)
  ctx.fillStyle = WATER
  const th = st.tank * 0.16
  ctx.fillRect(0.345 * w, (0.955 - th) * h, 0.31 * w, th * h)

  st.p.forEach((p) => {
    p.y += (0.4 + level * 0.9) * dt * (p.sp ?? 1)
    if (Math.random() > level + 0.05 && p.y < 0.05) return
    if (p.y > 0.55 && p.x > 0.2 && p.x < 0.8) {
      // hit roof → respawn
      p.y = -0.02
      p.x = Math.random()
    } else if (p.y > 1) {
      p.y = -0.02
      p.x = Math.random()
    }
    if (p.y > 0) {
      ctx.strokeStyle = 'rgba(58,123,176,0.7)'
      ctx.lineWidth = 1.4
      ctx.beginPath()
      ctx.moveTo(p.x * w, p.y * h)
      ctx.lineTo(p.x * w, p.y * h + 6)
      ctx.stroke()
    }
  })
  arrow(ctx, 0.5 * w, 0.52 * h, 0.5 * w, 0.62 * h, WATER)
  label(ctx, 'monsoon rain', 0.5 * w, 0.06 * h, 'center')
  label(ctx, `tanka  ${Math.round(st.tank * 100)}% full`, 0.5 * w, 0.9 * h, 'center')
}

/* ---------- 6. Thermal mass: time-delay through a thick wall ---------- */
function thermalmass(ctx: CanvasRenderingContext2D, w: number, h: number, level: number) {
  const out = 0.5 + 0.5 * Math.sin((level - 0.25) * Math.PI * 2) // outside temp 0..1
  const LAG = 0.22
  const inside = 0.5 + 0.32 * Math.sin((level - 0.25 - LAG) * Math.PI * 2)
  // sky tint by time
  const day = Math.max(0, Math.sin(level * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5)
  ctx.fillStyle = mix('#1d2740', '#bfe0f2', day)
  ctx.fillRect(0, 0, 0.4 * w, 0.5 * h)
  // sun / moon
  const cx = 0.05 * w + level * 0.3 * w
  const cy = 0.42 * h - Math.sin(level * Math.PI * 2 - Math.PI / 2) * 0.3 * h
  ctx.fillStyle = day > 0.3 ? '#f4c542' : '#e8eef5'
  ctx.beginPath()
  ctx.arc(cx, cy, 0.035 * h, 0, 7)
  ctx.fill()
  // ground
  ctx.fillStyle = '#e3cfa6'
  ctx.fillRect(0, 0.5 * h, w, 0.5 * h)
  // thick wall with heat gradient
  const wx = 0.4 * w
  const ww = 0.22 * w
  for (let i = 0; i < 10; i++) {
    const f = i / 9
    const tmp = out * (1 - f) + inside * f
    ctx.fillStyle = mix(STONE, HOT, tmp * 0.6)
    ctx.fillRect(wx + f * ww, 0.2 * h, ww / 10 + 1, 0.7 * h)
  }
  // inside room
  ctx.fillStyle = '#efe2c6'
  ctx.fillRect(0.62 * w, 0.2 * h, 0.34 * w, 0.7 * h)
  // thermometers
  const therm = (x: number, v: number, lab: string) => {
    ctx.strokeStyle = INK
    ctx.lineWidth = 1.5
    ctx.strokeRect(x, 0.3 * h, 0.04 * w, 0.4 * h)
    ctx.fillStyle = mix(COOL, HOT, v)
    ctx.fillRect(x, (0.7 - v * 0.4) * h, 0.04 * w, v * 0.4 * h)
    label(ctx, lab, x + 0.02 * w, 0.74 * h, 'center')
  }
  therm(0.16 * w, out, 'outside')
  therm(0.78 * w, inside, 'inside')
  label(ctx, 'thick thermal-mass wall', 0.51 * w, 0.97 * h, 'center')
  const hr = Math.round(level * 24)
  label(ctx, `${String(hr).padStart(2, '0')}:00`, 0.51 * w, 0.16 * h, 'center')
}

/* ---------- 7. Sundial: gnomon shadow tells time ---------- */
function sundial(ctx: CanvasRenderingContext2D, w: number, h: number, level: number) {
  // sky
  const day = Math.sin(level * Math.PI)
  ctx.fillStyle = mix('#1d2740', '#cfe6f5', Math.max(0.05, day))
  ctx.fillRect(0, 0, w, 0.55 * h)
  ctx.fillStyle = '#e3cfa6'
  ctx.fillRect(0, 0.55 * h, w, 0.45 * h)
  // sun arc (sunrise left -> sunset right)
  const sx = 0.1 * w + level * 0.8 * w
  const sy = 0.5 * h - Math.sin(level * Math.PI) * 0.42 * h
  ctx.fillStyle = '#f4c542'
  ctx.beginPath()
  ctx.arc(sx, sy, 0.04 * h, 0, 7)
  ctx.fill()
  // gnomon (triangle) at center
  const gx = 0.5 * w
  const baseY = 0.78 * h
  const apexY = 0.32 * h
  ctx.fillStyle = STONE
  ctx.beginPath()
  ctx.moveTo(gx, baseY)
  ctx.lineTo(gx, apexY)
  ctx.lineTo(gx + 0.16 * w, baseY)
  ctx.closePath()
  ctx.fill()
  // shadow cast onto ground, opposite the sun
  const dir = sx < gx ? 1 : -1
  const shLen = (0.12 + (1 - day) * 0.3) * w * dir
  ctx.strokeStyle = 'rgba(60,48,40,0.5)'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.moveTo(gx, baseY)
  ctx.lineTo(gx + shLen, baseY)
  ctx.stroke()
  // scale ticks
  ctx.strokeStyle = INK
  ctx.lineWidth = 1
  for (let i = -5; i <= 5; i++) {
    const x = gx + i * 0.07 * w
    ctx.beginPath()
    ctx.moveTo(x, baseY + 4)
    ctx.lineTo(x, baseY + 12)
    ctx.stroke()
  }
  const hr = 6 + Math.round(level * 12)
  label(ctx, `Samrat Yantra · ≈ ${String(hr).padStart(2, '0')}:00`, 0.5 * w, 0.97 * h, 'center')
  label(ctx, 'shadow marks the hour', gx + shLen, baseY - 8, dir > 0 ? 'left' : 'right')
}

/* ---------- 8. Symmetry: a façade generated from one axis ---------- */
function symmetry(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, level: number) {
  const reveal = level < 0.5 ? level * 2 : (1 - level) * 2 // ping-pong 0..1
  const axis = 0.5 * w
  // base platform
  ctx.fillStyle = '#e9d4ad'
  ctx.fillRect(0.1 * w, 0.78 * h, 0.8 * w, 0.12 * h)
  // axis line
  ctx.strokeStyle = mix(color, '#000', 0.1)
  ctx.setLineDash([4, 4])
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(axis, 0.1 * h)
  ctx.lineTo(axis, 0.9 * h)
  ctx.stroke()
  ctx.setLineDash([])
  // mirrored modules grow outward from the axis
  const modules = 5
  const mw = 0.08 * w
  const gap = 0.085 * w
  const shown = reveal * modules
  for (let i = 0; i < modules; i++) {
    const vis = Math.max(0, Math.min(1, shown - i))
    if (vis <= 0) continue
    const cy = 0.4 * h
    const heights = [0.36, 0.32, 0.28, 0.24, 0.2]
    const bh = heights[i] * h * vis
    ;[-1, 1].forEach((sgn) => {
      const x = axis + sgn * (gap * (i + 0.6)) - (sgn < 0 ? mw : 0)
      ctx.fillStyle = mix(color, '#fff', 0.15)
      ctx.fillRect(x, cy + (0.36 * h - bh), mw, bh + 0.36 * h - (0.36 * h - bh))
      // arched window
      ctx.fillStyle = '#fbf3e4'
      ctx.beginPath()
      ctx.arc(x + mw / 2, cy + 0.5 * h * 0.25, mw * 0.3, Math.PI, 0)
      ctx.fillRect(x + mw * 0.2, cy + 0.5 * h * 0.25, mw * 0.6, 0.12 * h * vis)
      ctx.fill()
    })
  }
  // crowning dome on axis
  if (reveal > 0.05) {
    ctx.fillStyle = mix(color, '#fff', 0.1)
    ctx.beginPath()
    ctx.arc(axis, 0.34 * h, 0.05 * w, Math.PI, 0)
    ctx.fill()
  }
  label(ctx, 'mirror axis', axis, 0.08 * h, 'center')
  label(ctx, `${Math.round(reveal * modules)} mirrored modules`, 0.5 * w, 0.97 * h, 'center')
}
