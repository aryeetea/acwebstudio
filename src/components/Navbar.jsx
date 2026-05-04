import { useEffect, useState } from 'react'
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

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <nav className="mx-auto max-w-6xl rounded-[28px] border border-warmbrown/10 bg-softwhite/78 px-3 py-3 shadow-[0_24px_60px_rgba(17,17,16,0.08)] backdrop-blur-2xl sm:px-7 sm:py-4">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          <Link to="/" className="shrink-0" aria-label="ACE Web Studio home">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-[18px] border border-warmbrown/10 bg-softwhite/90 px-2.5 py-2 shadow-[0_14px_30px_rgba(17,17,16,0.05)] sm:px-3">
                <img src="/logo-ace-main.png" alt="ACE Web Studio" className="h-9 w-auto sm:h-11" />
              </div>
              <div className="hidden min-w-0 sm:block">
                <div className="text-[0.65rem] uppercase tracking-[0.26em] text-warmbrown">ACE Web Studio</div>
                <div className="mt-1 text-sm text-ink/60">Custom websites for modern brands</div>
              </div>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {links.map(link => {
              const active = pathname === link.to

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-full px-4 py-2 text-sm tracking-[0.14em] uppercase transition-all ${
                    active
                      ? 'bg-ink text-softwhite shadow-[0_12px_24px_rgba(23,20,17,0.18)]'
                      : 'text-ink/55 hover:bg-warmbrown-pale/40 hover:text-ink'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              to="/checkout"
              className="rounded-full border border-warmbrown/20 bg-warmbrown px-5 py-3 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-softwhite transition hover:-translate-y-0.5 hover:bg-ink"
            >
              Start Project
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(current => !current)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-warmbrown/15 bg-softwhite/90 text-ink md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            <div className="flex flex-col gap-1.5">
              <span className="h-px w-5 bg-ink" />
              <span className="h-px w-5 bg-ink" />
              <span className="h-px w-5 bg-ink" />
            </div>
          </button>
        </div>

        {open && (
          <div id="mobile-navigation" className="mt-4 grid gap-3 border-t border-warmbrown-pale/70 pt-4 md:hidden">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-[18px] px-4 py-3 text-sm uppercase tracking-[0.14em] transition ${
                  pathname === link.to ? 'bg-ink text-softwhite' : 'bg-warmbrown-pale/25 text-ink/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/checkout"
              className="rounded-[18px] bg-warmbrown px-4 py-3 text-center text-sm uppercase tracking-[0.14em] text-softwhite"
            >
              Start Project
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
