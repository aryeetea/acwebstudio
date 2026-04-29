import { useState } from 'react'
import { Link } from 'react-router-dom'
// PortraitCard import removed
import { faqs } from '../data/faqs'

const services = [
  {
    num: '01',
    name: 'Starter',
    price: '$150 – $250',
    desc: 'For freelancers and individuals who need a sharp, professional one-page presence — delivered quickly.',
    features: ['1-page custom website', 'Mobile responsive design', 'Clean, modern aesthetic', 'Basic contact section', '2 rounds of revisions'],
  },
  {
    num: '02',
    name: 'Professional',
    price: '$400 – $700',
    desc: 'For small businesses ready to make a real impression across multiple pages.',
    features: ['3–5 pages', 'Contact form included', 'Custom animations', 'SEO-ready structure', '3 rounds of revisions'],
    featured: true,
  },
  {
    num: '03',
    name: 'Signature',
    price: '$800 – $1300',
    desc: 'For established brands who want a fully custom, high-end digital experience that stands out.',
    features: ['6–10 pages', 'Advanced animations', 'Custom features', 'Priority support', '5 rounds of revisions'],
  },
]

const portfolioPreviews = [
  {
    name: 'Lumora Studio',
    desc: 'Minimal editorial site for a London photography studio.',
    tag: 'Photography',
    initial: 'Lumora',
    bg: 'linear-gradient(135deg,#2C2C2A,#444441)',
  },
  {
    name: 'Terroir Co.',
    desc: 'Landing page for an artisan coffee brand. Warm, bold typography.',
    tag: 'E-Commerce',
    initial: 'Terroir',
    bg: 'linear-gradient(135deg,#3B2A1A,#8B6F4E)',
  },
  {
    name: 'Kova Legal',
    desc: 'Professional site for a boutique law firm. Trust-building and clean.',
    tag: 'Professional',
    initial: 'Kova',
    bg: 'linear-gradient(135deg,#1a2535,#2d4a6e)',
  },
]

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <>
      {/* HERO */}
      <div style={{ minHeight: '92vh', display: 'flex', alignItems: 'center', padding: '140px 5% 80px', background: 'linear-gradient(180deg, var(--cream), var(--white))', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, var(--hero-glow) 0%, transparent 70%)', opacity: 1, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-8%', left: '-2%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)', opacity: 0.65, pointerEvents: 'none' }} />
        <div className="page-shell">
          <div className="hero-grid">
            <div>
              <div className="section-label fade-in delay-1">Web Design & Development</div>
              <div className="fade-in delay-2" style={{ marginBottom: 26 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 999, background: 'var(--white)', border: '1px solid var(--brown-pale)', marginBottom: 22, boxShadow: '0 12px 28px rgba(31, 23, 38, 0.06)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-strong)', boxShadow: '0 0 0 6px var(--accent-soft)' }} />
                  <span style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gray)' }}>Rose Noir Studio</span>
                </div>
                <h1 style={{ fontSize: 'clamp(40px,6vw,80px)', maxWidth: 820, marginBottom: 28, lineHeight: 1.02 }}>
                  Custom websites for
                  <br />
                  <em style={{ fontStyle: 'italic', color: 'var(--brown)' }}>small businesses with vision</em>
                  <br />
                  and brands ready to grow
                </h1>
              </div>
              <p className="fade-in delay-3" style={{ fontSize: 17, color: 'var(--gray)', maxWidth: 560, marginBottom: 32, fontWeight: 300, lineHeight: 1.8 }}>
                AC Web Studio designs and develops custom websites from scratch for founders who want something polished, personal, and built to last.
              </p>
              <div className="fade-in delay-4" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 38 }}>
                <Link to="/services" className="btn-primary">View Packages</Link>
                {/* Portfolio button removed */}
              </div>
              <p className="fade-in delay-4" style={{ fontSize: 13, color: 'var(--gray)', marginTop: 16 }}>
                Start with a package, explore the work, or reach out for a custom quote.
              </p>
            </div>
            {/* PortraitCard removed */}
          </div>
        </div>
      </div>

      {/* INTRO BAND */}
      <div style={{ background: 'linear-gradient(135deg, var(--surface-dark), var(--surface-dark-soft))', padding: '80px 5%' }}>
        <div className="page-shell layout-split">
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,3.5vw,46px)', color: '#fff', lineHeight: 1.18, marginBottom: 32 }}>
              Design-first development that{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--brown-light)' }}>actually works</em>{' '}
              for your business
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              {[
                ['100%', 'Custom builds'],
                ['3', 'Flexible packages'],
                ['∞', 'Creative possibilities'],
                ['1', 'Focused designer'],
              ].map(([n, l]) => (
                <div key={l} style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 20 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300, color: '#fff', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', marginTop: 6 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 17, lineHeight: 1.9, fontWeight: 300 }}>
            AC Web Studio creates websites from scratch — no page builders, no bloated templates. Each site is thoughtfully designed to reflect your brand and built to perform. Whether you're a solo creative, a small business, or a growing brand, there's a package built for you.
          </p>
        </div>
      </div>

      {/* SERVICES PREVIEW */}
      <section style={{ padding: '100px 5%', background: 'var(--white)' }}>
        <div className="page-shell">
          <div className="section-label">What We Offer</div>
          <h2 style={{ fontSize: 'clamp(30px,4vw,52px)', marginBottom: 16, color: 'var(--black)' }}>
            Packages built for<br />every stage of growth
          </h2>
          <p style={{ color: 'var(--gray)', fontSize: 17, fontWeight: 300, maxWidth: 520, marginBottom: 52, lineHeight: 1.75 }}>
            Three tiers of service, each designed with clarity and purpose. No hidden fees — just honest, quality work.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {services.map(s => (
              <div
                key={s.num}
                style={{
                  background: s.featured ? 'var(--black)' : 'var(--white)',
                  border: `1px solid ${s.featured ? 'var(--black)' : 'var(--brown-pale)'}`,
                  borderRadius: 4,
                  padding: '36px 28px',
                  position: 'relative',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(31,23,38,0.12)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                {s.featured && (
                  <span style={{ position: 'absolute', top: 20, right: 20, background: 'var(--brown)', color: '#fff', fontSize: 11, letterSpacing: '0.08em', padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase' }}>
                    Best Fit
                  </span>
                )}
                <div style={{ fontSize: 12, color: 'var(--brown-light)', letterSpacing: '0.1em', marginBottom: 16 }}>{s.num}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: s.featured ? '#fff' : 'var(--black)', marginBottom: 8 }}>{s.name}</h3>
                <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--brown)', marginBottom: 16 }}>{s.price}</div>
                <p style={{ fontSize: 14, color: s.featured ? 'rgba(255,255,255,0.6)' : 'var(--gray)', marginBottom: 24, fontWeight: 300, lineHeight: 1.7 }}>{s.desc}</p>
                <ul style={{ listStyle: 'none' }}>
                  {s.features.map(f => (
                    <li key={f} style={{ fontSize: 14, color: s.featured ? 'rgba(255,255,255,0.7)' : 'var(--gray)', padding: '7px 0', borderBottom: `1px solid ${s.featured ? 'rgba(255,255,255,0.1)' : 'var(--brown-pale)'}`, display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ color: 'var(--brown)', fontSize: 12, flexShrink: 0 }}>→</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/services" className="btn-primary">View Full Packages</Link>
          </div>
        </div>
      </section>

      {/* Portfolio preview section removed */}

      {/* FAQ */}
      <section style={{ padding: '100px 5%', background: 'var(--white)' }}>
        <div className="page-shell layout-faq">
          <div>
            <div className="section-label">FAQ</div>
            <h2 style={{ fontSize: 'clamp(28px,3.5vw,46px)', marginBottom: 20, color: 'var(--black)' }}>Common questions</h2>
            <p style={{ fontSize: 15, color: 'var(--gray)', fontWeight: 300, lineHeight: 1.8 }}>
              Still have questions? Feel free to reach out directly.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 32 }}>
              <Link to="/faq" className="btn-outline">
                View Full FAQ
              </Link>
              <Link to="/contact" className="btn-primary">
                Get in Touch
              </Link>
            </div>
          </div>
          <div>
            {faqs.slice(0, 4).map((f, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--brown-pale)' }}>
                <div
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 0', cursor: 'pointer', gap: 20 }}
                >
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: 'var(--black)', fontWeight: 400 }}>
                    {f.q}
                  </h3>
                  <span style={{
                    width: 28, height: 28,
                    border: '1px solid var(--brown-pale)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16,
                    color: openFaq === i ? '#fff' : 'var(--brown)',
                    background: openFaq === i ? 'var(--black)' : 'transparent',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}>
                    {openFaq === i ? '−' : '+'}
                  </span>
                </div>
                {openFaq === i && (
                  <p style={{ fontSize: 15, color: 'var(--gray)', fontWeight: 300, lineHeight: 1.8, paddingBottom: 24 }}>
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <div style={{ background: 'var(--brown)', padding: '80px 5%', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,4vw,54px)', color: '#fff', marginBottom: 20, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.15 }}>
          Ready to build something you're proud of?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 17, marginBottom: 40, fontWeight: 300 }}>
          Let's turn your vision into a website that works as hard as you do.
        </p>
        <Link to="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--brown)' }}>
          Work With Me
        </Link>
      </div>
    </>
  )
}
