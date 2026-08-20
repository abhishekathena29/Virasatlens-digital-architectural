import { useEffect, useState } from 'react'

export type Route = { name: 'home' } | { name: 'explore' } | { name: 'monument'; id: string }

function parse(hash: string): Route {
  const h = hash.replace(/^#\/?/, '')
  if (h.startsWith('monument/')) return { name: 'monument', id: h.slice('monument/'.length) }
  if (h === 'explore') return { name: 'explore' }
  return { name: 'home' }
}

export function navigate(to: string) {
  window.location.hash = to
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash))
  useEffect(() => {
    const onChange = () => {
      setRoute(parse(window.location.hash))
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
