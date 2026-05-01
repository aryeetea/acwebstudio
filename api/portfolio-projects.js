import { json, methodNotAllowed, readProjects } from './_shared/core.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, ['GET'])
  }

  try {
    const projects = await readProjects()
    return json(res, 200, projects)
  } catch (error) {
    return json(res, 500, { error: error.message || 'Could not load portfolio projects.' })
  }
}
