import { siteConfig } from '../config/site'
import './Footer.css'

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="footer__brand mono">{siteConfig.identity}</span>
        <span className="footer__copyright">
          © {CURRENT_YEAR} {siteConfig.name}
        </span>
        <span className="footer__signature mono">built with curiosity and code</span>
      </div>
    </footer>
  )
}
