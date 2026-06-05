import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BorderGlow from './BorderGlow'
import TextType from './TextType'

export default function Hero() {
  const [swapped, setSwapped] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current)
  }, [])

  function handleSwap() {
    if (swapped || spinning) return
    setSpinning(true)
    timeoutRef.current = setTimeout(() => {
      setSpinning(false)
      setSwapped(true)
    }, 560)
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4" style={{ paddingTop: '84px' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        className="w-full max-w-sm"
        style={{ minHeight: '500px' }}
      >
        {/* Eyebrow */}
        <p className="font-mono text-xs text-text-secondary text-center mb-3 tracking-wide">
          Pat Kuo · @ChefDoxie · Taiwan
        </p>

        <SwapWidget swapped={swapped} spinning={spinning} onSwap={handleSwap} />

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-5 text-center text-sm text-text-secondary leading-relaxed"
        >
          DeFi BD. Problem solver. Data driven.<br />
          Owner of one Dachshund.
        </motion.p>

        {/* Typing descriptor */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-3 flex justify-center font-mono text-sm"
          style={{ color: '#7c3aed' }}
        >
          <TextType
            text={['Liquidity deals.', 'Incentive design.', 'Ecosystem partnerships.', 'Protocol growth.']}
            typingSpeed={40}
            deletingSpeed={20}
            pauseDuration={1800}
            showCursor={true}
            cursorCharacter="_"
            cursorClassName="text-purple-400"
          />
        </motion.div>

        {/* Contact icons reveal */}
        <AnimatePresence>
          {swapped && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 flex items-center justify-center gap-2"
            >
              <a
                href="mailto:patkuo87225@gmail.com"
                className="p-2.5 rounded-xl text-text-secondary hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0)', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0)' }}
                aria-label="Email Pat"
              >
                <EmailIcon />
              </a>
              <a
                href="https://x.com/ChefDoxie"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl text-text-secondary hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0)', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0)' }}
                aria-label="X / Twitter"
              >
                <XIcon />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Scroll chevron */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.8, ease: 'easeInOut' }}
        >
          <ChevronDown />
        </motion.div>
      </motion.div>
    </section>
  )
}

function SwapWidget({ swapped, spinning, onSwap }) {
  return (
    <BorderGlow
      backgroundColor="#111111"
      colors={['#7c3aed', '#40D6E1', '#6d28d9']}
      glowColor="270 70 60"
      borderRadius={16}
    >
      <div className="px-4 pt-4 pb-2">
        <span className="text-sm font-medium text-white">Swap</span>
      </div>

      <TokenBox label="You send" token="IDEA" amount="1" />

      {/* Arrow */}
      <div className="relative flex items-center justify-center -my-0.5 z-10">
        <motion.button
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ background: '#1a1a1a', border: '2px solid #111111' }}
          animate={spinning ? { rotate: 180, scale: 1.15 } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          onClick={onSwap}
          aria-label="Swap tokens"
        >
          <ArrowIcon />
        </motion.button>
      </div>

      <TokenBox label="You get" token="RESULT" amount="∞" />

      {/* Rate */}
      <div className="px-4 py-2">
        <p className="font-mono text-xs text-text-secondary">
          1 IDEA = ∞ RESULT
        </p>
      </div>

      {/* Swap button — wave fill effect */}
      <div className="px-1 pb-1">
        <motion.button
          onClick={onSwap}
          disabled={swapped}
          whileTap={!swapped ? { scale: 0.98 } : {}}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="relative w-full py-3.5 rounded-xl font-semibold text-base overflow-hidden"
          style={{
            background: 'rgba(124,58,237,0.18)',
            border: '1px solid rgba(124,58,237,0.45)',
            cursor: swapped ? 'default' : 'pointer',
          }}
        >
          {/* Green fill sweeps left-to-right — 800ms organic deceleration */}
          <motion.div
            className="absolute inset-0"
            style={{ background: '#22c55e', transformOrigin: 'left' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: spinning || swapped ? 1 : 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* White shimmer travels slightly ahead of the fill — 500ms */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
            }}
            initial={{ x: '-100%' }}
            animate={{ x: spinning || swapped ? '100%' : '-100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Text cross-fade — triggered at 70% fill (560ms timeout) */}
          <span className="relative z-10">
            <AnimatePresence mode="wait" initial={false}>
              {swapped ? (
                <motion.span
                  key="outcome"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{ color: '#ffffff' }}
                >
                  Outcome
                </motion.span>
              ) : (
                <motion.span
                  key="swap"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ color: '#a78bfa' }}
                >
                  Swap
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </motion.button>
      </div>
    </BorderGlow>
  )
}

function TokenBox({ label, token, amount }) {
  return (
    <div
      className="mx-1 my-0.5 rounded-xl px-4 py-3"
      style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="mb-1.5">
        <span className="text-xs text-text-secondary">{label}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-2xl font-medium text-white">{amount}</span>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg shrink-0"
          style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)' }}
        >
          <div className="w-4 h-4 rounded-full" style={{ background: '#7c3aed' }} />
          <span className="font-mono text-xs font-semibold text-white">{token}</span>
        </div>
      </div>
    </div>
  )
}

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

