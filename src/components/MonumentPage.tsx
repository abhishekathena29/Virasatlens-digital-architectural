import { useState } from 'react'
import { LENS_META, MONUMENTS, MONUMENT_MODELS, availableLenses, byId, lensText, type LensKey, type Monument } from '../data'
import { navigate } from '../useRoute'
import Simulation from './Simulation'
import MonumentArt from './MonumentArt'
import Model3D from './Model3D'

const DIMS: { key: keyof import('../data').Monument['dims']; label: string; icon: string }[] = [
  { key: 'history', label: 'History', icon: '📜' },
  { key: 'architecture', label: 'Architecture', icon: '🏛' },
  { key: 'cooling', label: 'Passive Cooling & Climate', icon: '❄' },
  { key: 'water', label: 'Water Engineering', icon: '💧' },
  { key: 'geometry', label: 'Geometry & Planning', icon: '◆' },
  { key: 'social', label: 'Social & Cultural Design', icon: '🎭' },
]

export default function MonumentPage({ id }: { id: string }) {
  const m = byId(id)

  if (!m) {
    return (
      <div className="page">
        <p className="crumb">
          <button className="link" onClick={() => navigate('/explore')}>
            ← Back to all monuments
          </button>
        </p>
        <p>Monument not found.</p>
      </div>
    )
  }

  const idx = MONUMENTS.findIndex((x) => x.id === id)
  const prev = MONUMENTS[(idx - 1 + MONUMENTS.length) % MONUMENTS.length]
  const next = MONUMENTS[(idx + 1) % MONUMENTS.length]

  return (
    <div className="page">
      <p className="crumb">
        <button className="link" onClick={() => navigate('/')}>
          Home
        </button>
        <span> / </span>
        <button className="link" onClick={() => navigate('/explore')}>
          Monuments
        </button>
        <span> / {m.name}</span>
      </p>

      {/* Hero */}
      <header className="mon-hero" style={{ ['--accent' as string]: m.hue }}>
        <div>
          <span className="mon-tag" style={{ color: m.hue }}>
            {m.tagline}
          </span>
          <h1>{m.name}</h1>
          <div className="mon-chips">
            <span>📍 {m.place}</span>
            <span>🕑 {m.period}</span>
            <span>🧱 {m.material}</span>
            <span>🌡 {m.climate}</span>
          </div>
          <p className="mon-intro">{m.intro}</p>
        </div>
      </header>

      {/* Interactive 3D model, where a real one exists */}
      {MONUMENT_MODELS[m.id] && (
        <section className="mon-block">
          <h2>Walk around it in 3D</h2>
          <Model3D model={MONUMENT_MODELS[m.id]} key={m.id} />
        </section>
      )}

      {/* Interactive Design Lens */}
      <DesignLensSection monument={m} key={m.id} />

      {/* Architecture illustration + the science behind it */}
      <section className="mon-block">
        <h2>Architecture &amp; the science behind it</h2>
        <p className="arch-lead" style={{ borderColor: m.hue }}>
          {m.howItWorks}
        </p>
        <MonumentArt monument={m} key={m.id} />
      </section>

      {/* Full six-dimension data */}
      <section className="mon-block">
        <h2>The full picture · six dimensions</h2>
        <div className="dim-grid">
          {DIMS.map((d) => (
            <article className="dim-card" key={d.key}>
              <span className="dim-ico" aria-hidden>
                {d.icon}
              </span>
              <h3>{d.label}</h3>
              <p>{m.dims[d.key]}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Jantar Mantar instrument explorer */}
      {m.instruments && (
        <section className="mon-block">
          <h2>Instrument explorer · {m.instruments.length} yantras</h2>
          <div className="inst-grid">
            {m.instruments.map((it) => (
              <div className="inst-card" key={it.name}>
                <p className="inst-name">{it.name}</p>
                <p className="inst-fn">{it.fn}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Prev / next */}
      <nav className="mon-nav">
        <button className="mon-nav-btn" onClick={() => navigate(`/monument/${prev.id}`)}>
          <span>← Previous</span>
          <strong>{prev.name}</strong>
        </button>
        <button className="mon-nav-btn right" onClick={() => navigate(`/monument/${next.id}`)}>
          <span>Next →</span>
          <strong>{next.name}</strong>
        </button>
      </nav>
    </div>
  )
}

/** Keyed by monument id from the parent, so switching monuments always resets to that monument's first lens. */
function DesignLensSection({ monument: m }: { monument: Monument }) {
  const lenses = availableLenses(m)
  const [lens, setLens] = useState<LensKey>(lenses[0])
  const simType = m.sims[lens]
  const lensMeta = LENS_META[lens]

  return (
    <section className="mon-block">
      <h2>Design Lens · see the science move</h2>
      <p className="lens-hint">
        Only the design lenses this monument actually uses are shown — switch between them to see a
        different piece of the science, explained on its own terms.
      </p>
      <div className="lens-buttons">
        {lenses.map((k) => (
          <button
            key={k}
            className={`lens-btn ${lens === k ? 'lens-on' : ''}`}
            style={lens === k ? { borderColor: LENS_META[k].color, color: LENS_META[k].color } : undefined}
            onClick={() => setLens(k)}
          >
            <span aria-hidden>{LENS_META[k].icon}</span> {LENS_META[k].label}
          </button>
        ))}
      </div>
      <div className="lens-grid">
        <Simulation type={simType} color={m.hue} key={lens} />
        <div className="lens-readout" style={{ borderColor: lensMeta.color }}>
          <strong>{lensMeta.label}</strong>
          <p>{lensText(m, lens)}</p>
        </div>
      </div>
    </section>
  )
}
