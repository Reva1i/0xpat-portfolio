import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import GradientText from './GradientText'

const PARTNER_CARDS = [
  {
    metric: '$1.2M',
    metricSub: 'Protocol Revenue · 30+ IDOs · Zero errors',
    avatar: { type: 'single', file: 'bnbwallet.png', fallback: 'B', color: '#F0B90B' },
    title: 'Binance Wallet',
    subtitle: 'Institutional Partner',
    details: 'End-to-end coordination of 30+ token launches on Binance Wallet IDO — pool setup, ~$1M liquidity per launch, post-launch monitoring. Zero delays or errors.',
  },
  {
    metric: '$500K',
    metricSub: 'Secured for CAKE Holders · 17 partners',
    avatar: { type: 'single', file: 'cake.png', fallback: 'P', color: '#7c3aed' },
    title: '$500K in Token Rewards',
    subtitle: 'For CAKE Holders',
    details: 'Secured 17 token reward partnerships — project teams commit rewards, CAKE stakers earn passively.',
  },
  {
    metric: '$300K+',
    metricSub: 'OP & MON rewards deployed · Base & Monad',
    avatar: {
      type: 'dual',
      files: ['OP.png', 'Monad.ico'],
      fallbacks: [{ label: 'OP', color: '#FF0420' }, { label: 'MON', color: '#6B4EFF' }],
    },
    title: 'Incentive Programs',
    subtitle: 'Optimism · Monad',
    details: '$300K+ in OP and MON incentives deployed across Base and Monad pools · Pre-TGE deal flow · cbAssets & EURC liquidity sourcing',
  },
]

function SingleLogo({ file, fallback, color, size = 36 }) {
  const dim = `${size}px`
  return (
    <>
      <img
        src={`/logos/${file}`}
        alt={fallback}
        style={{ width: dim, height: dim, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}
        onError={(e) => {
          e.currentTarget.style.display = 'none'
          e.currentTarget.nextSibling.style.display = 'flex'
        }}
      />
      <span
        style={{
          width: dim, height: dim, borderRadius: '50%', background: color,
          border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0,
          alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: `${Math.round(size * 0.33)}px`,
          display: 'none',
        }}
      >
        {fallback}
      </span>
    </>
  )
}

function DualLogo({ files, fallbacks }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, width: '52px' }}>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <SingleLogo file={files[0]} fallback={fallbacks[0].label} color={fallbacks[0].color} size={28} />
      </div>
      <div style={{ position: 'relative', zIndex: 1, marginLeft: '-8px' }}>
        <SingleLogo file={files[1]} fallback={fallbacks[1].label} color={fallbacks[1].color} size={28} />
      </div>
    </div>
  )
}

function CardAvatar({ avatar }) {
  if (avatar.type === 'dual') {
    return <DualLogo files={avatar.files} fallbacks={avatar.fallbacks} />
  }
  return (
    <div style={{ display: 'flex', flexShrink: 0 }}>
      <SingleLogo file={avatar.file} fallback={avatar.fallback} color={avatar.color} size={36} />
    </div>
  )
}

function GradientCard({ card, index, inView }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.1 + index * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Gradient border wrapper */}
      <div
        style={{
          padding: '1px',
          borderRadius: '13px',
          background: hovered
            ? 'linear-gradient(135deg, #7c3aed, #40D6E1)'
            : 'linear-gradient(135deg, rgba(124,58,237,0.45), rgba(64,214,225,0.45))',
          flex: 1,
          display: 'flex',
          transition: 'background 0.3s ease, box-shadow 0.3s ease',
          boxShadow: hovered
            ? '0 0 24px rgba(124,58,237,0.35), 0 0 48px rgba(64,214,225,0.15)'
            : '0 0 0px rgba(124,58,237,0)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          style={{
            background: '#111111',
            borderRadius: '12px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="p-6 flex flex-col" style={{ minHeight: '280px', flex: 1 }}>
            <div
              className="font-mono font-bold mb-1"
              style={{ fontSize: '2rem', lineHeight: 1.1, color: '#7c3aed', letterSpacing: '-0.02em' }}
            >
              {card.metric}
            </div>
            <div className="text-xs text-text-muted mb-5 leading-relaxed">
              {card.metricSub}
            </div>

            <div className="flex items-center gap-2.5 mb-3">
              <CardAvatar avatar={card.avatar} />
              <div>
                <div className="font-semibold text-white text-sm leading-tight">{card.title}</div>
                <div className="text-xs text-text-muted mt-0.5">{card.subtitle}</div>
              </div>
            </div>

            <p
              className="text-xs text-text-secondary leading-relaxed mt-auto pt-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              {card.details}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Partnerships() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="partnerships" ref={ref} className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-2xl font-bold" style={{ display: 'inline-block' }}>
            <GradientText colors={['#ffffff', '#a78bfa', '#ffffff']} animationSpeed={8} yoyo={true}>Partnerships</GradientText>
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded font-mono"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#888888' }}
          >
            Institutional
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
          {PARTNER_CARDS.map((card, i) => (
            <GradientCard key={card.title} card={card} index={i} inView={inView} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
