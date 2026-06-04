import { motion } from 'framer-motion'

const CHAR_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function SplitText({
  text,
  className = '',
  charDelay = 0.03,
  duration = 0.4,
  ease = 'easeOut',
  initialDelay = 0,
}) {
  return (
    <span className={className} style={{ display: 'inline-block' }}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={CHAR_VARIANTS}
          initial="hidden"
          animate="visible"
          transition={{ duration, delay: initialDelay + i * charDelay, ease }}
          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}
