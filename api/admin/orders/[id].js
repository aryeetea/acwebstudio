import { findOrderById, json, methodNotAllowed, requireAdmin } from '../../_shared/core.js'
import { supabase } from '../../supabase.js'

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

  if (req.method !== 'DELETE') {
    return methodNotAllowed(res, ['DELETE'])
  }

  const id = getRouteId(req)

  if (!id) {
    return json(res, 400, { error: 'Order id is required.' })
  }

  try {
    const existingOrder = await findOrderById(id)

    if (!existingOrder) {
      return json(res, 404, { error: 'Order not found.' })
    }

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }

    return json(res, 200, { success: true })
  } catch (error) {
    return json(res, 500, { error: error.message || 'Could not remove this order.' })
  }
}
