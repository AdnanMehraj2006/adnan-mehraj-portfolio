import { useEffect, useState, type MouseEvent } from 'react'
import { Menu, X } from 'lucide-react'
import { siteConfig } from '../config/site'
import { useActiveSection } from '../hooks/useActiveSection'
import { downloadResume, isValidHttpsUrl } from '../lib/download'
import { Button } from './ui/Button'
import './Navbar.css'

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'problem-solving', label: 'Problem Solving' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
] as const

const SECTION_IDS = NAV_LINKS.map((link) => link.id)

const NAVBAR_OFFSET = 68

function navBehavior() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection(SECTION_IDS)
  const hasResume = isValidHttpsUrl(siteConfig.resumeDownloadUrl)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  const scrollToSection = (id: string, behavior: ScrollBehavior = navBehavior()) => {
    const el = document.getElementById(id)
    if (!el) return
    const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET + 4)
    window.scrollTo({ top, behavior })
  }

  // Deterministic nav: update the hash (keeps Back/Forward) and programmatically
  // scroll to the exact target offset, so the displayed section always matches
  // the highlighted nav item — no competing/aborted native smooth-scrolls.
  const goTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()
    if (window.location.hash !== `#${id}`) history.pushState(null, '', `#${id}`)
    scrollToSection(id)
  }

  useEffect(() => {
    const onPop = () => {
      const hash = window.location.hash.replace('#', '')
      if ((SECTION_IDS as string[]).includes(hash)) scrollToSection(hash, 'auto')
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <a
          href="#home"
          className="navbar__brand"
          onClick={(event) => goTo(event, 'home')}
        >
          <span className="navbar__logo mono">AM.dev</span>
          <span className="navbar__status" aria-hidden="true">
            <span className="navbar__status-dot" />
            <span className="mono">online</span>
          </span>
        </a>

        <nav className="navbar__links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`navbar__link mono ${active === link.id ? 'is-active' : ''}`}
              aria-current={active === link.id ? 'true' : undefined}
              onClick={(event) => goTo(event, link.id)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="navbar__actions">
          {/* Resume / CV: silent no-op while no URL is configured. */}
          <Button
            variant="nav"
            className="navbar__resume"
            aria-label="Resume / CV"
            onClick={() => {
              void downloadResume()
            }}
          >
            {hasResume ? 'Resume / CV' : 'Resume / CV'}
          </Button>

          <button
            type="button"
            className="navbar__toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div id="mobile-menu" className="navbar__mobile">
          <nav aria-label="Mobile" className="navbar__mobile-inner">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`navbar__moblink mono ${active === link.id ? 'is-active' : ''}`}
                onClick={(event) => {
                  goTo(event, link.id)
                  close()
                }}
              >
                <span className="navbar__mobnum">0{NAV_LINKS.indexOf(link) + 1}</span>
                {link.label}
              </a>
            ))}
            <div className="navbar__mobresume">
              <Button variant="primary" className="navbar__mobresume-btn">
                Resume / CV
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
