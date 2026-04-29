import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

const links = [
  { to: '/',          label: 'Home' },
  { to: '/about',     label: 'About Us' },
  { to: '/services',  label: 'Services' },
  // Portfolio link removed
  // Team link removed, merged into About Us
  { to: '/faq',       label: 'FAQ' },
  { to: '/contact',   label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          AC Web <span>Studio</span>
        </Link>
        <ul className={styles.links}>
          {links.map(l => (
            <li key={l.to}>
              <Link to={l.to} className={pathname === l.to ? styles.active : ''}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <button className={styles.hamburger} onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
      </div>
      {open && (
        <div className={styles.mobile}>
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
        </div>
      )}
    </nav>
  )
}
