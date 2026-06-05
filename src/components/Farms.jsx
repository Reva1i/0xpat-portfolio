import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import BorderGlow from './BorderGlow'
import GradientText from './GradientText'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, ReferenceDot, CartesianGrid,
} from 'recharts'
import { VOLUME_DATA } from '../utils/data'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const base = payload.find(p => p.dataKey === 'baseTotal')
  const vol = payload.find(p => p.dataKey === 'volume')
  const profit = payload.find(p => p.dataKey === 'profit')
  return (
    <div
      style={{
        background: '#1a1a1a',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '6px',
        padding: '8px 12px',
      }}
    >
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#888888', marginBottom: '4px' }}>{label}</div>
      {base && (
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>
          Base Total: ${base.value}B
        </div>
      )}
      {vol && (
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 600, color: '#40D6E1' }}>
          PCS: ${vol.value}B
        </div>
      )}
      {profit && profit.value !== null && (
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', marginTop: '2px', color: profit.value >= 0 ? '#22c55e' : '#ef4444' }}>
          {profit.value >= 0 ? '+' : ''}{profit.value.toLocaleString()} CAKE/mo
        </div>
      )}
    </div>
  )
}

export default function Farms() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="farms" ref={ref} className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-2xl font-bold" style={{ display: 'inline-block' }}>
            <GradientText colors={['#ffffff', '#a78bfa', '#ffffff']} animationSpeed={8} yoyo={true}>Farms</GradientText>
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded font-mono"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#888888' }}
          >
            Base Growth
          </span>
        </div>

        {/* Section meta strip */}
        <p className="font-mono text-xs mb-4" style={{ color: '#444444' }}>
          $12.16B peak · Base #2 Jul–Nov 2025 · +26,146 CAKE/mo
        </p>

        <div className="mb-4">
          <p className="font-mono text-xs text-text-muted mb-1">Base Monthly Volume</p>
          <p className="font-mono text-2xl font-bold text-white">
            $3.63B → <span style={{ color: '#7c3aed' }}>$12.21B</span>
            <span className="font-normal text-sm text-text-muted ml-2">peak</span>
          </p>
        </div>

        <p className="leading-relaxed max-w-2xl mb-8" style={{ fontSize: '13px', color: '#888888' }}>
          Reduced Base farm emissions from –214,460 CAKE/month to profitability during a market-wide contraction without losing market share. Smart allocation during a downturn, not cuts during growth.
        </p>

        {/* Chart card */}
        <BorderGlow backgroundColor="#111111" colors={['#7c3aed', '#40D6E1', '#6d28d9']} glowColor="270 70 60" borderRadius={12} className="mb-4">
          <div className="p-4 sm:p-6">
            <p className="font-mono text-xs mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Volume on Base
            </p>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-5 mb-4">
              <span className="flex items-center gap-1.5 font-mono text-xs" style={{ color: '#40D6E1' }}>
                <span style={{ display: 'inline-block', width: 12, height: 2, borderRadius: 1, background: '#40D6E1' }} />
                PCS Volume
              </span>
              <span className="flex items-center gap-1.5 font-mono text-xs" style={{ color: '#7c3aed' }}>
                <span style={{ display: 'inline-block', width: 12, height: 2, borderRadius: 1, background: '#7c3aed' }} />
                Profitability
              </span>
              <span className="flex items-center gap-1.5 font-mono text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <span style={{ display: 'inline-block', width: 14, height: 0, borderTop: '2px dashed rgba(255,255,255,0.3)' }} />
                Base Ecosystem
              </span>
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={VOLUME_DATA} margin={{ top: 16, right: 52, left: -20, bottom: 0 }}>
                <CartesianGrid
                  yAxisId="left"
                  vertical={false}
                  stroke="rgba(255,255,255,0.04)"
                  strokeDasharray="0"
                />

                <XAxis
                  dataKey="month"
                  tick={{ fill: '#444444', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                  axisLine={false}
                  tickLine={false}
                />

                {/* Left axis — volume in billions */}
                <YAxis
                  yAxisId="left"
                  tick={{ fill: '#444444', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}B`}
                />

                {/* Right axis — profitability in CAKE/mo */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#444444', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => v === 0 ? '0' : `${Math.round(v / 1000)}K`}
                  domain={[-230000, 50000]}
                  ticks={[-200000, -100000, 0]}
                />

                <Tooltip content={<CustomTooltip />} />

                {/* Break-even line — with "Flipped profitable" label */}
                <ReferenceLine
                  yAxisId="right"
                  y={0}
                  stroke="rgba(34,197,94,0.25)"
                  strokeDasharray="4 4"
                  label={{ value: 'Flipped profitable', position: 'insideLeft', fill: '#22c55e', fontSize: 9, fontFamily: 'JetBrains Mono', offset: 4 }}
                />

                {/* Oct 25 — volume peak line */}
                <ReferenceLine
                  yAxisId="left"
                  x="Oct 25"
                  stroke="rgba(64,214,225,0.2)"
                  strokeDasharray="3 3"
                />

                {/* Mar 26 — profit turns positive */}
                <ReferenceLine
                  yAxisId="left"
                  x="Mar 26"
                  stroke="rgba(34,197,94,0.2)"
                  strokeDasharray="3 3"
                />

                {/* Jan 26 — market contraction annotation */}
                <ReferenceLine
                  yAxisId="left"
                  x="Jan 26"
                  stroke="transparent"
                  label={{ value: 'Market-wide contraction · PCS turned profitable', position: 'insideTopRight', fill: 'rgba(255,255,255,0.25)', fontSize: 8, fontFamily: 'JetBrains Mono' }}
                />

                {/* Base ecosystem total volume — dashed muted */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="baseTotal"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth={1.5}
                  strokeDasharray="5 4"
                  dot={false}
                  activeDot={{ fill: 'rgba(255,255,255,0.5)', r: 3, strokeWidth: 0 }}
                  isAnimationActive={true}
                  animationBegin={200}
                  animationDuration={2000}
                  animationEasing="ease-out"
                />

                {/* PancakeSwap volume — teal */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="volume"
                  stroke="#40D6E1"
                  strokeWidth={2}
                  dot={{ fill: '#40D6E1', r: 3, strokeWidth: 0 }}
                  activeDot={{ fill: '#40D6E1', r: 5, strokeWidth: 0 }}
                  isAnimationActive={true}
                  animationBegin={0}
                  animationDuration={2000}
                  animationEasing="ease-out"
                />

                {/* Profitability line — purple */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="profit"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ fill: '#7c3aed', r: 4, strokeWidth: 0 }}
                  isAnimationActive={true}
                  animationBegin={400}
                  animationDuration={2000}
                  animationEasing="ease-out"
                  connectNulls={false}
                />

                {/* Peak dot at Oct 25 */}
                <ReferenceDot
                  yAxisId="left"
                  x="Oct 25"
                  y={12.21}
                  r={5}
                  fill="#40D6E1"
                  stroke="#0a0a0a"
                  strokeWidth={2}
                  label={{ value: 'Peak $12.21B', position: 'top', fill: '#40D6E1', fontSize: 9, fontFamily: 'JetBrains Mono', offset: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </BorderGlow>

        {/* Context banner */}
        <div
          className="rounded-lg px-4 py-2.5 mb-3"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="font-mono text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Oct 2025: Base ecosystem peak ·{' '}
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>$53B total DEX volume</span>
            {' '}· PancakeSwap maintained position through the contraction
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
          <Callout
            delay={0.35}
            label="Strategy"
            text="Base Foundation partner for liquidity sourcing, co-incentive campaigns, and pre-TGE pipeline development."
          />
          <ProfitabilityCallout delay={0.45} />
        </div>
      </motion.div>
    </section>
  )
}

function ProfitabilityCallout({ delay }) {
  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
      transition={{ delay, duration: 0.4 }}
    >
      <BorderGlow backgroundColor="#111111" colors={['#7c3aed', '#40D6E1', '#6d28d9']} glowColor="270 70 60" borderRadius={12} className="flex-1">
        <div className="p-4 h-full">
          <div className="text-xs text-accent font-mono uppercase tracking-wider mb-1.5">Profitability</div>
          <p className="text-xs text-text-muted mb-1">Farm emissions</p>
          <div className="flex items-center flex-wrap gap-1 font-mono text-sm font-semibold">
            <GradientText colors={['#ef4444', '#f97316', '#ef4444']} animationSpeed={3}>–214,460</GradientText>
            <span className="text-text-muted">→</span>
            <GradientText colors={['#22c55e', '#40D6E1', '#22c55e']} animationSpeed={3}>+26,146</GradientText>
            <span className="text-text-muted font-normal">CAKE/mo</span>
          </div>
        </div>
      </BorderGlow>
    </motion.div>
  )
}

function Callout({ delay, label, text }) {
  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
      transition={{ delay, duration: 0.4 }}
    >
      <BorderGlow backgroundColor="#111111" colors={['#7c3aed', '#40D6E1', '#6d28d9']} glowColor="270 70 60" borderRadius={12} className="flex-1">
        <div className="p-4 h-full">
          <div className="text-xs text-accent font-mono uppercase tracking-wider mb-1.5">{label}</div>
          <p className="text-sm text-text-secondary leading-relaxed">{text}</p>
        </div>
      </BorderGlow>
    </motion.div>
  )
}
