import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink px-5 py-20 text-softwhite sm:px-6">
      <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,rgba(209,173,132,0.2),transparent_50%)]" />
      <div className="relative mx-auto mb-14 max-w-6xl rounded-[32px] border border-softwhite/10 bg-softwhite/6 p-8 shadow-[0_28px_70px_rgba(0,0,0,0.24)] backdrop-blur-sm sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <div className="text-[0.7rem] uppercase tracking-[0.24em] text-warmbrown-light">Ready to look established online?</div>
            <h3 className="text-balance mt-4 max-w-2xl font-display text-[2rem] leading-[0.98] text-softwhite sm:text-[3rem]">
              A more aesthetic website should still feel credible, clear, and ready to sell.
            </h3>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
            <Link
              to="/checkout"
              className="rounded-full bg-softwhite px-6 py-4 text-center text-[0.74rem] uppercase tracking-[0.2em] text-ink transition hover:bg-warmbrown hover:text-softwhite"
            >
              Book Your Project
            </Link>
            <Link
              to="/portfolio"
              className="rounded-full border border-softwhite/18 px-6 py-4 text-center text-[0.74rem] uppercase tracking-[0.2em] text-softwhite transition hover:bg-softwhite hover:text-ink"
            >
              See Portfolio
            </Link>
          </div>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-14 border-b border-softwhite/10 pb-14 lg:grid-cols-[1.6fr_0.9fr_0.9fr_1fr]">
        <div>
          <Link to="/" className="inline-block rounded-[20px] bg-softwhite/95 px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.14)]" aria-label="ACE Web Studio home">
            <img src="/logo-ace-main.png" alt="ACE Web Studio" className="h-12 w-auto" />
          </Link>
          <p className="mt-5 max-w-sm text-[0.98rem] leading-8 text-softwhite/62">
            Premium, custom websites for small businesses and founders who want to look established, intentional, and worth remembering.
          </p>
        </div>

        <div>
          <h4 className="font-display text-xl text-softwhite">Navigate</h4>
          <div className="mt-5 grid gap-3 text-sm uppercase tracking-[0.12em] text-softwhite/58">
            <Link className="transition hover:text-softwhite" to="/">Home</Link>
            <Link className="transition hover:text-softwhite" to="/about">About</Link>
            <Link className="transition hover:text-softwhite" to="/services">Services</Link>
            <Link className="transition hover:text-softwhite" to="/portfolio">Portfolio</Link>
            <Link className="transition hover:text-softwhite" to="/contact">Contact</Link>
          </div>
        </div>

        <div>
          <h4 className="font-display text-xl text-softwhite">Packages</h4>
          <div className="mt-5 grid gap-3 text-sm uppercase tracking-[0.08em] text-softwhite/58">
            <Link className="transition hover:text-softwhite" to="/services">Basic</Link>
            <Link className="transition hover:text-softwhite" to="/services">Standard</Link>
            <Link className="transition hover:text-softwhite" to="/services">Premium</Link>
          </div>
        </div>

        <div>
          <h4 className="font-display text-xl text-softwhite">Connect</h4>
          <div className="mt-5 grid gap-3 text-sm uppercase tracking-[0.12em] text-softwhite/58">
            <Link className="transition hover:text-softwhite" to="/contact">Start a Project</Link>
            <Link className="transition hover:text-softwhite" to="/faq">FAQ</Link>
            <a className="text-anywhere transition hover:text-softwhite" href="mailto:aileen.aryeetey@outlook.com">aileen.aryeetey@outlook.com</a>
            <a className="text-anywhere transition hover:text-softwhite" href="mailto:cowusuforkuo@gmail.com">cowusuforkuo@gmail.com</a>
            <Link className="transition hover:text-softwhite" to="/admin">Admin</Link>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col justify-between gap-3 pt-8 text-xs uppercase tracking-[0.14em] text-softwhite/35 sm:flex-row">
        <p>© 2026 ACE Web Studio</p>
        <p>Design-first websites, built from scratch</p>
      </div>
    </footer>
  )
}
