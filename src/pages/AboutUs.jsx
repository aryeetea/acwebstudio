import { Link } from 'react-router-dom'
import PortraitCard from '../components/PortraitCard'
import SectionIntro from '../components/SectionIntro'

const values = [
  ['Custom by default', 'Every build starts from a blank canvas instead of a template, so the final result feels considered and distinct.'],
  ['Clarity in process', 'From discovery to delivery, the experience is structured, collaborative, and easy to understand.'],
  ['Editorial restraint', 'We care about the details that create luxury: pacing, composition, spacing, and what gets left out.'],
  ['Built to convert', 'The goal is not only to look beautiful. It is to help visitors trust you and take the next step.'],
]

const process = [
  ['01', 'Discovery', 'We define goals, audience, tone, and priorities before touching layout or code.'],
  ['02', 'Design', 'The visual direction is shaped first so every page has a clear atmosphere and hierarchy.'],
  ['03', 'Development', 'Once approved, the site is built from scratch with clean front-end structure and responsive behavior.'],
  ['04', 'Refinement', 'We review the details together, polish the small things, and tighten what matters most.'],
]

export default function AboutUs() {
  return (
    <>
      <section className="relative overflow-hidden px-5 pb-20 pt-36 sm:px-6 sm:pt-40">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_left,rgba(255,208,0,0.26),transparent_34%),radial-gradient(circle_at_top_right,rgba(240,23,106,0.20),transparent_28%)]" />
        <div className="relative mx-auto max-w-6xl">
          <SectionIntro
            label="About"
            title="A small studio with a high standard for detail."
            copy="AC Web Studio brings design direction and front-end craft together to create websites that feel elevated, intentional, and ready to represent serious businesses."
          />
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <PortraitCard />
          </div>

          <div className="space-y-7 text-[1rem] leading-8 text-ink/68 sm:text-[1.05rem]">
            <p>
              AC Web Studio was built for founders and small business owners who want a website they can feel proud to send people to. We believe premium does not have to mean cold, and minimal does not have to mean generic.
            </p>
            <p>
              Our work is shaped by an editorial mindset: strong hierarchy, generous spacing, confident typography, and a sense of restraint that lets the right details stand out. Before anything is developed, we think about how the brand should feel and what the visitor should understand.
            </p>
            <p>
              The end result is a custom website that feels calm, refined, and strategic, with enough personality to feel alive. It is built to support trust, communicate quality, and help the business behind it look established online.
            </p>

            <div className="grid gap-5 pt-8 md:grid-cols-2">
              {values.map(([title, copy]) => (
                <div key={title} className="rounded-[4px] border border-warmbrown-pale bg-softwhite p-6 shadow-[0_14px_34px_rgba(17,17,16,0.04)]">
                  <h3 className="font-display text-[1.55rem] text-ink">{title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-7 text-ink/65">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink px-5 py-24 text-softwhite sm:px-6">
        <div className="mx-auto max-w-6xl">
          <SectionIntro
            label="Process"
            title="A clear process with space for craft."
            copy="Structured enough to feel professional, flexible enough to keep the work creative."
          />
          <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {process.map(([step, title, copy]) => (
              <div key={step} className="border-t border-softwhite/15 pt-6">
                <div className="text-[0.7rem] uppercase tracking-[0.24em] text-warmbrown-light">{step}</div>
                <h3 className="mt-4 font-display text-[1.9rem] text-softwhite">{title}</h3>
                <p className="mt-4 text-[0.96rem] leading-8 text-softwhite/58">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-softwhite px-5 py-20 text-center sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-[2.5rem] leading-[1] text-ink sm:text-[3.5rem]">
            If you want a site that feels both refined and memorable, we should talk.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[1rem] leading-8 text-ink/66">
            The goal is simple: make your business look clear, premium, and ready for the next level.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="rounded-full bg-ink px-8 py-4 text-center text-[0.76rem] font-medium uppercase tracking-[0.2em] text-softwhite transition hover:-translate-y-0.5 hover:bg-warmbrown"
            >
              Start a Project
            </Link>
            <Link
              to="/services"
              className="rounded-full border border-ink px-8 py-4 text-center text-[0.76rem] font-medium uppercase tracking-[0.2em] text-ink transition hover:bg-ink hover:text-softwhite"
            >
              View Packages
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
