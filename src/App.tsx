import { useRef } from 'react'
import { MONUMENTS } from './data'
import { navigate, useRoute } from './useRoute'
import HeritageMap from './components/HeritageMap'
import ExplorePage from './components/ExplorePage'
import MonumentPage from './components/MonumentPage'
import Compare from './components/Compare'
import Counter from './components/Counter'
import HeroFlow from './components/HeroFlow'
import { useReveal } from './useReveal'
import './App.css'

function App() {
  const route = useRoute()

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" onClick={() => navigate('/')}>
          <span className="brand-mark">◑</span>
          <span>
            Virasat<em>·</em>Lens
          </span>
        </button>
        <nav className="nav">
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => navigate('/explore')}>Monuments</button>
          <button onClick={() => navigate('/#compare')}>Then vs Now</button>
        </nav>
      </header>

      <main id="top">
        {route.name === 'monument' ? (
          <MonumentPage id={route.id} />
        ) : route.name === 'explore' ? (
          <ExplorePage />
        ) : (
          <Home />
        )}
      </main>

      <footer className="footer">
        <span>Virasat·Lens — a learning experience in Rajasthan’s architectural science.</span>
        <span className="footer-dim">Illustrative schematics for education.</span>
      </footer>
    </div>
  )
}

function Home() {
  const { ref: mapRef, visible: mapVisible } = useReveal<HTMLElement>()
  const { ref: compareRef, visible: compareVisible } = useReveal<HTMLElement>()
  const { ref: aboutRef, visible: aboutVisible } = useReveal<HTMLElement>()

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Digital Architecture Experience · Rajasthan Edition</p>
          <h1>
            Read the <span className="hl">science</span> hidden in
            <br /> India’s desert architecture.
          </h1>
          <p className="lede">
            Explore Rajasthan’s monuments as living machines — watch air flow through a
            jaali, water fill a stepwell, and heat crawl through a thick wall, all in real
            time. Built for students, designers and the curious traveller.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={() => navigate('/explore')}>
              Explore {MONUMENTS.length} monuments
            </button>
            <a className="btn btn-ghost" href="#map">
              Open the map
            </a>
          </div>
          <div className="hero-stats">
            <div>
              <strong>
                <Counter to={MONUMENTS.length} start />
              </strong>
              <span>monuments</span>
            </div>
            <div>
              <strong>
                <Counter to={6} start />
              </strong>
              <span>dimensions each</span>
            </div>
            <div>
              <strong>
                <Counter to={8} start />
              </strong>
              <span>live simulations</span>
            </div>
          </div>
        </div>
        <HeroArt />
      </section>

      {/* Map */}
      <section id="map" className={`section reveal ${mapVisible ? 'reveal-in' : ''}`} ref={mapRef}>
        <div className="section-head">
          <h2>Interactive heritage map</h2>
          <p>
            Filter by climate, material or era. <strong>Zoom and drag</strong> to roam
            Rajasthan, then click any glowing node to open that monument’s dedicated page.
          </p>
        </div>
        <HeritageMap onSelect={(id) => navigate(`/monument/${id}`)} />
      </section>

      {/* Compare */}
      <section
        id="compare"
        className={`section section-alt reveal ${compareVisible ? 'reveal-in' : ''}`}
        ref={compareRef}
      >
        <div className="section-head">
          <h2>Traditional vs modern</h2>
          <p>
            Drag the slider to morph between the old way and the new — and watch how energy,
            comfort, sustainability and community shift with it.
          </p>
        </div>
        <Compare />
      </section>

      {/* About */}
      <section id="about" className={`section about reveal ${aboutVisible ? 'reveal-in' : ''}`} ref={aboutRef}>
        <div className="section-head">
          <h2>Why this matters</h2>
        </div>
        <div className="about-grid">
          {[
            { ico: '📐', title: 'Science made simple', body: 'Thermodynamics, airflow and passive design explained through buildings you can see.' },
            { ico: '🎓', title: 'For students & designers', body: 'Each element is paired with the physical principle that makes it work.' },
            { ico: '🌿', title: 'Heritage → sustainability', body: 'Centuries-old climate wisdom, reframed for a warming world.' },
          ].map((card, i) => (
            <article key={card.title} style={{ transitionDelay: `${i * 90}ms` }}>
              <span className="about-ico" aria-hidden>
                {card.ico}
              </span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

/** The hero's arch: a live airflow simulation behind the jaali, tilting gently toward the cursor. */
function HeroArt() {
  const frameRef = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = frameRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(700px) rotateY(${px * 14}deg) rotateX(${-py * 14}deg)`
  }
  const onLeave = () => {
    const el = frameRef.current
    if (!el) return
    el.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg)'
  }

  return (
    <div className="hero-art">
      <div className="arch-frame" ref={frameRef} onMouseMove={onMove} onMouseLeave={onLeave}>
        <HeroFlow />
        <div className="jaali" />
      </div>
    </div>
  )
}

export default App
