export const packages = [
  {
    slug: 'starter',
    tier: '01 — Basic',
    name: 'Starter',
    price: '$150 – $250',
    priceRange: [150, 250],
    deposit: '$75 – $125',
    turnaround: '3–5 days',
    who: 'Perfect for freelancers, creatives, and individuals who need a clean, professional presence online — fast.',
    includes: [
      '1-page fully custom website',
      'Mobile responsive design',
      'Clean, modern aesthetic',
      'Basic contact section',
      'Smooth scroll & hover effects',
      '2 rounds of revisions',
      'Final file handover',
    ],
    addons: [
      { id: 'starter-extra-section', label: 'Extra section', price: '$30 – $60' },
      { id: 'starter-fast-delivery', label: 'Fast delivery', price: '$50 – $100' },
      { id: 'starter-extra-revision', label: 'Extra revision round', price: '$20 – $40' },
    ],
  },
  {
    slug: 'professional',
    tier: '02 — Standard',
    name: 'Professional',
    price: '$400 – $700',
    priceRange: [400, 700],
    deposit: '$200 – $350',
    turnaround: '7–14 days',
    who: 'Ideal for small businesses and brands ready to make a real impression across multiple pages.',
    includes: [
      '3–5 fully custom pages',
      'Mobile responsive & optimized',
      'Contact form integration',
      'Basic animations & transitions',
      'SEO-ready structure',
      '3 rounds of revisions',
      'Final file handover',
    ],
    addons: [
      { id: 'professional-extra-page', label: 'Extra page', price: '$50 – $100' },
      { id: 'professional-fast-delivery', label: 'Fast delivery', price: '$75 – $150' },
      { id: 'professional-extra-revision', label: 'Extra revision round', price: '$30 – $50' },
      { id: 'professional-forms-animations', label: 'Forms + animations', price: '$50 – $120' },
    ],
    featured: true,
  },
  {
    slug: 'signature',
    tier: '03 — Premium',
    name: 'Signature',
    price: '$800 – $1300',
    priceRange: [800, 1300],
    deposit: '$400 – $650',
    turnaround: '2–4 weeks',
    who: 'For established businesses and ambitious brands who want a fully custom, high-end digital experience.',
    includes: [
      '6–10 fully custom pages',
      'Advanced animations & interactions',
      'Custom features & functionality',
      'Full mobile optimization',
      'SEO structure & performance',
      '5 rounds of revisions',
      'Priority support & communication',
      'Final file handover',
    ],
    addons: [
      { id: 'signature-extra-page', label: 'Extra page', price: '$70 – $120' },
      { id: 'signature-fast-delivery', label: 'Fast delivery', price: '$100 – $200' },
      { id: 'signature-extra-revision', label: 'Extra revision round', price: '$40 – $70' },
      { id: 'signature-custom-features', label: 'Custom features / animations', price: '$100+' },
    ],
  },
]

export const packageOptions = packages.map(pkg => ({
  value: pkg.slug,
  label: `${pkg.name} — ${pkg.price}`,
}))

export const packageMap = Object.fromEntries(packages.map(pkg => [pkg.slug, pkg]))

function parsePricePart(value) {
  const amount = Number.parseInt(value.replace(/[^\d]/g, ''), 10)
  return Number.isFinite(amount) ? amount : 0
}

export function getPriceRangeFromLabel(label) {
  if (typeof label !== 'string') {
    return [0, 0]
  }

  const normalized = label.replace(/\s+/g, ' ').trim()
  const parts = normalized.match(/\$[\d,]+/g) || []

  if (parts.length >= 2) {
    return [parsePricePart(parts[0]), parsePricePart(parts[1])]
  }

  if (parts.length === 1) {
    const value = parsePricePart(parts[0])
    return /\+$/.test(normalized) ? [value, value] : [value, value]
  }

  return [0, 0]
}
