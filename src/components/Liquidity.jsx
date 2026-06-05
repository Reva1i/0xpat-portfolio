import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { DEAL_GROUPS } from '../utils/data'
import CountUp from './CountUp'
import BorderGlow from './BorderGlow'
import GradientText from './GradientText'

const LOGO_MAP = {
  'U': 'U.png',
  'APYx': 'APYx.png',
  'earnAUSD': 'earnAUSD.png',
  'Overnight USD': 'USD+.png',
  'HeyELSA': 'HeyELSA.png',
  'VELVET': 'VELVET.jpeg',
  'tGBP': 'tGBP.avif',
  'CADC': 'CADC.jpg',
  'IDRX': 'IDRX.png',
  'BRZ': 'BRZ.png',
  'AUDF': 'AUDF.png',
  'MEW': 'MEW.jpg',
  'ZEUS': 'ZEUS.png',
  'AUKI': 'AUKI.webp',
  'BIO': 'BIO.png',
  'DEGEN': 'DEGEN.png',
  'EDEL': 'EDEL.png',
  'TROLL': 'TROLL.png',
  'FACY': 'FACY.png',
}

const FALLBACK_COLORS = [
  '#7c3aed', '#2563eb', '#059669', '#d97706', '#dc2626',
  '#7c3aed', '#0891b2', '#9333ea', '#16a34a', '#ea580c',
]

const FEE_MAP = { Stablecoin: '0.05%', Altcoin: '0.25%', RWA: '0.30%' }

const ALL_DEALS = DEAL_GROUPS.flatMap(g => g.deals)
const MAX_TVL_NUM = Math.max(...ALL_DEALS.map(d => parseTvlNum(d.tvl)))

function parseTvlNum(str) {
  if (str.includes('M')) return parseFloat(str.replace(/[$M]/g, '')) * 1_000_000
  if (str.includes('K')) return parseFloat(str.replace(/[$K]/g, '')) * 1_000
  return parseFloat(str.replace(/[$]/g, ''))
}

function ProtocolLogo({ name }) {
  const file = LOGO_MAP[name]
  const fallbackColor = FALLBACK_COLORS[name.charCodeAt(0) % FALLBACK_COLORS.length]
  const size = { width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0 }

  if (file) {
    return (
      <span style={{ position: 'relative', display: 'inline-flex', ...size }}>
        <img
          src={`/logos/${file}`}
          alt={name}
          style={{ ...size, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)' }}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextSibling.style.display = 'flex'
          }}
        />
        <span
          style={{
            ...size, background: fallbackColor, display: 'none',
            alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '10px',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          {name[0].toUpperCase()}
        </span>
      </span>
    )
  }

  return (
    <span
      style={{
        ...size, background: fallbackColor, display: 'inline-flex',
        alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 700, fontSize: '10px',
        fontFamily: 'JetBrains Mono, monospace',
      }}
    >
      {name[0].toUpperCase()}
    </span>
  )
}

function FeePill({ type }) {
  const fee = FEE_MAP[type] || '0.25%'
  return (
    <span
      style={{
        background: '#1a1a1a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '9999px',
        padding: '2px 8px',
        fontSize: '10px',
        fontFamily: 'JetBrains Mono, monospace',
        color: '#888888',
        whiteSpace: 'nowrap',
      }}
    >
      {fee}
    </span>
  )
}

const CHAIN_COLORS = {
  Base: { bg: 'rgba(0,82,255,0.12)', border: 'rgba(0,82,255,0.3)', text: '#4d8fff' },
  BNBChain: { bg: 'rgba(243,186,47,0.12)', border: 'rgba(243,186,47,0.3)', text: '#f3ba2f' },
  Monad: { bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.3)', text: '#7c3aed' },
  SOL: { bg: 'rgba(153,69,255,0.12)', border: 'rgba(153,69,255,0.3)', text: '#9945ff' },
}

function ChainBadge({ chain }) {
  const parts = chain.includes(' · ') ? chain.split(' · ') : [chain]
  return (
    <span className="flex items-center gap-1 flex-wrap">
      {parts.map(p => {
        const c = CHAIN_COLORS[p] || CHAIN_COLORS.Base
        return (
          <span
            key={p}
            className="font-mono text-xs px-2 py-0.5 rounded-md"
            style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
          >
            {p}
          </span>
        )
      })}
    </span>
  )
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function TvlCell({ tvl }) {
  return (
    <span className="font-mono text-sm text-white">{tvl}</span>
  )
}

function DealRow({ deal, isLast, i, inView }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.3, delay: 0.05 + i * 0.03, ease: 'easeOut' }}
      className="group relative grid items-center text-sm cursor-default"
      style={{
        gridTemplateColumns: '1fr auto 1fr 1fr',
        padding: '8px 16px',
        borderBottom: !isLast ? '1px solid rgba(255,255,255,0.04)' : 'none',
        background: hovered ? 'rgba(255,255,255,0.025)' : 'transparent',
        transition: 'background 0.15s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Gradient left border on hover */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '2px',
          background: 'linear-gradient(to bottom, #7c3aed, #40D6E1)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.15s ease',
        }}
      />

      {/* Protocol + single logo */}
      <span className="font-medium text-white flex items-center gap-2">
        <ProtocolLogo name={deal.protocol} />
        {deal.protocol}
      </span>

      {/* Fee */}
      <span style={{ paddingLeft: '12px', paddingRight: '12px' }}>
        <FeePill type={deal.type} />
      </span>

      {/* Chain */}
      <span><ChainBadge chain={deal.chain} /></span>

      {/* TVL */}
      <TvlCell tvl={deal.tvl} />
    </motion.div>
  )
}

function DealGroup({ group, groupIndex, inView }) {
  const [open, setOpen] = useState(group.year === '2026')

  return (
    <div style={{ borderTop: groupIndex > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-2.5 flex items-center justify-between transition-colors"
        style={{ background: 'rgba(255,255,255,0.02)' }}
        aria-expanded={open}
      >
        <span
          className="font-mono text-xs px-2.5 py-0.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#666666' }}
        >
          {group.year}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <ChevronIcon />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            {group.deals.map((deal, i) => (
              <DealRow
                key={deal.protocol + i}
                deal={deal}
                i={i}
                isLast={i === group.deals.length - 1}
                inView={inView}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Liquidity() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="liquidity" ref={ref} className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold" style={{ display: 'inline-block' }}>
            <GradientText colors={['#ffffff', '#a78bfa', '#ffffff']} animationSpeed={8} yoyo={true}>Liquidity</GradientText>
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded font-mono"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#888888' }}
          >
            Pool List
          </span>
        </div>

        {/* Section meta strip */}
        <p className="font-mono text-xs mt-1 mb-4" style={{ color: '#444444' }}>
          11 protocols · $10M+ TVL · Base / BNBChain
        </p>

        <p className="mb-4 leading-relaxed" style={{ fontSize: '13px', color: '#888888' }}>
          Protocol liquidity deals closed across Base, BNBChain, and Monad. Each position represents a structured incentive deal — reward tiers, duration, co-incentive terms, and TVL targets.
        </p>

        <BorderGlow backgroundColor="#111111" colors={['#7c3aed', '#40D6E1', '#6d28d9']} glowColor="270 70 60" borderRadius={12}>
          <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: '600px' }}>
                {/* Table header — 5 cols */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr 1fr',
                    padding: '10px 16px',
                    background: '#111111',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    fontSize: '11px',
                    fontWeight: 500,
                    fontFamily: 'JetBrains Mono, monospace',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#555555',
                    gap: '12px',
                  }}
                >
                  <span>Protocol</span>
                  <span style={{ paddingLeft: '12px', paddingRight: '12px' }}>Fee <span style={{ color: '#333333' }}>↑↓</span></span>
                  <span>Chain <span style={{ color: '#333333' }}>↑↓</span></span>
                  <span>TVL <span style={{ color: '#333333' }}>↑↓</span></span>
                </div>

                {DEAL_GROUPS.map((group, groupIndex) => (
                  <DealGroup
                    key={group.year}
                    group={group}
                    groupIndex={groupIndex}
                    inView={inView}
                  />
                ))}
              </div>
            </div>
          </div>
        </BorderGlow>

        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <span className="font-mono text-xs text-text-muted">2026:</span>
          <span className="font-mono text-sm font-semibold text-white">
            $<CountUp from={0} to={7} duration={2} separator="," className="font-mono" startWhen={inView} />M+ sourced
          </span>
          <span className="text-text-muted">·</span>
          <span className="font-mono text-xs text-text-muted">2025:</span>
          <span className="font-mono text-sm text-text-secondary">
            $<CountUp from={0} to={3.75} duration={2} separator="," className="font-mono" startWhen={inView} />M sourced
          </span>
          <span className="text-text-muted">·</span>
          <span className="font-mono text-sm text-text-secondary">
            $<CountUp from={0} to={20} duration={2} separator="," className="font-mono" startWhen={inView} />M coordinated
          </span>
        </div>
      </motion.div>
    </section>
  )
}
