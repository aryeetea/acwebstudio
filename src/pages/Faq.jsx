import { useState } from 'react'
import { Link } from 'react-router-dom'
import FaqAccordion from '../components/FaqAccordion'
import SectionIntro from '../components/SectionIntro'
import { faqs } from '../data/faqs'

export default function Faq() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <>
      <section className="relative overflow-hidden px-5 pb-20 pt-36 sm:px-6 sm:pt-40">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_right,rgba(255,208,0,0.26),transparent_34%),radial-gradient(circle_at_left,rgba(240,23,106,0.18),transparent_28%)]" />
        <div className="relative mx-auto max-w-6xl">
          <SectionIntro
            label="FAQ"
            title="Everything clients tend to ask before they book."
            copy="A clear overview of how the process works, what the timeline looks like, and what to expect once we begin."
          />
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.86fr_1.14fr]">
          <div className="space-y-6">
            <div className="rounded-[4px] border border-warmbrown-pale bg-cream p-6 shadow-[0_16px_34px_rgba(17,17,16,0.05)]">
              <div className="text-[0.72rem] uppercase tracking-[0.24em] text-warmbrown">Quick Notes</div>
              <div className="mt-5 grid gap-4">
                {[
                  ['Replies', 'Within 24 hours'],
                  ['Build style', 'Custom-coded from scratch'],
                  ['Client fit', 'Small businesses and founders'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 border-b border-warmbrown-pale pb-4 text-[0.96rem]">
                    <span className="text-ink/52">{label}</span>
                    <span className="text-right text-ink/76">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[4px] border border-warmbrown-pale bg-softwhite p-6 shadow-[0_16px_34px_rgba(17,17,16,0.05)]">
              <h3 className="font-display text-[2rem] text-ink">Still unsure?</h3>
              <p className="mt-4 text-[0.97rem] leading-8 text-ink/65">
                If you want help figuring out the best package or scope, send an inquiry and we can point you in the right direction.
              </p>
              <Link
                to="/contact"
                className="mt-8 inline-flex rounded-full bg-ink px-7 py-4 text-[0.74rem] font-medium uppercase tracking-[0.2em] text-softwhite transition hover:bg-warmbrown"
              >
                Start an Inquiry
              </Link>
            </div>
          </div>

          <FaqAccordion items={faqs} openIndex={openFaq} onToggle={setOpenFaq} />
        </div>
      </section>
    </>
  )
}
