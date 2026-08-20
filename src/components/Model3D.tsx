import { useState } from 'react'
import type { Model3D as Model3DData } from '../data'

/**
 * Embeds a Sketchfab model, but only once the visitor asks for it — the Sketchfab
 * viewer is a heavy WebGL payload, so it stays a lightweight poster/button until clicked.
 */
export default function Model3D({ model }: { model: Model3DData }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="model3d">
      <div className="model3d-frame">
        {loaded ? (
          <iframe
            title={model.title}
            className="model3d-iframe"
            src={`https://sketchfab.com/models/${model.uid}/embed?autostart=1&ui_theme=dark`}
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
          />
        ) : (
          <button className="model3d-poster" onClick={() => setLoaded(true)}>
            <span className="model3d-play" aria-hidden>
              ▶
            </span>
            <span>Load interactive 3D model</span>
            <span className="model3d-hint">Drag to rotate · scroll to zoom · loads from Sketchfab</span>
          </button>
        )}
      </div>
      <p className="model3d-credit">
        “{model.title}” by {model.author} on{' '}
        <a href={`https://sketchfab.com/3d-models/${model.uid}`} target="_blank" rel="noreferrer noopener">
          Sketchfab
        </a>
        {model.note && <> · {model.note}</>}
      </p>
    </div>
  )
}
