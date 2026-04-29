import { useState } from 'react'
import { Link } from 'react-router-dom'
import { faqs } from '../data/faqs'

export default function Faq() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <>
      <div style={{ padding: '140px 5% 80px', background: 'linear-gradient(180deg, var(--cream), var(--white))', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '2%', right: '-8%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, var(--hero-glow) 0%, transparent 72%)', opacity: 1, pointerEvents: 'none' }} />
        <div className="page-shell">
          <div className="section-label fade-in delay-1">FAQ</div>
          <h1 className="fade-in delay-2" style={{ fontSize: 'clamp(40px,5.5vw,76px)', maxWidth: 760, lineHeight: 1.08, marginBottom: 28 }}>
            Everything clients usually
            <br />
            <em style={{ fontStyle: 'italic', color: 'var(--brown)' }}>ask before booking</em>
          </h1>
          <p className="fade-in delay-3" style={{ fontSize: 18, color: 'var(--gray)', maxWidth: 580, fontWeight: 300, lineHeight: 1.85 }}>
            A dedicated place for timelines, payments, revisions, and what working together actually looks like.
          </p>
        </div>
      </div>

      <section style={{ padding: '100px 5%', background: 'var(--white)' }}>
        <div className="page-shell layout-split" style={{ alignItems: 'start' }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,3.8vw,48px)', color: 'var(--black)', marginBottom: 20, lineHeight: 1.15 }}>
              Clear answers,
              <br />
              no guesswork
            </h2>
            <p style={{ fontSize: 16, color: 'var(--gray)', lineHeight: 1.85, fontWeight: 300, marginBottom: 30 }}>
              If you are comparing packages, wondering what happens after inquiry, or trying to understand the process, this page is here to make that easier.
            </p>
            <div style={{ background: 'var(--cream)', border: '1px solid var(--brown-pale)', borderRadius: 4, padding: '24px 22px', marginBottom: 18 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--brown)', textTransform: 'uppercase', marginBottom: 10 }}>
                Quick Notes
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                {[
                  ['Replies', 'Within 24 hours'],
                  ['Deposit', '50 percent to begin'],
                  ['Build style', 'Custom-coded from scratch'],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, paddingBottom: 12, borderBottom: '1px solid var(--brown-pale)', fontSize: 14 }}>
                    <span style={{ color: 'var(--gray)' }}>{label}</span>
                    <span style={{ color: 'var(--black)', fontWeight: 500, textAlign: 'right' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/contact" className="btn-primary">Start Your Project</Link>
          </div>

          <div>
            {faqs.map((faq, index) => (
              <div key={faq.q} style={{ borderBottom: '1px solid var(--brown-pale)' }}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '24px 0',
                    gap: 20,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: 'var(--black)', lineHeight: 1.2 }}>
                    {faq.q}
                  </span>
                  <span style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    border: '1px solid var(--brown-pale)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: openFaq === index ? '#fff' : 'var(--brown)',
                    background: openFaq === index ? 'var(--black)' : 'transparent',
                    flexShrink: 0,
                  }}>
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                {openFaq === index && (
                  <p style={{ padding: '0 0 26px', fontSize: 15, color: 'var(--gray)', fontWeight: 300, lineHeight: 1.85, maxWidth: 760 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ background: 'var(--black)', padding: '80px 5%', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,4vw,52px)', color: '#fff', marginBottom: 20, maxWidth: 620, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.15 }}>
          Still unsure about something?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 17, marginBottom: 40, fontWeight: 300 }}>
          Send your questions directly and I will help you choose the right package and next step.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/contact" className="btn-primary">Ask a Question</Link>
          <Link to="/services" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
            View Packages
          </Link>
        </div>
      </div>
    </>
  )
}
