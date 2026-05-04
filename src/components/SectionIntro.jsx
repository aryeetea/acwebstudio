export default function SectionIntro({ label, title, copy, align = 'left' }) {
  const centered = align === 'center'

  return (
    <div className={centered ? 'mx-auto max-w-4xl text-center' : 'max-w-3xl'}>
      <div className={`mb-6 flex flex-wrap items-center gap-3 text-[0.68rem] font-medium uppercase editorial-kicker text-warmbrown sm:text-[0.72rem] ${centered ? 'justify-center' : ''}`}>
        <span className="inline-flex rounded-full border border-warmbrown/20 bg-softwhite/80 px-3 py-1 shadow-[0_10px_24px_rgba(23,20,17,0.05)]">
          Studio
        </span>
        <span className="h-px w-10 bg-gradient-to-r from-warmbrown/70 to-warmbrown/10" />
        <span>{label}</span>
      </div>
      <h2 className="text-balance font-display text-[2.1rem] leading-[0.98] text-ink sm:text-[3.2rem] md:text-[3.75rem]">
        {title}
      </h2>
      {copy ? (
        <p className={`mt-6 text-[0.98rem] leading-8 text-ink/64 sm:text-[1.07rem] ${centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}>
          {copy}
        </p>
      ) : null}
    </div>
  )
}
