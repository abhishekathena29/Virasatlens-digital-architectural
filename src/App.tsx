import { MONUMENTS } from './data'
import { navigate, useRoute } from './useRoute'
import HeritageMap from './components/HeritageMap'
import ExplorePage from './components/ExplorePage'
import MonumentPage from './components/MonumentPage'
import Compare from './components/Compare'
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
              <strong>{MONUMENTS.length}</strong>
              <span>monuments</span>
            </div>
            <div>
              <strong>6</strong>
              <span>dimensions each</span>
            </div>
            <div>
              <strong>8</strong>
              <span>live simulations</span>
            </div>
          </div>
        </div>
        <div className="hero-art" aria-hidden>
          <div className="arch-frame">
            <div className="jaali" />
          </div>
        </div>
      </section>

      {/* Map */}
      <section id="map" className="section">
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
      <section id="compare" className="section section-alt">
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
      <section id="about" className="section about">
        <div className="section-head">
          <h2>Why this matters</h2>
        </div>
        <div className="about-grid">
          <article>
            <span className="about-ico">📐</span>
            <h3>Science made simple</h3>
            <p>Thermodynamics, airflow and passive design explained through buildings you can see.</p>
          </article>
          <article>
            <span className="about-ico">🎓</span>
            <h3>For students &amp; designers</h3>
            <p>Each element is paired with the physical principle that makes it work.</p>
          </article>
          <article>
            <span className="about-ico">🌿</span>
            <h3>Heritage → sustainability</h3>
            <p>Centuries-old climate wisdom, reframed for a warming world.</p>
          </article>
        </div>
      </section>
    </>
  )
}

export default App
