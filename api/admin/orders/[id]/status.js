import {
  findOrderById,
  json,
  mapOrderRow,
  methodNotAllowed,
  notifyCustomerOfDecision,
  readRequestBody,
  requireAdmin,
} from '../../../_shared/core.js'
import { supabase } from '../../../supabase.js'

function getRouteId(req) {
  const value = req.query?.id

  if (Array.isArray(value)) {
    return value[0] || ''
  }

  return typeof value === 'string' ? value : ''
}

export default async function handler(req, res) {
  const session = requireAdmin(req, res)

  if (!session) {
    return
  }

  if (req.method !== 'PATCH') {
    return methodNotAllowed(res, ['PATCH'])
  }

  const id = getRouteId(req)

  if (!id) {
    return json(res, 400, { error: 'Order id is required.' })
  }

  try {
    const body = readRequestBody(req)
    const nextStatus = typeof body.status === 'string' ? body.status.trim() : ''
    const allowedStatuses = new Set(['accepted', 'declined'])

    if (!allowedStatuses.has(nextStatus)) {
      return json(res, 400, { error: 'A valid order decision is required.' })
    }

    const existingOrder = await findOrderById(id)

    if (!existingOrder) {
      return json(res, 404, { error: 'Order not found.' })
    }

    if (nextStatus === 'accepted' && existingOrder.status !== 'paid') {
      return json(res, 400, { error: 'Only paid orders can be accepted.' })
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
      .eq('id', id)
      .select()
      .maybeSingle()

    if (error) {
      throw new Error(error.message)
    }

    if (!data) {
      return json(res, 404, { error: 'Order not found.' })
    }

    return json(res, 200, mapOrderRow(data))
  } catch (error) {
    return json(res, 500, { error: error.message || 'Could not update this order.' })
  }
}
