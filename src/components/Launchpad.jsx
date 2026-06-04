import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import BorderGlow from './BorderGlow'
import GradientText from './GradientText'
import TextType from './TextType'

const IDO_LOGOS = [
  'AGT.png', 'AIOT.png', 'APR.png', 'B2.png', 'CUDIS.png',
  'HYPER.png', 'IDOL.png', 'IR.png', 'LAB.png', 'MILK.png',
  'MITO.png', 'myx.png', 'OPG.png', 'PRAI.png', 'RICE.png', 'RWA.png',
]

const DOUBLED = [...IDO_LOGOS, ...IDO_LOGOS]

const RANKINGS = [
  { name: 'PancakeSwap', value: 100 },
  { name: 'DEX #2',      value: 68  },
  { name: 'DEX #3',      value: 47  },
  { name: 'DEX #4',      value: 31  },
  { name: 'DEX #5',      value: 19  },
]

function RankingCard() {
  const chartRef = useRef(null)
  const chartInView = useInView(chartRef, { once: true, margin: '-60px' })
  const [tooltipVisible, setTooltipVisible] = useState(false)

  return (
    <div
      className="rounded-xl overflow-visible mb-6"
      style={{ border: '1px solid rgba(124,58,237,0.25)', background: '#111111', borderRadius: '12px', overflow: 'hidden' }}
    >
      {/* Banner */}
      <div
        className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
        style={{
          background: 'rgba(124,58,237,0.06)',
          borderBottom: '1px solid rgba(124,58,237,0.12)',
          borderLeft: '3px solid rgba(124,58,237,0.5)',
        }}
      >
        <span className="font-mono text-sm text-white flex items-center gap-1.5">
          <motion.span
            style={{ display: 'inline-block' }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2.5 }}
          >
            🏆
          </motion.span>
          {' '}#1 DEX by trading volume and market share · 2025
        </span>
        <a
          href="https://blog.pancakeswap.finance/articles/2025-recap"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-text-muted hover:text-text-secondary transition-colors"
          style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}
        >
          Source: PancakeSwap 2025 Recap
        </a>
      </div>

      {/* Chart */}
      <div ref={chartRef} style={{ padding: '12px 16px 0', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {RANKINGS.map((item, i) => {
            const widthPct = (item.value / 108) * 100
            const isPCS = i === 0
            const delay = i * 0.1

            return (
              <div key={item.name} style={{ position: 'relative' }}>
                {/* Tooltip — outside the overflow:hidden track */}
                <AnimatePresence>
                  {isPCS && tooltipVisible && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: 'absolute',
                        top: '-34px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(10,10,10,0.95)',
                        border: '1px solid rgba(64,214,225,0.35)',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: 11,
                        fontFamily: 'JetBrains Mono, monospace',
                        color: '#40D6E1',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        zIndex: 20,
                      }}
                    >
                      PancakeSwap · #1 DEX · 2025
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bar track — motion.div for hover glow */}
                <motion.div
                  whileHover={{
                    boxShadow: isPCS
                      ? '0 0 14px rgba(64,214,225,0.5)'
                      : '0 0 8px rgba(255,255,255,0.2)',
                  }}
                  transition={{ boxShadow: { duration: 0.2 } }}
                  style={{
                    height: '22px',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    boxShadow: isPCS ? '0 0 10px rgba(64,214,225,0.15)' : 'none',
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={chartInView ? { width: `${widthPct}%` } : { width: 0 }}
                    whileHover={isPCS ? { filter: 'brightness(1.15)' } : undefined}
                    transition={{
                      width: { delay, duration: isPCS ? 1.2 : 0.8, ease: [0.22, 1, 0.36, 1] },
                      filter: { duration: 0.2 },
                    }}
                    onHoverStart={isPCS ? () => setTooltipVisible(true) : undefined}
                    onHoverEnd={isPCS ? () => setTooltipVisible(false) : undefined}
                    style={{
                      height: '100%',
                      borderRadius: '0 3px 3px 0',
                      background: isPCS
                        ? 'linear-gradient(to right, rgba(64,214,225,0.3), #40D6E1)'
                        : 'rgba(255,255,255,0.08)',
                      position: 'relative',
                    }}
                  >
                    {isPCS && (
                      <span
                        style={{
                          position: 'absolute',
                          right: 10,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#111111',
                          fontWeight: 700,
                          fontSize: 11,
                          fontFamily: 'JetBrains Mono, monospace',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        🏆 PancakeSwap · #1
                      </span>
                    )}
                    {/* Shimmer sweep — PCS bar only, triggers after fill completes */}
                    {isPCS && (
                      <motion.div
                        initial={{ x: '-100%' }}
                        animate={chartInView ? { x: '200%' } : { x: '-100%' }}
                        transition={{
                          delay: 1.4,
                          duration: 0.7,
                          ease: 'easeInOut',
                          repeat: Infinity,
                          repeatDelay: 5,
                        }}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '45%',
                          height: '100%',
                          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.45), transparent)',
                          pointerEvents: 'none',
                        }}
                      />
                    )}
                  </motion.div>
                </motion.div>
              </div>
            )
          })}
        </div>

        {/* Left gradient mask */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            right: 'auto',
            width: '72px',
            background: 'linear-gradient(to right, #111111 40%, transparent)',
            pointerEvents: 'none',
          }}
        />
      </div>

      <p
        className="font-mono px-4 pb-3 pt-3"
        style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}
      >
        2025 DEX Rankings by Trading Volume
      </p>
    </div>
  )
}

const LOGO_STYLE = {
  height: '48px',
  width: '48px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '1px solid rgba(255,255,255,0.1)',
  flexShrink: 0,
  opacity: 0.75,
  transition: 'transform 200ms ease, filter 200ms ease, opacity 200ms ease',
  cursor: 'default',
}

function handleLogoEnter(e) {
  e.currentTarget.style.transform = 'scale(1.2)'
  e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(255,255,255,0.6))'
  e.currentTarget.style.opacity = '1'
  const row = e.currentTarget.closest('[data-marquee-row]')
  if (row) row.style.animationPlayState = 'paused'
}

function handleLogoLeave(e) {
  e.currentTarget.style.transform = 'scale(1)'
  e.currentTarget.style.filter = 'none'
  e.currentTarget.style.opacity = '0.75'
  const row = e.currentTarget.closest('[data-marquee-row]')
  if (row) row.style.animationPlayState = 'running'
}

const ROW2 = [...IDO_LOGOS.slice(8), ...IDO_LOGOS.slice(0, 8), ...IDO_LOGOS.slice(8), ...IDO_LOGOS.slice(0, 8)]

function LogoStrip() {
  return (
    <div className="mb-8">
      <p className="text-xs text-text-muted mb-4 uppercase tracking-wider font-mono">Selected IDO Partners</p>
      <div style={{ position: 'relative' }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* Strip */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          perspective: '1000px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.01)',
          overflow: 'hidden',
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}>
          <div style={{ transform: 'rotateX(8deg)', transformStyle: 'preserve-3d', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Row 1 — left */}
            <div
              data-marquee-row="1"
              className="flex gap-4 px-3"
              style={{ width: 'max-content', animation: 'marquee 30s linear infinite' }}
            >
              {DOUBLED.map((file, i) => (
                <img key={`r1-${file}-${i}`} src={`/logos/ido/${file}`} alt={file.replace(/\.[^.]+$/, '')}
                  onMouseEnter={handleLogoEnter} onMouseLeave={handleLogoLeave} style={LOGO_STYLE} />
              ))}
            </div>
            {/* Row 2 — right, staggered */}
            <div
              data-marquee-row="2"
              className="flex gap-4 px-3"
              style={{ width: 'max-content', animation: 'marquee-reverse 25s linear infinite' }}
            >
              {ROW2.map((file, i) => (
                <img key={`r2-${file}-${i}`} src={`/logos/ido/${file}`} alt={file.replace(/\.[^.]+$/, '')}
                  onMouseEnter={handleLogoEnter} onMouseLeave={handleLogoLeave} style={LOGO_STYLE} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Launchpad() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="launchpad" ref={ref} className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-bold">
            <GradientText colors={['#ffffff', '#a78bfa', '#ffffff']} animationSpeed={8} yoyo={true}>Launchpad</GradientText>
          </h2>
          <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: 'rgba(255,255,255,0.06)', color: '#888888' }}>
            IDO Record
          </span>
        </div>

        <p className="text-sm text-text-secondary mb-8 leading-relaxed max-w-2xl">
          30+ token launches on Binance Wallet IDO with zero delays or errors. Each launch required end-to-end coordination — pool setup, liquidity injection (~$1M per IDO), and post-launch monitoring.
        </p>

        <LogoStrip />

        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
        >
          <RankingCard />
        </motion.div>

        {/* Titan Launch highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-6"
        >
          <BorderGlow backgroundColor="#111111" colors={['#7c3aed', '#40D6E1', '#6d28d9']} glowColor="270 70 60" borderRadius={12}>
            <div className="p-6">
              <div className="text-xs font-mono text-accent mb-3 uppercase tracking-wider">Titan Launch</div>

              <div className="flex items-center gap-3 mb-1">
                <img
                  src="/logos/ido/OPG.png"
                  alt="OpenGradient"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    border: '1px solid rgba(255,255,255,0.1)',
                    flexShrink: 0,
                  }}
                />
                <div className="text-lg font-bold text-white">OpenGradient × Virtuals</div>
              </div>

              <div className="text-sm text-text-secondary mb-4">
                First-ever Titan Launch outside Uniswap on Base
              </div>

              <div className="flex flex-wrap gap-4">
                <Metric value="$2.91M" label="Avg daily volume" sub="First 3 days" />
                <div className="w-px bg-white/5 hidden sm:block" />
                <div>
                  <a
                    href="https://x.com/binance/status/2057729212430127170"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-base font-bold text-white hover:text-accent transition-colors flex items-center gap-1"
                  >
                    Listed on Binance Spot
                    <span style={{ fontSize: '12px', opacity: 0.7 }}>↗</span>
                  </a>
                  <div className="text-sm text-text-secondary">OpenGradient listing</div>
                  <div className="text-xs text-text-muted mt-0.5">Post-launch</div>
                </div>
              </div>
            </div>
          </BorderGlow>
        </motion.div>

        {/* Supporting stats — 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch">
          {[
            { value: '30+', label: 'IDO launches' },
            { value: '~$1M', label: 'Liquidity per launch' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className="flex flex-col"
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.35 }}
            >
              <BorderGlow backgroundColor="#111111" colors={['#7c3aed', '#40D6E1', '#6d28d9']} glowColor="270 70 60" borderRadius={12} className="flex-1">
                <div className="p-4">
                  <div className="font-mono text-base font-semibold text-white mb-0.5">{s.value}</div>
                  <div className="text-xs text-text-secondary">{s.label}</div>
                </div>
              </BorderGlow>
            </motion.div>
          ))}

          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.42, duration: 0.35 }}
            style={{ overflow: 'hidden', borderRadius: '12px' }}
          >
            <BorderGlow backgroundColor="rgba(34,197,94,0.04)" colors={['#22c55e', '#40D6E1', '#22c55e']} glowColor="142 70 60" glowIntensity={0.4} borderRadius={12} className="flex-1">
              <div className="p-4 flex flex-1 items-center justify-center">
                <span
                  className="font-mono text-sm flex items-center gap-2 whitespace-nowrap"
                  style={{ color: '#22c55e' }}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.6)' }}
                  />
                  ✓ Zero Errors
                </span>
              </div>
            </BorderGlow>
          </motion.div>
        </div>

        <div className="mt-5">
          <TextType
            text={[
              '30+ IDO launches managed.',
              'Zero errors across all campaigns.',
              '~$1M average liquidity per launch.',
              'Protocol revenue: $1.2M generated.',
            ]}
            typingSpeed={40}
            deletingSpeed={20}
            pauseDuration={2000}
            cursorCharacter="_"
            cursorClassName="text-teal-400"
            startOnVisible={true}
            className="font-mono text-xs text-text-secondary"
          />
        </div>
      </motion.div>
    </section>
  )
}

function Metric({ value, label, sub }) {
  return (
    <div>
      <div className="font-mono text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-text-secondary">{label}</div>
      {sub && <div className="text-xs text-text-muted mt-0.5">{sub}</div>}
    </div>
  )
}
