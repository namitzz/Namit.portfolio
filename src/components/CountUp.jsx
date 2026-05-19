import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import { useEffect, useRef } from 'react'

/**
 * Animated number that counts up when scrolled into view.
 * Supports prefixes / suffixes and decimal places.
 */
export default function CountUp({
  to,
  from = 0,
  duration = 1.4,
  prefix = '',
  suffix = '',
  decimals = 0,
  plain = false,
  className = '',
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const mv = useMotionValue(from)
  const display = useTransform(mv, (v) => {
    const rounded = Math.round(v)
    const formatted = decimals
      ? v.toFixed(decimals)
      : plain
        ? String(rounded)
        : rounded.toLocaleString()
    return prefix + formatted + suffix
  })

  useEffect(() => {
    if (!inView) return
    const controls = animate(mv, to, { duration, ease: [0.22, 1, 0.36, 1] })
    return controls.stop
  }, [inView, mv, to, duration])

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  )
}
