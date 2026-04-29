import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const projects = [
  {
    name: 'Lumora Studio',
    desc: 'Minimal editorial website for a London-based photography studio. Built to let the work breathe — generous whitespace, clean grid, and subtle hover reveals.',
    tag: 'Photography',
    type: 'Basic',
    bg: 'linear-gradient(135deg,#2C2C2A,#444441)',
    initial: 'L',
  },
  {
    name: 'Terroir Co.',

  import ProjectCarousel from '../components/ProjectCarousel'
  import styles from './Portfolio.module.css'
  import { useState } from 'react'

  export default function Portfolio() {
    const [projects, setProjects] = useState(() => {
      try {
        return JSON.parse(localStorage.getItem('portfolioProjects')) || []
      } catch {
        return []
      }
    })
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
      localStorage.setItem('portfolioProjects', JSON.stringify(projects))
    }, [projects])

    async function handleAddProject(e) {
      e.preventDefault()
      setError('')
      if (!url) return
      setLoading(true)
      try {
        const res = await fetch('http://localhost:5050/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        })
        if (!res.ok) throw new Error('Could not analyze project')
        const data = await res.json()
        setProjects([{ ...data, images: data.screenshots.map(b64 => `data:image/png;base64,${b64}`) }, ...projects])
        setUrl('')
      } catch (e) {
        setError(e.message || 'Failed to analyze project')
      } finally {
        setLoading(false)
      }
    }

    function handleDeleteProject(idx) {
      setProjects(projects => projects.filter((_, i) => i !== idx))
    }

    return (
      <div className={styles.portfolioPage}>
        <div className={styles.header}>
          <div className="section-label">Portfolio</div>
          <h1>Selected Work</h1>
          <p className={styles.intro}>
            Just paste your project link below. The site will analyze it, suggest a summary, guess the tech stack, and show screenshots in a carousel.
          </p>
          <form onSubmit={handleAddProject} className={styles.addForm}>
            <input
              type="url"
              placeholder="https://yourproject.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className={styles.urlInput}
              required
              disabled={loading}
            />
            <button type="submit" className={styles.addBtn} disabled={loading || !url}>
              {loading ? 'Analyzing...' : 'Add Project'}
            </button>
          </form>
          {error && <div className={styles.error}>{error}</div>}
        </div>
        <div className={styles.projectsGrid}>
          {projects.map((proj, i) => (
            <div className={styles.projectCard} key={proj.url + i}>
              <a href={proj.url} target="_blank" rel="noopener noreferrer" className={styles.projectTitle}>
                {proj.title}
              </a>
              <div className={styles.carouselWrap}>
                <ProjectCarousel images={proj.images} />
              </div>
              <div className={styles.projectInfo}>
                <div className={styles.projectDesc}>{proj.summary}</div>
                <div className={styles.projectMeta}>
                  <span className={styles.packageType}>{proj.packageType} Package</span>
                  <span className={styles.techList}>{proj.technologies.join(', ')}</span>
                </div>
              </div>
              <button className={styles.deleteBtn} onClick={() => handleDeleteProject(i)} title="Delete project">Delete</button>
            </div>
          ))}
        </div>
      </div>
    )
  }
