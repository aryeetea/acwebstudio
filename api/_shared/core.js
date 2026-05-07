import crypto from 'crypto'
import Stripe from 'stripe'
import { packages } from '../../src/data/packages.js'
import { hasSupabaseConfig, supabase } from '../supabase.js'

const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'change-me-before-production'
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12

export const ADMIN_ACCESS_CODE = process.env.ADMIN_ACCESS_CODE?.trim() || ''
export const ORDER_NOTIFICATION_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL?.trim() || 'webstudioace@outlook.com'
export const STRIPE_CURRENCY = (process.env.STRIPE_CURRENCY?.trim() || 'usd').toLowerCase()
export const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID?.trim() || ''
export const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID?.trim() || ''
export const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY?.trim() || ''
export const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY?.trim() || ''
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY?.trim() || ''
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET?.trim() || ''
export const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null

export const PACKAGE_TYPE_OPTIONS = [...packages.map(pkg => pkg.name), 'Custom']

export function ensureSupabase() {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error('Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to the API environment.')
  }
}

export function json(res, statusCode, payload) {
  res.status(statusCode).json(payload)
}

export function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed)
  return json(res, 405, { error: 'Method not allowed.' })
}

export function readRequestBody(req) {
  if (!req.body) {
    return {}
  }

  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }

  return req.body
}

export function signToken(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(encoded).digest('base64url')
  return `${encoded}.${signature}`
}

export function createAdminSession() {
  const expiresAt = Date.now() + TOKEN_TTL_MS
  const token = signToken({ role: 'admin', expiresAt })
  return { token, expiresAt }
}

export function ensureStripe() {
  if (!stripe) {
    throw new Error('Stripe is not configured. Add STRIPE_SECRET_KEY to the API environment.')
  }
}

export function verifyToken(token) {
  if (!token) return null

  const [encoded, signature] = token.split('.')
  if (!encoded || !signature) return null

  const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(encoded).digest('base64url')
  if (signature !== expected) return null

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))
    if (payload.expiresAt < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export function requireAdmin(req, res) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  const session = verifyToken(token)

  if (!session) {
    json(res, 401, { error: 'Unauthorized' })
    return null
  }

  return session
}

export function mapProjectRow(project) {
  return {
    id: project.id,
    url: project.url,
    title: project.title,
    description: project.description,
    technologies: project.technologies || [],
    packageType: project.package_type,
    summary: project.summary,
    ogImage: project.og_image,
    screenshots: project.screenshots || [],
    createdAt: project.created_at,
  }
}

export async function readProjects() {
  ensureSupabase()

  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data || []).map(mapProjectRow)
}

export async function readContactInquiries() {
  ensureSupabase()

  const { data, error } = await supabase
    .from('contact_inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data || []).map(inquiry => ({
    id: inquiry.id,
    firstName: inquiry.first_name,
    lastName: inquiry.last_name,
    email: inquiry.email,
    businessName: inquiry.business_name,
    website: inquiry.website,
    timeline: inquiry.timeline,
    package: inquiry.package,
    message: inquiry.message,
    createdAt: inquiry.created_at,
  }))
}

export function mapOrderRow(order) {
  return {
    id: order.id,
    firstName: order.first_name,
    lastName: order.last_name,
    email: order.email,
    businessName: order.business_name,
    website: order.website,
    timeline: order.timeline,
    notes: order.notes,
    packageSlug: order.package_slug,
    packageName: order.package_name,
    packagePrice: order.package_price,
    addons: order.addons || [],
    totalMin: order.total_min || 0,
    totalMax: order.total_max || 0,
    amountDueNow: order.amount_due_now || 0,
    currency: order.currency || STRIPE_CURRENCY,
    stripeSessionId: order.stripe_session_id || '',
    submittedEmailSentAt: order.submitted_email_sent_at || '',
    decisionEmailSentAt: order.decision_email_sent_at || '',
    customerNotifiedStatus: order.customer_notified_status || '',
    status: order.status || 'pending',
    createdAt: order.created_at,
  }
}

export async function readOrders() {
  ensureSupabase()

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data || []).map(mapOrderRow)
}

export async function findOrderById(id) {
  ensureSupabase()

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function findOrderBySessionId(sessionId) {
  ensureSupabase()

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('stripe_session_id', sessionId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function finalizeOrderPayment({ sessionId, paymentStatus }) {
  ensureSupabase()

  const existingOrder = await findOrderBySessionId(sessionId)

  if (!existingOrder) {
    return null
  }

  const paymentWasCompleted = paymentStatus === 'paid'
  const updatePayload = {}

  if (paymentWasCompleted && existingOrder.status === 'payment_pending') {
    updatePayload.status = 'paid'
  }

  if (paymentWasCompleted && !existingOrder.submitted_email_sent_at) {
    let companyEmailSent = false
    let customerEmailSent = false

    try {
      companyEmailSent = await notifyCompanyOfSubmittedOrder(existingOrder)
      customerEmailSent = await notifyCustomerOfSubmittedOrder(existingOrder)
    } catch (mailError) {
      console.warn(`Order email notification failed for ${existingOrder.id}:`, mailError.message)
    }

    if (companyEmailSent || customerEmailSent) {
      updatePayload.submitted_email_sent_at = new Date().toISOString()
    }
  }

  if (!Object.keys(updatePayload).length) {
    return existingOrder
  }

  const { data, error } = await supabase
    .from('orders')
    .update(updatePayload)
    .eq('stripe_session_id', sessionId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export function canSendEmail() {
  return Boolean(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY)
}

export async function sendEmail({ to, subject, text }) {
  if (!canSendEmail()) {
    return false
  }

  const recipients = Array.isArray(to) ? to : [to]
  const cleanedRecipients = recipients.map(email => String(email).trim()).filter(Boolean)

  if (!cleanedRecipients.length) {
    return false
  }
  const results = await Promise.all(cleanedRecipients.map(async recipient => {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY || undefined,
        template_params: {
          to_email: recipient,
          subject,
          message: text,
          reply_to: ORDER_NOTIFICATION_EMAIL,
          from_name: 'ACE Web Studio',
        },
      }),
    })

    if (!response.ok) {
      const payload = await response.text().catch(() => '')
      throw new Error(payload || `Could not send email through EmailJS to ${recipient}.`)
    }

    return true
  }))

  return results.every(Boolean)
}

export async function notifyCustomerOfDecision(order, nextStatus) {
  const approved = nextStatus === 'accepted'

  return sendEmail({
    to: order.email,
    subject: approved
      ? 'ACE Web Studio accepted your order'
      : 'ACE Web Studio updated your order',
    text: approved
      ? [
          `Hi ${order.first_name},`,
          '',
          'Great news. We accepted your website order and your project is moving forward.',
          '',
          `Package: ${order.package_name}`,
          `Deposit received: $${order.amount_due_now || 0}`,
          '',
          `Please email us at ${ORDER_NOTIFICATION_EMAIL} so we can begin planning and design with you.`,
          '',
          'ACE Web Studio',
        ].join('\n')
      : [
          `Hi ${order.first_name},`,
          '',
          'Thank you for your order. After review, we are not able to move forward with this request right now.',
          '',
          `If you want to discuss a different direction, you can contact us at ${ORDER_NOTIFICATION_EMAIL}.`,
          '',
          'ACE Web Studio',
        ].join('\n'),
  })
}

function formatAddonList(addons = []) {
  if (!addons.length) {
    return 'No add-ons selected'
  }

  return addons.map(addon => `${addon.label}${addon.price ? ` (${addon.price})` : ''}`).join(', ')
}

export async function notifyCompanyOfSubmittedOrder(order) {
  return sendEmail({
    to: ORDER_NOTIFICATION_EMAIL,
    subject: `New website order from ${order.first_name} ${order.last_name}`,
    text: [
      'A new website order was submitted and paid.',
      '',
      `Customer: ${order.first_name} ${order.last_name}`,
      `Email: ${order.email}`,
      `Business: ${order.business_name || 'Not provided'}`,
      `Package: ${order.package_name}`,
      `Package price: ${order.package_price}`,
      `Deposit paid: $${order.amount_due_now || 0}`,
      `Estimated total: $${order.total_min || 0} - $${order.total_max || 0}`,
      `Timeline: ${order.timeline || 'Not provided'}`,
      `Website: ${order.website || 'Not provided'}`,
      `Add-ons: ${formatAddonList(order.addons || [])}`,
      '',
      'Idea / notes:',
      order.notes || 'No project notes included.',
      '',
      `Stripe session: ${order.stripe_session_id || 'Not available'}`,
    ].join('\n'),
  })
}

export async function notifyCustomerOfSubmittedOrder(order) {
  return sendEmail({
    to: order.email,
    subject: 'ACE Web Studio received your order deposit',
    text: [
      `Hi ${order.first_name},`,
      '',
      'We received your website order and deposit payment successfully.',
      '',
      `Package: ${order.package_name}`,
      `Deposit paid: $${order.amount_due_now || 0}`,
      `Estimated total: $${order.total_min || 0} - $${order.total_max || 0}`,
      '',
      'We will review your idea and follow up from webstudioace@outlook.com with the next steps.',
      '',
      'If you want to add anything else in the meantime, reply to this email or contact us at webstudioace@outlook.com.',
      '',
      'ACE Web Studio',
    ].join('\n'),
  })
}

export function getSiteUrl(req) {
  const configured = process.env.SITE_URL?.trim()

  if (configured) {
    return configured.replace(/\/+$/g, '')
  }

  const origin = req.headers.origin?.trim()
  if (origin) {
    return origin.replace(/\/+$/g, '')
  }

  const host = req.headers.host?.trim()
  if (host) {
    const forwardedProto = req.headers['x-forwarded-proto']
    const protocol = typeof forwardedProto === 'string' ? forwardedProto.split(',')[0].trim() : 'http'
    return `${protocol}://${host}`
  }

  return 'http://localhost:5173'
}

function parseMoneyPart(value) {
  const amount = Number.parseInt(String(value).replace(/[^\d]/g, ''), 10)
  return Number.isFinite(amount) ? amount : 0
}

export function parseMoneyRange(label) {
  if (typeof label !== 'string') {
    return { min: 0, max: 0 }
  }

  const normalized = label.replace(/\s+/g, ' ').trim()
  const parts = normalized.match(/\$[\d,]+/g) || []

  if (parts.length >= 2) {
    return {
      min: parseMoneyPart(parts[0]),
      max: parseMoneyPart(parts[1]),
    }
  }

  if (parts.length === 1) {
    const value = parseMoneyPart(parts[0])
    return { min: value, max: value }
  }

  return { min: 0, max: 0 }
}

export function toStripeAmount(amount) {
  return Math.max(0, Math.round(amount * 100))
}

export function getCheckoutOrderDetails(body = {}) {
  const packageSlug = typeof body.packageSlug === 'string' ? body.packageSlug.trim() : ''
  const selectedPackage = packages.find(pkg => pkg.slug === packageSlug)

  if (!selectedPackage) {
    throw new Error('Choose a valid package before continuing to payment.')
  }

  const addonIds = Array.isArray(body.addonIds)
    ? body.addonIds.map(value => String(value).trim()).filter(Boolean)
    : []

  const selectedAddons = selectedPackage.addons.filter(addon => addonIds.includes(addon.id))
  const baseRange = selectedPackage.priceRange || [0, 0]
  const depositRange = parseMoneyRange(selectedPackage.deposit)

  const totals = selectedAddons.reduce(
    (current, addon) => {
      const addonRange = parseMoneyRange(addon.price)

      return {
        totalMin: current.totalMin + addonRange.min,
        totalMax: current.totalMax + addonRange.max,
        depositNow: current.depositNow + addonRange.min,
      }
    },
    {
      totalMin: baseRange[0],
      totalMax: baseRange[1],
      depositNow: depositRange.min,
    }
  )

  return {
    firstName: body.firstName?.trim() || '',
    lastName: body.lastName?.trim() || '',
    email: body.email?.trim() || '',
    businessName: body.businessName?.trim() || '',
    website: body.website?.trim() || '',
    timeline: body.timeline?.trim() || '',
    notes: body.notes?.trim() || '',
    packageSlug: selectedPackage.slug,
    packageName: selectedPackage.name,
    packagePrice: selectedPackage.price,
    selectedPackage,
    selectedAddons,
    totalMin: totals.totalMin,
    totalMax: totals.totalMax,
    amountDueNow: totals.depositNow,
  }
}

export function buildOrderPayload(details, overrides = {}) {
  return {
    first_name: details.firstName,
    last_name: details.lastName,
    email: details.email,
    business_name: details.businessName,
    website: details.website,
    timeline: details.timeline,
    notes: details.notes,
    package_slug: details.packageSlug,
    package_name: details.packageName,
    package_price: details.packagePrice,
    addons: details.selectedAddons.map(addon => ({
      id: addon.id,
      label: addon.label,
      price: addon.price,
    })),
    total_min: details.totalMin,
    total_max: details.totalMax,
    amount_due_now: details.amountDueNow,
    currency: STRIPE_CURRENCY,
    stripe_session_id: overrides.stripeSessionId || '',
    status: overrides.status || 'payment_pending',
  }
}

export function normalizePackageType(value) {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  return PACKAGE_TYPE_OPTIONS.includes(trimmed) ? trimmed : ''
}

export async function removeScreenshots(screenshots = []) {
  ensureSupabase()

  const paths = screenshots
    .map(screenshotUrl => {
      try {
        const pathname = new URL(screenshotUrl).pathname
        const marker = '/storage/v1/object/public/portfolio-previews/'
        const index = pathname.indexOf(marker)
        return index >= 0 ? pathname.slice(index + marker.length) : null
      } catch {
        return null
      }
    })
    .filter(Boolean)

  if (!paths.length) {
    return
  }

  const { error } = await supabase.storage.from('portfolio-previews').remove(paths)

  if (error) {
    throw new Error(error.message)
  }
}
