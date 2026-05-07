import { finalizeOrderPayment, json, mapOrderRow, methodNotAllowed, readRequestBody, ensureStripe, ensureSupabase, stripe } from '../_shared/core.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST'])
  }

  try {
    ensureSupabase()
    ensureStripe()

    const body = readRequestBody(req)
    const sessionId = body.sessionId?.trim()

    if (!sessionId) {
      return json(res, 400, { error: 'A checkout session ID is required.' })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const orderRecord = await finalizeOrderPayment({
      sessionId: session.id,
      paymentStatus: session.payment_status,
    })

    if (!orderRecord) {
      return json(res, 404, { error: 'That order session could not be found.' })
    }

    return json(res, 200, {
      ...mapOrderRow(orderRecord),
      status: orderRecord.status || (session.payment_status === 'paid' ? 'paid' : 'payment_pending'),
      paymentStatus: session.payment_status,
    })
  } catch (error) {
    return json(res, 500, { error: error.message || 'Could not confirm this payment.' })
  }
}
