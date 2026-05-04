import { resolveAssetUrl } from '../lib/api'

export default function PortfolioShowcase({ projects, loading }) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[30px] border border-warmbrown/12 bg-softwhite shadow-[0_24px_56px_rgba(17,17,16,0.06)]"
          >
            <div className="aspect-[4/3] animate-pulse bg-warmbrown-pale/70" />
            <div className="space-y-4 p-6">
              <div className="h-4 w-24 animate-pulse rounded bg-warmbrown-pale/80" />
              <div className="h-8 w-2/3 animate-pulse rounded bg-warmbrown-pale/70" />
              <div className="h-16 animate-pulse rounded bg-warmbrown-pale/50" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map(i => (
          <div key={i} className="overflow-hidden rounded-[30px] border border-warmbrown/12 bg-softwhite shadow-[0_24px_56px_rgba(17,17,16,0.06)]">
            <div className="relative flex aspect-[4/3] items-center justify-center bg-cream bg-[radial-gradient(circle_at_top_right,rgba(196,168,130,0.18),transparent_48%),radial-gradient(circle_at_bottom_left,rgba(139,111,78,0.08),transparent_50%)]">
              <span className="rounded-full border border-warmbrown-pale bg-softwhite/80 px-4 py-2 text-[0.65rem] uppercase tracking-[0.22em] text-ink/40">
                Projects coming soon
              </span>
            </div>
            <div className="space-y-3 p-6">
              <div className="h-2.5 w-20 rounded-full bg-warmbrown-pale/80" />
              <div className="h-6 w-2/3 rounded bg-warmbrown-pale/50" />
              <div className="space-y-2 pt-1">
                <div className="h-3 rounded bg-warmbrown-pale/40" />
                <div className="h-3 w-5/6 rounded bg-warmbrown-pale/40" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {projects.map(project => {
        const heroImage = resolveAssetUrl(project.screenshots?.[0] || project.ogImage)

        return (
          <article
            key={project.id}
            className="group overflow-hidden rounded-[30px] border border-warmbrown/12 bg-softwhite shadow-[0_24px_56px_rgba(17,17,16,0.06)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_70px_rgba(17,17,16,0.1)]"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-ink">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt={`${project.title} preview`}
                  className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(196,168,130,0.35),transparent_42%),linear-gradient(135deg,#111110,#4b3f35,#C4A882)] px-8 text-center font-display text-4xl text-softwhite">
                  {project.title}
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-5">
                <span className="rounded-full border border-softwhite/18 bg-softwhite/12 px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-softwhite/90 backdrop-blur-sm">
                  {project.packageType}
                </span>
                <span className="text-anywhere text-[0.68rem] uppercase tracking-[0.18em] text-softwhite/70 sm:text-right">
                  {new URL(project.url).hostname.replace(/^www\./, '')}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {project.technologies?.slice(0, 3).map(technology => (
                  <span
                    key={technology}
                    className="rounded-full border border-warmbrown/10 bg-cream px-3 py-1 text-[0.68rem] uppercase tracking-[0.14em] text-warmbrown"
                  >
                    {technology}
                  </span>
                ))}
              </div>

              <h3 className="text-balance mt-5 font-display text-[1.65rem] leading-none text-ink sm:text-[1.8rem]">{project.title}</h3>
              <p className="mt-4 text-[0.96rem] leading-8 text-ink/65">
                {project.description || project.summary}
              </p>

              <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full bg-ink px-5 py-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-softwhite transition hover:bg-warmbrown"
                >
                  Visit Project
                </a>
                <span className="text-[0.72rem] uppercase tracking-[0.18em] text-ink/42">
                  Live portfolio render
                </span>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
