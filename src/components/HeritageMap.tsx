import { useRef, useState } from 'react'
import { MONUMENTS, FILTERS, type Monument } from '../data'

type FilterState = { climate: string | null; material: string | null; period: string | null }
const emptyFilters: FilterState = { climate: null, material: null, period: null }

function siteMatches(m: Monument, f: FilterState) {
  if (f.climate && m.climateKey !== f.climate) return false
  if (f.material && m.materialKey !== f.material) return false
  if (f.period && m.periodBand !== f.period) return false
  return true
}

const MIN_Z = 1
const MAX_Z = 5

export default function HeritageMap({ onSelect }: { onSelect: (id: string) => void }) {
  const [filters, setFilters] = useState<FilterState>(emptyFilters)
  const [hover, setHover] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [center, setCenter] = useState({ x: 50, y: 50 })
  const svgRef = useRef<SVGSVGElement>(null)
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null)

  const toggle = (group: keyof FilterState, key: string) =>
    setFilters((prev) => ({ ...prev, [group]: prev[group] === key ? null : key }))

  const clampCenter = (c: { x: number; y: number }, z: number) => {
    const half = 50 / z
    return {
      x: Math.max(half, Math.min(100 - half, c.x)),
      y: Math.max(half, Math.min(100 - half, c.y)),
    }
  }

  const setZoomClamped = (z: number, c = center) => {
    const nz = Math.max(MIN_Z, Math.min(MAX_Z, z))
    setZoom(nz)
    setCenter(clampCenter(c, nz))
  }

  const vw = 100 / zoom
  const vx = center.x - vw / 2
  const vy = center.y - vw / 2

  // Pan handlers
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, moved: false }
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const dx = ((e.clientX - drag.current.x) / rect.width) * vw
    const dy = ((e.clientY - drag.current.y) / rect.height) * vw
    if (Math.abs(e.clientX - drag.current.x) + Math.abs(e.clientY - drag.current.y) > 3) drag.current.moved = true
    drag.current.x = e.clientX
    drag.current.y = e.clientY
    setCenter((c) => clampCenter({ x: c.x - dx, y: c.y - dy }, zoom))
  }
  const onPointerUp = () => {
    drag.current = null
  }
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setZoomClamped(zoom * (e.deltaY < 0 ? 1.15 : 0.87))
  }

  const hovered = MONUMENTS.find((m) => m.id === hover)

  return (
    <div className="map-wrap">
      <aside className="layers">
        <p className="layers-title">Layers</p>
        {(Object.keys(FILTERS) as (keyof typeof FILTERS)[]).map((group) => (
          <div className="layer-group" key={group}>
            <span className="layer-label">{group}</span>
            <div className="chips">
              {FILTERS[group].map((opt) => (
                <button
                  key={opt.key}
                  className={`chip ${filters[group] === opt.key ? 'chip-on' : ''}`}
                  onClick={() => toggle(group, opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        {(filters.climate || filters.material || filters.period) && (
          <button className="chip clear" onClick={() => setFilters(emptyFilters)}>
            Reset layers
          </button>
        )}
      </aside>

      <div className="map-stage">
        <svg
          ref={svgRef}
          viewBox={`${vx} ${vy} ${vw} ${vw}`}
          className="map-svg"
          role="img"
          aria-label="Map of Rajasthan"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onWheel={onWheel}
        >
          <path
            className="map-land"
            d="M18 30 L34 18 L52 14 L66 22 L72 18 L80 30 L86 46 L78 58 L82 70 L70 82 L52 90 L40 84 L30 72 L16 64 L12 48 Z"
          />
          {[28, 44, 60, 76].map((y) => (
            <line key={y} x1="10" y1={y} x2="90" y2={y} className="map-grid" />
          ))}
          {MONUMENTS.map((m) => {
            const match = siteMatches(m, filters)
            const r = 3.6 / Math.sqrt(zoom)
            return (
              <g
                key={m.id}
                className={`node ${match ? '' : 'node-dim'}`}
                transform={`translate(${m.coords.x} ${m.coords.y})`}
                onClick={() => {
                  if (match && !drag.current?.moved) onSelect(m.id)
                }}
                onMouseEnter={() => setHover(m.id)}
                onMouseLeave={() => setHover(null)}
              >
                <circle className="node-halo" r={r} style={{ fill: m.hue }} />
                <circle className="node-dot" r={1.4 / Math.sqrt(zoom)} style={{ fill: m.hue }} />
                {hover === m.id && (
                  <text
                    className="node-label"
                    x={0}
                    y={-r - 1.5}
                    textAnchor="middle"
                    style={{ fontSize: 3.4 / Math.sqrt(zoom) }}
                  >
                    {m.name}
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        <div className="zoom-ctl">
          <button onClick={() => setZoomClamped(zoom * 1.4)} aria-label="Zoom in">
            +
          </button>
          <button onClick={() => setZoomClamped(zoom / 1.4)} aria-label="Zoom out">
            −
          </button>
          <button
            className="zoom-reset"
            onClick={() => {
              setZoom(1)
              setCenter({ x: 50, y: 50 })
            }}
            aria-label="Reset view"
          >
            ⟳
          </button>
        </div>

        <p className="map-hint">
          {hovered ? `${hovered.name} · ${hovered.place}` : 'Scroll or drag to explore · click a node →'}
        </p>
      </div>
    </div>
  )
}
