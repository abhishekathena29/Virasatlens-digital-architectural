import { useState } from 'react'
import { MONUMENT_IMAGES, commonsUrl } from '../data'

/**
 * Photographs of a monument laid out in an alternating (criss-cross) column:
 * image left / text right, then image right / text left, and so on. Each row
 * pairs a real photo with an explanation of that architecture and its science.
 * Images are hotlinked from Wikimedia Commons; any that fail to load are
 * dropped so the layout degrades gracefully.
 */
export default function MonumentGallery({ id }: { id: string }) {
  const images = MONUMENT_IMAGES[id]
  const [broken, setBroken] = useState<Record<string, boolean>>({})

  if (!images) return null
  const visible = images.filter((im) => !broken[im.file])
  if (visible.length === 0) return null

  return (
    <div className="crisscross">
      {visible.map((im, i) => (
        <figure className={`cc-row ${i % 2 === 1 ? 'reverse' : ''}`} key={im.file}>
          <div className="cc-media">
            <img
              src={commonsUrl(im.file, 900)}
              alt={im.title}
              loading="lazy"
              onError={() => setBroken((b) => ({ ...b, [im.file]: true }))}
            />
          </div>
          <figcaption className="cc-text">
            <span className="cc-index">{String(i + 1).padStart(2, '0')}</span>
            <h4 className="cc-title">{im.title}</h4>
            <p className="cc-science">{im.science}</p>
          </figcaption>
        </figure>
      ))}
      <p className="gallery-credit">Photos: Wikimedia Commons</p>
    </div>
  )
}
