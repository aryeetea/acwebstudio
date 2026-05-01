import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseServiceRoleKey)
export const supabaseEnvStatus = {
  hasSupabaseUrl: Boolean(supabaseUrl),
  hasSupabaseServiceRoleKey: Boolean(supabaseServiceRoleKey),
}

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
      },
    })
  : null
