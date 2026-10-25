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

    // Restore scroll position for a hash present at load when the browser has
    // not already positioned the target section in the active band (refresh /
    // direct-link restoration). Uses an instant jump so it never races the
    // browser's own smooth anchor scroll.
    const hash = window.location.hash.replace('#', '')
    if (ids.includes(hash)) {
      const el = document.getElementById(hash)
      // On a cold load (refresh / direct link) the browser's own anchor
      // scroll is unreliable and can leave the section just outside the
      // active band. Always snap deterministically to the target offset so
      // the correct section is both restored and highlighted.
      if (el) {
        const root = document.documentElement
        const prev = root.style.scrollBehavior
        root.style.scrollBehavior = 'auto'
        const rect = el.getBoundingClientRect()
        const targetY = Math.max(0, window.scrollY + rect.top - NAVBAR_OFFSET + 4)
        window.scrollTo(0, targetY)
        root.style.scrollBehavior = prev
      }
    }

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

    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids])

  return active
}
