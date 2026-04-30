import { resolveAssetUrl } from '../lib/api'

export default function PortfolioShowcase({ projects, loading, emptyMessage = 'No portfolio projects yet.' }) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[4px] border border-warmbrown-pale bg-softwhite shadow-[0_14px_36px_rgba(17,17,16,0.04)]"
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
      <div className="rounded-[4px] border border-dashed border-warmbrown-pale bg-softwhite px-8 py-14 text-center text-[1rem] leading-8 text-ink/60">
        {emptyMessage}
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
            className="group overflow-hidden rounded-[4px] border border-warmbrown-pale bg-softwhite shadow-[0_14px_36px_rgba(17,17,16,0.04)] transition duration-300 hover:-translate-y-1"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-ink">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt={`${project.title} preview`}
                  className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,201,60,0.32),transparent_42%),linear-gradient(135deg,#c2185b,#ff4f9a,#ffc93c)] px-8 text-center font-display text-4xl text-softwhite">
                  {project.title}
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent p-5">
                <span className="rounded-full border border-softwhite/18 bg-softwhite/12 px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-softwhite/90 backdrop-blur-sm">
                  {project.packageType}
                </span>
                <span className="text-[0.68rem] uppercase tracking-[0.18em] text-softwhite/70">
                  {new URL(project.url).hostname.replace(/^www\./, '')}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {project.technologies?.slice(0, 3).map(technology => (
                  <span
                    key={technology}
                    className="rounded-full bg-cream px-3 py-1 text-[0.68rem] uppercase tracking-[0.14em] text-warmbrown"
                  >
                    {technology}
                  </span>
                ))}
              </div>

              <h3 className="mt-5 font-display text-[1.8rem] leading-none text-ink">{project.title}</h3>
              <p className="mt-4 text-[0.96rem] leading-8 text-ink/65">
                {project.description || project.summary}
              </p>

              <div className="mt-6 flex items-center justify-between gap-4">
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
