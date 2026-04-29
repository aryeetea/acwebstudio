import { Link } from 'react-router-dom'
import { packages } from '../data/packages'

const comparisons = [
  { label: 'Pages',           basic: '1',         standard: '3–5',       premium: '6–10' },
  { label: 'Mobile responsive', basic: '✓',       standard: '✓',         premium: '✓' },
  { label: 'Contact form',    basic: '—',          standard: '✓',         premium: '✓' },
  { label: 'Animations',      basic: 'Basic',      standard: 'Standard',  premium: 'Advanced' },
  { label: 'Revisions',       basic: '2',          standard: '3',         premium: '5' },
  { label: 'SEO structure',   basic: '—',          standard: '✓',         premium: '✓' },
  { label: 'Priority support',basic: '—',          standard: '—',         premium: '✓' },
  { label: 'Custom features', basic: '—',          standard: '—',         premium: '✓' },
  { label: 'Turnaround',      basic: '3–5 days',   standard: '7–14 days', premium: '2–4 weeks' },
]

export default function Services() {
  return (
    <>
      {/* HERO */}
      <div style={{ padding: '140px 5% 80px', background: 'var(--cream)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: '-20%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, var(--brown-pale) 0%, transparent 70%)', opacity: 0.4, pointerEvents: 'none' }} />
        <div className="page-shell">
          <div className="section-label fade-in delay-1">Services & Pricing</div>
          <h1 className="fade-in delay-2" style={{ fontSize: 'clamp(40px,5.5vw,76px)', maxWidth: 700, lineHeight: 1.08, marginBottom: 28 }}>
            Transparent pricing.<br />
            <em style={{ fontStyle: 'italic', color: 'var(--brown)' }}>Exceptional work.</em>
          </h1>
          <p className="fade-in delay-3" style={{ fontSize: 18, color: 'var(--gray)', maxWidth: 540, fontWeight: 300, lineHeight: 1.85 }}>
            Every package is fully custom — no templates, no shortcuts. Choose the tier that fits your goals, then add exactly what you need.
          </p>
        </div>
      </div>

      {/* PACKAGES */}
      <section style={{ padding: '100px 5%', background: 'var(--white)' }}>
        <div className="page-shell">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 60 }}>
            {packages.map(pkg => (
              <div
                key={pkg.name}
                style={{
                  border: pkg.featured ? '2px solid var(--black)' : '1px solid var(--brown-pale)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  background: 'var(--white)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Card Header */}
                <div style={{ padding: '32px 28px', borderBottom: '1px solid var(--brown-pale)', background: pkg.featured ? 'var(--black)' : 'transparent' }}>
                  {pkg.featured && (
                    <div style={{ display: 'inline-block', background: 'var(--brown)', color: '#fff', fontSize: 11, letterSpacing: '0.08em', padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase', marginBottom: 16 }}>
                      Recommended
                    </div>
                  )}
                  <div style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--brown)', textTransform: 'uppercase', marginBottom: 12 }}>
                    {pkg.tier}
                  </div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, color: pkg.featured ? '#fff' : 'var(--black)', marginBottom: 12, fontWeight: 400 }}>
                    {pkg.name}
                  </h2>
                  <div style={{ fontSize: 30, fontWeight: 500, color: pkg.featured ? '#fff' : 'var(--black)', marginBottom: 12 }}>
                    {pkg.price}
                  </div>
                  <p style={{ fontSize: 14, color: pkg.featured ? 'rgba(255,255,255,0.55)' : 'var(--gray)', lineHeight: 1.7, fontWeight: 300 }}>
                    {pkg.who}
                  </p>
                </div>

                {/* Card Body */}
                <div style={{ padding: 28, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 12, letterSpacing: '0.08em', color: 'var(--brown)', textTransform: 'uppercase', marginBottom: 16 }}>
                    What's Included
                  </div>
                  <ul style={{ listStyle: 'none', marginBottom: 28 }}>
                    {pkg.includes.map(item => (
                      <li key={item} style={{ fontSize: 14, color: 'var(--gray)', padding: '7px 0', borderBottom: '1px solid #F0EBE2', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 300 }}>
                        <span style={{ color: 'var(--brown)', fontSize: 13, flexShrink: 0 }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Add-ons */}
                  <div style={{ background: 'var(--cream)', borderRadius: 4, padding: 20, marginBottom: 24 }}>
                    <div style={{ fontSize: 12, letterSpacing: '0.08em', color: 'var(--gray)', textTransform: 'uppercase', marginBottom: 12 }}>
                      Add-Ons Available
                    </div>
                    {pkg.addons.map(a => (
                      <div key={a.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--gray)', padding: '6px 0', borderBottom: '1px solid var(--brown-pale)', fontWeight: 300 }}>
                        <span>{a.label}</span>
                        <span style={{ color: 'var(--brown)', fontWeight: 500 }}>{a.price}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    to={`/contact?package=${pkg.slug}`}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      background: pkg.featured ? 'var(--brown)' : 'var(--black)',
                      color: '#fff',
                      padding: 14,
                      borderRadius: 2,
                      fontSize: 14,
                      letterSpacing: '0.06em',
                      transition: 'background 0.2s',
                      marginTop: 'auto',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = pkg.featured ? 'var(--black)' : 'var(--brown)'}
                    onMouseLeave={e => e.currentTarget.style.background = pkg.featured ? 'var(--brown)' : 'var(--black)'}
                  >
                    Order This Package
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* COMPARISON TABLE */}
          <div style={{ background: 'var(--cream)', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--brown-pale)' }}>
            <div style={{ padding: '28px 32px', borderBottom: '1px solid var(--brown-pale)', background: 'var(--white)' }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: 'var(--black)', fontWeight: 400 }}>
                Package Comparison
              </h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--white)' }}>
                    <th style={{ padding: '14px 32px', textAlign: 'left', fontSize: 13, color: 'var(--gray)', fontWeight: 400, letterSpacing: '0.06em', borderBottom: '1px solid var(--brown-pale)' }}>
                      Feature
                    </th>
                    {['Basic', 'Standard', 'Premium'].map(h => (
                      <th key={h} style={{ padding: '14px 24px', textAlign: 'center', fontSize: 13, color: h === 'Standard' ? 'var(--brown)' : 'var(--gray)', fontWeight: 500, letterSpacing: '0.06em', borderBottom: '1px solid var(--brown-pale)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row, i) => (
                    <tr key={row.label} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--white)' }}>
                      <td style={{ padding: '12px 32px', fontSize: 14, color: 'var(--gray)', fontWeight: 300, borderBottom: '1px solid var(--brown-pale)' }}>
                        {row.label}
                      </td>
                      {[row.basic, row.standard, row.premium].map((val, j) => (
                        <td key={j} style={{ padding: '12px 24px', textAlign: 'center', fontSize: 14, color: val === '—' ? 'var(--gray-light)' : val === '✓' ? 'var(--brown)' : 'var(--black)', fontWeight: val === '✓' ? 500 : 300, borderBottom: '1px solid var(--brown-pale)' }}>
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* NOT SURE SECTION */}
      <section style={{ padding: '100px 5%', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ background: 'var(--white)', border: '1px solid var(--brown-pale)', borderRadius: 4, padding: '60px 48px', textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Not Sure?</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(26px,3.5vw,40px)', color: 'var(--black)', marginBottom: 16, fontWeight: 400 }}>
              Not sure which package is right for you?
            </h2>
            <p style={{ fontSize: 16, color: 'var(--gray)', fontWeight: 300, lineHeight: 1.8, marginBottom: 36 }}>
              Send us your project details and we will help you choose the best fit. Every project starts with a clear conversation and a practical recommendation.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn-primary">Request a Custom Quote</Link>
              <Link to="/team" className="btn-outline">Meet the Team</Link>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BAND */}
      <div style={{ background: 'var(--brown)', padding: '80px 5%', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,4vw,52px)', color: '#fff', marginBottom: 20, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.15 }}>
          Ready to place your order?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 17, marginBottom: 40, fontWeight: 300 }}>
          Choose a package, send your project details, and we will confirm the deposit, scope, and timeline with you.
        </p>
        <Link
          to="/contact"
          className="btn-primary"
          style={{ background: '#fff', color: 'var(--brown)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--black)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--brown)' }}
        >
          Order Your Package
        </Link>
      </div>
    </>
  )
}
