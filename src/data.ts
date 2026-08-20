// Heritage data for the Digital Architecture Experience: Rajasthan Edition.
// Coordinates (x, y) are percentages positioned over the stylised Rajasthan map.

export type LensKey = 'cooling' | 'airflow' | 'water' | 'geometry'

/** Animated simulation shown for a given lens. See components/Simulation.tsx. */
export type SimType =
  | 'venturi'
  | 'chimney'
  | 'coolsink'
  | 'evaporative'
  | 'rainwater'
  | 'thermalmass'
  | 'sundial'
  | 'symmetry'

export interface WalkElement {
  term: string
  meaning: string
  science: string
}

export interface Instrument {
  name: string
  fn: string
}

export interface Monument {
  id: string
  name: string
  place: string
  coords: { x: number; y: number }
  period: string
  periodBand: 'ancient' | 'medieval' | 'early-modern' | 'modern'
  material: string
  materialKey: 'sandstone' | 'marble' | 'lime'
  climate: string
  climateKey: 'arid' | 'semi-arid' | 'desert'
  hue: string
  tagline: string
  intro: string
  /** The six dimensions of analysis from the research dataset. */
  dims: {
    history: string
    architecture: string
    cooling: string
    water: string
    geometry: string
    social: string
  }
  /** Which live simulation each Design Lens plays. */
  sims: Record<LensKey, SimType>
  /** Distinct explanation for the "Airflow & Light" Design Lens — kept separate from dims.cooling so the two lenses never repeat the same text. */
  airflowNote: string
  /** A short, narrative "how it works" explanation that opens the Architecture section — monument-specific, not shared across archetypes. */
  howItWorks: string
  /** Design Lenses this monument genuinely doesn't have — hides that lens button instead of showing filler text. */
  excludeLenses?: LensKey[]
  walkthrough?: WalkElement[]
  instruments?: Instrument[]
}

export const LENS_META: Record<LensKey, { label: string; color: string; icon: string }> = {
  cooling: { label: 'Passive Cooling', color: '#2f7d8c', icon: '❄' },
  airflow: { label: 'Airflow & Light', color: '#c89b3c', icon: '☀' },
  water: { label: 'Water Engineering', color: '#3a6ea5', icon: '💧' },
  geometry: { label: 'Geometry & Planning', color: '#a8432a', icon: '◆' },
}

const LENS_ORDER: LensKey[] = ['cooling', 'airflow', 'water', 'geometry']

/** The Design Lenses that actually apply to a given monument, in display order. */
export const availableLenses = (m: Monument): LensKey[] =>
  LENS_ORDER.filter((k) => !m.excludeLenses?.includes(k))

/** The explanation text for one Design Lens on one monument. */
export const lensText = (m: Monument, lens: LensKey): string => {
  switch (lens) {
    case 'cooling':
      return m.dims.cooling
    case 'airflow':
      return m.airflowNote
    case 'water':
      return m.dims.water
    case 'geometry':
      return m.dims.geometry
  }
}

export const FILTERS = {
  climate: [
    { key: 'arid', label: 'Arid' },
    { key: 'semi-arid', label: 'Semi-arid' },
    { key: 'desert', label: 'Hot desert' },
  ],
  material: [
    { key: 'sandstone', label: 'Sandstone' },
    { key: 'marble', label: 'Marble' },
    { key: 'lime', label: 'Lime / stone' },
  ],
  period: [
    { key: 'ancient', label: 'Ancient (pre-1000)' },
    { key: 'medieval', label: 'Medieval (1000–1600)' },
    { key: 'early-modern', label: 'Early modern (1600–1900)' },
    { key: 'modern', label: 'Modern (1900+)' },
  ],
} as const

export const MONUMENTS: Monument[] = [
  {
    id: 'jantar-mantar',
    name: 'Jantar Mantar',
    place: 'Jaipur',
    coords: { x: 62, y: 46 },
    period: '1734 CE',
    periodBand: 'early-modern',
    material: 'Lime & marble',
    materialKey: 'lime',
    climate: 'Semi-arid',
    climateKey: 'semi-arid',
    hue: '#c2a36b',
    tagline: 'Architecture that Tells Time',
    intro:
      'Not a palace but a giant outdoor scientific instrument disguised as architecture — nineteen monumental stone instruments that read the sky with the naked eye.',
    dims: {
      history:
        'Built by Sawai Jai Singh II — founder of Jaipur — to improve astronomical calculations, and completed in 1734. A UNESCO World Heritage Site.',
      architecture:
        'Nineteen monumental masonry instruments in local stone and marble turn scientific tools into architecture, spread over ~18,700 m².',
      cooling:
        'Passive cooling was not a design goal — the site is kept open to the sky for unobstructed observation. Stone and lime plaster help the structures withstand Jaipur’s climate.',
      water:
        'Water management was not an important feature; unlike forts and palaces it was designed for observation, not habitation or defence.',
      geometry:
        'Geometry is its heart — circles, triangles, arcs, angles and celestial coordinate systems form large-scale mathematical models aligned to the cardinal directions.',
      social:
        '18th-century astronomy was linked to religion, calendars, festivals, agriculture and governance; the observatory reinforced the ruler as a patron of science.',
    },
    sims: { cooling: 'thermalmass', airflow: 'sundial', water: 'rainwater', geometry: 'sundial' },
    excludeLenses: ['cooling', 'water'],
    howItWorks:
      'Scale is the entire trick here. A sundial’s accuracy depends on how finely you can read a shadow, and a small brass gnomon can only ever be so precise. Sawai Jai Singh II’s solution was to stop building instruments and start building buildings: the Vrihat Samrat Yantra’s gnomon is a 27-metre stone wall, angled to match Jaipur’s latitude so its edge points exactly at the celestial pole. A shadow that size creeps across the marble scale slowly enough to read the time to within two seconds — precision achieved through architectural mass, not delicate machinery.',
    airflowNote:
      'There’s no ventilation strategy here — the plaza is kept open to the sky precisely so nothing interrupts a sightline. What moves through this space instead of air is light: the sun swings the great gnomon’s shadow across the curved marble quadrants like a slow clock hand, while the Jai Prakash Yantra’s bowls invert that same sunlight into a map of the stars underfoot.',
    walkthrough: [
      {
        term: 'Vrihat Samrat Yantra',
        meaning: 'The great sundial, 27 m tall — the largest in the world.',
        science: 'Its hypotenuse is aligned to Earth’s axis; the shadow marks time to ~2 seconds.',
      },
      {
        term: 'Jai Prakash Yantra',
        meaning: 'Hemispherical bowl instruments.',
        science: 'Maps the sky onto a marble bowl to read the Sun’s position via inverted shadows.',
      },
      {
        term: 'Cardinal alignment',
        meaning: 'Instruments set to Jaipur’s latitude and the cardinal axes.',
        science: 'Turns geometry and the Sun’s path into a precise measuring machine.',
      },
    ],
    instruments: [
      { name: 'Vrihat Samrat Yantra', fn: 'The world’s largest stone sundial (27 m); an equinoctial dial reading time to ~2 seconds.' },
      { name: 'Laghu Samrat Yantra', fn: 'The smaller sundial; local time to ~20 seconds, its ramp pointing to the North Pole.' },
      { name: 'Great Ram Yantra', fn: 'Paired open cylindrical structures measuring the altitude and azimuth of Sun and planets.' },
      { name: 'Jai Prakash Yantra', fn: 'Two hemispherical marble bowls mapping the sky, read through inverted shadows.' },
      { name: 'Chakra Yantra', fn: 'A ring instrument measuring the coordinates and hour angle of the Sun.' },
      { name: 'Digamsa Yantra', fn: 'A pillar within concentric circles used to predict sunrise and sunset times.' },
      { name: 'Nadivalaya Yantra', fn: 'Paired plates facing north and south, symbolising Earth’s two hemispheres.' },
      { name: 'Rasivalaya Yantra', fn: 'Twelve instruments — one per zodiac sign — read as each sign crosses the meridian.' },
      { name: 'Yantra Raj', fn: 'A 2.43 m astrolabe, the largest of its kind, for altitude and time.' },
      { name: 'Dakshinottara Bhitti', fn: 'Measures the meridian altitude and zenith distance of the Sun.' },
      { name: 'Unnathamsa Yantra', fn: 'A large metal ring measuring the altitude of celestial bodies.' },
      { name: 'Kranti Vritta', fn: 'Measures the solar sign (ecliptic position) of the Sun by day.' },
    ],
  },
  {
    id: 'amber-fort',
    name: 'Amber Fort',
    place: 'Amer',
    coords: { x: 60, y: 44 },
    period: '1592 CE',
    periodBand: 'medieval',
    material: 'Red sandstone & marble',
    materialKey: 'marble',
    climate: 'Semi-arid',
    climateKey: 'semi-arid',
    hue: '#c06a4a',
    tagline: 'The Palace of Mirrors & Breezes',
    intro:
      'A hillside palace famous for the Sheesh Mahal of inlaid mirrors and the Sukh Niwas — an early “air-conditioned” hall cooled by water cascading over marble.',
    dims: {
      history: 'Capital of the Kachwaha Rajputs before the city of Jaipur was founded.',
      architecture: 'Layered courtyards, palaces, temples and defences integrated into a hill.',
      cooling:
        'Courtyards, thick walls and the water-cooled Sukh Niwas reduce heat gain — water flowing over marble chills the breeze that crosses it before it ever reaches a person.',
      water: 'Reservoirs and gravity-fed systems supplied the hill complex from Maota Lake below.',
      geometry: 'Sequential spaces organise movement from public to private zones around char-bagh gardens.',
      social: 'The palace layout reflects royal hierarchy, administration and court life.',
    },
    sims: { cooling: 'evaporative', airflow: 'venturi', water: 'rainwater', geometry: 'symmetry' },
    howItWorks:
      'Amber Fort solves cooling with water, not walls. In the Sukh Niwas, channels cut into the marble carry a continuous flow across the width of the hall; as air brushes over that wet surface it gives up heat to evaporation and arrives on the far side several degrees cooler — the same principle a modern evaporative cooler uses, run entirely on gravity. The Sheesh Mahal solves a different problem with the same instinct for physics over fuel: thousands of convex mirror fragments catch a single candle flame and multiply it into a field of light, so the hall could be lit at night without burning enough oil to heat the room.',
    airflowNote:
      'Openings through the Ganesh Pol and the courtyard walls are angled to catch the breeze rolling up off Maota Lake below, then thread it through jali screens and across open courts so every hall gets cross-ventilation and filtered daylight without a single mechanical fan.',
    walkthrough: [
      {
        term: 'Sukh Niwas',
        meaning: 'The “Hall of Pleasure”.',
        science: 'Water runs through wall channels; evaporation chills the breeze passing over it.',
      },
      {
        term: 'Sheesh Mahal',
        meaning: 'Mirror palace of inlaid glass.',
        science: 'Mirrors multiply a single flame — daylight is amplified, reducing heat from lamps.',
      },
      {
        term: 'Chhatri',
        meaning: 'Elevated domed pavilion.',
        science: 'Shades a viewpoint while letting breeze flow beneath the dome.',
      },
    ],
  },
  {
    id: 'jaigarh-fort',
    name: 'Jaigarh Fort',
    place: 'Amer',
    coords: { x: 57, y: 42 },
    period: '1726 CE',
    periodBand: 'early-modern',
    material: 'Sandstone',
    materialKey: 'sandstone',
    climate: 'Semi-arid',
    climateKey: 'semi-arid',
    hue: '#b0703f',
    tagline: 'The Fort of Cannons',
    intro:
      'Built to protect Amber and house military resources — functional, defensive architecture engineered to survive long sieges.',
    dims: {
      history: 'Built primarily to protect Amber and to house military resources.',
      architecture: 'Functional military architecture focused on defence and logistics.',
      cooling: 'Thick masonry moderates temperature in harsh conditions.',
      water: 'Massive rainwater storage tanks supported long sieges.',
      geometry: 'Defensive layouts maximise surveillance and control.',
      social: 'Reflects the military priorities of the Rajput kingdoms.',
    },
    sims: { cooling: 'thermalmass', airflow: 'venturi', water: 'rainwater', geometry: 'symmetry' },
    howItWorks:
      'Jaigarh was built to survive a siege, and every choice reads that way. Its ramparts aren’t just thick, they’re battered — sloped so an attacker’s momentum and cannon shot glance off rather than strike square — and that same mass of stone works as a giant thermal flywheel, soaking up the day’s heat so slowly that the interior always lags hours behind the desert outside. The real engineering flex is underground: channels across the hillside funnel every drop of monsoon rain into covered tanks, because a fort that can’t run out of water can’t be starved out.',
    airflowNote:
      'The ridge above Amber catches wind that never reaches the valley floor, and the fort uses it twice — narrow surveillance slits built for watching the approach also work as vents, threading that hilltop breeze through the garrison’s stone magazines and living quarters.',
  },
  {
    id: 'hawa-mahal',
    name: 'Hawa Mahal',
    place: 'Jaipur',
    coords: { x: 64, y: 47 },
    period: '1799 CE',
    periodBand: 'early-modern',
    material: 'Pink sandstone',
    materialKey: 'sandstone',
    climate: 'Semi-arid',
    climateKey: 'semi-arid',
    hue: '#d98a6a',
    tagline: 'The Palace of Winds',
    intro:
      'A five-storey screen of 953 latticed windows — built so royal women could watch the street unseen, and engineered so the desert breeze cools every room without a fan.',
    dims: {
      history: 'Built for royal women to observe city activities unseen, in keeping with purdah.',
      architecture: 'A unique honeycomb façade with hundreds of small windows.',
      cooling:
        'Being little more than a single thin stone screen, the façade holds almost no heat — it never builds the thermal mass that keeps other palaces warm after sunset, so rooms shed the day’s warmth as soon as the sun drops.',
      water: 'Minimal water infrastructure.',
      geometry: 'A highly symmetrical façade creates visual rhythm and balance.',
      social: 'Directly shaped by social customs such as purdah.',
    },
    sims: { cooling: 'thermalmass', airflow: 'venturi', water: 'rainwater', geometry: 'symmetry' },
    excludeLenses: ['water'],
    howItWorks:
      'The Hawa Mahal isn’t really a building with windows — it’s closer to a wall that’s mostly holes. Its 953 openings turn the whole five-storey façade into one continuous surface for air exchange: wind forced through each small jaali aperture speeds up as it’s squeezed through, the same nozzle effect that makes water jet out of a narrowed hose, so even a mild breeze outside arrives indoors as a distinct, cooling draught. Because the screen is barely a stone’s-width thick, there’s almost no mass to store heat in — this is a building designed to let the desert’s evening cool pass straight through it rather than holding the day’s heat out.',
    airflowNote:
      'Air forced through each jaali’s tiny holes accelerates as it squeezes through — the Venturi effect — turning even a faint outside breeze into a real draught inside every one of the 953 windows, while the honeycomb pattern maximises the surface area available for that exchange.',
    walkthrough: [
      {
        term: 'Jharokha',
        meaning: 'Overhanging enclosed balcony with a carved canopy.',
        science: 'Shades the wall from direct sun while projecting the viewer into moving air.',
      },
      {
        term: 'Jaali',
        meaning: 'Perforated stone lattice screen.',
        science: 'Small openings accelerate incoming air (Venturi effect) and diffuse harsh light.',
      },
      {
        term: 'Honeycomb façade',
        meaning: 'The bee-hive arrangement of 953 windows.',
        science: 'Maximises surface area for cross-ventilation across the whole elevation.',
      },
    ],
  },
  {
    id: 'city-palace-jaipur',
    name: 'City Palace, Jaipur',
    place: 'Jaipur',
    coords: { x: 61, y: 49 },
    period: '1732 CE',
    periodBand: 'early-modern',
    material: 'Sandstone & marble',
    materialKey: 'marble',
    climate: 'Semi-arid',
    climateKey: 'semi-arid',
    hue: '#c98a5c',
    tagline: 'The Ceremonial Heart of Jaipur',
    intro:
      'The administrative and ceremonial heart of Jaipur’s rulers, where Rajput, Mughal and European ideas coexist in a single planned complex.',
    dims: {
      history: 'The administrative and ceremonial heart of Jaipur’s rulers.',
      architecture: 'Rajput, Mughal and European influences coexist in one complex.',
      cooling: 'Courtyards and shaded passages improve comfort.',
      water: 'Decorative water features and dedicated palace supply systems.',
      geometry: 'Planned around ceremonial axes and hierarchical spaces.',
      social: 'Designed to stage royal authority and public ceremonies.',
    },
    sims: { cooling: 'evaporative', airflow: 'chimney', water: 'rainwater', geometry: 'symmetry' },
    howItWorks:
      'The City Palace was designed to be read, not just occupied — every axis, gate and courtyard sequence stages a journey from public street to private royal chamber, with the architecture itself enforcing who gets to go where. That same sequence of open courts does double duty as climate control: each one is a light-well and a breeze-catcher for the rooms wrapped around it, while shaded colonnades like the Sabha Niwas keep direct sun off the stone so the audience hall stays usable through the hottest part of the day.',
    airflowNote:
      'The Sabha Niwas audience hall is open-sided behind its colonnade, so its rows of columns carry the roof while leaving every side free for cross-breeze; the palace’s courtyards are threaded along the same ceremonial axis, each one pulling air through the halls that flank it.',
  },
  {
    id: 'mehrangarh',
    name: 'Mehrangarh Fort',
    place: 'Jodhpur',
    coords: { x: 38, y: 58 },
    period: '1459 CE',
    periodBand: 'medieval',
    material: 'Sandstone & marble',
    materialKey: 'marble',
    climate: 'Arid',
    climateKey: 'arid',
    hue: '#b06a52',
    tagline: 'The Citadel on the Cliff',
    intro:
      'Rising 120 metres above the blue city of Jodhpur, this fort marries military strength with palaces whose carved screens keep royal chambers cool in the dry heat.',
    dims: {
      history: 'Seat of the Rathore rulers for centuries.',
      architecture: 'Massive fort walls emerge naturally from the rocky hill.',
      cooling: 'Thick stone walls and shaded interiors reduce the desert heat.',
      water: 'Internal storage in rock-cut tanks ensured resilience during sieges.',
      geometry: 'Terrain-driven planning uses the natural elevation strategically.',
      social: 'Represents martial culture and Rajput statecraft.',
    },
    sims: { cooling: 'thermalmass', airflow: 'venturi', water: 'rainwater', geometry: 'symmetry' },
    howItWorks:
      'Mehrangarh’s first defence is geology: the fort doesn’t sit on a hill so much as grow out of one, its walls rising straight from 120 metres of solid rock that no siege engine could undermine. That rock is also a cool anchor for everything built on it, while the carved jharokha screens threaded across the palace façades shade the sandstone directly and funnel the stronger, cleaner air found at altitude into the chambers behind them — height solving the military problem and the comfort problem at once.',
    airflowNote:
      'Jharokha balconies and zenana lattice screens wrap the upper palaces, catching the high-altitude breeze the valley floor never gets while still shading the sandstone wall behind them — and in the women’s quarters, the same perforated screens let air move freely while blocking any sightline in.',
    walkthrough: [
      {
        term: 'Burj',
        meaning: 'Bastion / defensive tower.',
        science: 'Sited on rock to use the cliff as natural elevation and foundation.',
      },
      {
        term: 'Jharokha',
        meaning: 'Carved viewing balcony in the palace zones.',
        science: 'Captures the high-altitude breeze and shades the sandstone wall behind it.',
      },
      {
        term: 'Zenana screens',
        meaning: 'Latticed walls of the women’s quarters.',
        science: 'Privacy plus ventilation — air passes freely while sightlines are blocked.',
      },
    ],
  },
  {
    id: 'umaid-bhawan',
    name: 'Umaid Bhawan Palace',
    place: 'Jodhpur',
    coords: { x: 40, y: 56 },
    period: '1943 CE',
    periodBand: 'modern',
    material: 'Sandstone',
    materialKey: 'sandstone',
    climate: 'Arid',
    climateKey: 'arid',
    hue: '#bd7a4e',
    tagline: 'The Last Great Palace',
    intro:
      'One of the world’s largest private residences, built partly as a famine-relief project — a bridge between princely tradition and 20th-century design.',
    dims: {
      history: 'Constructed partly as a famine-relief project in the 20th century.',
      architecture: 'Combines Art Deco, classical and Indian architectural traditions.',
      cooling: 'Large, tall interior volumes give the stone mass room to buffer the desert’s daily temperature swing before it ever reaches the rooms people use.',
      water: 'Modern water infrastructure compared to the older forts.',
      geometry: 'Symmetrical planning reflects modern palace design principles.',
      social: 'Symbolises the transition from princely rule to modern India.',
    },
    sims: { cooling: 'thermalmass', airflow: 'chimney', water: 'rainwater', geometry: 'symmetry' },
    howItWorks:
      'Umaid Bhawan translates centuries of passive-cooling instinct into an Art Deco vocabulary. Instead of a courtyard, it stacks volume under a single great dome: the tall interior space lets hot air rise and escape at the top, continuously drawing cooler air in below — a stack effect operating at the scale of a small hill. Built partly as a famine-relief employment project, its scale wasn’t only architectural ambition: every extra day of stonework was another day’s wages for workers during a drought, so bigger genuinely meant better here.',
    airflowNote:
      'Beneath the great central dome, warm air rises through the full height of the building and escapes upward, continuously drawing cooler air in at ground level — a stack-effect chimney built at the scale of an entire palace rather than a single courtyard.',
  },
  {
    id: 'kumbhalgarh',
    name: 'Kumbhalgarh Fort',
    place: 'Rajsamand',
    coords: { x: 40, y: 72 },
    period: '1458 CE',
    periodBand: 'medieval',
    material: 'Sandstone',
    materialKey: 'sandstone',
    climate: 'Semi-arid',
    climateKey: 'semi-arid',
    hue: '#a5764a',
    tagline: 'The Great Wall of India',
    intro:
      'A mountain stronghold ringed by 36 km of walls — a refuge for the Mewar kingdom, self-sufficient enough to outlast any siege.',
    dims: {
      history: 'Served as a refuge and stronghold for the Mewar kingdom.',
      architecture: 'One of India’s most formidable mountain fortifications.',
      cooling: 'Its elevated location benefits from cooler temperatures and airflow.',
      water: 'Extensive reservoirs enabled self-sufficiency during conflict.',
      geometry: 'Defensive geometry follows the mountain contours.',
      social: 'Demonstrates the survival strategy of the Mewar state.',
    },
    sims: { cooling: 'thermalmass', airflow: 'venturi', water: 'rainwater', geometry: 'symmetry' },
    howItWorks:
      '36 kilometres of wall — among the longest in the world — sounds like a triumph of labour, but it’s really a triumph of letting the terrain do the design work. Rather than fighting the mountain’s contours, the ramparts trace them exactly, which made the wall nearly unbuildable to besiege (every approach is already covered by higher ground) and far cheaper to build than a wall imposed on flatter land would have been. Sequenced gateways stack the same logic in miniature, forcing any attacker through a series of narrow, overlooked chokepoints long before reaching the citadel at the summit.',
    airflowNote:
      'At this altitude the air is simply cooler and steadier than in the valley, and the fort’s sequence of narrow gateways works like a series of wind funnels, channelling that hill breeze up through each checkpoint toward the palaces at the summit.',
  },
  {
    id: 'chittorgarh',
    name: 'Chittorgarh Fort',
    place: 'Chittorgarh',
    coords: { x: 52, y: 74 },
    period: '7th c. CE',
    periodBand: 'ancient',
    material: 'Sandstone',
    materialKey: 'sandstone',
    climate: 'Semi-arid',
    climateKey: 'semi-arid',
    hue: '#a86a4a',
    tagline: 'The Fort of Valour',
    intro:
      'A fortified hill-city bound up with Rajput ideals of honour and resistance — palaces, temples and victory towers spread across 700 acres.',
    dims: {
      history: 'Associated with major sieges, sacrifice and Rajput resistance.',
      architecture: 'A fortified city containing palaces, temples and towers.',
      cooling: 'Open planning and an elevated position aid ventilation.',
      water: 'Numerous reservoirs sustained a large resident population.',
      geometry: 'Urban-scale planning organises military, religious and civic spaces.',
      social: 'Embodies the Rajput ideals of honour, duty and resistance.',
    },
    sims: { cooling: 'thermalmass', airflow: 'venturi', water: 'coolsink', geometry: 'symmetry' },
    howItWorks:
      'Chittorgarh isn’t one building but an entire city compressed onto a plateau — palaces, temples and the nine-storey Vijaya Stambha all sharing one elevated, open plan. That openness is a deliberate climate strategy at urban scale: a large resident population needed constant ventilation from every side, which the plateau’s height and exposure supplied for free, while a network of reservoirs meant the same population never had to leave the walls even to drink.',
    airflowNote:
      'Because the whole city sits on an open plateau rather than in a valley, wind reaches it from every direction rather than funnelling through one channel — the temples’ repeated column bays and the fort’s wide, unenclosed courts let that cross-breeze move freely through public and religious space alike.',
  },
  {
    id: 'junagarh-fort',
    name: 'Junagarh Fort',
    place: 'Bikaner',
    coords: { x: 30, y: 32 },
    period: '1594 CE',
    periodBand: 'medieval',
    material: 'Sandstone',
    materialKey: 'sandstone',
    climate: 'Hot desert',
    climateKey: 'desert',
    hue: '#c99552',
    tagline: 'The Unconquered Desert Fort',
    intro:
      'A rare ground-level fort that was never taken — richly decorated palaces and courtyards that stay liveable in the heart of the Thar desert.',
    dims: {
      history: 'Built by the rulers of Bikaner and remained unconquered despite numerous regional conflicts.',
      architecture: 'A rare ground-level fort with richly decorated palaces, courtyards and pavilions.',
      cooling: 'Thick sandstone walls, shaded courts and compact spaces mitigate the desert heat.',
      water: 'Relied on wells, tanks and careful storage in an arid environment.',
      geometry: 'Sequential courtyards create controlled movement through the complex.',
      social: 'Reflects the wealth, diplomacy and courtly culture of a desert kingdom.',
    },
    sims: { cooling: 'thermalmass', airflow: 'chimney', water: 'rainwater', geometry: 'symmetry' },
    howItWorks:
      'Junagarh breaks the Rajasthani rule that a fort belongs on a hill — it sits at ground level in the middle of the Thar desert, and never fell despite that apparent vulnerability. What compensates for the missing height is mass and compactness: thick sandstone walls and tightly clustered, shaded courtyards keep the desert heat from ever fully reaching the richly painted rooms inside, while the fort’s diplomatic rather than purely military character shows in just how much effort went into making those interiors comfortable rather than merely defensible.',
    airflowNote:
      'Small, screened rooms like those in the Phool Mahal trap still, shaded air rather than trying to move large volumes of it, while the fort’s enclosed courtyard gardens add a second layer — greenery and standing water that cool the air by evaporation before it ever drifts into the surrounding halls.',
  },
  {
    id: 'jaisalmer-fort',
    name: 'Jaisalmer Fort',
    place: 'Jaisalmer',
    coords: { x: 22, y: 54 },
    period: '1156 CE',
    periodBand: 'medieval',
    material: 'Yellow sandstone',
    materialKey: 'sandstone',
    climate: 'Hot desert',
    climateKey: 'desert',
    hue: '#d9b25a',
    tagline: 'The Living Golden Fort',
    intro:
      'One of the few forts still inhabited — homes, temples and markets thrive inside golden sandstone walls that rise straight out of the desert.',
    dims: {
      history: 'Founded in the 12th century as a major centre on the desert trade routes.',
      architecture: 'A living fort where homes, temples and markets exist within the defensive walls.',
      cooling: 'A dense urban fabric, narrow lanes and sandstone construction reduce heat exposure.',
      water: 'Rainwater storage and traditional desert conservation techniques supported residents.',
      geometry: 'Streets evolved organically around the topography and defensive needs.',
      social: 'Demonstrates how commerce, religion and daily life coexisted within a fort.',
    },
    sims: { cooling: 'thermalmass', airflow: 'chimney', water: 'rainwater', geometry: 'symmetry' },
    howItWorks:
      'Jaisalmer is one of the only forts in India still fully alive — people live, trade and worship inside its walls today exactly as they did eight centuries ago. That endurance comes from a dense, almost accidental piece of climate engineering: buildings packed close along narrow lanes shade each other and the street between them almost all day, so the settlement effectively air-conditions itself through sheer density, something no single building could achieve alone.',
    airflowNote:
      'Those same narrow, shaded lanes act as wind channels — funnelling and accelerating whatever breeze reaches the plateau — while jharokha balconies projecting over the streets catch that moving air at first-floor height and shade the sandstone wall behind them at the same time.',
  },
  {
    id: 'patwon-ki-haveli',
    name: 'Patwon Ki Haveli',
    place: 'Jaisalmer',
    coords: { x: 24, y: 56 },
    period: '1805 CE',
    periodBand: 'early-modern',
    material: 'Yellow sandstone',
    materialKey: 'sandstone',
    climate: 'Hot desert',
    climateKey: 'desert',
    hue: '#d9b25a',
    tagline: 'A Mansion Carved from Honey-Stone',
    intro:
      'A cluster of five havelis whose golden sandstone façades are carved as finely as lace — and which stay liveable in fierce heat through pure passive design.',
    dims: {
      history: 'Built by wealthy traders during Jaisalmer’s commercial peak.',
      architecture: 'Famous for intricate stone carving and elaborate façades.',
      cooling:
        'Massive load-bearing sandstone walls carry high thermal mass, delaying the desert’s heat so that the day’s peak warmth only arrives inside well after sunset.',
      water: 'Limited water infrastructure beyond household storage in a tanka (cistern).',
      geometry: 'A highly ordered façade design showcases symmetry and craftsmanship.',
      social: 'Expresses merchant wealth, status and family life through architecture.',
    },
    sims: { cooling: 'thermalmass', airflow: 'chimney', water: 'rainwater', geometry: 'symmetry' },
    howItWorks:
      'Five linked mansions share one design logic: let the façade do the filtering and let the courtyard do the moving. Soft yellow sandstone is easy to carve when freshly quarried and only hardens with age, which is why the openings here are cut as finely as lace rather than left as plain windows — every one of them breaks direct sun into a soft, diffuse light before it reaches a room.',
    airflowNote:
      'Every opening is cut as a jaali screen that speeds and cools the air passing through it, while the central aangan courtyard behaves like a chimney — hot air continuously rises out through its open roof, pulling cooler air in through the rooms around it.',
    walkthrough: [
      {
        term: 'Jaali',
        meaning: 'Intricately carved stone lattice over every opening.',
        science: 'Filters fierce desert sun to soft light and cools incoming air.',
      },
      {
        term: 'Aangan',
        meaning: 'Central open-to-sky courtyard.',
        science: 'Acts as a thermal chimney — hot air rises out, drawing cool air through rooms.',
      },
      {
        term: 'Thick walls',
        meaning: 'Massive load-bearing sandstone walls.',
        science: 'High thermal mass delays heat, so peak warmth arrives only after sunset.',
      },
    ],
  },
  {
    id: 'nathmal-ki-haveli',
    name: 'Nathmal Ki Haveli',
    place: 'Jaisalmer',
    coords: { x: 20, y: 57 },
    period: '1885 CE',
    periodBand: 'early-modern',
    material: 'Yellow sandstone',
    materialKey: 'sandstone',
    climate: 'Hot desert',
    climateKey: 'desert',
    hue: '#d7a94f',
    tagline: 'The Twin-Carved Haveli',
    intro:
      'Carved by two brothers working on opposite wings, its façade is famously almost — but not quite — symmetrical.',
    dims: {
      history: 'Commissioned by an influential state official in Jaisalmer.',
      architecture: 'Known for its remarkably detailed carvings and blended stylistic influences.',
      cooling:
        'Deep-set window reveals and an internal courtyard keep direct sun off the interior walls, holding the rooms several degrees below the street outside.',
      water: 'Primarily domestic-scale water management.',
      geometry: 'Notable for its balanced composition and decorative symmetry.',
      social: 'Reflects the aspirations of elite administrative families.',
    },
    sims: { cooling: 'thermalmass', airflow: 'chimney', water: 'rainwater', geometry: 'symmetry' },
    howItWorks:
      'Two brothers carved this haveli’s two wings independently, working from opposite ends toward the middle without comparing notes as they went — which is why the façade is famous for being almost, but not quite, a mirror image of itself. That near-symmetry doesn’t undermine the building’s climate logic: whichever wing you’re in, the same combination of jaali screens and an internal courtyard is doing the same job of filtering light and pulling air through the rooms.',
    airflowNote:
      'Carved jali screens across every opening speed the incoming breeze exactly as they do at Patwon-ki-Haveli next door, while the internal courtyard draws that air onward through the building by convection.',
  },
  {
    id: 'city-palace-udaipur',
    name: 'City Palace, Udaipur',
    place: 'Udaipur',
    coords: { x: 42, y: 80 },
    period: '1559 CE',
    periodBand: 'medieval',
    material: 'Granite & marble',
    materialKey: 'marble',
    climate: 'Semi-arid',
    climateKey: 'semi-arid',
    hue: '#b58a5e',
    tagline: 'The Palace on Lake Pichola',
    intro:
      'A palace grown over four centuries along the shore of Lake Pichola — balconies, courtyards and terraces layered into one interconnected whole.',
    dims: {
      history: 'Expanded over centuries by successive rulers of Mewar.',
      architecture: 'A layered complex combining balconies, courtyards, towers and terraces.',
      cooling:
        'Height and thick masonry keep the palace’s interior several degrees cooler than the lakeside promenade below, holding off the day’s heat far longer than a single-storey building could.',
      water: 'Integrated with traditional palace water supply systems and the lake.',
      geometry: 'Incremental growth created a sophisticated network of interconnected spaces.',
      social: 'Represents royal ceremony, governance and Mewar identity.',
    },
    sims: { cooling: 'evaporative', airflow: 'chimney', water: 'rainwater', geometry: 'symmetry' },
    howItWorks:
      'Grown over four centuries rather than built to one plan, the City Palace reads as a single composition only because each ruler who added to it kept the same logic: face the lake, stack courtyards, let height and water do the cooling. The result is architecture as a running conversation across generations, where a balcony added in one century still lines up with a courtyard from another because both were solving the same problem the same way.',
    airflowNote:
      'The palace’s long façade faces Lake Pichola directly, and the Badi Mahal’s rooftop garden court pulls that cool, lake-crossed air up and deep into the building’s interior — an internal courtyard doing at rooftop level what it usually does at ground level.',
  },
  {
    id: 'sajjangarh',
    name: 'Sajjangarh Palace',
    place: 'Udaipur',
    coords: { x: 40, y: 82 },
    period: '1884 CE',
    periodBand: 'early-modern',
    material: 'White marble',
    materialKey: 'marble',
    climate: 'Semi-arid',
    climateKey: 'semi-arid',
    hue: '#bfa06a',
    tagline: 'The Monsoon Palace',
    intro:
      'A hilltop retreat built to watch the monsoon clouds roll in over Udaipur — architecture designed around views, wind and the seasons.',
    dims: {
      history: 'Built as a royal retreat and observation point overlooking the region.',
      architecture: 'A hilltop palace emphasising views and a strategic location.',
      cooling: 'Its high elevation captures cooler winds and seasonal weather patterns.',
      water: 'Limited water systems, given its observational role.',
      geometry: 'Positioned to maximise visibility across the surrounding terrain.',
      social: 'Illustrates royal engagement with landscape and seasonal cycles.',
    },
    sims: { cooling: 'thermalmass', airflow: 'venturi', water: 'rainwater', geometry: 'symmetry' },
    excludeLenses: ['water'],
    howItWorks:
      'Sajjangarh was built to watch weather, not to shelter from it — a hilltop retreat whose entire plan is oriented so every principal room commands a long view over the plains, waiting for the first monsoon clouds to appear on the horizon. That same siting solves comfort almost as a side effect: the highest, most exposed point around Udaipur is also the coolest and breeziest, so the palace stays comfortable for the very reason it’s a good place to watch a storm roll in.',
    airflowNote:
      'Sitting on the highest point for miles, the palace catches wind that never reaches the city below at all — every principal room is oriented to take advantage of it, turning the same exposure built for watching storms into a constant natural draught.',
  },
  {
    id: 'garh-palace-bundi',
    name: 'Garh Palace',
    place: 'Bundi',
    coords: { x: 58, y: 66 },
    period: '1607 CE',
    periodBand: 'early-modern',
    material: 'Sandstone',
    materialKey: 'sandstone',
    climate: 'Semi-arid',
    climateKey: 'semi-arid',
    hue: '#b07a4a',
    tagline: 'The Painted Palace of Bundi',
    intro:
      'A palace built dramatically into a hillside, celebrated for its Bundi-school murals and the way it steps down the slope.',
    dims: {
      history: 'Developed by Bundi’s rulers as the political centre of the kingdom.',
      architecture: 'Built dramatically into a hillside with interconnected palaces and murals.',
      cooling: 'Terraces, courtyards and thick walls moderate the temperature.',
      water: 'Supported by nearby traditional water structures and storage systems.',
      geometry: 'Architecture follows the slope while maintaining hierarchical organisation.',
      social: 'Reveals court life, patronage of art and social hierarchy.',
    },
    sims: { cooling: 'thermalmass', airflow: 'chimney', water: 'rainwater', geometry: 'symmetry' },
    howItWorks:
      'Rather than levelling the hillside to build on flat ground, Bundi’s rulers let Garh Palace cascade down the slope in terraces — a decision that saved enormous earthwork and gave every level its own courtyard and its own view. The Bundi-school murals in the Chitrashala survive precisely because of this terracing: their courtyard sits deep enough into the hill to be shaded by the level above it, protecting centuries-old pigment from direct sun.',
    airflowNote:
      'Each terrace opens onto its own courtyard, so the palace ventilates itself level by level rather than relying on one central shaft — the shaded Chitrashala arcade in particular channels air across its painted walls without ever exposing them to direct sun.',
  },
  {
    id: 'ranthambore-fort',
    name: 'Ranthambore Fort',
    place: 'Sawai Madhopur',
    coords: { x: 62, y: 61 },
    period: '10th c. CE',
    periodBand: 'ancient',
    material: 'Sandstone',
    materialKey: 'sandstone',
    climate: 'Semi-arid',
    climateKey: 'semi-arid',
    hue: '#a97a4c',
    tagline: 'The Fort in the Wild',
    intro:
      'A rugged hill fort set within a tiger reserve — defence over ornament, shaped entirely by the contours of its hill.',
    dims: {
      history: 'Controlled an important strategic region and witnessed repeated struggles for power.',
      architecture: 'A rugged hill fort emphasising defence over ornamentation.',
      cooling: 'Its elevated terrain benefits from airflow and natural cooling.',
      water: 'Reservoirs and storage systems sustained the fort during conflict.',
      geometry: 'Planning is shaped by the contours of the hill and defensive needs.',
      social: 'Combined military, religious and administrative functions within one complex.',
    },
    sims: { cooling: 'thermalmass', airflow: 'venturi', water: 'rainwater', geometry: 'symmetry' },
    howItWorks:
      'Ranthambore is defence stripped of ornament — a fort whose plan is dictated entirely by the contours of an isolated hill deep inside what is now a tiger reserve. The Battees Khamba hall shows the same restraint turned to structure: thirty-two plain pillars in a repeating grid span a large covered space using nothing but a simple, honest structural rhythm, no ornamental flourish required.',
    airflowNote:
      'The fort’s exposed, elevated position keeps air moving across it constantly, and the open-sided Battees Khamba hall is built to take advantage — its grid of thirty-two pillars supports the roof while leaving every side free for cross-ventilation.',
  },
  {
    id: 'bala-quila',
    name: 'Bala Quila',
    place: 'Alwar',
    coords: { x: 68, y: 38 },
    period: '1550 CE',
    periodBand: 'medieval',
    material: 'Sandstone & quartzite',
    materialKey: 'sandstone',
    climate: 'Semi-arid',
    climateKey: 'semi-arid',
    hue: '#a8764e',
    tagline: 'The Ridge Fortress of Alwar',
    intro:
      'Long fortifications stretched along a ridge above Alwar, built for surveillance and territorial control.',
    dims: {
      history: 'Served as a strategic stronghold for the rulers of the Alwar region.',
      architecture: 'Long fortifications stretch across a ridge with commanding views.',
      cooling: 'Hilltop exposure improves ventilation and reduces heat buildup.',
      water: 'Traditional reservoirs and storage structures supported occupation.',
      geometry: 'Defensive walls follow the natural terrain to maximise protection.',
      social: 'Reflects the importance of surveillance and territorial control.',
    },
    sims: { cooling: 'thermalmass', airflow: 'venturi', water: 'rainwater', geometry: 'symmetry' },
    howItWorks:
      'Bala Quila’s walls do one job — watch the land below — and the architecture is shaped entirely around doing that job well. Long fortifications simply follow the ridge crest rather than any formal plan, because the ridge already provides everything a defender needs: unbroken sightlines down every approach and enough elevation that no attacker arrives unseen.',
    airflowNote:
      'The same ridge-top exposure that gives Bala Quila its sightlines also keeps it constantly ventilated — ridge winds sweep the fortifications almost without interruption, since nothing on the surrounding terrain sits high enough to block them.',
  },
  {
    id: 'ajmer-fort',
    name: 'Ajmer Fort',
    place: 'Ajmer',
    coords: { x: 52, y: 52 },
    period: '1570 CE',
    periodBand: 'medieval',
    material: 'Sandstone',
    materialKey: 'sandstone',
    climate: 'Semi-arid',
    climateKey: 'semi-arid',
    hue: '#b57a4c',
    tagline: 'The Political Crossroads',
    intro:
      'A compact fort that combined military and administrative roles at a meeting point of Rajput and Mughal power.',
    dims: {
      history: 'Played a key role during periods of Rajput and Mughal rule.',
      architecture: 'A compact fort combining military and administrative functions.',
      cooling: 'Thick walls provided thermal insulation in a hot climate.',
      water: 'Relied on regional water storage and supply systems.',
      geometry: 'Organised around practical defensive and governing requirements.',
      social: 'Represents Ajmer’s role as a political crossroads.',
    },
    sims: { cooling: 'thermalmass', airflow: 'venturi', water: 'rainwater', geometry: 'symmetry' },
    howItWorks:
      'Ajmer Fort was built to do two jobs at once — garrison and government office — at a location where Rajput and Mughal power directly overlapped. Its compactness reflects that dual role: there was no room in the plan for the ornamental flourishes of a purely ceremonial palace, because every space had to earn its place as either defensible or administratively useful.',
    airflowNote:
      'The audience hall and surrounding chambers are arranged around a working courtyard rather than a ceremonial one, but it does the same job any Rajasthani courtyard does — pulling air through the rooms that face onto it.',
  },
  {
    id: 'adhai-din-ka-jhonpra',
    name: 'Adhai Din Ka Jhonpra',
    place: 'Ajmer',
    coords: { x: 50, y: 53 },
    period: '1199 CE',
    periodBand: 'medieval',
    material: 'Stone & lime',
    materialKey: 'lime',
    climate: 'Semi-arid',
    climateKey: 'semi-arid',
    hue: '#a98a5c',
    tagline: 'The Two-and-a-Half-Day Mosque',
    intro:
      'One of the earliest Indo-Islamic monuments in North India — a mosque assembled from the reused elements of earlier temples.',
    dims: {
      history: 'One of the earliest Indo-Islamic monuments in North India.',
      architecture: 'Reused and adapted earlier structural elements into a new architectural form.',
      cooling: 'Arcades and shaded spaces reduce solar exposure.',
      water: 'Water was primarily used for ritual and religious purposes.',
      geometry: 'Repetitive arches, columns and courtyards create a strong geometric order.',
      social: 'Symbolises cultural interaction, adaptation and religious transformation.',
    },
    sims: { cooling: 'thermalmass', airflow: 'venturi', water: 'rainwater', geometry: 'symmetry' },
    excludeLenses: ['water'],
    howItWorks:
      'Adhai Din Ka Jhonpra is literally built from recycled architecture — its arcades are earlier Hindu and Jain temple pillars, salvaged and re-erected to carry a new Indo-Islamic screen wall of seven pointed arches. That screen does structural and symbolic work simultaneously: the repeated arch carries the roof’s load efficiently while also announcing, in stone, that this building belongs to a different tradition than the columns holding it up.',
    airflowNote:
      'The colonnade of salvaged temple pillars creates a naturally shaded, breeze-through corridor behind the seven-arched screen wall, so the same recycled structure that carries the roof also keeps the prayer hall ventilated.',
  },
  {
    id: 'chand-baori',
    name: 'Chand Baori',
    place: 'Abhaneri',
    coords: { x: 66, y: 52 },
    period: 'c. 800 CE',
    periodBand: 'ancient',
    material: 'Sandstone',
    materialKey: 'sandstone',
    climate: 'Arid',
    climateKey: 'arid',
    hue: '#8a9a6b',
    tagline: 'The Inverted Pyramid of Water',
    intro:
      'One of the deepest stepwells in India: 3,500 steps descending 13 storeys — a piece of climate engineering that stores monsoon water and stays cool year-round.',
    dims: {
      history: 'One of the oldest and deepest stepwells in India, built around the 8th–9th century.',
      architecture: '3,500 narrow steps descend thirteen storeys in a precise double-flight geometry.',
      cooling: 'The base stays 5–6 °C cooler than the surface — the surrounding earth acts as a natural refrigerator.',
      water: 'As the catchment’s lowest point, it stores monsoon water through the long dry season.',
      geometry: 'A near-perfect square plan with mirror-symmetric staircases forms an almost fractal pattern.',
      social: 'A shared civic and social space at the heart of village life.',
    },
    sims: { cooling: 'thermalmass', airflow: 'venturi', water: 'coolsink', geometry: 'symmetry' },
    howItWorks:
      'Chand Baori solves a problem that has nothing to do with buildings and everything to do with geology: in the Thar’s long dry season, the water table drops far below what a simple well can reach conveniently. The stepwell’s answer is to dig an inverted pyramid instead of a shaft — 3,500 steps in mirror-image flights that reach water at any level the table happens to be at, while the sheer mass of surrounding earth keeps the base 5–6 °C cooler than the surface, a refrigerator built from nothing but excavated stone.',
    airflowNote:
      'The stepped galleries self-shade almost the entire shaft through the day, and because cool air sinks, that shade keeps a genuine downdraught of cooler air pooling at the base alongside the stored water — the geometry does the cooling as much as the depth does.',
    walkthrough: [
      {
        term: 'Baori',
        meaning: 'Stepwell — a well reached by descending stairs.',
        science: 'Keeps water accessible as the water table rises and falls across seasons.',
      },
      {
        term: 'Step geometry',
        meaning: 'Double flights of steps in a precise zig-zag.',
        science: 'Maximises usable edge length so many people can draw water at once.',
      },
      {
        term: 'Thermal mass',
        meaning: 'Deep stone walls surrounding the shaft.',
        science: 'The ground stays 5–6 °C cooler than the surface — a natural refrigerator.',
      },
    ],
  },
]

export const byId = (id: string) => MONUMENTS.find((m) => m.id === id)

// ---- Architecture illustrations ----

export type Archetype =
  | 'observatory'
  | 'palace-hill'
  | 'fort'
  | 'screen'
  | 'palace'
  | 'haveli'
  | 'stepwell'
  | 'mosque'

export const ARCHETYPE: Record<string, Archetype> = {
  'jantar-mantar': 'observatory',
  'amber-fort': 'palace-hill',
  'jaigarh-fort': 'fort',
  'hawa-mahal': 'screen',
  'city-palace-jaipur': 'palace',
  mehrangarh: 'palace-hill',
  'umaid-bhawan': 'palace',
  kumbhalgarh: 'fort',
  chittorgarh: 'fort',
  'junagarh-fort': 'palace',
  'jaisalmer-fort': 'fort',
  'patwon-ki-haveli': 'haveli',
  'nathmal-ki-haveli': 'haveli',
  'city-palace-udaipur': 'palace-hill',
  sajjangarh: 'palace-hill',
  'garh-palace-bundi': 'palace-hill',
  'ranthambore-fort': 'fort',
  'bala-quila': 'fort',
  'ajmer-fort': 'fort',
  'adhai-din-ka-jhonpra': 'mosque',
  'chand-baori': 'stepwell',
}

/** Fallback annotated features when a monument has no bespoke walkthrough. */
export const ARCHETYPE_FEATURES: Record<Archetype, WalkElement[]> = {
  fort: [
    { term: 'Ramparts & bastions', meaning: 'Massive battered (sloping) walls with rounded towers.', science: 'Thick stone stores night coolness and deflects cannon fire; the slope adds stability.' },
    { term: 'Hilltop siting', meaning: 'The fort is built directly on rock.', science: 'Elevation commands the terrain and gives a cool, stable foundation.' },
    { term: 'Rainwater tanks', meaning: 'Rock-cut reservoirs across the complex.', science: 'Harvest the monsoon so the garrison stays self-sufficient through long sieges.' },
  ],
  palace: [
    { term: 'Symmetry & axes', meaning: 'Wings mirror a central axis.', science: 'Ordered geometry frames ceremony and organises movement from public to private.' },
    { term: 'Shaded arcades', meaning: 'Deep verandahs and colonnades.', science: 'Keep direct sun off the walls, cutting heat gain into the rooms.' },
    { term: 'Courtyards', meaning: 'Open courts within the plan.', science: 'Ventilate the interior, gather daylight, and host social and court life.' },
  ],
  'palace-hill': [
    { term: 'Layered courtyards', meaning: 'Courts stepping up the hillside.', science: 'Each court ventilates the rooms around it and steps the plan into the slope.' },
    { term: 'Jharokhas & chhatris', meaning: 'Carved balconies and domed pavilions.', science: 'Shade the walls and catch the breeze while framing the view.' },
    { term: 'Water channels', meaning: 'Reservoirs and gravity-fed channels.', science: 'Cool the air by evaporation and supply the complex without pumps.' },
  ],
  haveli: [
    { term: 'Jaali screens', meaning: 'Perforated carved-stone lattice.', science: 'Filters glare to soft light and accelerates cooling air (Venturi effect).' },
    { term: 'Jharokha balconies', meaning: 'Overhanging carved windows.', science: 'Shade the façade and project the viewer into moving air.' },
    { term: 'Aangan (courtyard)', meaning: 'Central open-to-sky court.', science: 'Acts as a chimney — hot air rises out, pulling cool air through the rooms.' },
  ],
  mosque: [
    { term: 'Arcade of arches', meaning: 'Rows of repeated pointed arches.', science: 'Carry the roof efficiently and shade a cool colonnade.' },
    { term: 'Domes', meaning: 'Masonry domes over the bays.', science: 'Lift hot air upward and span space without heavy internal supports.' },
    { term: 'Sahn (courtyard)', meaning: 'The open forecourt.', science: 'Ventilates the prayer hall and gathers the congregation.' },
  ],
  observatory: [
    { term: 'Samrat Yantra', meaning: 'The great triangular sundial.', science: 'Its edge is aligned to Earth’s axis; the shadow marks time to seconds.' },
    { term: 'Curved scales', meaning: 'Quadrant arcs beside the gnomon.', science: 'Calibrated in stone so a sweeping shadow reads the hour directly.' },
    { term: 'Cardinal alignment', meaning: 'Instruments set to the compass and latitude.', science: 'Turns geometry and the Sun’s path into a precise measuring machine.' },
  ],
  screen: [
    { term: 'Honeycomb façade', meaning: 'Hundreds of small latticed windows.', science: 'Maximise surface area for cross-ventilation across the whole elevation.' },
    { term: 'Jaali lattice', meaning: 'Perforated stone in every opening.', science: 'Speeds incoming air (Venturi) and diffuses harsh light to a soft glow.' },
    { term: 'Tapering crown', meaning: 'The façade steps inward as it rises.', science: 'A pyramidal profile that stays stable and self-shades the upper storeys.' },
  ],
  stepwell: [
    { term: 'Descending steps', meaning: 'Thousands of steps in mirror flights.', science: 'Reach water at any level and self-shade the shaft through the day.' },
    { term: 'Stored water', meaning: 'A reservoir at the base.', science: 'The catchment’s lowest point holds monsoon water through the dry season.' },
    { term: 'Deep thermal mass', meaning: 'Earth walls around the shaft.', science: 'The base stays 5–6 °C cooler than the surface — a natural refrigerator.' },
  ],
}

export const featuresFor = (m: Monument): WalkElement[] =>
  m.walkthrough ?? ARCHETYPE_FEATURES[ARCHETYPE[m.id] ?? 'palace']

// ---- Real photographs (Wikimedia Commons) + science captions ----

export interface MonImage {
  file: string
  /** Short label of the architectural feature shown. */
  title: string
  /** A fuller explanation of the architecture and the science behind it. */
  science: string
}

/** Build a stable Wikimedia Commons image URL that resolves without the hashed path. */
export const commonsUrl = (file: string, width = 1100) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`

/** A paragraph explaining what the "Anatomy of the design" diagram shows for each archetype. */
export const ARCHETYPE_INTRO: Record<Archetype, string> = {
  observatory:
    'The diagram strips the observatory back to its essential instrument — a triangular gnomon beside a curved measuring scale. There is no roof and no wall to cool; the “architecture” exists only to cast and catch a shadow. Every edge is a line of trigonometry set to the latitude and the celestial equator, so the structure itself performs the calculation.',
  'palace-hill':
    'The diagram shows how a hill palace really works: not one big block but a stack of courtyards and pavilions stepping up the slope. Each open court is a lung and a light-well for the rooms around it, while carved balconies (jharokhas) and domed pavilions (chhatris) shade the walls and catch the breeze. Water channels thread through, cooling the air by evaporation as they go.',
  fort:
    'The diagram reduces the fort to its defensive logic. Massive battered (sloping) walls and rounded bastions sit on high rock: the slope sheds attackers and cannon-fire, the height commands the land, and the sheer mass of stone works as a thermal battery — soaking up the day’s heat and releasing it slowly at night. Rock-cut tanks harvest the monsoon so the garrison never runs dry.',
  screen:
    'The diagram shows the Hawa Mahal for what it is — not a building but a habitable wall. The façade tapers as it rises into a stable pyramid, and its surface is almost entirely holes: hundreds of latticed windows that turn the whole elevation into a ventilation machine, speeding and cooling the air that passes through.',
  palace:
    'The diagram lays out the palace’s ordering idea: a strong central mass on an axis, with wings mirrored to either side and a shaded arcade of arches along the front. The symmetry choreographs ceremony and movement, while the deep arcade and interior courtyards keep the sun off the walls and draw air through the plan.',
  haveli:
    'The diagram shows the two halves of a haveli’s design. Outside, a carved sandstone façade of jaali screens and projecting jharokha balconies shades the wall and filters the sun. Inside sits the aangan — a central courtyard open to the sky that works like a chimney, letting hot air rise out and pulling cool air through the rooms.',
  stepwell:
    'The diagram turns the stepwell inside-out: it is an inverted pyramid dug into the earth. Thousands of steps in mirror-image flights reach the water at any level, self-shade the shaft through the day, and put the coolest, most humid air — and the stored monsoon water — at the very bottom.',
  mosque:
    'The diagram shows the mosque’s simple, powerful order: a screen of repeated pointed arches leading into a colonnade, with domes over the bays and an open courtyard in front. The arch does double duty as structure and ornament, while the domes lift hot air and the courtyard ventilates the prayer hall.',
}

export const MONUMENT_IMAGES: Record<string, MonImage[]> = {
  'jantar-mantar': [
    { file: 'Jaipur, Jantar Mantar, Brihat Samrat Yantra (9713595658).jpg', title: 'Brihat Samrat Yantra — the giant sundial', science: 'A 27 m right-angled triangle whose sloping edge is set exactly parallel to Earth’s axis. As the Sun crosses the sky, the gnomon’s shadow sweeps the curved marble quadrants below — reading local time to about two seconds. Pure geometry doing the work of a clock.' },
    { file: 'Jantar Mantar at Jaipur.jpg', title: 'Instruments as architecture', science: 'Each structure is a trigonometric idea built at monumental scale and aligned to the cardinal directions. Together the plaza works as a naked-eye computer for the sky — the building is the instrument.' },
    { file: 'Laghu samrat yantra.JPG', title: 'Laghu Samrat Yantra', science: 'A smaller sundial whose inclined ramp points straight at the celestial pole. The ramp’s angle equals Jaipur’s latitude (about 27°), so the shadow falling across the graduated scale gives the time directly.' },
    { file: 'Kapali Yantra.jpg', title: 'Hemispherical bowl dials', science: 'Concave marble bowls mirror the dome of the sky. Cross-wires cast a shadow-point down into the bowl, and where that point lands on the engraved grid gives a star’s position — an inverted map of the heavens carved in stone.' },
  ],
  'amber-fort': [
    { file: '20191219 Fort Amber, Amer, Jaipur 0955 9481.jpg', title: 'Layered hillside courtyards', science: 'The palace climbs the ridge as a stack of courtyards rather than one block. Each open court ventilates the rooms wrapped around it and steps the plan into the cooler air of the hillside.' },
    { file: 'Amber Fort - Sheesh Mahal Interior.jpg', title: 'Sheesh Mahal — the mirror hall', science: 'Walls and ceiling are inlaid with thousands of tiny convex mirrors. A single candle is multiplied into a whole field of light, so the hall could be lit at night without the heat of many burning lamps.' },
    { file: 'Courtyard of Amer Fort, India.jpg', title: 'Breeze-catching courts', science: 'Openings are placed to pull the lake breeze across the courtyards and through the halls, while deep verandahs keep the direct sun off the walls — the logic behind the water-cooled Sukh Niwas.' },
    { file: 'Amer Fort - Ganesh Pol (2022) - img 01.jpg', title: 'Ganesh Pol gateway', science: 'A richly carved gate crowned with latticed jharokhas. The screens let royal women watch processions unseen while shading the sandstone behind them from the sun.' },
  ],
  'jaigarh-fort': [
    { file: 'Jaipur 03-2016 01 Jaigarh Fort.jpg', title: 'Ridge-hugging ramparts', science: 'Thick, battered (sloping) walls follow the hilltop. The mass of stone absorbs the day’s heat slowly and gives it back at night, steadying the temperature inside through big desert swings.' },
    { file: 'Rajasthan-Jaipur-Jaigarh-Fort-water-supply-Apr-2004-01.JPG', title: 'Siege-proof water system', science: 'Channels funnel monsoon runoff from the surrounding hills into huge covered tanks. Stored underground away from evaporation, it could keep a garrison alive through months of siege.' },
    { file: 'Jaigarh Fort - Char bagh 2.jpg', title: 'Char-bagh garden', science: 'A four-part garden brings the geometry of paradise inside the walls — and its water channels cool the surrounding air by evaporation.' },
  ],
  'hawa-mahal': [
    { file: 'East facade Hawa Mahal Jaipur from ground level (July 2022) - img 01.jpg', title: 'The honeycomb façade', science: '953 small windows across a thin five-storey screen give a vast surface for air to enter. Cross-ventilation runs almost constantly — which is exactly why it is called the Palace of Winds.' },
    { file: 'Inside hawa mahal looking east towards the famous facade.jpg', title: 'Soft, glare-free light', science: 'Seen from within, the stone jaali breaks the fierce sun into thousands of small beams, filling the rooms with a soft, even daylight instead of harsh glare and heat.' },
    { file: 'Hawa-mahal-from-window.JPG', title: 'The jaali window — the Venturi effect', science: 'Air forced through the lattice’s tiny holes speeds up as it squeezes through, just like air through a nozzle. So even a gentle breeze outside arrives indoors as a distinct cooling draught.' },
    { file: 'Top 2 Stories of Hawa Mahal Jaipur.jpg', title: 'A self-shading pyramid', science: 'The façade steps inward as it rises. The tapered profile keeps a tall, thin screen structurally stable and lets each storey shade the one below.' },
  ],
  'city-palace-jaipur': [
    { file: 'Jaipur 03-2016 23 City Palace complex.jpg', title: 'Planned on ceremonial axes', science: 'The palace is laid out along strict axes, moving visitors through a sequence of courts from public to private — an order that also choreographs royal ceremony.' },
    { file: 'Chandra Mahal, City Palace, Jaipur, 20191218 0951 9043.jpg', title: 'Chandra Mahal’s shaded storeys', science: 'Seven storeys of deep balconies and carved screens keep the sun off the walls, so the tall palace stays cool from top to bottom.' },
    { file: 'SabhaNiwas.jpg', title: 'Sabha Niwas — the audience hall', science: 'A colonnaded, open-sided hall: the rows of columns carry the roof while leaving the sides open for breeze and daylight during court.' },
  ],
  mehrangarh: [
    { file: 'Jodhpur mehrangarh fort (enhanced).jpg', title: 'Built on living rock', science: 'The fort rises 120 m on a sheer basalt cliff. The rock is both an unbreachable foundation and a cool thermal anchor for the palaces perched above it.' },
    { file: 'Jodhpur, India, Mehrangarh Fort, Palace 2.jpg', title: 'Jharokha-screened façades', science: 'Carved balconies and lattices wrap the palace walls, shading the sandstone and funnelling the stronger, cleaner breeze found at height into the chambers.' },
    { file: 'Jodhpur, India, Gates of Mehrangarh Fort.jpg', title: 'Battered gates and walls', science: 'Enormously thick, sloping sandstone walls resist attack and act as a heat store, so interiors lag hours behind the desert’s midday peak.' },
  ],
  'umaid-bhawan': [
    { file: 'Umaid bhavan Palace, Jodhpur.jpg', title: 'A ventilated central dome', science: 'Beneath the great dome, tall interior volumes let hot air rise and escape upward, drawing cooler air in below — passive comfort achieved at palace scale.' },
    { file: 'Umaid Bhawan Palace-Museum.JPG', title: 'Symmetry around one axis', science: 'Wings mirror a central spine in classic 20th-century palace planning — balanced geometry that also keeps circulation simple and legible.' },
  ],
  kumbhalgarh: [
    { file: 'Aerial view of Kumbhalgarh.jpg', title: 'Walls that follow the mountain', science: '36 km of ramparts trace the ridgelines. Letting the terrain set the geometry made the wall almost impossible to storm — and far cheaper to build and defend.' },
    { file: 'Kumbhalgarh fort.JPG', title: 'The cool of the heights', science: 'At altitude the air is cooler and breezier; combined with massive stone walls, the stronghold stays comfortable without any machinery.' },
    { file: 'Gate of kumbhalgarh fort.jpg', title: 'Sequenced gateways', science: 'A series of fortified gates forces attackers through narrow, overlooked chokepoints long before they can reach the citadel.' },
  ],
  chittorgarh: [
    { file: 'Chittorgarh fort.JPG', title: 'A city on a plateau', science: 'The fort is a whole town on a high mesa. Its open, elevated layout catches wind from every side, ventilating a large resident population.' },
    { file: 'Victory+Tower+Chittorgarh.jpg', title: 'Vijaya Stambha (Victory Tower)', science: 'A nine-storey tower built on careful proportion and repeated storeys — geometry raised as a public statement of triumph and visible for miles.' },
    { file: 'Jain temple inside Chittorgarh Fort.jpg', title: 'Temples of repeating bays', science: 'Within the walls, temples repeat a symmetrical column-and-bay module — a structural rhythm that is also visually ordered.' },
  ],
  'junagarh-fort': [
    { file: 'India Bikaner Junagarh Fort.jpg', title: 'A fort on flat ground', science: 'Unusually, Bikaner’s fort sits at ground level rather than on a hill. It relies on thick sandstone walls and compact, shaded courts to keep the Thar heat out.' },
    { file: 'Jhoola inside the Phool Mahal, Junagarh Fort, Bikaner.jpg', title: 'Phool Mahal interior', science: 'Small, screened rooms trap shade and still, cool air, and are richly painted to display the wealth of a desert trading court.' },
    { file: 'Gardens Junagarh Fort 2007.jpg', title: 'Cooling courtyard gardens', science: 'Enclosed gardens bring greenery and evaporative cooling into the heart of the plan, tempering the rooms that surround them.' },
  ],
  'jaisalmer-fort': [
    { file: 'Jaisalmer Fort.jpg', title: 'The golden living fort', science: 'Bastions of yellow sandstone rise straight from the desert. It is one of the few forts still lived in, and its dense fabric of buildings shades its own narrow lanes.' },
    { file: 'Corridor of Jain temple - Jaisalmer Fort.jpg', title: 'Shaded stone corridors', science: 'Narrow, thick-walled passages stay cool and dim, sheltering people and the fort’s Jain temples from the desert sun.' },
    { file: 'DSC 2758b Jharokha Jaisalmer Fort.jpg', title: 'Jharokha over the lane', science: 'Projecting carved balconies shade the wall and the street below while catching any breeze funnelled through the tight lanes.' },
  ],
  'patwon-ki-haveli': [
    { file: 'Patwaon Ki Haveli.JPG', title: 'A façade of carved sandstone', science: 'Five linked mansions present a wall of lace-like carving. Soft yellow sandstone is easy to carve when quarried, then hardens in the dry desert air.' },
    { file: 'Patwon ki haveli 6.JPG', title: 'Sun-filtering jaali balconies', science: 'Every opening is a perforated screen: it cuts the glare to a soft light, gives privacy, and speeds the breeze into the rooms behind.' },
  ],
  'nathmal-ki-haveli': [
    { file: 'Nathmal Haweli with signature seals of architects.jpg', title: 'The near-symmetrical twin façade', science: 'Two brothers carved one wing each, so the front is almost — but not exactly — mirror-symmetric. The jaali and jharokhas still shade and ventilate the rooms behind.' },
  ],
  'city-palace-udaipur': [
    { file: 'Udaipur City Palace.jpg', title: 'A palace along the lake', science: 'The long façade faces Lake Pichola; its height and lakeside courts pull cool air off the water and through the rooms.' },
    { file: 'The Badi Mahal, City Palace, Udaipur.jpg', title: 'Badi Mahal — a rooftop garden court', science: 'A garden courtyard sits high on the building, bringing trees, shade and moving air deep into the palace interior.' },
    { file: 'Udaipur palace night.jpg', title: 'Four centuries in one complex', science: 'Successive rulers added courts and towers over 400 years, growing an interconnected maze that still reads as a single composition.' },
  ],
  sajjangarh: [
    { file: 'Monsoon Palace.jpg', title: 'A palace to watch the rain', science: 'Perched on a hilltop, it was built to observe the monsoon sweeping in. The elevation also gives it the coolest, breeziest air anywhere around Udaipur.' },
    { file: 'Monsoon Palace Udaipur, Front Entrance.jpg', title: 'Positioned for the view', science: 'The plan is arranged so that every principal room commands a long view over the terrain and the gathering clouds.' },
  ],
  'garh-palace-bundi': [
    { file: 'Garh Palace and Taragarh Fort, Bundi 2011-12-26 EK II.jpg', title: 'A palace stepping down a hill', science: 'Rather than levelling the slope, the palace cascades down it in terraces — earthworks minimised, views and airflow maximised.' },
    { file: 'Bundi-Garh Palace-Chitrasala GVN-20131015.jpg', title: 'Chitrashala — the painted gallery', science: 'A shaded arcaded courtyard whose walls carry the famous blue-green Bundi murals, protected from sun and rain by the surrounding colonnade.' },
    { file: 'Bundi-Garh Palace-Diwan I Khas-02-Antechamber courtyard-20131015.jpg', title: 'Antechamber courtyard', science: 'Thick walls and small enclosed courts moderate the temperature, keeping the private audience rooms cool through the day.' },
  ],
  'ranthambore-fort': [
    { file: 'Ranthambhore Fort.jpg', title: 'A fort shaped by its hill', science: 'Defence came before ornament: the walls simply follow the contours of a steep, isolated hill set deep inside the forest.' },
    { file: 'Battees Khamba (32 Pillars).jpg', title: 'Battees Khamba (32 pillars)', science: 'A hall carried on thirty-two pillars — a clear, repeating structural grid spanning a large covered space.' },
    { file: 'Naulakha gate,ranthambor fort.jpg', title: 'The Naulakha gateway', science: 'A fortified gate guards the single steep approach — the only practical way up to the fort.' },
  ],
  'bala-quila': [
    { file: 'Alwar fort or Bala Quila 01.jpg', title: 'Ramparts along the ridge', science: 'Walls run for kilometres along the hill crest, built high above the town for surveillance and control of the routes below.' },
    { file: 'City of Alwar from bala quila.jpg', title: 'Commanding the valley', science: 'From the ridge the whole Alwar valley is in view; the exposed height also keeps the fort constantly ventilated.' },
  ],
  'ajmer-fort': [
    { file: "Akbar's Fort.jpg", title: 'Akbar’s square fort', science: 'A compact, four-square Mughal fort of thick stone. The heavy walls insulate the interior against Ajmer’s hot, dry climate.' },
    { file: "Akbar's Fort Ajmer, Audience Hall.jpg", title: 'The audience hall', science: 'Rooms are arranged around clear defensive and administrative needs rather than display — a working seat of government.' },
    { file: "Main Entrance of Akbar's Fort.jpg", title: 'The fortified main gate', science: 'A single strong gateway controlled all access to this fort at the meeting point of Rajput and Mughal power.' },
  ],
  'adhai-din-ka-jhonpra': [
    { file: 'Adhai Din-ka-Jhonpra Screen wall (6133975257).jpg', title: 'The seven-arched screen', science: 'A wall of seven tall pointed arches fronts the prayer hall. The repeated arch is both the structure and the ornament, creating a strong geometric rhythm.' },
    { file: 'Adhai Din-ka-Jhonpra Arcade (6134519070).jpg', title: 'Colonnade of reused pillars', science: 'Columns salvaged from earlier temples were re-erected as shaded arcades — recycling that also visibly blends two architectural traditions.' },
    { file: 'Adhai Din-ka-Jhonpra Column detail (6134514518).jpg', title: 'Recomposed carving', science: 'Look closely and the carved pillars are mismatched temple pieces, adapted into a new Indo-Islamic form — built, legend says, in just “two and a half days”.' },
  ],
  'chand-baori': [
    { file: 'Steps of Chand Baori step-well.jpg', title: '3,500 steps in mirror flights', science: 'Double staircases zig-zag down thirteen storeys in perfect symmetry, reaching the water at any level and covering the walls in a near-fractal pattern.' },
    { file: 'A magnificently carved window overlooking Chand Baori.jpg', title: 'Shaded pavilion galleries', science: 'Colonnaded galleries overlook the shaft. Twenty metres down, the air sits 5–6 °C cooler than the surface — a natural cold store in the desert.' },
    { file: 'Abhaneri-Chand Baori-36-Stufenbrunnen-2018-gje.jpg', title: 'An inverted pyramid for water', science: 'The whole well is the catchment’s lowest point, so monsoon runoff drains in and is stored here right through the long dry season.' },
  ],
}

// ---- Comparative module: Traditional vs Modern ----

export interface CompareMetric {
  key: string
  label: string
  traditional: number
  modern: number
  note: string
}

export interface CompareCase {
  id: string
  traditionalName: string
  modernName: string
  summary: string
  metrics: CompareMetric[]
}

export const COMPARE_CASES: CompareCase[] = [
  {
    id: 'dwelling',
    traditionalName: 'Haveli',
    modernName: 'Modern apartment',
    summary:
      'A courtyard haveli versus a sealed glass-and-concrete apartment. The old logic costs almost nothing to run; the new one leans on machines.',
    metrics: [
      { key: 'energy', label: 'Energy efficiency', traditional: 88, modern: 42, note: 'Passive cooling vs. constant air-conditioning load.' },
      { key: 'thermal', label: 'Thermal comfort', traditional: 80, modern: 70, note: 'Thick walls smooth out heat; AC works but spikes on power cuts.' },
      { key: 'sustain', label: 'Sustainability', traditional: 85, modern: 45, note: 'Local stone & lime vs. cement, steel and glass with high embodied carbon.' },
      { key: 'social', label: 'Social interaction', traditional: 90, modern: 38, note: 'Shared courtyard life vs. isolated private units.' },
    ],
  },
  {
    id: 'water',
    traditionalName: 'Stepwell',
    modernName: 'Piped supply',
    summary:
      'A community stepwell versus a centralised piped network with pumps. One recharges the aquifer; the other depletes it.',
    metrics: [
      { key: 'energy', label: 'Energy efficiency', traditional: 95, modern: 40, note: 'Gravity-fed access vs. continuous pumping and treatment.' },
      { key: 'thermal', label: 'Water security', traditional: 75, modern: 60, note: 'Local storage survives outages; pipes fail when the grid does.' },
      { key: 'sustain', label: 'Sustainability', traditional: 90, modern: 50, note: 'Recharges groundwater vs. extracts and ships it long distances.' },
      { key: 'social', label: 'Social interaction', traditional: 85, modern: 30, note: 'A shared civic space vs. an invisible utility.' },
    ],
  },
]
