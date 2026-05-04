export default function FaqAccordion({ items, openIndex, onToggle, compact = false }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-warmbrown/12 bg-softwhite/92 shadow-[0_24px_56px_rgba(17,17,16,0.06)] backdrop-blur-sm">
      {items.map((item, index) => {
        const active = openIndex === index

        return (
          <div key={item.q} className="border-b border-warmbrown-pale/60 px-4 last:border-b-0 sm:px-7">
            <button
              type="button"
              onClick={() => onToggle(active ? -1 : index)}
              className="flex w-full items-start justify-between gap-4 py-5 text-left sm:items-center sm:gap-6 sm:py-6"
            >
              <span className={`text-balance font-display text-[1.18rem] leading-[1.15] text-ink sm:text-[1.55rem] ${compact ? 'sm:text-[1.35rem]' : ''}`}>
                {item.q}
              </span>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-lg transition-all sm:h-10 sm:w-10 ${
                  active
                    ? 'border-ink bg-ink text-softwhite shadow-[0_12px_24px_rgba(23,20,17,0.18)]'
                    : 'border-warmbrown/14 bg-warmbrown-pale/20 text-warmbrown'
                }`}
              >
                {active ? '−' : '+'}
              </span>
            </button>
            {active && (
              <p className="max-w-3xl pb-5 text-[0.96rem] leading-7 text-ink/65 animate-fade-up sm:pb-6 sm:text-[0.98rem] sm:leading-8">
                {item.a}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
