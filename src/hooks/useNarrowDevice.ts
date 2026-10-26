import { useEffect } from 'react'

/**
 * Detects a small physical touch device independently of the CSS viewport.
 * Certain mobile browsers (e.g. "Request desktop site") report a desktop-wide
 * CSS viewport even on a narrow phone, so `window.innerWidth` is large and
 * the normal media queries switch to multi-column layouts that get squeezed
 * into the physical screen. Here we compare the physical screen size against
 * a small threshold and expose a `.device-narrow` class that layout CSS can
 * key off to force single-column layouts where appropriate.
 */
export function useNarrowDevice() {
  useEffect(() => {
    const CLASS = 'device-narrow'
    const THRESHOLD = 620

    const update = () => {
      const coarse = window.matchMedia('(pointer: coarse)').matches
      const physicalWidth = Math.min(window.screen.width || Infinity, window.innerWidth)
      document.documentElement.classList.toggle(CLASS, coarse && physicalWidth <= THRESHOLD)
    }

    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
      document.documentElement.classList.remove(CLASS)
    }
  }, [])
}
