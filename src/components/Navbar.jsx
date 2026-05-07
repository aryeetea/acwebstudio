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
      <nav className="mx-auto max-w-7xl rounded-[28px] border border-warmbrown/10 bg-softwhite/82 px-3 py-3 shadow-[0_24px_60px_rgba(17,17,16,0.08)] backdrop-blur-2xl sm:px-5 sm:py-4 lg:px-7">
        <div className="flex items-center justify-between gap-3 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-6">
          <Link to="/" className="shrink-0" aria-label="ACE Web Studio home">
            <div className="rounded-[22px] border border-warmbrown/10 bg-softwhite/92 px-3 py-2 shadow-[0_14px_30px_rgba(17,17,16,0.05)] sm:px-4 sm:py-3">
              <img src="/logo-ace-main.png" alt="ACE Web Studio" className="h-10 w-auto sm:h-14" />
            </div>
          </Link>

          <div className="hidden min-w-0 items-center justify-center gap-1 lg:flex xl:gap-2">
            {links.map(link => {
              const active = pathname === link.to

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-full px-3 py-2.5 text-[0.68rem] tracking-[0.12em] uppercase transition-all xl:px-4 xl:text-[0.79rem] xl:tracking-[0.16em] ${
                    active
                      ? 'bg-ink text-softwhite shadow-[0_12px_24px_rgba(23,20,17,0.18)]'
                      : 'text-ink/55 hover:bg-warmbrown-pale/40 hover:text-ink'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => setOpen(current => !current)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-warmbrown/15 bg-softwhite/90 text-ink lg:hidden"
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
          <div id="mobile-navigation" className="mt-4 grid gap-3 border-t border-warmbrown-pale/70 pt-4 lg:hidden">
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
          </div>
        )}
      </nav>
    </header>
  )
}
