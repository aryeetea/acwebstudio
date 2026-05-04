import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FaqAccordion from '../components/FaqAccordion'
import PortfolioShowcase from '../components/PortfolioShowcase'
import SectionIntro from '../components/SectionIntro'
import { faqs } from '../data/faqs'
import { fetchPortfolioProjects } from '../lib/api'

const services = [
  {
    tier: 'Starter',
    price: '$180',
    description: 'A clean one-page website for businesses that need a professional online presence without unnecessary complexity.',
    features: ['1 custom page', '2 week delivery', '2 revisions', '50% deposit upfront'],
  },
  {
    tier: 'Business',
    price: '$450',
    description: 'A multi-page website for businesses that need room to explain their services and build trust clearly.',
    features: ['3 to 5 custom pages', '3 week delivery', '3 revisions', '50% deposit upfront'],
    featured: true,
  },
  {
    tier: 'Professional',
    price: '$900',
    description: 'A premium multi-page website for established businesses that need a fuller and more refined digital presence.',
    features: ['6 to 10 custom pages', '4 to 5 week delivery', '5 revisions', '50% deposit upfront'],
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
      <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 sm:pb-24 sm:pt-40">
        <div className="absolute inset-x-0 top-0 h-[660px] bg-[radial-gradient(circle_at_top_right,rgba(196,168,130,0.28),transparent_34%),radial-gradient(circle_at_left,rgba(139,111,78,0.12),transparent_26%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="animate-fade-up flex flex-wrap items-center gap-3 text-[0.68rem] font-medium uppercase editorial-kicker text-warmbrown sm:text-[0.72rem]">
              <span className="rounded-full border border-warmbrown/12 bg-softwhite/80 px-3 py-1 shadow-[0_10px_24px_rgba(23,20,17,0.05)]">Luxury feel</span>
              <span className="h-px w-8 bg-warmbrown/70" />
              <span>Web Design & Development</span>
            </div>
            <h1 className="text-balance animate-fade-up mt-6 max-w-5xl font-display text-[2.7rem] leading-[0.94] text-ink opacity-0 [animation-delay:120ms] sm:text-[4.4rem] lg:text-[5.5rem]">
              Aesthetic, professional websites for <span className="italic text-warmbrown">small businesses</span> with ambition.
            </h1>
            <p className="animate-fade-up mt-6 max-w-3xl text-[1rem] leading-7 text-ink/66 opacity-0 [animation-delay:240ms] sm:mt-7 sm:text-[1.08rem] sm:leading-8">
              ACE Web Studio designs and develops custom business websites with thoughtful structure, polished visuals, and a calm premium presentation that still feels clear, trustworthy, and ready to convert.
            </p>
            <div className="animate-fade-up mt-10 flex flex-col gap-4 opacity-0 [animation-delay:360ms] sm:flex-row">
              <Link
                to="/checkout"
                className="rounded-full bg-ink px-8 py-4 text-center text-[0.76rem] font-medium uppercase tracking-[0.2em] text-softwhite shadow-[0_18px_34px_rgba(23,20,17,0.14)] transition hover:-translate-y-0.5 hover:bg-warmbrown"
              >
                Place an Order
              </Link>
              <Link
                to="/portfolio"
                className="rounded-full border border-ink/14 bg-softwhite/84 px-8 py-4 text-center text-[0.76rem] font-medium uppercase tracking-[0.2em] text-ink transition hover:bg-ink hover:text-softwhite"
              >
                View Work
              </Link>
            </div>
          </div>

          <div className="animate-fade-up opacity-0 [animation-delay:420ms]">
            <div className="surface-panel relative rounded-[34px] p-6">
              <div className="absolute right-6 top-6 rounded-full border border-warmbrown/12 bg-warmbrown-pale/28 px-3 py-1 text-[0.66rem] uppercase tracking-[0.18em] text-warmbrown">
                Editorial polish
              </div>
              <div className="grid gap-5 pt-14">
                {[
                  ['Custom coded', 'No templates. Every layout is shaped around your business.'],
                  ['Professional pacing', 'Typography, spacing, and hierarchy tuned to feel premium.'],
                  ['Ready to launch', 'Structured, mobile-responsive, and built for modern trust signals.'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[24px] border border-warmbrown/10 bg-softwhite/70 p-5">
                    <div className="text-[0.68rem] uppercase tracking-[0.2em] text-warmbrown">{label}</div>
                    <p className="mt-3 text-[0.96rem] leading-7 text-ink/66">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink px-4 py-16 text-softwhite sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <h2 className="text-balance max-w-xl font-display text-[2.2rem] leading-[1] sm:text-[3.4rem]">
              Design-first development that feels refined and performs.
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-6 sm:gap-8">
              {[
                ['100%', 'Custom-built'],
                ['3', 'Core packages'],
                ['50%', 'Deposit to book'],
                ['3 mo', 'Free support'],
              ].map(([value, label]) => (
                <div key={label} className="border-t border-softwhite/15 pt-4">
                  <div className="font-display text-[2.6rem] leading-none text-softwhite">{value}</div>
                  <div className="mt-2 text-[0.78rem] uppercase tracking-[0.18em] text-softwhite/45">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="self-end text-[1rem] leading-8 text-softwhite/60">
            Every package includes a Figma mockup before development begins, responsive layouts across devices, hosting and deployment, and three months of minor post-launch support.
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 sm:py-24">
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
                className={`group rounded-[30px] border p-8 transition duration-500 hover:-translate-y-1.5 ${
                  service.featured
                    ? 'border-ink bg-ink text-softwhite shadow-[0_24px_60px_rgba(17,17,16,0.12)]'
                    : 'border-warmbrown/12 bg-softwhite text-ink shadow-[0_24px_56px_rgba(17,17,16,0.06)]'
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
                  to={`/checkout?package=${service.tier.toLowerCase()}`}
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

      <section className="bg-softwhite px-4 py-20 sm:px-6 sm:py-24">
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

      <section className="px-4 py-20 sm:px-6 sm:py-24">
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

      <section className="bg-warmbrown px-4 py-16 text-center text-softwhite sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl rounded-[34px] border border-softwhite/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-6 py-12 shadow-[0_28px_70px_rgba(20,16,13,0.2)] sm:px-10">
          <h2 className="text-balance font-display text-[2.15rem] leading-[1] sm:text-[3.6rem]">
            Ready for a website that looks as established as your business deserves?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[1rem] leading-8 text-softwhite/78">
            Secure your project with a 50% deposit upfront, then pay the remaining 50% on completion once you are happy with the final result.
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
