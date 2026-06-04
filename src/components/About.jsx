import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import GradientText from './GradientText'
import RotatingText from './RotatingText'

const LINKS = [
  {
    label: 'Email',
    href: 'mailto:patkuo87225@gmail.com',
    newTab: false,
    icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>,
  },
  {
    label: 'X / Twitter',
    href: 'https://x.com/ChefDoxie',
    newTab: true,
    icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  },
  {
    label: 'Telegram',
    href: 'https://t.me/chefdoxie',
    newTab: true,
    icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8-1.7 8.02c-.12.58-.46.72-.93.45l-2.58-1.9-1.24 1.19c-.14.14-.26.26-.53.26l.19-2.66 4.84-4.37c.21-.19-.05-.29-.32-.1L7.9 14.49l-2.54-.79c-.55-.17-.56-.55.12-.82l9.91-3.82c.46-.17.86.11.71.74h-.46z"/></svg>,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/patkuo/',
    newTab: true,
    icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
  },
]

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="about"
      ref={ref}
      className="py-20 px-4 sm:px-6 max-w-5xl mx-auto"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold">
            <GradientText colors={['#ffffff', '#a78bfa', '#ffffff']} animationSpeed={8} yoyo={true}>About</GradientText>
          </h2>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-hidden">
          <span className="text-sm text-text-muted font-mono flex-shrink-0">I am a</span>
          <RotatingText
            texts={['Rational Degen', 'Problem Solver', 'Liquidity Architect', 'Data Maximalist']}
            staggerFrom="last"
            staggerDuration={0.04}
            rotationInterval={3000}
            splitBy="words"
            mainClassName="text-purple-400 font-mono font-bold"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-120%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          />
        </div>

        <div className="space-y-4 text-sm text-text-secondary leading-relaxed mb-8">
          <p>Rational degen who believes in data. Longtermist.</p>
          <p>Five years building in DeFi, focusing on ecosystem BD across Base, BNBChain, and Monad. Liquidity deals, incentive design, foundation partnerships. I work best where strategy meets execution.</p>
          <p>Currently at PancakeSwap. Devoted to democratizing the financial system.</p>
        </div>

        <div className="flex items-center gap-3 mb-10">
          {LINKS.map(({ label, href, newTab, icon }, i) => (
            <motion.a
              key={label}
              href={href}
              target={newTab ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-label={label}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.35 }}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#111111',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#888888',
                transition: 'color 0.15s ease, border-color 0.15s ease',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#888888'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              }}
            >
              {icon}
            </motion.a>
          ))}
        </div>

        <motion.a
          href="https://t.me/chefdoxie"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            border: '1px solid rgba(124,58,237,0.5)',
            color: '#ffffff',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8-1.7 8.02c-.12.58-.46.72-.93.45l-2.58-1.9-1.24 1.19c-.14.14-.26.26-.53.26l.19-2.66 4.84-4.37c.21-.19-.05-.29-.32-.1L7.9 14.49l-2.54-.79c-.55-.17-.56-.55.12-.82l9.91-3.82c.46-.17.86.11.71.74h-.46z"/>
          </svg>
          Connect
        </motion.a>
      </motion.div>
    </section>
  )
}
