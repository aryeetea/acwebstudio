import { ensureSupabase, json, methodNotAllowed, readRequestBody } from './_shared/core.js'
import { supabase } from './supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST'])
  }

  try {
    ensureSupabase()

    const body = readRequestBody(req)
    const payload = {
      first_name: body.firstName?.trim() || '',
      last_name: body.lastName?.trim() || '',
      email: body.email?.trim(),
      business_name: body.businessName?.trim() || '',
      website: body.website?.trim() || '',
      timeline: body.timeline?.trim() || '',
      package: body.package?.trim() || '',
      message: body.message?.trim() || '',
    }

    if (!payload.email) {
      return json(res, 400, { error: 'Email is required.' })
    }

    const { data, error } = await supabase
      .from('contact_inquiries')
      .insert(payload)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return json(res, 201, {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      businessName: data.business_name,
      website: data.website,
      timeline: data.timeline,
      package: data.package,
      message: data.message,
      createdAt: data.created_at,
    })
  } catch (error) {
    return json(res, 500, { error: error.message || 'Could not save this inquiry.' })
  }
}
