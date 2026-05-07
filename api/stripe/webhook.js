import { STRIPE_WEBHOOK_SECRET, ensureStripe, finalizeOrderPayment, json, methodNotAllowed, stripe } from '../_shared/core.js'

async function readRawBody(req) {
  if (Buffer.isBuffer(req.body)) {
    return req.body
  }

  if (typeof req.body === 'string') {
    return Buffer.from(req.body)
  }

  if (req.body instanceof Uint8Array) {
    return Buffer.from(req.body)
  }

  const chunks = []

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  return Buffer.concat(chunks)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST'])
  }

  try {
    ensureStripe()

    if (!STRIPE_WEBHOOK_SECRET) {
      throw new Error('Stripe webhook is not configured. Add STRIPE_WEBHOOK_SECRET to the API environment.')
    }

    const signature = req.headers['stripe-signature']

    if (!signature) {
      return json(res, 400, { error: 'Missing Stripe signature.' })
    }

    const rawBody = await readRawBody(req)
    const event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET)

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object
      await finalizeOrderPayment({
        sessionId: session.id,
        paymentStatus: session.payment_status || 'paid',
      })
    }

    return json(res, 200, { received: true })
  } catch (error) {
    const statusCode = error.type === 'StripeSignatureVerificationError' ? 400 : 500
    return json(res, statusCode, { error: error.message || 'Could not process Stripe webhook.' })
  }
}
