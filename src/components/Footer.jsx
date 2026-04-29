import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>AC Web <span>Studio</span></Link>
            <p>Custom websites built from scratch, designed to elevate your brand and convert visitors into clients.</p>
          </div>
          <div className={styles.col}>
            <h4>Navigation</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/services">Services</Link>
            <Link to="/portfolio">Portfolio</Link>
            <Link to="/team">Meet the Team</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className={styles.col}>
            <h4>Packages</h4>
            <Link to="/services">Basic — $150–$250</Link>
            <Link to="/services">Standard — $400–$700</Link>
            <Link to="/services">Premium — $800–$1300</Link>
          </div>
          <div className={styles.col}>
            <h4>Connect</h4>
            <a href="https://fiverr.com/yourprofile" target="_blank" rel="noreferrer">Fiverr</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="mailto:hello@acwebstudio.com">Email</a>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>© 2025 AC Web Studio. All rights reserved.</p>
          <p>Custom websites, crafted with care.</p>
        </div>
      </div>
    </footer>
  )
}
