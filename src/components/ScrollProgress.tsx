import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'
import './ScrollProgress.css'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const spring = useSpring(0, { stiffness: 120, damping: 22 })

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const total = doc.scrollHeight - doc.clientHeight
      const value = total > 0 ? doc.scrollTop / total : 0
      setProgress(value)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    spring.set(progress)
  }, [progress, spring])

  return (
    <div className="scroll-progress" aria-hidden="true">
      <motion.div className="scroll-progress__bar" style={{ scaleX: spring }} />
    </div>
  )
}
