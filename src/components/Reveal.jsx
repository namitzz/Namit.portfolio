import { motion, useReducedMotion } from 'framer-motion'

/**
 * The page's one scroll reveal.
 *
 * Two rules it exists to enforce everywhere rather than per section:
 *
 * `initial` never sets opacity. Only transform is animated, so content
 * that has to be readable is readable even if the animation never runs
 * (throttled tab, low-power mode, a paused compositor). Visibility is
 * never something an animation grants.
 *
 * Reduced motion is honoured in JS. The stylesheet's
 * `prefers-reduced-motion` rule shortens CSS animations, but these run
 * through Framer on the Web Animations API, which that rule does not
 * reach. Sections used to slide between 10 and 40px under the preference.
 *
 * `as` keeps the element semantic inside lists and articles; `amount: 0`
 * fires as soon as any part of the element crosses, which matters for the
 * tall rows further down the page.
 */
export default function Reveal({
  children,
  as = 'div',
  y = 14,
  x = 0,
  delay = 0,
  duration = 0.55,
  className = '',
  style,
}) {
  const reduce = useReducedMotion()
  const Tag = motion[as] || motion.div

  return (
    <Tag
      className={className}
      style={style}
      initial={reduce ? { x: 0, y: 0 } : { x, y }}
      whileInView={{ x: 0, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration, delay, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {children}
    </Tag>
  )
}

/**
 * Props for a reveal that grows a shape out of nothing: a bar from zero
 * height, a progress track from zero width, a path drawn from zero
 * length.
 *
 * These are the one case where `initial` legitimately hides content, and
 * so the one case that has to be gated. Under reduced motion the shape
 * starts at its finished value instead, because otherwise the preference
 * leaves a bar chart as an empty axis.
 *
 * A plain function rather than a hook: several of these render inside
 * `.map()`, where a hook call would be a different number of hooks per
 * render. Call `useReducedMotion()` once in the component and pass it in.
 */
export function grow(reduce, from, to, transition) {
  if (reduce) return { initial: to, animate: to }
  return {
    initial: from,
    whileInView: to,
    viewport: { once: true, amount: 0 },
    transition,
  }
}
