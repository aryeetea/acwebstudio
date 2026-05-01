import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FaqAccordion from '../components/FaqAccordion'
import PortfolioShowcase from '../components/PortfolioShowcase'
import SectionIntro from '../components/SectionIntro'
import { faqs } from '../data/faqs'
import { fetchPortfolioProjects } from '../lib/api'

const services = [
  {
    tier: 'Basic',
    price: '$150–$250',
    description: 'A focused one-page presence for freelancers, creatives, and small brands who need something polished quickly.',
    features: ['1 custom page', 'Mobile-first build', 'Contact section', '2 revision rounds'],
  },
  {
    tier: 'Professional',
    price: '$400–$700',
    description: 'A multi-page website with stronger structure, strategy, and conversion points for growing businesses.',
    features: ['3–5 custom pages', 'Inquiry form', 'Motion details', '3 revision rounds'],
    featured: true,
  },
  {
    tier: 'Signature',
    price: '$800–$1300',
    description: 'A more expansive, premium build for brands that want a richer experience and room to scale.',
    features: ['6–10 custom pages', 'Advanced interactions', 'Custom features', 'Priority support'],
  },
]

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0)
  const [portfolioProjects, setPortfolioProjects] = useState([])
  const [portfolioLoading, setPortfolioLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadPortfolioProjects() {
      try {
        const items = await fetchPortfolioProjects()

        if (!cancelled) {
          setPortfolioProjects(items.slice(0, 3))
        }
      } catch {
        if (!cancelled) {
          setPortfolioProjects([])
        }
      } finally {
        if (!cancelled) {
          setPortfolioLoading(false)
        }
      }
    }

    loadPortfolioProjects()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <section className="relative overflow-hidden px-5 pb-24 pt-36 sm:px-6 sm:pt-40">
        <div className="absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(circle_at_top_right,rgba(196,168,130,0.24),transparent_36%),radial-gradient(circle_at_left,rgba(139,111,78,0.12),transparent_28%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="animate-fade-up flex items-center gap-3 text-[0.72rem] font-medium uppercase tracking-[0.24em] text-warmbrown">
            <span className="h-px w-8 bg-warmbrown/70" />
            <span>Web Design & Development</span>
          </div>
          <h1 className="animate-fade-up mt-6 max-w-5xl font-display text-[3.25rem] leading-[0.92] text-ink opacity-0 [animation-delay:120ms] sm:text-[4.4rem] lg:text-[5.4rem]">
            Premium websites for <span className="italic text-warmbrown">small businesses</span> with ambition.
          </h1>
          <p className="animate-fade-up mt-7 max-w-3xl text-[1.08rem] leading-8 text-ink/66 opacity-0 [animation-delay:240ms]">
            ACE Web Studio creates custom websites with an editorial eye, thoughtful structure, and clean development for founders who want to look established online.
          </p>
          <div className="animate-fade-up mt-10 flex flex-col gap-4 opacity-0 [animation-delay:360ms] sm:flex-row">
            <Link
              to="/checkout"
              className="rounded-full bg-ink px-8 py-4 text-center text-[0.76rem] font-medium uppercase tracking-[0.2em] text-softwhite transition hover:-translate-y-0.5 hover:bg-warmbrown"
            >
              Place an Order
            </Link>
            <Link
              to="/portfolio"
              className="rounded-full border border-ink px-8 py-4 text-center text-[0.76rem] font-medium uppercase tracking-[0.2em] text-ink transition hover:bg-ink hover:text-softwhite"
            >
              View Work
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-ink px-5 py-20 text-softwhite sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <h2 className="max-w-xl font-display text-[2.5rem] leading-[1] sm:text-[3.4rem]">
              Design-first development that feels refined and performs.
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-8">
              {[
                ['100%', 'Custom-built'],
                ['3', 'Core packages'],
                ['24h', 'Reply window'],
                ['∞', 'Creative potential'],
              ].map(([value, label]) => (
                <div key={label} className="border-t border-softwhite/15 pt-4">
                  <div className="font-display text-[2.6rem] leading-none text-softwhite">{value}</div>
                  <div className="mt-2 text-[0.78rem] uppercase tracking-[0.18em] text-softwhite/45">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="self-end text-[1rem] leading-8 text-softwhite/60">
            Each site is written from scratch with a balance of clarity, personality, and restraint. The result feels premium without trying too hard, which is exactly what helps smaller brands look more established.
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <SectionIntro
            label="Services"
            title="Packages built to match your stage of growth."
            copy="Three clear offers, each designed to feel elevated, custom, and practical for the kind of business you are building."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {services.map(service => (
              <article
                key={service.tier}
                className={`group rounded-[4px] border p-8 transition duration-300 hover:-translate-y-1 ${
                  service.featured
                    ? 'border-ink bg-ink text-softwhite shadow-[0_24px_60px_rgba(17,17,16,0.12)]'
                    : 'border-warmbrown-pale bg-softwhite text-ink shadow-[0_14px_36px_rgba(17,17,16,0.04)]'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className={`text-[0.74rem] uppercase tracking-[0.22em] ${service.featured ? 'text-warmbrown-light' : 'text-warmbrown'}`}>
                    {service.tier}
                  </div>
                  {service.featured && (
                    <span className="rounded-full border border-softwhite/10 bg-softwhite/8 px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-softwhite/80">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="mt-8 font-display text-[2.3rem] leading-none">{service.price}</div>
                <p className={`mt-5 text-[0.97rem] leading-8 ${service.featured ? 'text-softwhite/68' : 'text-ink/64'}`}>
                  {service.description}
                </p>
                <ul className={`mt-8 grid gap-3 text-[0.95rem] leading-7 ${service.featured ? 'text-softwhite/80' : 'text-ink/72'}`}>
                  {service.features.map(feature => (
                    <li key={feature} className="flex gap-3">
                      <span className={service.featured ? 'text-warmbrown-light' : 'text-warmbrown'}>•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/checkout?package=${service.tier.toLowerCase().includes('professional') ? 'professional' : service.tier.toLowerCase().includes('signature') ? 'signature' : 'starter'}`}
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-4 text-center text-[0.75rem] font-medium uppercase tracking-[0.18em] transition hover:-translate-y-0.5 ${
                    service.featured
                      ? 'bg-softwhite text-ink hover:bg-warmbrown hover:text-softwhite'
                      : 'bg-ink text-softwhite hover:bg-warmbrown'
                  }`}
                >
                  Order This Package
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-softwhite px-5 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <SectionIntro
            label="Selected Work"
            title="Recent client work, built from the ground up."
            copy="Every project is designed and coded from scratch — no templates, no shortcuts. Clean, custom work that represents the business behind it."
          />

          <div className="mt-14">
            <PortfolioShowcase
              projects={portfolioProjects}
              loading={portfolioLoading}
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <SectionIntro
              label="FAQ"
              title="Questions clients usually ask before they book."
              copy="The essentials, clearly answered."
            />
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/faq"
                className="rounded-full border border-ink px-7 py-4 text-center text-[0.75rem] font-medium uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-softwhite"
              >
                Full FAQ
              </Link>
              <Link
                to="/contact"
                className="rounded-full bg-ink px-7 py-4 text-center text-[0.75rem] font-medium uppercase tracking-[0.18em] text-softwhite transition hover:bg-warmbrown"
              >
                Get in Touch
              </Link>
            </div>
          </div>

          <FaqAccordion items={faqs.slice(0, 4)} openIndex={openFaq} onToggle={setOpenFaq} compact />
        </div>
      </section>

      <section className="bg-warmbrown px-5 py-20 text-center text-softwhite sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-[2.5rem] leading-[1] sm:text-[3.6rem]">
            Ready for a website that looks as established as your business deserves?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[1rem] leading-8 text-softwhite/78">
            Let’s shape a site that feels confident, clean, and unmistakably yours.
          </p>
          <div className="mt-10">
            <Link
              to="/checkout"
              className="inline-flex rounded-full bg-softwhite px-8 py-4 text-[0.76rem] font-medium uppercase tracking-[0.2em] text-warmbrown transition hover:-translate-y-0.5 hover:bg-ink hover:text-softwhite"
            >
              Go to Checkout
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
