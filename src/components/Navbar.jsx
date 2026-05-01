import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/checkout', label: 'Order' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/contact', label: 'Contact' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav className="mx-auto max-w-6xl rounded-[4px] border border-warmbrown-pale/80 bg-softwhite/76 px-5 py-4 shadow-[0_18px_40px_rgba(17,17,16,0.06)] backdrop-blur-xl sm:px-7">
        <div className="flex items-center justify-between gap-6">
          <Link to="/" className="shrink-0" aria-label="ACE Web Studio home">
            <img src="/logo-ace-main.png" alt="ACE Web Studio" className="h-12 w-auto" />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {links.map(link => {
              const active = pathname === link.to

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm tracking-[0.14em] uppercase transition-colors ${
                    active ? 'text-ink' : 'text-ink/55 hover:text-ink'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="hidden md:block">
            <Link
              to="/admin"
              className="rounded-full bg-ink px-5 py-3 text-[0.74rem] font-medium uppercase tracking-[0.18em] text-softwhite transition hover:-translate-y-0.5 hover:bg-warmbrown"
            >
              Admin
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(current => !current)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-warmbrown-pale text-ink md:hidden"
            aria-label="Toggle navigation"
          >
            <div className="flex flex-col gap-1.5">
              <span className="h-px w-5 bg-ink" />
              <span className="h-px w-5 bg-ink" />
              <span className="h-px w-5 bg-ink" />
            </div>
          </button>
        </div>

        {open && (
          <div className="mt-5 grid gap-3 border-t border-warmbrown-pale/80 pt-5 md:hidden">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`rounded-[4px] px-2 py-2 text-sm uppercase tracking-[0.14em] ${
                  pathname === link.to ? 'text-ink' : 'text-ink/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-ink px-5 py-3 text-center text-[0.74rem] font-medium uppercase tracking-[0.18em] text-softwhite"
            >
              Admin
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
