import { useRef, useCallback } from 'react'

export function useMagneticHover(strength = 0.3, maxOffset = 10) {
  const ref = useRef(null)

  const onMouseMove = useCallback(
    (e) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) * strength
      const dy = (e.clientY - cy) * strength
      const x = Math.max(-maxOffset, Math.min(maxOffset, dx))
      const y = Math.max(-maxOffset, Math.min(maxOffset, dy))
      el.style.transform = `translate(${x}px, ${y}px)`
    },
    [strength, maxOffset]
  )

  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'translate(0px, 0px)'
    el.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }, [])

  const onMouseEnter = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transition = 'transform 0.1s linear'
  }, [])

  return { ref, onMouseMove, onMouseLeave, onMouseEnter }
}
