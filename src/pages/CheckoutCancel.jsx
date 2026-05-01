import { Link, useSearchParams } from 'react-router-dom'
import SectionIntro from '../components/SectionIntro'

export default function CheckoutCancel() {
  const [searchParams] = useSearchParams()
  const selectedPackage = searchParams.get('package') || ''

  return (
    <>
      <section className="relative overflow-hidden px-5 pb-20 pt-36 sm:px-6 sm:pt-40">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_left,rgba(196,168,130,0.22),transparent_34%),radial-gradient(circle_at_right,rgba(17,17,16,0.08),transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl">
          <SectionIntro
            label="Checkout Paused"
            title="Your payment was not completed."
            copy="No worries. Your order was not finalized, and you can return to checkout whenever you are ready."
          />
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-[4px] border border-warmbrown-pale bg-softwhite p-8 text-center shadow-[0_18px_40px_rgba(17,17,16,0.05)]">
          <h2 className="font-display text-[2.5rem] text-ink">Want to continue your order?</h2>
          <p className="mt-5 text-[1rem] leading-8 text-ink/65">
            Head back to checkout to adjust your package, keep your extras, and finish the secure payment when it works for you.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to={selectedPackage ? `/checkout?package=${selectedPackage}` : '/checkout'}
              className="rounded-full bg-ink px-8 py-4 text-[0.76rem] font-medium uppercase tracking-[0.2em] text-softwhite transition hover:bg-warmbrown"
            >
              Return to Checkout
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-ink px-8 py-4 text-[0.76rem] font-medium uppercase tracking-[0.2em] text-ink transition hover:bg-ink hover:text-softwhite"
            >
              Contact Instead
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
