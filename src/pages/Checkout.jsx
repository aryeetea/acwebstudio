import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SectionIntro from '../components/SectionIntro'
import { createCheckoutSession } from '../lib/api'
import { getPriceRangeFromLabel, packageMap, packages } from '../data/packages'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatCurrencyRange([min, max]) {
  if (!min && !max) return 'Custom quote'
  if (min === max) return formatCurrency(min)
  return `${formatCurrency(min)} - ${formatCurrency(max)}`
}

export default function Checkout() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialPackage = searchParams.get('package') || packages[0]?.slug || ''
  const [selectedPackageSlug, setSelectedPackageSlug] = useState(initialPackage)
  const [selectedAddonIds, setSelectedAddonIds] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    businessName: '',
    website: '',
    timeline: '',
    notes: '',
  })

  const selectedPackage = packageMap[selectedPackageSlug] || packages[0]
  const selectedAddons = selectedPackage.addons.filter(addon => selectedAddonIds.includes(addon.id))

  const pricing = useMemo(() => {
    const estimatedRange = selectedAddons.reduce(
      (range, addon) => {
        const [addonMin, addonMax] = getPriceRangeFromLabel(addon.price)
        return [range[0] + addonMin, range[1] + addonMax]
      },
      [...selectedPackage.priceRange]
    )

    const [depositMin] = getPriceRangeFromLabel(selectedPackage.deposit)
    const amountDueToday = selectedAddons.reduce((sum, addon) => {
      const [addonMin] = getPriceRangeFromLabel(addon.price)
      return sum + addonMin
    }, depositMin)

    return {
      estimatedRange,
      amountDueToday,
    }
  }, [selectedAddons, selectedPackage])

  function handlePackageChange(event) {
    const nextSlug = event.target.value
    setSelectedPackageSlug(nextSlug)
    setSelectedAddonIds([])
    setSearchParams(nextSlug ? { package: nextSlug } : {})
  }

  function handleChange(event) {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }))
  }

  function handleAddonToggle(addonId) {
    setSelectedAddonIds(current =>
      current.includes(addonId)
        ? current.filter(id => id !== addonId)
        : [...current, addonId]
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const session = await createCheckoutSession({
        ...form,
        packageSlug: selectedPackage.slug,
        addonIds: selectedAddonIds,
      })

      if (!session?.url) {
        throw new Error('Could not start secure payment right now.')
      }

      window.location.href = session.url
    } catch (submitError) {
      setError(submitError.message)
      setSubmitting(false)
    }
  }

  return (
    <>
      <section className="relative overflow-hidden px-5 pb-20 pt-36 sm:px-6 sm:pt-40">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_right,rgba(196,168,130,0.32),transparent_34%),radial-gradient(circle_at_left,rgba(17,17,16,0.1),transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl">
          <SectionIntro
            label="Order Online"
            title="Choose your package, customize it, and pay online."
            copy="This checkout is separate from contact so clients can configure their order, add extras, and pay a secure booking deposit like a real ecommerce flow."
          />
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <form onSubmit={handleSubmit} className="rounded-[4px] border border-warmbrown-pale bg-softwhite p-6 shadow-[0_18px_40px_rgba(17,17,16,0.05)] sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.24em] text-warmbrown">Secure Checkout</p>
                <h2 className="mt-4 font-display text-[2.3rem] leading-none text-ink">Order setup</h2>
              </div>
              <div className="rounded-full bg-cream px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-ink/60">
                Stripe payment
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <Field label="First Name" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Aileen" required />
              <Field label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Aryeetey" required />
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="hello@brand.com" required />
              <Field label="Business Name" name="businessName" value={form.businessName} onChange={handleChange} placeholder="Your Business (optional)" />
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Field label="Website or Instagram" name="website" value={form.website} onChange={handleChange} placeholder="yourbrand.com" />
              <Field label="Preferred Timeline" name="timeline" value={form.timeline} onChange={handleChange} placeholder="2 weeks" />
            </div>

            <div className="mt-8 rounded-[4px] border border-warmbrown-pale bg-cream p-5">
              <div className="text-[0.7rem] uppercase tracking-[0.18em] text-ink/50">Step 1</div>
              <label className="mt-2 block text-[1rem] text-ink">Select your package</label>
              <select
                value={selectedPackage.slug}
                onChange={handlePackageChange}
                className="mt-4 w-full rounded-[4px] border border-warmbrown-pale bg-softwhite px-4 py-4 text-[0.96rem] text-ink outline-none transition focus:border-warmbrown"
              >
                {packages.map(pkg => (
                  <option key={pkg.slug} value={pkg.slug}>
                    {pkg.name} - {pkg.price}
                  </option>
                ))}
              </select>

              <div className="mt-4 rounded-[4px] border border-warmbrown-pale bg-softwhite px-4 py-4 text-[0.95rem] leading-7 text-ink/68">
                {selectedPackage.who}
              </div>
            </div>

            <div className="mt-5 rounded-[4px] border border-warmbrown-pale bg-cream p-5">
              <div className="text-[0.7rem] uppercase tracking-[0.18em] text-ink/50">Step 2</div>
              <div className="mt-2 text-[1rem] text-ink">Choose extra add-ons</div>
              <div className="mt-5 grid gap-3">
                {selectedPackage.addons.map(addon => {
                  const checked = selectedAddonIds.includes(addon.id)

                  return (
                    <label
                      key={addon.id}
                      className={`flex cursor-pointer items-start justify-between gap-4 rounded-[4px] border px-4 py-4 transition ${
                        checked
                          ? 'border-warmbrown bg-softwhite'
                          : 'border-warmbrown-pale bg-transparent hover:border-warmbrown'
                      }`}
                    >
                      <div className="flex gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleAddonToggle(addon.id)}
                          className="mt-1 h-4 w-4 accent-[var(--color-warmbrown)]"
                        />
                        <div>
                          <div className="text-[0.96rem] text-ink">{addon.label}</div>
                          <div className="mt-1 text-sm text-ink/55">Starting at {addon.price}</div>
                        </div>
                      </div>
                      <div className="text-sm text-warmbrown">{addon.price}</div>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-[0.7rem] uppercase tracking-[0.18em] text-ink/50">
                Your Website Idea
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={6}
                placeholder="Tell us your idea. What do you want the website to do, who is it for, and what kind of look or features do you have in mind?"
                className="w-full rounded-[4px] border border-warmbrown-pale bg-cream px-4 py-4 text-[0.96rem] leading-8 text-ink outline-none transition placeholder:text-ink/35 focus:border-warmbrown"
                required
              />
            </div>

            {error && <p className="mt-5 rounded-[4px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 rounded-full bg-ink px-8 py-4 text-[0.76rem] font-medium uppercase tracking-[0.2em] text-softwhite transition hover:-translate-y-0.5 hover:bg-warmbrown disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Redirecting to Payment...' : `Pay ${formatCurrency(pricing.amountDueToday)} Deposit`}
            </button>
          </form>

          <aside className="space-y-6">
            <div className="rounded-[4px] border border-warmbrown-pale bg-ink p-7 text-softwhite shadow-[0_18px_40px_rgba(17,17,16,0.08)]">
              <div className="text-[0.72rem] uppercase tracking-[0.24em] text-warmbrown-light">Order Summary</div>
              <h2 className="mt-4 font-display text-[2.4rem] leading-none">{selectedPackage.name}</h2>
              <div className="mt-4 text-[1.1rem] text-warmbrown-light">{selectedPackage.price}</div>
              <p className="mt-5 text-[0.96rem] leading-8 text-softwhite/68">{selectedPackage.who}</p>

              <div className="mt-8 grid gap-4 rounded-[4px] border border-softwhite/10 bg-softwhite/6 p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[0.72rem] uppercase tracking-[0.18em] text-softwhite/55">Estimated project total</span>
                  <span className="font-display text-[2rem] text-softwhite">{formatCurrencyRange(pricing.estimatedRange)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-softwhite/10 pt-4">
                  <span className="text-[0.72rem] uppercase tracking-[0.18em] text-softwhite/55">Pay today</span>
                  <span className="font-display text-[2rem] text-warmbrown-light">{formatCurrency(pricing.amountDueToday)}</span>
                </div>
                <div className="text-sm leading-7 text-softwhite/60">
                  Checkout collects the starting deposit securely online. Clients can come with just the idea, and the rest of the project details can be refined after review.
                </div>
              </div>

              <div className="mt-8">
                <div className="text-[0.72rem] uppercase tracking-[0.18em] text-warmbrown-light">Included</div>
                <ul className="mt-4 grid gap-3 text-[0.95rem] leading-7 text-softwhite/78">
                  {selectedPackage.includes.map(item => (
                    <li key={item} className="flex gap-3">
                      <span className="text-warmbrown-light">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-[4px] border border-warmbrown-pale bg-softwhite p-7 shadow-[0_16px_34px_rgba(17,17,16,0.05)]">
              <div className="text-[0.72rem] uppercase tracking-[0.24em] text-warmbrown">Need to ask something first?</div>
              <p className="mt-5 text-[0.96rem] leading-8 text-ink/66">
                The contact page is now just for questions, collaborations, and general inquiries. Orders and payments stay in checkout.
              </p>
              <Link
                to="/contact"
                className="mt-6 inline-flex rounded-full border border-ink px-6 py-3 text-[0.74rem] font-medium uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-softwhite"
              >
                Go to Contact
              </Link>
            </div>
          </aside>
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
