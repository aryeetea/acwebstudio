import cors from 'cors'
import crypto from 'crypto'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { packageMap, packages } from '../src/data/packages.js'
import {
  ADMIN_ACCESS_CODE,
  EMAILJS_PRIVATE_KEY,
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  ORDER_NOTIFICATION_EMAIL,
  PACKAGE_TYPE_OPTIONS,
  STRIPE_CURRENCY,
  ensureStripe,
  ensureSupabase,
  getSiteUrl,
  parseMoneyRange,
  stripe,
  toStripeAmount,
} from './_shared/core.js'
import { supabase } from './supabase.js'

const __filename = fileURLToPath(import.meta.url)
const isDirectRun = process.argv[1] ? path.resolve(process.argv[1]) === __filename : false

const app = express()

const PORT = process.env.PORT || 5050
const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'change-me-before-production'
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12
const PACKAGE_OPTIONS = new Set(PACKAGE_TYPE_OPTIONS)

app.use(cors())
app.use(express.json({ limit: '2mb' }))

function canSendEmail() {
  return Boolean(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY)
}

function mapProjectRow(project) {
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

async function readProjects() {
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

async function readContactInquiries() {
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

async function readOrders() {
  ensureSupabase()

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data || []).map(order => ({
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
  }))
}

async function findOrderById(id) {
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

async function findOrderBySessionId(sessionId) {
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

function getCheckoutOrderDetails(body = {}) {
  const packageSlug = typeof body.packageSlug === 'string' ? body.packageSlug.trim() : ''
  const selectedPackage = packageMap[packageSlug]

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

function buildOrderPayload(details, overrides = {}) {
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

function mapOrderRow(order) {
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

function formatAddonList(addons = []) {
  if (!addons.length) {
    return 'No add-ons selected'
  }

  return addons.map(addon => `${addon.label}${addon.price ? ` (${addon.price})` : ''}`).join(', ')
}

async function sendEmail({ to, subject, text }) {
  if (!canSendEmail()) {
    return false
  }

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
        to_email: Array.isArray(to) ? to.join(',') : to,
        subject,
        message: text,
        reply_to: ORDER_NOTIFICATION_EMAIL,
        from_name: 'ACE Web Studio',
      },
    }),
  })

  if (!response.ok) {
    const payload = await response.text().catch(() => '')
    throw new Error(payload || 'Could not send email through EmailJS.')
  }

  return true
}

async function notifyCompanyOfSubmittedOrder(order) {
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

async function notifyCustomerOfSubmittedOrder(order) {
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

async function notifyCustomerOfDecision(order, nextStatus) {
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

function sanitizeSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'project'
}

function normalizeUrl(rawUrl) {
  const value = rawUrl?.trim()

  if (!value) {
    throw new Error('Missing url')
  }

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`
  const normalized = new URL(withProtocol)

  return normalized.toString()
}

function signToken(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(encoded).digest('base64url')

  return `${encoded}.${signature}`
}

function verifyToken(token) {
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

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  const session = verifyToken(token)

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  req.session = session
  next()
}

function guessTech(html) {
  const tech = []

  if (/react/i.test(html)) tech.push('React')
  if (/next/i.test(html)) tech.push('Next.js')
  if (/vue/i.test(html)) tech.push('Vue.js')
  if (/wordpress|wp-content/i.test(html)) tech.push('WordPress')
  if (/shopify/i.test(html)) tech.push('Shopify')
  if (/bootstrap/i.test(html)) tech.push('Bootstrap')
  if (/tailwind/i.test(html)) tech.push('Tailwind CSS')
  if (/squarespace/i.test(html)) tech.push('Squarespace')
  if (/wix/i.test(html)) tech.push('Wix')
  if (/angular/i.test(html)) tech.push('Angular')
  if (/jquery/i.test(html)) tech.push('jQuery')
  if (/vite/i.test(html)) tech.push('Vite')
  if (/gatsby/i.test(html)) tech.push('Gatsby')
  if (/svelte/i.test(html)) tech.push('Svelte')

  return tech.length ? tech : ['Custom/Other']
}

function normalizePackageType(value) {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  return PACKAGE_OPTIONS.has(trimmed) ? trimmed : ''
}

function suggestPackageType(html) {
  const internalLinks = new Set(
    Array.from(
      html.matchAll(/<a [^>]*href=["'](\/(?!\/)[^"']*|https?:\/\/[^"']+)["']/gi),
      match => match[1]
    )
      .map(link => link.trim())
      .filter(link => link && !/^https?:\/\/(www\.)?(facebook|instagram|linkedin|x|twitter|youtube)\./i.test(link))
  )

  const sections = (html.match(/<section\b/gi) || []).length
  const forms = (html.match(/<form\b/gi) || []).length
  const serviceKeywords = (html.match(/services?|pricing|testimonials?|portfolio|contact|about|faq/gi) || []).length

  const score = internalLinks.size + sections + forms * 2 + Math.min(serviceKeywords, 6)

  if (score <= 6) return packages[0].name
  if (score <= 14) return packages[1].name
  return packages[2].name
}

function getMetaFromHtml(html, fallbackUrl) {
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is)
  const descriptionMatch = html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>|<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i
  )
  const ogImageMatch = html.match(
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["'][^>]*>|<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:image["'][^>]*>/i
  )

  return {
    title: titleMatch?.[1]?.replace(/\s+/g, ' ').trim() || fallbackUrl,
    description: (descriptionMatch?.[1] || descriptionMatch?.[2] || '').trim(),
    ogImage: (ogImageMatch?.[1] || ogImageMatch?.[2] || '').trim(),
  }
}

function generateSummary(meta, tech, pkg) {
  const description = meta.description ? ` ${meta.description}` : ''
  return `This project is built with ${tech.join(', ')} and best fits the ${pkg} package.${description}`.trim()
}

function createFallbackAnalysis(url) {
  const parsedUrl = new URL(url)
  const hostname = parsedUrl.hostname.replace(/^www\./, '')
  const readableTitle = hostname
    .split('.')
    .filter(Boolean)
    .slice(0, 2)
    .join(' ')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())

  return {
    title: readableTitle || hostname,
    description: 'Live project link added without an automated preview.',
    technologies: ['Custom/Other'],
    packageType: 'Custom',
    summary: 'This project was published from its live URL. Preview screenshots were not available, so the site is shown with a fallback portfolio card.',
    ogImage: '',
    screenshots: [],
  }
}

async function uploadScreenshots(baseName, screenshots) {
  ensureSupabase()
  const uploadedPaths = []

  for (const [index, screenshot] of screenshots.entries()) {
    const storagePath = `${baseName}-${index + 1}.png`
    const buffer = Buffer.from(screenshot, 'base64')

    const { error } = await supabase.storage
      .from('portfolio-previews')
      .upload(storagePath, buffer, {
        contentType: 'image/png',
        upsert: true,
      })

    if (error) {
      throw new Error(error.message)
    }

    const { data } = supabase.storage.from('portfolio-previews').getPublicUrl(storagePath)
    uploadedPaths.push(data.publicUrl)
  }

  return uploadedPaths
}

async function removeScreenshots(screenshots = []) {
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

async function analyzeProject(url) {
  let browser

  try {
    const { default: puppeteer } = await import('puppeteer')
    browser = await puppeteer.launch({ args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 1024, deviceScaleFactor: 1 })
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

    const html = await page.content()
    const meta = getMetaFromHtml(html, url)
    const tech = guessTech(html)
    const packageType = suggestPackageType(html)
    const summary = generateSummary(meta, tech, packageType)

    const screenshots = []
    screenshots.push(await page.screenshot({ encoding: 'base64', fullPage: false, type: 'png' }))
    await page.evaluate(() => window.scrollTo(0, Math.max(window.innerHeight * 0.9, document.body.scrollHeight * 0.35)))
    screenshots.push(await page.screenshot({ encoding: 'base64', fullPage: false, type: 'png' }))
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    screenshots.push(await page.screenshot({ encoding: 'base64', fullPage: false, type: 'png' }))

    return {
      title: meta.title,
      description: meta.description,
      technologies: tech,
      packageType,
      summary,
      ogImage: meta.ogImage,
      screenshots,
    }
  } catch (error) {
    if (/ERR_NAME_NOT_RESOLVED|ERR_CONNECTION_REFUSED|ERR_CONNECTION_TIMED_OUT|ERR_INTERNET_DISCONNECTED/i.test(error.message)) {
      throw new Error('Could not reach that website. Check the link and make sure the site is live.', { cause: error })
    }

    if (/Navigation timeout/i.test(error.message)) {
      throw new Error('That website took too long to load for a preview. Try again or use another project link.', { cause: error })
    }

    if (/net::ERR_ABORTED|403|401/i.test(error.message)) {
      throw new Error('That website blocked the preview request. Some sites do not allow automated previews.', { cause: error })
    }

    throw new Error(`Preview failed: ${error.message}`, { cause: error })
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

app.get('/api/portfolio-projects', async (_req, res) => {
  try {
    const projects = await readProjects()
    res.json(projects)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/admin/contact-inquiries', requireAdmin, async (_req, res) => {
  try {
    const inquiries = await readContactInquiries()
    res.json(inquiries)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/admin/orders', requireAdmin, async (_req, res) => {
  try {
    const orders = await readOrders()
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/contact-inquiries', async (req, res) => {
  try {
    ensureSupabase()

    const payload = {
      first_name: req.body.firstName?.trim() || '',
      last_name: req.body.lastName?.trim() || '',
      email: req.body.email?.trim(),
      business_name: req.body.businessName?.trim() || '',
      website: req.body.website?.trim() || '',
      timeline: req.body.timeline?.trim() || '',
      package: req.body.package?.trim() || '',
      message: req.body.message?.trim() || '',
    }

    if (!payload.email) {
      return res.status(400).json({ error: 'Email is required.' })
    }

    const { data, error } = await supabase
      .from('contact_inquiries')
      .insert(payload)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    res.status(201).json({
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      businessName: data.business_name,
      website: data.website,
      timeline: data.timeline,
      package: data.package,
      message: data.message,
      createdAt: data.created_at,
    })
  } catch (error) {
    res.status(500).json({ error: error.message || 'Could not save this inquiry.' })
  }
})

app.post('/api/checkout/session', async (req, res) => {
  try {
    ensureSupabase()
    ensureStripe()

    const details = getCheckoutOrderDetails(req.body)

    if (!details.firstName || !details.lastName || !details.email || !details.notes) {
      return res.status(400).json({ error: 'First name, last name, email, and your website idea are required before payment.' })
    }

    const siteUrl = getSiteUrl(req)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      billing_address_collection: 'auto',
      customer_email: details.email,
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel?package=${details.packageSlug}`,
      submit_type: 'pay',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: STRIPE_CURRENCY,
            unit_amount: toStripeAmount(parseMoneyRange(details.selectedPackage.deposit).min),
            product_data: {
              name: `${details.packageName} package deposit`,
              description: `Initial deposit for the ${details.packageName} website package.`,
            },
          },
        },
        ...details.selectedAddons.map(addon => ({
          quantity: 1,
          price_data: {
            currency: STRIPE_CURRENCY,
            unit_amount: toStripeAmount(parseMoneyRange(addon.price).min),
            product_data: {
              name: `${addon.label} add-on`,
              description: `Add-on for the ${details.packageName} website package.`,
            },
          },
        })),
      ],
      metadata: {
        firstName: details.firstName,
        lastName: details.lastName,
        email: details.email,
        businessName: details.businessName,
        website: details.website.slice(0, 500),
        timeline: details.timeline.slice(0, 500),
        notes: details.notes.slice(0, 500),
        packageSlug: details.packageSlug,
        packageName: details.packageName,
        packagePrice: details.packagePrice,
        addonIds: details.selectedAddons.map(addon => addon.id).join(','),
        totalMin: String(details.totalMin),
        totalMax: String(details.totalMax),
        amountDueNow: String(details.amountDueNow),
      },
    })

    const payload = buildOrderPayload(details, {
      stripeSessionId: session.id,
      status: 'payment_pending',
    })

    const { error } = await supabase
      .from('orders')
      .insert(payload)

    if (error) {
      throw new Error(error.message)
    }

    res.status(201).json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    res.status(500).json({ error: error.message || 'Could not start checkout.' })
  }
})

app.post('/api/orders/confirm', async (req, res) => {
  try {
    ensureSupabase()
    ensureStripe()

    const sessionId = req.body.sessionId?.trim()

    if (!sessionId) {
      return res.status(400).json({ error: 'A checkout session ID is required.' })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const existingOrder = await findOrderBySessionId(session.id)

    if (!existingOrder) {
      return res.status(404).json({ error: 'That order session could not be found.' })
    }

    const nextStatus = session.payment_status === 'paid' ? 'paid' : 'payment_pending'
    const updatePayload = {
      status: nextStatus,
    }

    if (session.payment_status === 'paid' && !existingOrder.submitted_email_sent_at) {
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

    const { data, error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('stripe_session_id', session.id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    res.json({
      ...mapOrderRow(data),
      status: data.status || nextStatus,
      paymentStatus: session.payment_status,
    })
  } catch (error) {
    res.status(500).json({ error: error.message || 'Could not confirm this payment.' })
  }
})

app.patch('/api/admin/orders/:id/status', requireAdmin, async (req, res) => {
  try {
    ensureSupabase()

    const nextStatus = req.body.status?.trim()
    const allowedStatuses = new Set(['accepted', 'declined'])

    if (!allowedStatuses.has(nextStatus)) {
      return res.status(400).json({ error: 'A valid order decision is required.' })
    }

    const existingOrder = await findOrderById(req.params.id)

    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found.' })
    }

    const updatePayload = {
      status: nextStatus,
    }

    const shouldNotifyCustomer = existingOrder.customer_notified_status !== nextStatus

    if (shouldNotifyCustomer) {
      try {
        const sent = await notifyCustomerOfDecision(existingOrder, nextStatus)

        if (sent) {
          updatePayload.customer_notified_status = nextStatus
          updatePayload.decision_email_sent_at = new Date().toISOString()
        }
      } catch (mailError) {
        console.warn(`Decision email notification failed for ${existingOrder.id}:`, mailError.message)
      }
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    res.json(mapOrderRow(data))
  } catch (error) {
    res.status(500).json({ error: error.message || 'Could not update this order.' })
  }
})

app.get('/api/admin/status', async (_req, res) => {
  try {
    res.json({
      ready: Boolean(ADMIN_ACCESS_CODE),
    })
  } catch (error) {
    res.status(500).json({ error: error.message || 'Could not load admin status.' })
  }
})

app.post('/api/admin/login', async (req, res) => {
  try {
    if (!ADMIN_ACCESS_CODE) {
      return res.status(500).json({ error: 'Admin access code is not configured on the server.' })
    }

    const code = req.body.code?.trim()

    if (!code) {
      return res.status(400).json({ error: 'Admin access code is required.' })
    }

    if (code !== ADMIN_ACCESS_CODE) {
      return res.status(401).json({ error: 'Invalid admin access code.' })
    }

    const expiresAt = Date.now() + TOKEN_TTL_MS
    const token = signToken({ role: 'admin', expiresAt })

    res.json({
      token,
      expiresAt,
      admin: { role: 'admin' },
    })
  } catch (error) {
    res.status(500).json({ error: error.message || 'Could not sign in to admin.' })
  }
})

app.get('/api/admin/session', requireAdmin, (req, res) => {
  res.json({
    ok: true,
    admin: {
      role: req.session.role,
    },
  })
})

app.post('/api/admin/portfolio-projects', requireAdmin, async (req, res) => {
  try {
    const url = normalizeUrl(req.body.url)
    const packageTypeOverride = normalizePackageType(req.body.packageType)
    const existingProjects = await readProjects()

    if (existingProjects.some(project => project.url === url)) {
      return res.status(409).json({ error: 'This project is already in the portfolio.' })
    }

    let analysis

    try {
      analysis = await analyzeProject(url)
    } catch (previewError) {
      console.warn(`Preview generation failed for ${url}:`, previewError.message)
      analysis = createFallbackAnalysis(url)
    }

    if (packageTypeOverride) {
      analysis.packageType = packageTypeOverride
    }

    let screenshotPaths = []

    if (analysis.screenshots.length > 0) {
      try {
        const baseName = `${sanitizeSlug(analysis.title)}-${crypto.randomUUID()}`
        screenshotPaths = await uploadScreenshots(baseName, analysis.screenshots)
      } catch (uploadError) {
        console.warn(`Screenshot upload failed for ${url}:`, uploadError.message)
      }
    }

    const { data, error } = await supabase
      .from('portfolio_projects')
      .insert({
        url,
        title: analysis.title,
        description: analysis.description,
        technologies: analysis.technologies,
        package_type: analysis.packageType,
        summary: analysis.summary,
        og_image: analysis.ogImage,
        screenshots: screenshotPaths,
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    const project = mapProjectRow(data)
    res.status(201).json(project)
  } catch (error) {
    console.error('Failed to add portfolio project:', error)
    res.status(500).json({ error: error.message || 'Could not analyze this project link.' })
  }
})

app.patch('/api/admin/portfolio-projects/:id', requireAdmin, async (req, res) => {
  try {
    ensureSupabase()

    const packageType = normalizePackageType(req.body.packageType)

    if (!packageType) {
      return res.status(400).json({ error: 'A valid package type is required.' })
    }

    const { data, error } = await supabase
      .from('portfolio_projects')
      .update({ package_type: packageType })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    res.json(mapProjectRow(data))
  } catch (error) {
    res.status(500).json({ error: error.message || 'Could not update this project.' })
  }
})

app.delete('/api/admin/portfolio-projects/:id', requireAdmin, async (req, res) => {
  try {
    const projects = await readProjects()
    const project = projects.find(item => item.id === req.params.id)

    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    await removeScreenshots(project.screenshots)

    const { error } = await supabase
      .from('portfolio_projects')
      .delete()
      .eq('id', req.params.id)

    if (error) {
      throw new Error(error.message)
    }

    res.json({ ok: true })
  } catch (error) {
    res.status(500).json({ error: error.message || 'Could not remove this project.' })
  }
})

export default app

if (isDirectRun) {
  app.listen(PORT, () => console.log(`API running on port ${PORT}`))
}
