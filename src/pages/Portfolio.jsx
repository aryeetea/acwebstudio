import { useEffect, useState } from 'react'
import PortfolioShowcase from '../components/PortfolioShowcase'
import SectionIntro from '../components/SectionIntro'
import { fetchPortfolioProjects } from '../lib/api'

export default function Portfolio() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadProjects() {
      try {
        const items = await fetchPortfolioProjects()
        if (!cancelled) {
          setProjects(items)
          setError('')
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProjects()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <section className="relative overflow-hidden px-5 pb-20 pt-36 sm:px-6 sm:pt-40">
        <div className="absolute inset-x-0 top-0 h-130 bg-[radial-gradient(circle_at_right,rgba(255,208,0,0.28),transparent_34%),radial-gradient(circle_at_left,rgba(240,23,106,0.18),transparent_28%)]" />
        <div className="relative mx-auto max-w-6xl">
          <SectionIntro
            label="Portfolio"
            title="Client work that renders directly from the real project links."
            copy="Each project below starts from a saved portfolio URL in the admin area, then the public site pulls in a rendered preview for visitors."
          />
          {error && (
            <p className="mt-6 max-w-2xl rounded-[4px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <PortfolioShowcase
            projects={projects}
            loading={loading}
            emptyMessage="No portfolio projects have been published yet. Add one from the admin page and it will appear here."
          />
        </div>
      </section>
    </>
  )
}
