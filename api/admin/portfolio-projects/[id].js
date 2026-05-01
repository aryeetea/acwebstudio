import { json, mapProjectRow, methodNotAllowed, normalizePackageType, readProjects, readRequestBody, removeScreenshots, requireAdmin, ensureSupabase } from '../../_shared/core.js'
import { supabase } from '../../supabase.js'

export default async function handler(req, res) {
  const session = requireAdmin(req, res)
  if (!session) {
    return
  }

  if (req.method === 'PATCH') {
    try {
      ensureSupabase()

      const body = readRequestBody(req)
      const packageType = normalizePackageType(body.packageType)

      if (!packageType) {
        return json(res, 400, { error: 'A valid package type is required.' })
      }

      const { data, error } = await supabase
        .from('portfolio_projects')
        .update({ package_type: packageType })
        .eq('id', req.query.id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return json(res, 200, mapProjectRow(data))
    } catch (error) {
      return json(res, 500, { error: error.message || 'Could not update this project.' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const projects = await readProjects()
      const project = projects.find(item => item.id === req.query.id)

      if (!project) {
        return json(res, 404, { error: 'Project not found' })
      }

      await removeScreenshots(project.screenshots)

      const { error } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', req.query.id)

      if (error) {
        throw new Error(error.message)
      }

      return json(res, 200, { ok: true })
    } catch (error) {
      return json(res, 500, { error: error.message || 'Could not remove this project.' })
    }
  }

  return methodNotAllowed(res, ['PATCH', 'DELETE'])
}
