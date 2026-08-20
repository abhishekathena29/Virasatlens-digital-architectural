import { useState } from 'react'
import { COMPARE_CASES } from '../data'

export default function Compare() {
  const [caseIdx, setCaseIdx] = useState(0)
  // 0 = fully traditional, 100 = fully modern
  const [blend, setBlend] = useState(0)
  const c = COMPARE_CASES[caseIdx]

  const lerp = (a: number, b: number) => Math.round(a + (b - a) * (blend / 100))

  return (
    <div className="compare">
      <div className="compare-switch">
        {COMPARE_CASES.map((cc, i) => (
          <button
            key={cc.id}
            className={`switch-btn ${i === caseIdx ? 'switch-on' : ''}`}
            onClick={() => setCaseIdx(i)}
          >
            {cc.traditionalName} vs {cc.modernName}
          </button>
        ))}
      </div>

      <p className="compare-summary">{c.summary}</p>

      <div className="slider-row">
        <span className={blend < 50 ? 'side-strong' : ''}>{c.traditionalName}</span>
        <input
          type="range"
          min={0}
          max={100}
          value={blend}
          onChange={(e) => setBlend(Number(e.target.value))}
          className="blend-slider"
          aria-label="Blend between traditional and modern"
        />
        <span className={blend >= 50 ? 'side-strong' : ''}>{c.modernName}</span>
      </div>

      <div className="metrics">
        {c.metrics.map((m) => {
          const val = lerp(m.traditional, m.modern)
          return (
            <div className="metric" key={m.key}>
              <div className="metric-head">
                <span>{m.label}</span>
                <span className="metric-val">{val}</span>
              </div>
              <div className="bar">
                <div className="bar-fill" style={{ width: `${val}%` }} />
              </div>
              <p className="metric-note">{m.note}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
