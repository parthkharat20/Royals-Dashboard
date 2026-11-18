import { useEffect, useRef, useState } from 'react'

export function AnimatedNumber({
  value,
  duration = 1000,
  decimals = 1,
  prefix = '',
  suffix = '',
  className = '',
}: {
  value: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<number>(0)

  useEffect(() => {
    const start = ref.current
    const target = Number.isFinite(value) ? value : 0
    const diff = target - start
    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      const current = start + diff * eased
      setDisplay(current)
      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        ref.current = target
        setDisplay(target)
      }
    }
    requestAnimationFrame(tick)
  }, [value, duration])

  return (
    <span className={`font-mono tabular ${className}`}>
      {prefix}{display.toFixed(decimals)}{suffix}
    </span>
  )
}
