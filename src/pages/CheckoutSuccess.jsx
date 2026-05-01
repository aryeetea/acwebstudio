import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SectionIntro from '../components/SectionIntro'
import { confirmOrderPayment } from '../lib/api'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const sessionId = searchParams.get('session_id') || ''

    async function confirm() {
      if (!sessionId) {
        setError('Missing checkout session ID.')
        setLoading(false)
        return
      }

      try {
        const result = await confirmOrderPayment(sessionId)
        if (!cancelled) {
          setOrder(result)
        }
      } catch (confirmError) {
        if (!cancelled) {
          setError(confirmError.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    confirm()

    return () => {
      cancelled = true
    }
  }, [searchParams])

  return (
    <>
      <section className="relative overflow-hidden px-5 pb-20 pt-36 sm:px-6 sm:pt-40">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,rgba(196,168,130,0.3),transparent_34%),radial-gradient(circle_at_right,rgba(17,17,16,0.08),transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl">
          <SectionIntro
            label="Payment Complete"
            title="Your order and payment were received."
            copy="This confirmation page ties the successful payment back to your order so the studio can review everything in one place."
          />
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-[4px] border border-warmbrown-pale bg-softwhite p-8 text-center shadow-[0_18px_40px_rgba(17,17,16,0.05)]">
          {loading ? (
            <p className="text-[1rem] leading-8 text-ink/65">Confirming your payment...</p>
          ) : error ? (
            <>
              <h2 className="font-display text-[2.3rem] text-ink">We received your redirect, but could not confirm the order yet.</h2>
              <p className="mt-5 text-[1rem] leading-8 text-ink/65">{error}</p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  to="/contact"
                  className="rounded-full bg-ink px-8 py-4 text-[0.76rem] font-medium uppercase tracking-[0.2em] text-softwhite transition hover:bg-warmbrown"
                >
                  Contact Us
                </Link>
                <Link
                  to="/checkout"
                  className="rounded-full border border-ink px-8 py-4 text-[0.76rem] font-medium uppercase tracking-[0.2em] text-ink transition hover:bg-ink hover:text-softwhite"
                >
                  Back to Checkout
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-cream text-[2.2rem] text-warmbrown">✓</div>
              <h2 className="mt-6 font-display text-[2.8rem] leading-[0.95] text-ink">Thank you, {order?.firstName}.</h2>
              <p className="mt-5 text-[1rem] leading-8 text-ink/65">
                Your {order?.packageName} order is marked <span className="text-ink">{order?.status}</span> and your deposit of {formatCurrency(order?.amountDueNow || 0)} has been recorded.
              </p>

              <div className="mx-auto mt-8 grid max-w-3xl gap-4 text-left md:grid-cols-2">
                <div className="rounded-[4px] border border-warmbrown-pale bg-cream px-5 py-5">
                  <div className="text-[0.68rem] uppercase tracking-[0.18em] text-ink/48">Package</div>
                  <div className="mt-2 text-[1rem] text-ink">{order?.packageName}</div>
                </div>
                <div className="rounded-[4px] border border-warmbrown-pale bg-cream px-5 py-5">
                  <div className="text-[0.68rem] uppercase tracking-[0.18em] text-ink/48">Email</div>
                  <div className="mt-2 text-[1rem] text-ink">{order?.email}</div>
                </div>
              </div>

              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  to="/portfolio"
                  className="rounded-full bg-ink px-8 py-4 text-[0.76rem] font-medium uppercase tracking-[0.2em] text-softwhite transition hover:bg-warmbrown"
                >
                  View Work
                </Link>
                <Link
                  to="/contact"
                  className="rounded-full border border-ink px-8 py-4 text-[0.76rem] font-medium uppercase tracking-[0.2em] text-ink transition hover:bg-ink hover:text-softwhite"
                >
                  Ask a Question
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
