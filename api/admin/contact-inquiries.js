import { json, methodNotAllowed, readContactInquiries, requireAdmin } from '../_shared/core.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET'])
  }

  const session = requireAdmin(req, res)
  if (!session) {
    return
  }

  try {
    const inquiries = await readContactInquiries()
    return json(res, 200, inquiries)
  } catch (error) {
    return json(res, 500, { error: error.message || 'Could not load contact inquiries.' })
  }
}
