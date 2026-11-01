import { useEffect, useRef, useState } from 'react'

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

  // Becomes true once the initial hash restoration has settled. Until then we
  // never write the URL, so transient active-section detection during first
  // layout can't overwrite the hash the user actually opened with.
  const syncReady = useRef(false)

  useEffect(() => {
    if (ids.length === 0) return

    // Disable the browser's own scroll restoration so a hash URL always
    // restores deterministically to its section (and un-hashed URLs start
    // at the top), independent of reload timing/layout shifts.
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    // Read the valid hash from the URL. It is only ever *read* here — nothing
    // on init/refresh writes it, so a requested `#about`/`#contact` can
    // never be overwritten with `#home`.
    const hash = window.location.hash.replace('#', '')
    const target = ids.includes(hash) ? hash : null
    let restored = false
    let cancelled = false

    // If there is no hash to restore, URL syncing may begin immediately.
    if (!target) syncReady.current = true

    // One deterministic restore. To avoid the mobile race where the browser's
    // native fragment scroll and our JS scroll fight (leaving the page at the
    // top), we wait until the target section's layout is genuinely stable —
    // two consecutive animation frames with the same element offset — then
    // scroll exactly once. It is event-driven (rAF), not a fixed timeout, and
    // never re-runs on user scrolling or on the browser's own scroll events.
    const restoreHash = () => {
      if (cancelled || restored || !target) return
      const el = document.getElementById(target)
      if (!el) return

      const root = document.documentElement
      const prev = root.style.scrollBehavior
      const measure = () => el.getBoundingClientRect().top + window.scrollY

      let lastY = -1
      let stableFrames = 0
      let done = false

      const settle = () => {
        if (cancelled || restored) return
        const y = measure()
        if (y === lastY) stableFrames += 1
        else stableFrames = 0
        lastY = y
        if (stableFrames >= 2 || document.readyState === 'complete') {
          done = true
          root.style.scrollBehavior = 'auto'
          const targetY = Math.max(0, y - NAVBAR_OFFSET + 4)
          window.scrollTo(0, targetY)
          root.style.scrollBehavior = prev
          restored = true
          syncReady.current = true
          setActive(target)
          return
        }
        requestAnimationFrame(settle)
      }

      requestAnimationFrame(settle)
      // Safety: if `stableFrames` never reaches 2 (e.g. a long layout shift),
      // settle once the window has fully loaded regardless.
      if (!done) window.addEventListener('load', settle, { once: true })
    }

    requestAnimationFrame(restoreHash)

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
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids])

  // Synchronize the URL hash with the active section. Uses replaceState so
  // scroll-driven changes don't add history entries; explicit navigation
  // (pushState in the Navbar) still creates back/forward points.
  useEffect(() => {
    if (!syncReady.current || !active) return
    const id = active
    if (window.location.hash === `#${id}`) return
    history.replaceState(null, '', `#${id}`)
  }, [active])

  return active
}
