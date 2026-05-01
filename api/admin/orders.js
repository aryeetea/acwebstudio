import { json, methodNotAllowed, readOrders, requireAdmin } from '../_shared/core.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET'])
  }

  const session = requireAdmin(req, res)
  if (!session) {
    return
  }

  try {
    const orders = await readOrders()
    return json(res, 200, orders)
  } catch (error) {
    return json(res, 500, { error: error.message || 'Could not load orders.' })
  }
}
