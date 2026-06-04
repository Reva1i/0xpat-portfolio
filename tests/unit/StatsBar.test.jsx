import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import StatsBar from '../../src/components/StatsBar'

vi.mock('framer-motion', async () => {
  const { forwardRef } = await import('react')
  return {
    motion: new Proxy({}, {
      get: (_, prop) =>
        forwardRef(({ children, animate, initial, exit, transition, whileHover, whileTap, ...rest }, ref) =>
          prop === 'div' || prop === 'section' || prop === 'button' || prop === 'a'
            ? require('react').createElement(prop, { ...rest, ref }, children)
            : require('react').createElement('div', { ...rest, ref }, children)
        ),
    }),
    AnimatePresence: ({ children }) => children,
    useInView: () => true,
    useMotionValue: (initial) => ({ get: () => initial, set: () => {}, on: () => () => {} }),
    useSpring: () => ({ on: () => () => {}, get: () => 0 }),
  }
})

describe('StatsBar', () => {
  it('renders all 4 stat items', () => {
    render(<StatsBar />)
    expect(screen.getByText('Peak DEX Volume')).toBeInTheDocument()
    expect(screen.getByText('TVL Sourced')).toBeInTheDocument()
    expect(screen.getByText('Protocol Revenue')).toBeInTheDocument()
    expect(screen.getByText('Profitability Improved')).toBeInTheDocument()
  })

  it('renders correct sublabels', () => {
    render(<StatsBar />)
    expect(screen.getByText('PancakeSwap on Base · 2025')).toBeInTheDocument()
    expect(screen.getByText('2025–2026 · Base, BNBChain, Monad')).toBeInTheDocument()
    expect(screen.getByText('Generated via IDO pools · BNBChain')).toBeInTheDocument()
    expect(screen.getByText('From –74K to +17K CAKE/mo · Base')).toBeInTheDocument()
  })
})
