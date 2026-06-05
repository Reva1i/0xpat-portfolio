import ScrollProgress from './components/ScrollProgress'
import Nav from './components/Nav'
import Hero from './components/Hero'
import StatsBar from './components/StatsBar'
import Liquidity from './components/Liquidity'
import Partnerships from './components/Partnerships'
import Launchpad from './components/Launchpad'
import Farms from './components/Farms'
import About from './components/About'

const TICKER_PHRASES = [
  { text: 'Build the Rails', type: 'label' },
  { text: 'Drive Adoption', type: 'label' },
  { text: 'Grow the Pie', type: 'label' },
  { text: 'Repeat', type: 'accent' },
]

// Repeat 10× — guarantees full coverage up to 4K screens (~4480px per block)
const TICKER_ITEMS = [...Array(10)].flatMap(() => TICKER_PHRASES)

function TickerContent() {
  return (
    <>
      {TICKER_ITEMS.map((seg, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              color: seg.type === 'accent' ? '#40D6E1' : '#555555',
              whiteSpace: 'nowrap',
            }}
          >
            {seg.text}
          </span>
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              color: '#2a2a2a',
              padding: '0 14px',
            }}
          >
            ·
          </span>
        </span>
      ))}
    </>
  )
}

function TickerStrip() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        height: '28px',
        background: '#111111',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        zIndex: 60,
      }}
    >
      <div
        style={{
          display: 'flex',
          width: 'max-content',
          animation: 'marquee 40s linear infinite',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <TickerContent />
        </span>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <TickerContent />
        </span>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <ScrollProgress />
      <TickerStrip />
      <Nav />
      <Hero />
      <StatsBar />
      <Liquidity />
      <Partnerships />
      <Launchpad />
      <Farms />
      <About />
    </div>
  )
}
