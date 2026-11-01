import { useEffect, useState } from 'react'

/** Approximate fixed navbar height (px) used as the active-section band offset. */
const NAVBAR_OFFSET = 72

/**
 * Returns the id of the section currently active in the viewport.
 *
 * Active-state logic is scroll-based (single rAF-throttled listener) rather
 * than an IntersectionObserver, which gives deterministic, flicker-free
 * tracking near section boundaries and lets us account for the fixed navbar.
 *
 * The initial value is derived from the URL hash (so a refresh/direct link
 * to `/#contact` restores Contact as active) and falls back to the first
 * section when no valid hash present. Scrolling keeps the value in sync but
 * never writes to the URL, so no history entries are created by scrolling.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(() => {
    const hash = window.location.hash.replace('#', '')
    return ids.includes(hash) ? hash : ids[0] ?? ''
  })

  useEffect(() => {
    if (ids.length === 0) return

    // Disable the browser's own scroll restoration so a hash URL always
    // restores deterministically to its section (and un-hashed URLs start
    // at the top), independent of reload timing/layout shifts.
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    // Cross valid hash from the URL. It is only ever *read* here — nothing
    // on init/refresh writes it, so a requested `#about`/`#contact` can
    // never be overwritten with `#home`.
    const hash = window.location.hash.replace('#', '')
    const target = ids.includes(hash) ? hash : null
    let restored = false
    let cancelled = false

    // A single deterministic restore. It runs after first paint and once more
    // on `window.load` (when fonts/images/3D have settled) so a layout shift
    // can't leave the page at the top. It waits (via rAF, no arbitrary
    // timeout) until the target section reports a settled, non-zero offset,
    // then scrolls exactly once — it never re-runs on user scrolling.
    const restoreHash = () => {
      if (cancelled || restored || !target) return
      const el = document.getElementById(target)
      if (!el) return
      const root = document.documentElement
      const prev = root.style.scrollBehavior
      root.style.scrollBehavior = 'auto'
      const rect = el.getBoundingClientRect()
      // Layout not settled yet (first frame) — retry on the next frame.
      if (rect.top === 0 && window.scrollY === 0 && document.readyState !== 'complete') {
        root.style.scrollBehavior = prev
        requestAnimationFrame(restoreHash)
        return
      }
      const targetY = Math.max(0, window.scrollY + rect.top - NAVBAR_OFFSET + 4)
      window.scrollTo(0, targetY)
      root.style.scrollBehavior = prev
      restored = true
      setActive(target)
    }

    requestAnimationFrame(restoreHash)
    window.addEventListener('load', restoreHash)

    let ticking = false

    const compute = () => {
      const sections = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null)
      if (sections.length === 0) return

      const doc = document.documentElement
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= doc.scrollHeight - 4

      if (scrolledToBottom) {
        setActive(ids[ids.length - 1])
        return
      }

      // Active section = the one whose top edge is just at/under the sticky
      // navbar line (i.e. the largest top value that is <= the band).
      let current = ids[0] ?? ''
      let bestTop = Number.NEGATIVE_INFINITY
      for (let i = 0; i < sections.length; i++) {
        const top = sections[i].getBoundingClientRect().top
        if (top <= NAVBAR_OFFSET + 8 && top > bestTop) {
          bestTop = top
          current = ids[i]
        }
      }
      setActive(current)
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          compute()
          ticking = false
        })
      }
    }

    // Skip the scroll-based active computation until the hash restore has been
    // applied, so the highlight isn't momentarily forced to the first section
    // while the page is still settling at the target.
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      cancelled = true
      window.removeEventListener('load', restoreHash)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids])

  return active
}
