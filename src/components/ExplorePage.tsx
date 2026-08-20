import { useState } from 'react'
import { FILTERS, MONUMENTS, MONUMENT_IMAGES, commonsUrl, type Monument } from '../data'
import { navigate } from '../useRoute'

type FilterState = { climate: string | null; material: string | null; period: string | null }
const empty: FilterState = { climate: null, material: null, period: null }

/** Card thumbnail: a real photo when one exists, falling back to the tinted initial. */
function MonCardArt({ m }: { m: Monument }) {
  const photo = MONUMENT_IMAGES[m.id]?.[0]
  const [broken, setBroken] = useState(false)

  return (
    <div className="mon-card-art" style={{ background: `linear-gradient(150deg, ${m.hue}, #7a5233)` }}>
      {photo && !broken ? (
        <img
          className="mon-card-img"
          src={commonsUrl(photo.file, 480)}
          alt={m.name}
          loading="lazy"
          onError={() => setBroken(true)}
        />
      ) : (
        <span className="mon-card-init">{m.name[0]}</span>
      )}
    </div>
  )
}

function matches(m: Monument, f: FilterState) {
  if (f.climate && m.climateKey !== f.climate) return false
  if (f.material && m.materialKey !== f.material) return false
  if (f.period && m.periodBand !== f.period) return false
  return true
}

export default function ExplorePage() {
  const [filters, setFilters] = useState<FilterState>(empty)
  const toggle = (g: keyof FilterState, k: string) =>
    setFilters((p) => ({ ...p, [g]: p[g] === k ? null : k }))
  const list = MONUMENTS.filter((m) => matches(m, filters))
  const active = filters.climate || filters.material || filters.period

  return (
    <div className="page">
      <div className="section-head">
        <p className="eyebrow">Explore the collection</p>
        <h1>Rajasthan’s monuments</h1>
        <p>
          {MONUMENTS.length} sites decoded across six dimensions — history, architecture,
          passive cooling, water, geometry and culture. Pick one to open its interactive page.
        </p>
      </div>

      <div className="explore-filters">
        {(Object.keys(FILTERS) as (keyof typeof FILTERS)[]).map((group) => (
          <div className="explore-fgroup" key={group}>
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
        {active && (
          <button className="chip clear" onClick={() => setFilters(empty)}>
            Reset
          </button>
        )}
      </div>

      <p className="explore-count">
        Showing {list.length} of {MONUMENTS.length}
      </p>

      <div className="explore-grid">
        {list.map((m) => (
          <button
            key={m.id}
            className="mon-card"
            style={{ ['--accent' as string]: m.hue }}
            onClick={() => navigate(`/monument/${m.id}`)}
          >
            <MonCardArt m={m} />
            <div className="mon-card-body">
              <span className="mon-card-tag">{m.tagline}</span>
              <h3>{m.name}</h3>
              <p className="mon-card-meta">
                {m.place} · {m.period}
              </p>
              <div className="mon-card-badges">
                <span>{m.climate}</span>
                <span>{m.material}</span>
              </div>
            </div>
            <span className="mon-card-go">Explore →</span>
          </button>
        ))}
      </div>
    </div>
  )
}
