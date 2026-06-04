import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Liquidity from '../../src/components/Liquidity'
import { DEAL_GROUPS } from '../../src/utils/data'

vi.mock('framer-motion', async () => {
  const { forwardRef } = await import('react')
  return {
    motion: new Proxy({}, {
      get: (_, prop) =>
        forwardRef(({ children, animate, initial, exit, transition, whileHover, whileTap, ...rest }, ref) =>
          require('react').createElement(
            ['div','section','button','a','span','p'].includes(prop) ? prop : 'div',
            { ...rest, ref },
            children
          )
        ),
    }),
    AnimatePresence: ({ children }) => children,
    useInView: () => true,
    useMotionValue: (initial) => ({ get: () => initial, set: () => {}, on: () => () => {} }),
    useSpring: () => ({ on: () => () => {}, get: () => 0 }),
  }
})

describe('Liquidity', () => {
  it('renders 2026 deals by default (expanded)', () => {
    render(<Liquidity />)
    DEAL_GROUPS[0].deals.forEach((deal) => {
      expect(screen.getByText(deal.protocol)).toBeInTheDocument()
    })
  })

  it('renders 2025 deals after expanding accordion', () => {
    render(<Liquidity />)
    fireEvent.click(screen.getByRole('button', { name: '2025' }))
    DEAL_GROUPS[1].deals.forEach((deal) => {
      expect(screen.getAllByText(deal.protocol).length).toBeGreaterThan(0)
    })
  })

  it('renders year group accordion buttons', () => {
    render(<Liquidity />)
    expect(screen.getByRole('button', { name: '2026' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2025' })).toBeInTheDocument()
  })

  it('renders U with coordinated label', () => {
    render(<Liquidity />)
    expect(screen.getByText('U')).toBeInTheDocument()
    expect(screen.getByText('coordinated')).toBeInTheDocument()
  })

  it('renders correct TVL values in 2026', () => {
    render(<Liquidity />)
    expect(screen.getByText('$20M')).toBeInTheDocument()
    expect(screen.getByText('$2M')).toBeInTheDocument()
    expect(screen.getByText('$700K')).toBeInTheDocument()
  })

  it('renders correct TVL values in 2025', () => {
    render(<Liquidity />)
    fireEvent.click(screen.getByRole('button', { name: '2025' }))
    expect(screen.getByText('$1.3M')).toBeInTheDocument()
    expect(screen.getByText('$1.1M')).toBeInTheDocument()
  })

  it('renders correct chain labels in 2026', () => {
    render(<Liquidity />)
    const baseLabels = screen.getAllByText('Base')
    expect(baseLabels.length).toBeGreaterThan(0)
    expect(screen.getByText('BNBChain')).toBeInTheDocument()
  })

  it('renders DEGEN row after expanding 2025', () => {
    render(<Liquidity />)
    fireEvent.click(screen.getByRole('button', { name: '2025' }))
    expect(screen.getByText('DEGEN')).toBeInTheDocument()
  })

  it('renders footer with year-split sourced totals', () => {
    render(<Liquidity />)
    expect(screen.getByText('2026:')).toBeInTheDocument()
    expect(screen.getByText('2025:')).toBeInTheDocument()
    const body = document.body.textContent
    expect(body).toMatch(/M\+ sourced/)
    expect(body).toMatch(/M sourced/)
    expect(body).toMatch(/M coordinated/)
  })
})
