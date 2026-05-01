import { ADMIN_ACCESS_CODE, json, methodNotAllowed } from '../_shared/core.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET'])
  }

  return json(res, 200, {
    ready: Boolean(ADMIN_ACCESS_CODE),
  })
}
