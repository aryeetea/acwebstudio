import { Link } from 'react-router-dom'
import SectionIntro from '../components/SectionIntro'
import { packages } from '../data/packages'

const comparisons = [
  ['Pages', '1', '3 to 5', '6 to 10'],
  ['Starting price', '$180', '$450', '$900'],
  ['Delivery', '2 weeks', '3 weeks', '4 to 5 weeks'],
  ['Mobile responsive', 'Included', 'Included', 'Included'],
  ['Contact form', 'Included', 'Included', 'Included'],
  ['Figma mockup first', 'Included', 'Included', 'Included'],
  ['Hosting & deployment', 'Included', 'Included', 'Included'],
  ['3 months free support', 'Included', 'Included', 'Included'],
  ['Social media icons', 'Included', 'Included', 'Included'],
  ['Revision rounds', '2', '3', '5'],
  ['Deposit required', '50%', '50%', '50%'],
]

export default function Services() {
  return (
    <>
      <section className="relative overflow-hidden px-5 pb-20 pt-36 sm:px-6 sm:pt-40">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top_right,rgba(196,168,130,0.24),transparent_36%),radial-gradient(circle_at_left,rgba(139,111,78,0.12),transparent_28%)]" />
        <div className="relative mx-auto max-w-6xl">
          <SectionIntro
            label="Services"
            title="Professional website packages with clear pricing and clear delivery."
            copy="Each package is built around a structured process, professional presentation, and a clear scope that makes booking straightforward."
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
                to={`/checkout?package=${pkg.slug}`}
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-4 text-center text-[0.75rem] font-medium uppercase tracking-[0.18em] transition hover:-translate-y-0.5 ${
                  pkg.featured
                    ? 'bg-softwhite text-ink hover:bg-warmbrown hover:text-softwhite'
                    : 'bg-ink text-softwhite hover:bg-warmbrown'
                }`}
              >
                Order {pkg.name}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-cream px-5 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-[4px] border border-warmbrown-pale bg-softwhite p-8 shadow-[0_18px_40px_rgba(17,17,16,0.05)] sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <div className="text-[0.72rem] uppercase tracking-[0.24em] text-warmbrown">All Packages Include</div>
              <h2 className="mt-5 font-display text-[2.3rem] leading-none text-ink sm:text-[2.8rem]">
                Everything needed for a professional website launch.
              </h2>
            </div>
            <div className="grid gap-3">
              {[
                'Design mockup in Figma before any code is written',
                'Mobile responsive on every device',
                'Contact form',
                'Hosting and deployment',
                '3 months free minor support after launch',
                'Social media icons',
              ].map(item => (
                <div key={item} className="rounded-[4px] border border-warmbrown-pale bg-cream px-4 py-4 text-[0.96rem] leading-7 text-ink/72">
                  {item}
                </div>
              ))}
            </div>
          </div>
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
                  {['Starter', 'Business', 'Professional'].map(head => (
                    <th key={head} className={`px-6 py-4 text-[0.7rem] uppercase tracking-[0.2em] sm:px-8 ${head === 'Business' ? 'text-warmbrown' : 'text-ink/50'}`}>
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
          <div className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-warmbrown">Monthly Maintenance</div>
          <h2 className="mt-5 font-display text-[2.4rem] leading-[1] text-ink sm:text-[3.1rem]">
            $80 per month after the first 3 months of free support.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[1rem] leading-8 text-ink/66">
            Monthly maintenance includes up to 3 small changes per month, text updates, image swaps, minor layout tweaks, and security checks. No contracts. Cancel anytime.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/checkout"
              className="rounded-full bg-ink px-8 py-4 text-center text-[0.76rem] font-medium uppercase tracking-[0.2em] text-softwhite transition hover:-translate-y-0.5 hover:bg-warmbrown"
            >
              Start Checkout
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-ink px-8 py-4 text-center text-[0.76rem] font-medium uppercase tracking-[0.2em] text-ink transition hover:bg-ink hover:text-softwhite"
            >
              Ask a Question
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-softwhite px-5 pb-24 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-[4px] border border-warmbrown-pale bg-softwhite px-6 py-14 text-center shadow-[0_16px_34px_rgba(17,17,16,0.05)] sm:px-10">
          <div className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-warmbrown">How Payment Works</div>
          <h2 className="mt-5 font-display text-[2.4rem] leading-[1] text-ink sm:text-[3.1rem]">
            50% deposit upfront. 50% on completion.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[1rem] leading-8 text-ink/66">
            A 50% deposit secures your project slot and allows work to begin. The remaining 50% is due on completion when you are happy with the final result.
          </p>
        </div>
      </section>
    </>
  )
}
