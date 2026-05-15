import { useMemo, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Button that subtly nudges toward the cursor on hover.
 * Falls back to a plain button on touch / coarse-pointer devices.
 */
export default function MagneticButton({
  as: Tag = 'a',
  strength = 18,
  className = '',
  style,
  children,
  ...rest
}) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18 })
  const sy = useSpring(y, { stiffness: 220, damping: 18 })

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    x.set(((e.clientX - cx) / (r.width / 2)) * strength)
    y.set(((e.clientY - cy) / (r.height / 2)) * strength)
  }

  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  const MotionTag = useMemo(() => motion(Tag), [Tag])
  return (
    <MotionTag
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy, ...style }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
