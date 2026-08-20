import { useEffect, useState } from 'react'

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3)

/** Counts up from 0 to `to` once `start` flips true. */
export default function Counter({ to, start, duration = 1100 }: { to: number; start: boolean; duration?: number }) {
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!start) return
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration)
      setN(Math.round(to * easeOutCubic(p)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, to, duration])

  return <>{n}</>
}
