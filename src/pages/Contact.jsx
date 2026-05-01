import { useState } from 'react'
import { Link } from 'react-router-dom'
import FaqAccordion from '../components/FaqAccordion'
import SectionIntro from '../components/SectionIntro'
import { faqs } from '../data/faqs'
import { createContactInquiry } from '../lib/api'
import emailjs from '@emailjs/browser'

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(0)
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [emailWarning, setEmailWarning] = useState('')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    businessName: '',
    website: '',
    timeline: '',
    message: '',
  })

  const handleChange = event => {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setEmailWarning('')

    try {
      await createContactInquiry(form)
    } catch (submitError) {
      setSubmitting(false)
      setError(submitError.message)
      return
    }

    // Send email via EmailJS
    if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            businessName: form.businessName,
            website: form.website,
            timeline: form.timeline,
            message: form.message,
          },
          EMAILJS_PUBLIC_KEY
        )
      } catch {
        setEmailWarning('Your message was saved, but the email notification could not be sent right now.')
      }
    } else {
      setEmailWarning('Your message was saved, but contact email notifications are not configured yet.')
    }

    setSent(true)
    setTimeout(() => setSent(false), 4000)
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      businessName: '',
      website: '',
      timeline: '',
      message: '',
    })
    setSubmitting(false)
  }

  return (
    <>
      <section className="relative overflow-hidden px-5 pb-20 pt-36 sm:px-6 sm:pt-40">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_left,rgba(255,208,0,0.26),transparent_34%),radial-gradient(circle_at_right,rgba(240,23,106,0.18),transparent_28%)]" />
        <div className="relative mx-auto max-w-6xl">
          <SectionIntro
            label="Contact"
            title="Get in touch with ACE Web Studio."
            copy="Reach out for questions, collaborations, or anything you want to discuss before booking. Orders and payments now happen in the separate checkout flow."
          />
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="space-y-6">
            <div className="rounded-[4px] border border-warmbrown-pale bg-softwhite p-7 shadow-[0_16px_34px_rgba(17,17,16,0.05)]">
              <div className="text-[0.72rem] uppercase tracking-[0.24em] text-warmbrown">Contact Details</div>
              <h2 className="mt-4 font-display text-[2.3rem] leading-none text-ink">Let’s talk about your website.</h2>
              <p className="mt-5 text-[0.96rem] leading-8 text-ink/64">
                Whether you are ready to book or just want to ask a few questions, this is the best place to reach ACE Web Studio.
              </p>
              <div className="mt-7 divide-y divide-warmbrown-pale">
                <div className="pb-5">
                  <div className="text-[0.68rem] uppercase tracking-[0.14em] text-ink/45">Aileen — Web Development</div>
                  <a href="mailto:aileen.aryeetey@outlook.com" className="mt-1.5 block text-[0.95rem] text-warmbrown transition hover:text-ink">
                    aileen.aryeetey@outlook.com
                  </a>
                </div>
                <div className="py-5">
                  <div className="text-[0.68rem] uppercase tracking-[0.14em] text-ink/45">Cynthia — UI/UX Design</div>
                  <a href="mailto:cowusuforkuo@gmail.com" className="mt-1.5 block text-[0.95rem] text-warmbrown transition hover:text-ink">
                    cowusuforkuo@gmail.com
                  </a>
                </div>
                <div className="pt-5">
                  <div className="text-[0.68rem] uppercase tracking-[0.14em] text-ink/45">Reply Window</div>
                  <div className="mt-1.5 text-[0.95rem] text-ink">Within 24 hours</div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                ['Project type', 'Custom-coded websites'],
                ['Best fit', 'Founders and small businesses'],
                ['Best use', 'Questions, collaborations, and general inquiries'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[4px] border border-warmbrown-pale bg-cream px-5 py-5">
                  <div className="text-[0.68rem] uppercase tracking-[0.18em] text-ink/48">{label}</div>
                  <div className="mt-2 text-[0.98rem] text-ink/74">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[4px] border border-warmbrown-pale bg-softwhite p-6 shadow-[0_18px_40px_rgba(17,17,16,0.05)] sm:p-8">
            {sent ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <div className="font-display text-[4rem] leading-none text-warmbrown">✓</div>
                <h3 className="mt-5 font-display text-[2.2rem] text-ink">Request received</h3>
                <p className="mt-4 max-w-xl text-[1rem] leading-8 text-ink/64">
                  Thanks for reaching out. We will review your request and confirm the best next step within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="First Name" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Aileen" />
                  <Field label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Aryeetey" />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Email" name="email" value={form.email} onChange={handleChange} placeholder="hello@brand.com" type="email" />
                  <Field label="Business Name" name="businessName" value={form.businessName} onChange={handleChange} placeholder="Your Business" />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Website or Instagram" name="website" value={form.website} onChange={handleChange} placeholder="yourbrand.com" />
                  <Field label="Preferred Timeline" name="timeline" value={form.timeline} onChange={handleChange} placeholder="Whenever works best for you" />
                </div>

                <div>
                  <label className="mb-2 block text-[0.7rem] uppercase tracking-[0.18em] text-ink/50">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Tell us what you want to ask, discuss, or clarify."
                    className="w-full rounded-[4px] border border-warmbrown-pale bg-cream px-4 py-4 text-[0.96rem] leading-8 text-ink outline-none transition placeholder:text-ink/35 focus:border-warmbrown"
                  />
                </div>

                {error && <p className="rounded-[4px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
                {emailWarning && <p className="rounded-[4px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{emailWarning}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-3 rounded-full bg-ink px-8 py-4 text-[0.76rem] font-medium uppercase tracking-[0.2em] text-softwhite transition hover:-translate-y-0.5 hover:bg-warmbrown"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="bg-softwhite px-5 py-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <SectionIntro
              label="Before You Inquire"
              title="A few answers before we start."
              copy="The essentials on timelines, revisions, and what we need from you."
            />
          </div>
          <FaqAccordion items={faqs} openIndex={openFaq} onToggle={setOpenFaq} />
        </div>
      </section>

      <section className="bg-ink px-5 py-20 text-center text-softwhite sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-[2.4rem] leading-[1] sm:text-[3.3rem]">
            Ready to order instead?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[1rem] leading-8 text-softwhite/62">
            If you already know what you want, head to checkout to choose a package, add extras, and pay online.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/checkout"
              className="rounded-full border border-softwhite/20 px-8 py-4 text-center text-[0.76rem] font-medium uppercase tracking-[0.2em] text-softwhite transition hover:bg-softwhite hover:text-ink"
            >
              Go to Checkout
            </Link>
            <Link
              to="/about"
              className="rounded-full bg-softwhite px-8 py-4 text-center text-[0.76rem] font-medium uppercase tracking-[0.2em] text-ink transition hover:bg-warmbrown hover:text-softwhite"
            >
              Learn About Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-[0.7rem] uppercase tracking-[0.18em] text-ink/50">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-[4px] border border-warmbrown-pale bg-cream px-4 py-4 text-[0.96rem] text-ink outline-none transition placeholder:text-ink/35 focus:border-warmbrown"
      />
    </div>
  )
}
