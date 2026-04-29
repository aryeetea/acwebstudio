import { Link } from 'react-router-dom'
import PortraitCard from '../components/PortraitCard'

const values = [
  { name: 'Custom Builds', desc: 'No templates. Every site is written from scratch, tailored entirely to you.' },
  { name: 'Clean Design', desc: 'Minimal, intentional, and purposeful. Nothing wasted, nothing cluttered.' },
  { name: 'Attention to Detail', desc: 'The small things make the biggest difference. Every pixel is considered.' },
  { name: 'Clear Communication', desc: 'No confusion, no surprises. Honest, transparent work from start to finish.' },
  { name: 'Design-First Thinking', desc: 'Before any code is written, I think about the user and the experience.' },
  { name: 'Results-Driven', desc: 'Beautiful sites that also convert — aesthetics and performance together.' },
]

const process = [
  { step: '01', title: 'Discovery', desc: 'We start with a conversation about your brand, your goals, and your audience. No assumptions — just listening.' },
  { step: '02', title: 'Design', desc: 'I create a design direction and layout concepts before touching code. You approve the look before we build.' },
  { step: '03', title: 'Development', desc: 'Every line of code is written from scratch. Clean, fast, and mobile-ready from day one.' },
  { step: '04', title: 'Revisions', desc: 'We refine together. Your feedback shapes the final result — nothing ships until you\'re happy.' },
  { step: '05', title: 'Launch', desc: 'Your site goes live. I handle the final checks, handover files, and make sure everything is perfect.' },
]

export default function About() {
  return (
    <>
      {/* HERO */}
      <div style={{ padding: '140px 5% 80px', background: 'linear-gradient(180deg, var(--cream), var(--white))', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, var(--hero-glow) 0%, transparent 70%)', opacity: 1, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-label fade-in delay-1">About AC Web Studio</div>
          <h1 className="fade-in delay-2" style={{ fontSize: 'clamp(40px,5.5vw,76px)', maxWidth: 760, lineHeight: 1.08, marginBottom: 28 }}>
            Built on craft,<br />
            <em style={{ fontStyle: 'italic', color: 'var(--brown)' }}>driven by results</em>
          </h1>
          <p className="fade-in delay-3" style={{ fontSize: 18, color: 'var(--gray)', maxWidth: 560, fontWeight: 300, lineHeight: 1.85 }}>
            A one-person studio dedicated to building websites that are as thoughtful as they are beautiful — custom-coded, design-first, and built to last.
          </p>
        </div>
      </div>

      {/* MAIN ABOUT */}
      <section style={{ padding: '100px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 100, alignItems: 'start' }}>

          {/* LEFT — Visual */}
          <div style={{ position: 'sticky', top: 100 }}>
            <PortraitCard />

            {/* Mini stats */}
            <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['100%', 'Custom built'], ['24h', 'Avg. response'], ['5★', 'Client rating'], ['∞', 'Possibilities']].map(([n, l]) => (
                <div key={l} style={{ background: 'var(--white)', border: '1px solid var(--brown-pale)', borderRadius: 4, padding: '16px 18px' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, color: 'var(--black)', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray)', letterSpacing: '0.06em', marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Story */}
          <div>
            <p style={{ fontSize: 18, color: 'var(--gray)', lineHeight: 1.9, fontWeight: 300, marginBottom: 24 }}>
              Hi — we're the team behind{' '}
              <strong style={{ color: 'var(--black)', fontWeight: 500 }}>AC Web Studio</strong>. We built this studio on one belief: that every business, regardless of size, deserves a website that genuinely reflects who they are.
            </p>
            <p style={{ fontSize: 18, color: 'var(--gray)', lineHeight: 1.9, fontWeight: 300, marginBottom: 24 }}>
              I don't use templates or drag-and-drop builders. Every project is written and designed{' '}
              <strong style={{ color: 'var(--black)', fontWeight: 500 }}>from scratch</strong>, with full attention to the details that make a site memorable — the typography, the spacing, the micro-interactions, the way a page breathes.
            </p>
            <p style={{ fontSize: 18, color: 'var(--gray)', lineHeight: 1.9, fontWeight: 300, marginBottom: 24 }}>
              My approach is{' '}
              <strong style={{ color: 'var(--black)', fontWeight: 500 }}>design-first</strong>. Before a single line of code is written, I think about who the user is, what they need to feel, and what action they should take. Good design and good development aren't separate — they're the same thing done well.
            </p>
            <p style={{ fontSize: 18, color: 'var(--gray)', lineHeight: 1.9, fontWeight: 300, marginBottom: 48 }}>
              Whether you're a freelancer building your first portfolio, a small business ready to level up, or an established brand seeking something polished and premium —{' '}
              <strong style={{ color: 'var(--black)', fontWeight: 500 }}>AC Web Studio is built to meet you there</strong>.
            </p>

            {/* VALUES */}
            <div style={{ borderTop: '1px solid var(--brown-pale)', paddingTop: 48, marginBottom: 48 }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: 'var(--black)', marginBottom: 32 }}>What I stand for</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {values.map(v => (
                  <div key={v.name} style={{ borderLeft: '2px solid var(--brown-pale)', paddingLeft: 20 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: 'var(--black)', marginBottom: 6 }}>{v.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.7, fontWeight: 300 }}>{v.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <Link to="/contact" className="btn-primary">Start Your Project</Link>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section style={{ padding: '100px 5%', background: 'var(--black)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ width: 24, height: 1, background: 'var(--brown)', display: 'block' }} />
            <span style={{ fontSize: 12, letterSpacing: '0.14em', color: 'var(--brown)', textTransform: 'uppercase' }}>How I Work</span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(30px,4vw,52px)', color: '#fff', marginBottom: 64, maxWidth: 480, lineHeight: 1.15 }}>
            A process built for{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--brown-light)' }}>clarity and quality</em>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40 }}>
            {process.map(p => (
              <div key={p.step}>
                <div style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--brown)', textTransform: 'uppercase', marginBottom: 16 }}>{p.step}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: '#fff', marginBottom: 12 }}>{p.title}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, fontWeight: 300 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div style={{ background: 'var(--brown)', padding: '80px 5%', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,4vw,52px)', color: '#fff', marginBottom: 20, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.15 }}>
          Let's build something great together
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 17, marginBottom: 40, fontWeight: 300 }}>
          Reach out and tell me about your project. I'd love to hear from you.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--brown)' }}>Start a Project</Link>
          <Link to="/services" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}>View Packages</Link>
        </div>
      </div>
    </>
  )
}
