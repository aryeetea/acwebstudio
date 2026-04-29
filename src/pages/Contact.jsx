import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { packageMap, packageOptions, packages } from '../data/packages'
import { faqs } from '../data/faqs'

const inputStyle = {
  width: '100%',
  background: 'var(--white)',
  border: '1px solid var(--brown-pale)',
  borderRadius: 2,
  padding: '13px 16px',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 15,
  color: 'var(--black)',
  outline: 'none',
  transition: 'border-color 0.2s',
}

const labelStyle = {
  display: 'block',
  fontSize: 12,
  letterSpacing: '0.08em',
  color: 'var(--gray)',
  textTransform: 'uppercase',
  marginBottom: 8,
}

export default function Contact() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [openFaq, setOpenFaq] = useState(null)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    package: searchParams.get('package') || 'professional',
    businessName: '',
    instagram: '',
    timeline: '',
    addons: [],
    message: '',
  })

  useEffect(() => {
    const packageFromUrl = searchParams.get('package')
    if (packageFromUrl && packageFromUrl !== form.package) {
      setForm(current => ({ ...current, package: packageFromUrl, addons: [] }))
    }
  }, [form.package, searchParams])

  const selectedPackage = packageMap[form.package] || packages[1]

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handlePackageChange = e => {
    const nextPackage = e.target.value
    setForm(current => ({ ...current, package: nextPackage, addons: [] }))
    setSearchParams(nextPackage ? { package: nextPackage } : {})
  }

  const handleAddonToggle = addonId => {
    setForm(current => ({
      ...current,
      addons: current.addons.includes(addonId)
        ? current.addons.filter(item => item !== addonId)
        : [...current.addons, addonId],
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    setSent(true)
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      package: selectedPackage.slug,
      businessName: '',
      instagram: '',
      timeline: '',
      addons: [],
      message: '',
    })
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <>
      {/* HERO */}
      <div style={{ padding: '140px 5% 80px', background: 'var(--cream)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, var(--brown-pale) 0%, transparent 70%)', opacity: 0.35, pointerEvents: 'none' }} />
        <div className="page-shell">
          <div className="section-label fade-in delay-1">Place Your Order</div>
          <h1 className="fade-in delay-2" style={{ fontSize: 'clamp(40px,5.5vw,76px)', maxWidth: 680, lineHeight: 1.08, marginBottom: 28 }}>
            Order your<br />
            <em style={{ fontStyle: 'italic', color: 'var(--brown)' }}>website package</em>
          </h1>
          <p className="fade-in delay-3" style={{ fontSize: 18, color: 'var(--gray)', maxWidth: 520, fontWeight: 300, lineHeight: 1.85 }}>
            Choose your package, add any extras, and send your project details. We will confirm the deposit, timeline, and next steps within 24 hours.
          </p>
        </div>
      </div>

      {/* CONTACT LAYOUT */}
      <section style={{ padding: '100px 5%', background: 'var(--white)' }}>
        <div className="page-shell layout-sidebar">

          {/* LEFT — Info */}
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(26px,3vw,40px)', color: 'var(--black)', lineHeight: 1.2, marginBottom: 20 }}>
              Your order at a glance
            </h2>
            <p style={{ fontSize: 16, color: 'var(--gray)', lineHeight: 1.85, fontWeight: 300, marginBottom: 36 }}>
              Pick a package, personalize it, and send everything in one place. We review each inquiry personally before confirming scope and timeline.
            </p>

            <div style={{ background: 'var(--white)', border: '1px solid var(--brown-pale)', borderRadius: 24, padding: '24px 22px', marginBottom: 24, boxShadow: '0 16px 30px rgba(31,23,38,0.06)' }}>
              <div style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--brown)', textTransform: 'uppercase', marginBottom: 10 }}>
                Selected Package
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, color: 'var(--black)', lineHeight: 1.05, marginBottom: 6 }}>
                {selectedPackage.name}
              </div>
              <div style={{ fontSize: 24, color: 'var(--brown)', fontWeight: 500, marginBottom: 14 }}>{selectedPackage.price}</div>
              <p style={{ fontSize: 14, color: 'var(--gray)', lineHeight: 1.7, marginBottom: 18 }}>{selectedPackage.who}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  ['Deposit to begin', selectedPackage.deposit],
                  ['Estimated turnaround', selectedPackage.turnaround],
                ].map(([label, value]) => (
                  <div key={label} style={{ background: 'var(--cream)', borderRadius: 16, padding: '14px 16px', border: '1px solid var(--brown-pale)' }}>
                    <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 15, color: 'var(--black)', fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>
              {form.addons.length > 0 && (
                <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--brown-pale)' }}>
                  <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 8 }}>Selected extras</div>
                  {selectedPackage.addons.filter(addon => form.addons.includes(addon.id)).map(addon => (
                    <div key={addon.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 14, color: 'var(--gray)', padding: '4px 0' }}>
                      <span>{addon.label}</span>
                      <span style={{ color: 'var(--brown)', fontWeight: 500 }}>{addon.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact details */}
            {[
              { icon: '✉', label: 'Order Confirmation', value: 'Within 24 hours' },
              { icon: '💳', label: 'To Secure Your Spot', value: '50% deposit required' },
              { icon: '🌍', label: 'Client Access', value: 'Open to clients worldwide' },
            ].map(d => (
              <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, padding: '16px 20px', background: 'var(--cream)', border: '1px solid var(--brown-pale)', borderRadius: 4 }}>
                <div style={{ width: 40, height: 40, background: 'var(--brown-pale)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  {d.icon}
                </div>
                <div>
                  <div style={{ fontSize: 11, letterSpacing: '0.08em', color: 'var(--gray)', textTransform: 'uppercase', marginBottom: 3 }}>{d.label}</div>
                  <div style={{ fontSize: 14, color: 'var(--black)', fontWeight: 400 }}>{d.value}</div>
                </div>
              </div>
            ))}

            <Link to="/faq" className="btn-outline" style={{ marginTop: 24 }}>
              Review Common Questions
            </Link>
          </div>

          {/* RIGHT — Form */}
          <div style={{ background: 'var(--cream)', border: '1px solid var(--brown-pale)', borderRadius: 4, padding: '44px 40px' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 64, color: 'var(--brown)', marginBottom: 16, lineHeight: 1 }}>✓</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, color: 'var(--black)', marginBottom: 12 }}>Order received!</h3>
                <p style={{ fontSize: 15, color: 'var(--gray)', fontWeight: 300, lineHeight: 1.7 }}>
                  Thanks for your request. We will confirm your package, deposit, and timeline within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Choose Your Package</label>
                  <select
                    name="package"
                    value={form.package}
                    onChange={handlePackageChange}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = 'var(--brown)'}
                    onBlur={e => e.target.style.borderColor = 'var(--brown-pale)'}
                  >
                    {packageOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                    <option value="">Custom quote request</option>
                  </select>
                </div>

                {/* Name row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
                  {[['firstName', 'First Name', 'Jane'], ['lastName', 'Last Name', 'Smith']].map(([name, label, ph]) => (
                    <div key={name}>
                      <label style={labelStyle}>{label}</label>
                      <input
                        name={name}
                        value={form[name]}
                        onChange={handleChange}
                        placeholder={ph}
                        required
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = 'var(--brown)'}
                        onBlur={e => e.target.style.borderColor = 'var(--brown-pale)'}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      required
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--brown)'}
                      onBlur={e => e.target.style.borderColor = 'var(--brown-pale)'}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Business / Brand Name</label>
                    <input
                      name="businessName"
                      value={form.businessName}
                      onChange={handleChange}
                      placeholder="AC Web Studio"
                      required
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--brown)'}
                      onBlur={e => e.target.style.borderColor = 'var(--brown-pale)'}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  <div>
                    <label style={labelStyle}>Instagram or Website</label>
                    <input
                      name="instagram"
                      value={form.instagram}
                      onChange={handleChange}
                      placeholder="@yourbrand or yoursite.com"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--brown)'}
                      onBlur={e => e.target.style.borderColor = 'var(--brown-pale)'}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Preferred Timeline</label>
                    <input
                      name="timeline"
                      value={form.timeline}
                      onChange={handleChange}
                      placeholder="ASAP / next month / flexible"
                      required
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--brown)'}
                      onBlur={e => e.target.style.borderColor = 'var(--brown-pale)'}
                    />
                  </div>
                </div>

                {selectedPackage?.addons?.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <label style={labelStyle}>Add-On Options</label>
                    <div style={{ display: 'grid', gap: 12 }}>
                      {selectedPackage.addons.map(addon => {
                        const active = form.addons.includes(addon.id)
                        return (
                          <button
                            key={addon.id}
                            type="button"
                            onClick={() => handleAddonToggle(addon.id)}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: 16,
                              width: '100%',
                              padding: '16px 18px',
                              borderRadius: 18,
                              border: `1px solid ${active ? 'var(--brown)' : 'var(--brown-pale)'}`,
                              background: active ? 'var(--white)' : 'rgba(255,255,255,0.62)',
                              color: 'var(--black)',
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                          >
                            <span>
                              <span style={{ display: 'block', fontSize: 14, fontWeight: 500 }}>{addon.label}</span>
                              <span style={{ display: 'block', fontSize: 12, color: 'var(--gray)', marginTop: 3 }}>
                                Add to this package
                              </span>
                            </span>
                            <span style={{ color: 'var(--brown)', fontSize: 13, fontWeight: 500 }}>{addon.price}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Message */}
                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Project Details / Order Notes</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me what pages you need, your style references, any must-have features, and anything else I should know before confirming your order..."
                    required
                    rows={5}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 130 }}
                    onFocus={e => e.target.style.borderColor = 'var(--brown)'}
                    onBlur={e => e.target.style.borderColor = 'var(--brown-pale)'}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  style={{ width: '100%', background: 'var(--black)', color: '#fff', border: 'none', padding: 16, borderRadius: 2, fontFamily: "'DM Sans', sans-serif", fontSize: 15, letterSpacing: '0.06em', cursor: 'pointer', transition: 'background 0.25s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--brown)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--black)'}
                >
                  Place Order Request →
                </button>
                <p style={{ fontSize: 12, color: 'var(--gray)', lineHeight: 1.7, marginTop: 12 }}>
                  This submits your order request and reserves the package pending deposit confirmation. No automatic payment is charged on-site yet.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '100px 5%' }}>
        <div className="page-shell">
          <div className="section-label">Before You Order</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(30px,4vw,50px)', color: 'var(--black)', marginBottom: 16 }}>
            Frequently asked questions
          </h2>
          <p style={{ fontSize: 16, color: 'var(--gray)', fontWeight: 300, maxWidth: 520, marginBottom: 56, lineHeight: 1.8 }}>
            Here are answers to the questions I get asked most often.
          </p>
          <Link to="/faq" className="btn-outline" style={{ marginBottom: 36, display: 'inline-block' }}>
            Visit Full FAQ Page
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '0 40px' }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--brown-pale)' }}>
                <div
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
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

      {/* BOTTOM CTA */}
      <div style={{ background: 'var(--black)', padding: '80px 5%', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px,4vw,52px)', color: '#fff', marginBottom: 20, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.15 }}>
          Need something outside the packages?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 17, marginBottom: 40, fontWeight: 300 }}>
          If none of the packages fit exactly, send a custom quote request and we will recommend the best next step.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/services" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
            Back to Packages
          </Link>
          <Link to="/team" className="btn-primary">
            Meet the Team
          </Link>
        </div>
      </div>
    </>
  )
}
