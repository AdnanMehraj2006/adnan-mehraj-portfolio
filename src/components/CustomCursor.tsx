import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import './CustomCursor.css'

export function CustomCursor() {
  const [enabled] = useState(
    () =>
      !window.matchMedia('(pointer: coarse)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [active, setActive] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const glowX = useSpring(x, { stiffness: 120, damping: 18 })
  const glowY = useSpring(y, { stiffness: 120, damping: 18 })

  useEffect(() => {
    if (!enabled) return

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      const target = event.target as Element | null
      setActive(!!target && !!target.closest('a, button, [role="button"]'))
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div className="cursor-glow" style={{ x: glowX, y: glowY }} aria-hidden="true" />
      <motion.div
        className={`cursor-dot ${active ? 'is-active' : ''}`}
        style={{ x, y }}
        aria-hidden="true"
      />
    </>
  )
}
