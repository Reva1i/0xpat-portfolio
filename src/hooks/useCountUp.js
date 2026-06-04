import { useState, useEffect, useRef } from 'react'

export function useCountUp(target, duration = 1500, start = false) {
  const [count, setCount] = useState(0)
  const frameRef = useRef(null)

  useEffect(() => {
    if (!start) return

    const startTime = performance.now()
    const startValue = 0

    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(startValue + (target - startValue) * eased)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        setCount(target)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration, start])

  return count
}
