import { json, methodNotAllowed, ensureSupabase, findOrderById, mapOrderRow, notifyCustomerOfDecision, readRequestBody, requireAdmin } from '../../../_shared/core.js'
import { supabase } from '../../../supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return methodNotAllowed(res, ['PATCH'])
  }

  const session = requireAdmin(req, res)
  if (!session) {
    return
  }

  try {
    ensureSupabase()

    const body = readRequestBody(req)
    const nextStatus = body.status?.trim()
    const allowedStatuses = new Set(['accepted', 'declined'])

    if (!allowedStatuses.has(nextStatus)) {
      return json(res, 400, { error: 'A valid order decision is required.' })
    }

    const existingOrder = await findOrderById(req.query.id)

    if (!existingOrder) {
      return json(res, 404, { error: 'Order not found.' })
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
      .eq('id', req.query.id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return json(res, 200, mapOrderRow(data))
  } catch (error) {
    return json(res, 500, { error: error.message || 'Could not update this order.' })
  }
}
