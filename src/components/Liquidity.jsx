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

function ProtocolLogo({ name }) {
  const file = LOGO_MAP[name]
  if (file) {
    return (
      <img
        src={`/logos/${file}`}
        alt={name}
        className="w-6 h-6 rounded-full object-cover flex-shrink-0"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
      />
    )
  }
  const color = FALLBACK_COLORS[name.charCodeAt(0) % FALLBACK_COLORS.length]
  return (
    <span
      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold"
      style={{ background: color, fontSize: '11px', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {name[0].toUpperCase()}
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

function DealRow({ deal, isLast, i, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.3, delay: 0.05 + i * 0.03, ease: 'easeOut' }}
      className="grid grid-cols-3 px-4 py-3 items-center text-sm hover:bg-elevated transition-colors cursor-default"
      style={{ borderBottom: !isLast ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
    >
      <span className="font-medium text-white flex items-center gap-2">
        <ProtocolLogo name={deal.protocol} />
        {deal.protocol}
      </span>
      <span><ChainBadge chain={deal.chain} /></span>
      <span className="font-mono text-sm text-white flex items-center gap-2">
        {deal.tvl}
        {deal.coordinated && (
          <span className="text-xs text-text-muted font-sans font-normal">coordinated</span>
        )}
      </span>
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
                key={deal.protocol}
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
          <h2 className="text-2xl font-bold">
            <GradientText colors={['#ffffff', '#a78bfa', '#ffffff']} animationSpeed={8} yoyo={true}>Liquidity</GradientText>
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded font-mono"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#888888' }}
          >
            Pool List
          </span>
        </div>

        <p className="text-sm text-text-secondary mt-4 mb-8 leading-relaxed">
          Protocol liquidity deals closed across Base, BNBChain, and Monad. Each position represents a structured incentive deal — reward tiers, duration, co-incentive terms, and TVL targets.
        </p>

        <BorderGlow backgroundColor="#111111" colors={['#7c3aed', '#40D6E1', '#6d28d9']} glowColor="270 70 60" borderRadius={12}>
          <div className="overflow-x-auto" style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ minWidth: '400px' }}>
              <div
                className="grid grid-cols-3 px-4 py-2.5 text-xs font-medium text-text-muted uppercase tracking-wider"
                style={{ background: '#111111', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span>Protocol</span>
                <span>Chain</span>
                <span className="font-mono">TVL</span>
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
