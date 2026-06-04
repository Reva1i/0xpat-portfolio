import ScrollProgress from './components/ScrollProgress'
import Nav from './components/Nav'
import Hero from './components/Hero'
import StatsBar from './components/StatsBar'
import Liquidity from './components/Liquidity'
import Partnerships from './components/Partnerships'
import Launchpad from './components/Launchpad'
import Farms from './components/Farms'
import About from './components/About'

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <ScrollProgress />
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
