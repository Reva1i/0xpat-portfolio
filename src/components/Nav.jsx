import { motion } from 'framer-motion'
import GlitchText from './GlitchText'
import './ShinyText.css'

const NAV_LINKS = [
  { label: 'Liquidity', href: '#liquidity' },
  { label: 'Partnerships', href: '#partnerships' },
  { label: 'Launchpad', href: '#launchpad' },
  { label: 'About', href: '#about' },
]

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8-1.7 8.02c-.12.58-.46.72-.93.45l-2.58-1.9-1.24 1.19c-.14.14-.26.26-.53.26l.19-2.66 4.84-4.37c.21-.19-.05-.29-.32-.1L7.9 14.49l-2.54-.79c-.55-.17-.56-.55.12-.82l9.91-3.82c.46-.17.86.11.71.74h-.46z"/>
    </svg>
  )
}

export default function Nav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14"
      style={{
        background: 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <a href="#" className="font-mono text-sm font-semibold tracking-tight">
        <GlitchText speed={0.4} enableShadows={false} enableOnHover={true} className="shiny-text">
          0xpat / doxie
        </GlitchText>
      </a>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm text-text-secondary hover:text-white transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>

        <a
          href="https://t.me/chefdoxie"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
          style={{
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.3)',
            color: '#7c3aed',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(124,58,237,0.25)'
            e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(124,58,237,0.15)'
            e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'
          }}
        >
          <TelegramIcon />
          Connect
        </a>
      </div>
    </motion.nav>
  )
}
