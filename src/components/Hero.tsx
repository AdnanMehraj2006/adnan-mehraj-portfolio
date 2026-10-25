import { Suspense, lazy, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Copy } from 'lucide-react'
import { siteConfig } from '../config/site'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { downloadResume } from '../lib/download'
import { ErrorBoundary } from './ErrorBoundary'
import { Button } from './ui/Button'
import { Magnetic } from './ui/Magnetic'
import './Hero.css'

const HeroScene = lazy(() => import('./HeroScene').then((m) => ({ default: m.HeroScene })))

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function Hero() {
  const [copied, setCopied] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const meta = siteConfig.heroMeta

  async function copyStatus() {
    try {
      await navigator.clipboard.writeText(
        `${siteConfig.name} | ${siteConfig.role} | status: ${meta.status}`,
      )
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  return (
    <section id="home" className="hero tech-grid-fade">
      <div className="container hero__grid">
        <div className="hero__left">
          <motion.div
            className="hero__kicker"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="hero__kicker-dot" aria-hidden="true" />
            <span className="mono">{siteConfig.role}</span>
          </motion.div>

          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.08 }}
          >
            {siteConfig.heroPrimary}
          </motion.h1>

          <motion.p
            className="hero__desc"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.2 }}
          >
            {siteConfig.heroShort}
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.32 }}
          >
            <Magnetic>
              <Button href="#projects" onClick={undefined}>
                Explore My Work
                <ArrowUpRight size={18} aria-hidden="true" />
              </Button>
            </Magnetic>
            <Magnetic strength={0.18}>
              <Button variant="ghost" href="#contact">
                Explore My Profiles
              </Button>
            </Magnetic>
            <Button
              variant="ghost"
              className="hero__resume"
              onClick={() => {
                void downloadResume()
              }}
            >
              Resume / CV
            </Button>
          </motion.div>

          <motion.div
            className="hero__meta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {Object.entries(meta).map(([key, value]) => (
              <button
                key={key}
                type="button"
                className="hero__meta-chip"
                onClick={key === 'status' ? copyStatus : undefined}
                aria-label={key === 'status' ? `Copy status: ${value}` : undefined}
              >
                <span className="hero__meta-key mono">{key}</span>
                <span className="hero__meta-val mono">{value}</span>
                {key === 'status' ? (
                  copied ? (
                    <span className="hero__meta-copied mono">copied</span>
                  ) : (
                    <Copy size={12} className="hero__meta-copy" aria-hidden="true" />
                  )
                ) : null}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="hero__stage" aria-hidden="true">
          {reducedMotion ? (
            <div className="hero__fallback" />
          ) : (
            <ErrorBoundary fallback={<div className="hero__fallback" />}>
              <Suspense fallback={<div className="hero__fallback" />}>
                <HeroScene />
              </Suspense>
            </ErrorBoundary>
          )}
          <div className="hero__stage-label mono">
            <span className="hero__stage-dot" />
            interactive · webgl
          </div>
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
