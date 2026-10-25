import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { siteConfig } from '../config/site'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { ErrorBoundary } from './ErrorBoundary'
import { Button } from './ui/Button'
import { Magnetic } from './ui/Magnetic'
import './Hero.css'

const HeroScene = lazy(() => import('./HeroScene').then((m) => ({ default: m.HeroScene })))

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function Hero() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <section id="home" className="hero tech-grid-fade">
      <div className="container hero__grid">
        <div className="hero__scene" aria-hidden="true">
          {reducedMotion ? (
            <div className="hero__scene-fallback" />
          ) : (
            <ErrorBoundary fallback={<div className="hero__scene-fallback" />}>
              <Suspense fallback={<div className="hero__scene-fallback" />}>
                <HeroScene />
              </Suspense>
            </ErrorBoundary>
          )}
        </div>
        <div className="hero__content">
          <motion.div
            className="hero__kicker"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="hero__kicker-dot" aria-hidden="true" />
            <span className="mono">{siteConfig.heroEyebrow}</span>
          </motion.div>

          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.08 }}
          >
            {siteConfig.heroName}
          </motion.h1>

          <motion.p
            className="hero__subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.16 }}
          >
            {siteConfig.heroSubtitle}
          </motion.p>

          <motion.p
            className="hero__desc"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.24 }}
          >
            {siteConfig.heroDescription}
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.32 }}
          >
            <Magnetic>
              <Button
                href="#projects"
                variant="ghost"
                className="hero__action hero__action--primary"
              >
                Explore My Work
              </Button>
            </Magnetic>
            <Magnetic strength={0.18}>
              <Button href="#contact" variant="ghost" className="hero__action">
                Explore My Profiles
              </Button>
            </Magnetic>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#about"
        className="hero__scroll"
        aria-label="Scroll to about section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
      >
        <span className="hero__scroll-text mono">scroll</span>
        <ArrowDown size={16} aria-hidden="true" />
      </motion.a>
    </section>
  )
}
