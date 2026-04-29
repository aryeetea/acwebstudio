import { useState, useRef, useEffect } from 'react'
import SectionIntro from '../components/SectionIntro'
import Carousel from '../components/Carousel'

function getSavedProjects() {
  try {
    return JSON.parse(localStorage.getItem('portfolioProjects') || '[]')
  } catch {
    return []
  }
}

  const [projects, setProjects] = useState(getSavedProjects())
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('portfolioProjects', JSON.stringify(projects))
  }, [projects])

  function handleAdd(e) {
    e.preventDefault()
    let url = input.trim()
    if (!url) return
    if (!/^https?:\/\//.test(url)) url = 'https://' + url
    if (projects.includes(url)) return
    setProjects([url, ...projects])
    setInput('')
    inputRef.current?.focus()
  }

  function handleRemove(idx) {
    setProjects(projects.filter((_, i) => i !== idx))
  }

  return (
    <>
       <section className="relative overflow-hidden px-5 pb-20 pt-36 sm:px-6 sm:pt-40">
         <div className="absolute inset-x-0 top-0 h-130 bg-[radial-gradient(circle_at_right,rgba(196,168,130,0.18),transparent_34%),radial-gradient(circle_at_left,rgba(139,111,78,0.10),transparent_28%)]" />
        <div className="relative mx-auto max-w-6xl">
          <SectionIntro
            label="Portfolio"
            title="Showcase your favorite websites."
            copy="Paste a website link below. Your portfolio will be saved and shown as a carousel."
          />
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-6">
        <div className="mx-auto max-w-2xl">
           <form onSubmit={handleAdd} className="flex gap-3 mb-10">
             <input
               ref={inputRef}
               type="url"
               value={input}
               onChange={e => setInput(e.target.value)}
               placeholder="https://yourwebsite.com"
               className="flex-1 rounded-sm border border-warmbrown-pale bg-cream px-4 py-3 text-[1rem] text-ink outline-none focus:border-warmbrown"
               required
             />
            <button type="submit" className="rounded-full bg-ink px-6 py-3 text-[0.8rem] font-medium uppercase tracking-[0.18em] text-softwhite hover:bg-warmbrown transition">
              Add
            </button>
          </form>

          {projects.length === 0 ? (
            <div className="text-center text-ink/60 py-16">No projects added yet. Paste a link above to get started.</div>
          ) : (
            <ul className="space-y-6">
              {projects.map((url, idx) => (
                <li key={url} className="flex items-center gap-4 border border-warmbrown-pale rounded-sm bg-softwhite px-6 py-4">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-warmbrown underline break-all flex-1">{url}</a>
                  <button
                    onClick={() => handleRemove(idx)}
                    className="bg-warmbrown/80 text-softwhite rounded-full px-3 py-1 text-xs hover:bg-warmbrown"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
