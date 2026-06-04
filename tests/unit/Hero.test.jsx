import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Hero from '../../src/components/Hero'

vi.mock('framer-motion', async () => {
  const { forwardRef } = await import('react')
  return {
    motion: new Proxy({}, {
      get: (_, prop) =>
        forwardRef(({ children, animate, initial, exit, transition, whileHover, whileTap, ...rest }, ref) =>
          require('react').createElement(
            ['div','section','button','a','span','p','nav'].includes(prop) ? prop : 'div',
            { ...rest, ref },
            children
          )
        ),
    }),
    AnimatePresence: ({ children }) => children,
    useInView: () => true,
  }
})

describe('Hero', () => {
  it('renders swap widget with IDEA and RESULT tokens', () => {
    render(<Hero />)
    expect(screen.getByText('IDEA')).toBeInTheDocument()
    expect(screen.getByText('RESULT')).toBeInTheDocument()
  })

  it('renders Swap button', () => {
    render(<Hero />)
    expect(screen.getByRole('button', { name: 'Swap' })).toBeInTheDocument()
  })

  it('renders eyebrow and bio', () => {
    render(<Hero />)
    expect(
      screen.getByText((_, el) => el?.tagName === 'P' && el?.textContent === 'Pat Kuo · @ChefDoxie · Taiwan')
    ).toBeInTheDocument()
    expect(screen.getByText(/Owner of one Dachshund/)).toBeInTheDocument()
  })

  it('shows Outcome! ✓ button label after clicking Swap', async () => {
    vi.useFakeTimers()
    render(<Hero />)
    fireEvent.click(screen.getByRole('button', { name: 'Swap' }))
    await act(async () => { vi.runAllTimers() })
    expect(screen.getByText('Outcome')).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('shows contact icon links after clicking Swap', async () => {
    vi.useFakeTimers()
    render(<Hero />)
    fireEvent.click(screen.getByRole('button', { name: 'Swap' }))
    await act(async () => { vi.runAllTimers() })
    const emailLink = screen.getByRole('link', { name: 'Email Pat' })
    expect(emailLink).toHaveAttribute('href', 'mailto:patkuo87225@gmail.com')
    const xLink = screen.getByRole('link', { name: 'X / Twitter' })
    expect(xLink).toHaveAttribute('href', 'https://x.com/ChefDoxie')
    vi.useRealTimers()
  })
})
