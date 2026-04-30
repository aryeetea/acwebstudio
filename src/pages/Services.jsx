import { Link } from 'react-router-dom'
import SectionIntro from '../components/SectionIntro'
import { packages } from '../data/packages'

const comparisons = [
  ['Pages', '1', '3–5', '6–10'],
  ['Mobile responsive', 'Included', 'Included', 'Included'],
  ['Contact form', 'Optional', 'Included', 'Included'],
  ['Animations', 'Light', 'Standard', 'Advanced'],
  ['Revision rounds', '2', '3', '5'],
  ['SEO structure', 'Basic', 'Included', 'Included'],
  ['Custom features', 'Optional', 'Light', 'Advanced'],
]

export default function Services() {
  return (
    <>
      <section className="relative overflow-hidden px-5 pb-20 pt-36 sm:px-6 sm:pt-40">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_right,rgba(255,208,0,0.28),transparent_34%),radial-gradient(circle_at_left,rgba(240,23,106,0.18),transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl">
          <SectionIntro
            label="Services"
            title="Clear pricing, premium presentation, and room to scale."
            copy="Each package is designed to feel custom, high-touch, and professionally structured from the start."
          />
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
          {packages.map(pkg => (
            <article
              key={pkg.slug}
              className={`rounded-[4px] border p-8 shadow-[0_18px_40px_rgba(17,17,16,0.05)] ${
                pkg.featured ? 'border-ink bg-ink text-softwhite' : 'border-warmbrown-pale bg-softwhite'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className={`text-[0.7rem] uppercase tracking-[0.22em] ${pkg.featured ? 'text-warmbrown-light' : 'text-warmbrown'}`}>
                    {pkg.tier}
                  </div>
                  <h2 className="mt-4 font-display text-[2.2rem] leading-none">{pkg.name}</h2>
                </div>
                {pkg.featured && (
                  <span className="rounded-full border border-softwhite/10 bg-softwhite/8 px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-softwhite/80">
                    Recommended
                  </span>
                )}
              </div>

              <div className="mt-8 font-display text-[2.8rem] leading-none">{pkg.price}</div>
              <p className={`mt-5 text-[0.96rem] leading-8 ${pkg.featured ? 'text-softwhite/65' : 'text-ink/64'}`}>
                {pkg.who}
              </p>

              <div className="mt-8 rounded-[4px] border px-4 py-4 text-sm uppercase tracking-[0.16em] ${
                pkg.featured ? 'border-softwhite/10 text-softwhite/75' : 'border-warmbrown-pale text-ink/58'
              }">
                Turnaround: {pkg.turnaround}
              </div>

              <div className="mt-8">
                <div className={`text-[0.72rem] uppercase tracking-[0.2em] ${pkg.featured ? 'text-warmbrown-light' : 'text-warmbrown'}`}>
                  Included
                </div>
                <ul className={`mt-4 grid gap-3 text-[0.95rem] leading-7 ${pkg.featured ? 'text-softwhite/78' : 'text-ink/68'}`}>
                  {pkg.includes.map(item => (
                    <li key={item} className="flex gap-3">
                      <span className={pkg.featured ? 'text-warmbrown-light' : 'text-warmbrown'}>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`mt-8 rounded-[4px] px-5 py-5 ${pkg.featured ? 'bg-softwhite/6' : 'bg-cream'}`}>
                <div className={`text-[0.72rem] uppercase tracking-[0.2em] ${pkg.featured ? 'text-softwhite/58' : 'text-ink/55'}`}>
                  Add-ons
                </div>
                <div className="mt-4 grid gap-3">
                  {pkg.addons.map(addon => (
                    <div key={addon.id} className={`flex items-start justify-between gap-4 text-sm ${pkg.featured ? 'text-softwhite/72' : 'text-ink/62'}`}>
                      <span>{addon.label}</span>
                      <span className={pkg.featured ? 'text-warmbrown-light' : 'text-warmbrown'}>{addon.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to={`/contact?package=${pkg.slug}`}
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-4 text-center text-[0.75rem] font-medium uppercase tracking-[0.18em] transition hover:-translate-y-0.5 ${
                  pkg.featured
                    ? 'bg-softwhite text-ink hover:bg-warmbrown hover:text-softwhite'
                    : 'bg-ink text-softwhite hover:bg-warmbrown'
                }`}
              >
                Choose {pkg.name}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-softwhite px-5 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[4px] border border-warmbrown-pale shadow-[0_18px_40px_rgba(17,17,16,0.05)]">
          <div className="border-b border-warmbrown-pale bg-cream px-6 py-5 sm:px-8">
            <h2 className="font-display text-[2rem] text-ink sm:text-[2.3rem]">Package Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-warmbrown-pale bg-softwhite">
                  <th className="px-6 py-4 text-[0.7rem] uppercase tracking-[0.2em] text-ink/50 sm:px-8">Feature</th>
                  {['Basic', 'Standard', 'Premium'].map(head => (
                    <th key={head} className={`px-6 py-4 text-[0.7rem] uppercase tracking-[0.2em] sm:px-8 ${head === 'Standard' ? 'text-warmbrown' : 'text-ink/50'}`}>
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisons.map(row => (
                  <tr key={row[0]} className="border-b border-warmbrown-pale/80">
                    <td className="px-6 py-4 text-[0.95rem] text-ink/65 sm:px-8">{row[0]}</td>
                    <td className="px-6 py-4 text-[0.95rem] text-ink sm:px-8">{row[1]}</td>
                    <td className="px-6 py-4 text-[0.95rem] text-ink sm:px-8">{row[2]}</td>
                    <td className="px-6 py-4 text-[0.95rem] text-ink sm:px-8">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-[4px] border border-warmbrown-pale bg-cream px-6 py-14 text-center shadow-[0_16px_34px_rgba(17,17,16,0.05)] sm:px-10">
          <div className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-warmbrown">Not Sure?</div>
          <h2 className="mt-5 font-display text-[2.4rem] leading-[1] text-ink sm:text-[3.1rem]">
            We can recommend the right package for you.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[1rem] leading-8 text-ink/66">
            If you already know your goals but are not sure which tier makes the most sense, reach out and we will guide you toward the best fit.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="rounded-full bg-ink px-8 py-4 text-center text-[0.76rem] font-medium uppercase tracking-[0.2em] text-softwhite transition hover:-translate-y-0.5 hover:bg-warmbrown"
            >
              Request a Quote
            </Link>
            <Link
              to="/about"
              className="rounded-full border border-ink px-8 py-4 text-center text-[0.76rem] font-medium uppercase tracking-[0.2em] text-ink transition hover:bg-ink hover:text-softwhite"
            >
              About the Studio
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
