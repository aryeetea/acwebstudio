import { ADMIN_ACCESS_CODE, createAdminSession, json, methodNotAllowed, readRequestBody } from '../_shared/core.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST'])
  }

  try {
    if (!ADMIN_ACCESS_CODE) {
      return json(res, 500, { error: 'Admin access code is not configured on the server.' })
    }

    const body = readRequestBody(req)
    const code = body.code?.trim()

    if (!code) {
      return json(res, 400, { error: 'Admin access code is required.' })
    }

    if (code !== ADMIN_ACCESS_CODE) {
      return json(res, 401, { error: 'Invalid admin access code.' })
    }

    const session = createAdminSession()

    return json(res, 200, {
      ...session,
      admin: { role: 'admin' },
    })
  } catch (error) {
    return json(res, 500, { error: error.message || 'Could not sign in to admin.' })
  }
}
