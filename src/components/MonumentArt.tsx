import { useState } from 'react'
import { ARCHETYPE, ARCHETYPE_INTRO, featuresFor, type Archetype, type Monument } from '../data'
import MonumentGallery from './MonumentGallery'

/** Numbered callout positions per archetype, in the 0..100 × 0..60 viewBox. */
const PINS: Record<Archetype, { x: number; y: number }[]> = {
  observatory: [{ x: 33, y: 40 }, { x: 60, y: 26 }, { x: 82, y: 44 }],
  'palace-hill': [{ x: 30, y: 40 }, { x: 54, y: 24 }, { x: 74, y: 48 }],
  fort: [{ x: 24, y: 34 }, { x: 50, y: 18 }, { x: 74, y: 44 }],
  screen: [{ x: 50, y: 40 }, { x: 28, y: 30 }, { x: 50, y: 16 }],
  palace: [{ x: 50, y: 22 }, { x: 26, y: 40 }, { x: 74, y: 40 }],
  haveli: [{ x: 30, y: 36 }, { x: 52, y: 24 }, { x: 72, y: 46 }],
  stepwell: [{ x: 50, y: 44 }, { x: 30, y: 28 }, { x: 68, y: 20 }],
  mosque: [{ x: 28, y: 34 }, { x: 55, y: 22 }, { x: 76, y: 40 }],
}

export default function MonumentArt({ monument }: { monument: Monument }) {
  const arch = ARCHETYPE[monument.id] ?? 'palace'
  const features = featuresFor(monument)
  const pins = PINS[arch]
  const [active, setActive] = useState(0)

  return (
    <div className="art-wrap">
      <MonumentGallery id={monument.id} />

      <h3 className="art-subhead">Anatomy of the design</h3>
      <p className="art-intro">{ARCHETYPE_INTRO[arch]}</p>
      <p className="art-note">Tap a number — on the diagram or in the list — to explore what it does.</p>
      <div className="art-grid">
        <figure className="art-figure">
          <svg viewBox="0 0 100 60" role="img" aria-label={`${monument.name} architecture diagram`}>
            <defs>
              <linearGradient id="artSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f6ead8" />
                <stop offset="100%" stopColor="#ecdcc0" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="100" height="60" fill="url(#artSky)" />
            <Scene arch={arch} hue={monument.hue} />
            {pins.map((p, i) => {
              const isActive = active === i
              return (
                <g
                  key={i}
                  transform={`translate(${p.x} ${p.y})`}
                  className="art-pin"
                  onClick={() => setActive(i)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Show ${features[i]?.term ?? `feature ${i + 1}`}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setActive(i)
                  }}
                >
                  {isActive && <circle className="art-pin-ring" r="4" style={{ stroke: monument.hue }} />}
                  <circle r={isActive ? 3.8 : 3.2} fill={isActive ? monument.hue : '#2a2018'} />
                  <text x="0" y="1.2" textAnchor="middle" fontSize="4" fontWeight="700" fill="#fff">
                    {i + 1}
                  </text>
                </g>
              )
            })}
          </svg>
          <figcaption>Illustrative diagram — click a number to explore it below.</figcaption>
        </figure>

        <ol className="art-legend">
          {features.map((f, i) => {
            const open = active === i
            return (
              <li key={f.term} className={open ? 'art-item-open' : ''}>
                <button
                  className="art-item-head"
                  onClick={() => setActive(i)}
                  aria-expanded={open}
                >
                  <span className="art-num" style={{ background: monument.hue }}>
                    {i + 1}
                  </span>
                  <span className="art-term">{f.term}</span>
                  <span className="art-chev" aria-hidden>
                    {open ? '−' : '+'}
                  </span>
                </button>
                {open && (
                  <div className="art-item-body">
                    {f.meaning && <p className="art-mean">{f.meaning}</p>}
                    <p className="art-sci">
                      <span aria-hidden>⚙</span> {f.science}
                    </p>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

/* ---------- Stylised architectural scenes ---------- */
function Scene({ arch, hue }: { arch: Archetype; hue: string }) {
  const shade = 'rgba(0,0,0,0.14)'
  const light = 'rgba(255,255,255,0.22)'
  const win = '#f6ead8'
  const ground = <rect x="0" y="52" width="100" height="8" fill="#e0cca4" />

  switch (arch) {
    case 'screen': {
      // Hawa Mahal: tapering tiered honeycomb façade
      const tiers = [
        { y: 40, w: 66 },
        { y: 33, w: 54 },
        { y: 26, w: 42 },
        { y: 20, w: 30 },
        { y: 15, w: 18 },
      ]
      return (
        <g>
          {ground}
          {tiers.map((t, i) => (
            <g key={i}>
              <rect x={50 - t.w / 2} y={t.y} width={t.w} height={i === 0 ? 12 : 8} fill={hue} />
              {Array.from({ length: Math.floor(t.w / 6) }).map((_, j) => (
                <path
                  key={j}
                  d={`M${50 - t.w / 2 + 2 + j * 6} ${t.y + 6} v-3 a1.6 1.6 0 0 1 3.2 0 v3 Z`}
                  fill={win}
                />
              ))}
            </g>
          ))}
          <path d="M50 15 q3 -6 0 -9 q-3 3 0 9 Z" fill={hue} />
        </g>
      )
    }
    case 'haveli': {
      // Carved façade with jharokha balconies + central gate
      return (
        <g>
          {ground}
          <rect x="18" y="18" width="64" height="34" fill={hue} />
          <rect x="18" y="18" width="64" height="4" fill={shade} />
          {/* window/balcony grid */}
          {[0, 1, 2].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <g key={`${r}-${c}`}>
                <rect x={24 + c * 14} y={24 + r * 9} width="9" height="6" fill={win} rx="3" />
                <rect x={23 + c * 14} y={29 + r * 9} width="11" height="1.4" fill={shade} />
              </g>
            )),
          )}
          {/* central arched gate */}
          <path d="M46 52 v-10 a4 4 0 0 1 8 0 v10 Z" fill={shade} />
          {/* rooftop chhatris */}
          <circle cx="24" cy="18" r="2.4" fill={hue} />
          <circle cx="76" cy="18" r="2.4" fill={hue} />
        </g>
      )
    }
    case 'fort': {
      // Hill with crenellated ramparts + bastions + gate + flag
      return (
        <g>
          {ground}
          <path d="M0 52 L20 40 L44 34 L70 38 L100 48 L100 52 Z" fill="#d8c19a" />
          <path d="M22 40 L78 40 L74 26 L26 26 Z" fill={hue} />
          <path d="M22 40 L78 40 L78 42 L22 42 Z" fill={shade} />
          {/* bastions */}
          <rect x="20" y="22" width="10" height="20" rx="2" fill={hue} />
          <rect x="70" y="22" width="10" height="20" rx="2" fill={hue} />
          {/* crenellations */}
          {Array.from({ length: 10 }).map((_, i) => (
            <rect key={i} x={22 + i * 5.6} y="23" width="3" height="3" fill={hue} />
          ))}
          {/* gate */}
          <path d="M46 40 v-8 a4 4 0 0 1 8 0 v8 Z" fill={shade} />
          {/* flag */}
          <line x1="50" y1="22" x2="50" y2="14" stroke="#a8432a" strokeWidth="1" />
          <path d="M50 14 l6 2 l-6 2 Z" fill="#a8432a" />
        </g>
      )
    }
    case 'palace-hill': {
      // Layered hillside palace with domes and chhatris
      return (
        <g>
          {ground}
          <path d="M0 52 L24 42 L52 34 L82 40 L100 50 L100 52 Z" fill="#d8c19a" />
          <rect x="24" y="40" width="52" height="12" fill={hue} />
          <rect x="30" y="32" width="40" height="10" fill={hue} />
          <rect x="30" y="32" width="40" height="3" fill={light} />
          <rect x="38" y="26" width="24" height="8" fill={hue} />
          {/* domes / chhatris */}
          <path d="M32 32 a4 4 0 0 1 8 0 Z" fill={hue} />
          <path d="M60 32 a4 4 0 0 1 8 0 Z" fill={hue} />
          <path d="M44 26 a6 6 0 0 1 12 0 Z" fill={hue} />
          <line x1="50" y1="20" x2="50" y2="16" stroke={hue} strokeWidth="1" />
          {/* arched openings */}
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M${30 + i * 12} 52 v-8 a3 3 0 0 1 6 0 v8 Z`} fill={win} opacity="0.7" />
          ))}
        </g>
      )
    }
    case 'palace': {
      // Symmetric palace: central dome + wings + arcade + garden
      return (
        <g>
          {ground}
          <rect x="14" y="34" width="72" height="18" fill={hue} />
          <rect x="36" y="26" width="28" height="26" fill={hue} />
          <rect x="36" y="26" width="28" height="3" fill={light} />
          <path d="M38 26 a12 12 0 0 1 24 0 Z" fill={hue} />
          <line x1="50" y1="14" x2="50" y2="10" stroke={hue} strokeWidth="1" />
          {/* wing chhatris */}
          <path d="M18 34 a3 3 0 0 1 6 0 Z" fill={hue} />
          <path d="M76 34 a3 3 0 0 1 6 0 Z" fill={hue} />
          {/* arcade of arches */}
          {Array.from({ length: 9 }).map((_, i) => (
            <path key={i} d={`M${17 + i * 8} 52 v-9 a3.4 3.4 0 0 1 6.8 0 v9 Z`} fill={win} opacity="0.75" />
          ))}
          {/* char-bagh axis */}
          <line x1="50" y1="52" x2="50" y2="58" stroke={shade} strokeWidth="1" strokeDasharray="2 2" />
        </g>
      )
    }
    case 'observatory': {
      // Jantar Mantar: gnomon + curved scale + small instruments
      return (
        <g>
          {ground}
          <circle cx="72" cy="18" r="4.5" fill="#f4c542" />
          {/* Samrat Yantra: triangular gnomon */}
          <polygon points="28,52 28,20 52,52" fill={hue} />
          <path d="M52 52 A34 34 0 0 1 70 30" fill="none" stroke={hue} strokeWidth="3" />
          <line x1="28" y1="20" x2="42" y2="40" stroke={shade} strokeWidth="1.2" />
          {/* small bowl instruments */}
          <path d="M78 52 a7 4 0 0 1 14 0 Z" fill={hue} />
          <path d="M60 52 a5 3 0 0 1 10 0 Z" fill={hue} opacity="0.8" />
        </g>
      )
    }
    case 'stepwell': {
      // Chand Baori: inverted stepped pyramid + water
      return (
        <g>
          <rect x="0" y="0" width="100" height="16" fill="#e0cca4" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={12 + i * 7} y={16 + i * 7} width={76 - i * 14} height="5" fill={hue} />
          ))}
          <rect x="40" y="51" width="20" height="6" fill="#3a6ea5" />
          <path d="M40 51 h20" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
        </g>
      )
    }
    case 'mosque': {
      // Arcade of pointed arches + domes + minaret
      return (
        <g>
          {ground}
          <rect x="16" y="30" width="68" height="22" fill={hue} />
          {Array.from({ length: 6 }).map((_, i) => (
            <path key={i} d={`M${20 + i * 11} 52 v-12 q3.5 -6 7 0 v12 Z`} fill={win} opacity="0.8" />
          ))}
          {/* domes */}
          <path d="M30 30 a8 8 0 0 1 16 0 Z" fill={hue} />
          <path d="M54 30 a8 8 0 0 1 16 0 Z" fill={hue} />
          <rect x="30" y="30" width="40" height="2.5" fill={light} />
          {/* minaret */}
          <rect x="80" y="24" width="5" height="28" fill={hue} />
          <path d="M80 24 a2.5 2.5 0 0 1 5 0 Z" fill={hue} />
        </g>
      )
    }
  }
}
