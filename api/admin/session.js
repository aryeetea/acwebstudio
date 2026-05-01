import { json, methodNotAllowed, requireAdmin } from '../_shared/core.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET'])
  }

  const session = requireAdmin(req, res)
  if (!session) {
    return
  }

  return json(res, 200, {
    ok: true,
    admin: {
      role: session.role,
    },
  })
}
