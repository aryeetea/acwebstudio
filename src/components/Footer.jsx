import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-ink px-5 py-20 text-softwhite sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-14 border-b border-softwhite/10 pb-14 lg:grid-cols-[1.6fr_0.9fr_0.9fr_1fr]">
        <div>
          <Link to="/" className="font-display text-[2rem] leading-none text-softwhite">
            AC Web <span className="text-warmbrown-light">Studio</span>
          </Link>
          <p className="mt-5 max-w-sm text-[0.98rem] leading-8 text-softwhite/58">
            Premium, custom websites for small businesses and founders who want to look established, intentional, and worth remembering.
          </p>
        </div>

        <div>
          <h4 className="font-display text-xl text-softwhite">Navigate</h4>
          <div className="mt-5 grid gap-3 text-sm uppercase tracking-[0.12em] text-softwhite/58">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/services">Services</Link>
            <Link to="/portfolio">Portfolio</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div>
          <h4 className="font-display text-xl text-softwhite">Packages</h4>
          <div className="mt-5 grid gap-3 text-sm uppercase tracking-[0.08em] text-softwhite/58">
            <Link to="/services">Basic</Link>
            <Link to="/services">Standard</Link>
            <Link to="/services">Premium</Link>
          </div>
        </div>

        <div>
          <h4 className="font-display text-xl text-softwhite">Connect</h4>
          <div className="mt-5 grid gap-3 text-sm uppercase tracking-[0.12em] text-softwhite/58">
            <Link to="/contact">Start a Project</Link>
            <Link to="/faq">FAQ</Link>
            <a href="mailto:aileen.aryeetey@outlook.com">aileen.aryeetey@outlook.com</a>
            <a href="mailto:cowusuforkuo@gmail.com">cowusuforkuo@gmail.com</a>
            <Link to="/admin">Admin</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 pt-8 text-xs uppercase tracking-[0.14em] text-softwhite/35 sm:flex-row">
        <p>© 2026 AC Web Studio</p>
        <p>Design-first websites, built from scratch</p>
      </div>
    </footer>
  )
}
