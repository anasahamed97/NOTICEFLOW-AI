/**
 * NoticeFlow AI - Supabase Client
 * Handles real-time cloud database connection with graceful offline fallback.
 */

import { createClient } from '@supabase/supabase-js'

// Get credentials from environment or localStorage override
const getCredentials = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL
  const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  let customUrl = ''
  let customKey = ''

  try {
    const raw = localStorage.getItem('noticeflow_settings_v1')
    if (raw) {
      const parsed = JSON.parse(raw)
      customUrl = parsed.supabaseUrl || ''
      customKey = parsed.supabaseAnonKey || ''
    }
  } catch (e) {
    // ignore
  }

  const supabaseUrl = customUrl || envUrl || ''
  const supabaseAnonKey = customKey || envAnonKey || ''

  return { supabaseUrl, supabaseAnonKey }
}

const { supabaseUrl, supabaseAnonKey } = getCredentials()

// Initialize client only if valid URL is present
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const isSupabaseConfigured = () => {
  const { supabaseUrl, supabaseAnonKey } = getCredentials()
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'))
}

export const getSupabaseClient = () => {
  const { supabaseUrl, supabaseAnonKey } = getCredentials()
  if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
    return createClient(supabaseUrl, supabaseAnonKey)
  }
  return null
}
