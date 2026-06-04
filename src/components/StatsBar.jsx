import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { STATS } from '../utils/data'
import CountUp from './CountUp'
import GradientText from './GradientText'

function StatItem({ stat, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      className="flex flex-col items-start gap-0.5 px-6 py-4 border-r last:border-r-0"
      style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      data-testid={`stat-item-${index}`}
    >
      <div className="flex items-center gap-2">
        <GradientText
          colors={['#ffffff', '#7c3aed', '#40D6E1', '#ffffff']}
          animationSpeed={6}
          pauseOnHover={true}
          className="font-mono text-xl font-semibold"
        >
          {stat.prefix}
          <CountUp from={0} to={stat.value} duration={2} startWhen={inView} />
          {stat.unit}
        </GradientText>
        <TrendUp delay={index * 0.375} />
      </div>
      <span className="text-xs text-text-secondary">{stat.label}</span>
      <span className="text-xs text-text-muted">{stat.sublabel}</span>
    </motion.div>
  )
}

export default function StatsBar() {
  return (
    <section
      className="w-full overflow-x-auto"
      style={{
        background: '#111111',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex min-w-max sm:min-w-0 sm:grid sm:grid-cols-4">
        {STATS.map((stat, i) => (
          <StatItem key={stat.label} stat={stat} index={i} />
        ))}
      </div>
    </section>
  )
}

function TrendUp({ delay }) {
  return (
    <div className="relative flex items-center justify-center w-5 h-5">
      <motion.div
        className="absolute rounded-full"
        style={{ width: 16, height: 16, border: '1.5px solid #22c55e' }}
        animate={{ scale: [1, 2], opacity: [0.6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2.5, ease: 'easeOut', delay }}
      />
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    </div>
  )
}
