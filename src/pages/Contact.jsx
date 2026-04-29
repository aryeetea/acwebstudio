import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import FaqAccordion from '../components/FaqAccordion'
import SectionIntro from '../components/SectionIntro'
import { faqs } from '../data/faqs'
import { packageMap, packageOptions, packages } from '../data/packages'

export default function Contact() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [openFaq, setOpenFaq] = useState(0)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    package: searchParams.get('package') || 'professional',
    businessName: '',
    website: '',
    timeline: '',
    message: '',
  })

  useEffect(() => {
    const pkg = searchParams.get('package')
    if (pkg && pkg !== form.package) {
      setForm(current => ({ ...current, package: pkg }))
    }
  }, [form.package, searchParams])

  const selectedPackage = packageMap[form.package] || packages[1]

  const handleChange = event => {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handlePackageChange = event => {
    const nextPackage = event.target.value
    setForm(current => ({ ...current, package: nextPackage }))
    setSearchParams(nextPackage ? { package: nextPackage } : {})
  }

  const handleSubmit = event => {
    event.preventDefault()
    // Save order to localStorage
    const prev = JSON.parse(localStorage.getItem('orders') || '[]')
    localStorage.setItem('orders', JSON.stringify([{ ...form, date: new Date().toISOString() }, ...prev]))
    setSent(true)
    setTimeout(() => setSent(false), 4000)
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      package: searchParams.get('package') || 'professional',
      businessName: '',
      website: '',
      timeline: '',
      message: '',
    })
  }

  return (
    <>
      <section className="relative overflow-hidden px-5 pb-20 pt-36 sm:px-6 sm:pt-40">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_left,rgba(196,168,130,0.18),transparent_34%),radial-gradient(circle_at_right,rgba(139,111,78,0.10),transparent_28%)]" />
        <div className="relative mx-auto max-w-6xl">
          <SectionIntro
            label="Contact"
            title="Start the conversation."
            copy="Tell us what you are building, what kind of presence you need, and which package feels closest to the right fit."
          />
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="space-y-6">
            <div className="rounded-[4px] border border-warmbrown-pale bg-softwhite p-7 shadow-[0_16px_34px_rgba(17,17,16,0.05)]">
              <div className="text-[0.72rem] uppercase tracking-[0.24em] text-warmbrown">Selected Package</div>
              <h2 className="mt-4 font-display text-[2.3rem] leading-none text-ink">{selectedPackage.name}</h2>
              <div className="mt-3 text-[1.1rem] text-warmbrown">{selectedPackage.price}</div>
              <p className="mt-5 text-[0.96rem] leading-8 text-ink/64">{selectedPackage.who}</p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[4px] border border-warmbrown-pale bg-cream px-4 py-4">
                  <div className="text-[0.68rem] uppercase tracking-[0.18em] text-ink/48">Deposit</div>
                  <div className="mt-2 text-[0.96rem] text-ink">{selectedPackage.deposit}</div>
                </div>
                <div className="rounded-[4px] border border-warmbrown-pale bg-cream px-4 py-4">
                  <div className="text-[0.68rem] uppercase tracking-[0.18em] text-ink/48">Turnaround</div>
                  <div className="mt-2 text-[0.96rem] text-ink">{selectedPackage.turnaround}</div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                ['Reply window', 'Within 24 hours'],
                ['Project type', 'Custom-coded websites'],
                ['Best fit', 'Founders and small businesses'],
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
                <div>
                  <label className="mb-2 block text-[0.7rem] uppercase tracking-[0.18em] text-ink/50">
                    Package
                  </label>
                  <select
                    name="package"
                    value={form.package}
                    onChange={handlePackageChange}
                    className="w-full rounded-[4px] border border-warmbrown-pale bg-cream px-4 py-4 text-[0.96rem] text-ink outline-none transition focus:border-warmbrown"
                  >
                    {packageOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                    <option value="">Custom quote request</option>
                  </select>
                </div>

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
                  <Field label="Preferred Timeline" name="timeline" value={form.timeline} onChange={handleChange} placeholder="Within 3 weeks" />
                </div>

                <div>
                  <label className="mb-2 block text-[0.7rem] uppercase tracking-[0.18em] text-ink/50">
                    Project Details
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Tell us about your business, the kind of website you need, and any references or direction you already have in mind."
                    className="w-full rounded-[4px] border border-warmbrown-pale bg-cream px-4 py-4 text-[0.96rem] leading-8 text-ink outline-none transition placeholder:text-ink/35 focus:border-warmbrown"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-3 rounded-full bg-ink px-8 py-4 text-[0.76rem] font-medium uppercase tracking-[0.2em] text-softwhite transition hover:-translate-y-0.5 hover:bg-warmbrown"
                >
                  Send Inquiry
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
            Need something beyond the packages?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[1rem] leading-8 text-softwhite/62">
            We also take on custom quote projects when the scope needs something more tailored.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/services"
              className="rounded-full border border-softwhite/20 px-8 py-4 text-center text-[0.76rem] font-medium uppercase tracking-[0.2em] text-softwhite transition hover:bg-softwhite hover:text-ink"
            >
              Back to Services
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
