import { findOrderBySessionId, json, mapOrderRow, methodNotAllowed, notifyCompanyOfSubmittedOrder, notifyCustomerOfSubmittedOrder, readRequestBody, ensureStripe, ensureSupabase, stripe } from '../_shared/core.js'
import { supabase } from '../supabase.js'

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
    const existingOrder = await findOrderBySessionId(session.id)

    if (!existingOrder) {
      return json(res, 404, { error: 'That order session could not be found.' })
    }

    const paymentWasCompleted = session.payment_status === 'paid'
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

    let orderRecord = existingOrder

    if (Object.keys(updatePayload).length > 0) {
      const { data, error } = await supabase
        .from('orders')
        .update(updatePayload)
        .eq('stripe_session_id', session.id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      orderRecord = data
    }

    return json(res, 200, {
      ...mapOrderRow(orderRecord),
      status: orderRecord.status || (paymentWasCompleted ? 'paid' : 'payment_pending'),
      paymentStatus: session.payment_status,
    })
  } catch (error) {
    return json(res, 500, { error: error.message || 'Could not confirm this payment.' })
  }
}
