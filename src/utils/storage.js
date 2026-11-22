/**
 * NoticeFlow AI - Storage & Supabase Cloud Sync Manager
 * Supports dual-layer persistence: Supabase PostgreSQL database + localStorage instant caching.
 */

import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient'

const STORAGE_KEYS = {
  NOTICES: 'noticeflow_notices_v1',
  EVENTS: 'noticeflow_events_v1',
  SETTINGS: 'noticeflow_settings_v1',
  ACTIVITY: 'noticeflow_activity_v1'
}

// Clean start - no dummy or mock data
export const INITIAL_EVENTS = []
export const INITIAL_NOTICES = []

// LocalStorage helpers
export function getStoredNotices() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTICES)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    // Strip any old seed data
    return Array.isArray(parsed) ? parsed.filter(n => !n.id?.startsWith('seed-')) : []
  } catch (e) {
    console.error('Error reading notices from storage:', e)
    return []
  }
}

export function saveStoredNotices(notices) {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices || []))
  } catch (e) {
    console.error('Error saving notices:', e)
  }
}

export function getStoredEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    // Strip any old seed data
    return Array.isArray(parsed) ? parsed.filter(e => !e.id?.startsWith('seed-')) : []
  } catch (e) {
    console.error('Error reading events from storage:', e)
    return []
  }
}

export function saveStoredEvents(events) {
  try {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events || []))
  } catch (e) {
    console.error('Error saving events:', e)
  }
}

export function getStoredSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    const defaults = {
      customApiKey: '',
      demoMode: false,
      languagePreference: 'all',
      enableBrowserNotifications: true,
      supabaseUrl: '',
      supabaseAnonKey: ''
    }
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults
  } catch (e) {
    return {
      customApiKey: '',
      demoMode: false,
      languagePreference: 'all',
      enableBrowserNotifications: true,
      supabaseUrl: '',
      supabaseAnonKey: ''
    }
  }
}

export function saveStoredSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
  } catch (e) {
    console.error('Error saving settings:', e)
  }
}

export function logActivity(type, message, metadata = {}) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY) || '[]'
    const list = JSON.parse(raw)
    const newEntry = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      message,
      metadata,
      timestamp: new Date().toISOString()
    }
    list.unshift(newEntry)
    const trimmed = list.slice(0, 50)
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(trimmed))

    // Background push to Supabase if configured
    syncActivityToSupabase(newEntry).catch(() => {})

    return trimmed
  } catch (e) {
    console.error('Error logging activity:', e)
    return []
  }
}

export function getStoredActivities() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    // Strip any old seed activities
    return Array.isArray(parsed) ? parsed.filter(a => !a.id?.startsWith('act-init-')) : []
  } catch (e) {
    return []
  }
}

// ====================================================================
// SUPABASE CLOUD SYNC FUNCTIONS
// ====================================================================

/**
 * Fetch all notices, events, and activities from Supabase and synchronize with localStorage
 */
export async function syncFromSupabase() {
  const client = getSupabaseClient()
  if (!client) return null

  try {
    // 1. Fetch Notices
    const { data: dbNotices, error: nErr } = await client
      .from('notices')
      .select('*')
      .order('uploaded_at', { ascending: false })

    if (nErr) throw nErr

    // 2. Fetch Events
    const { data: dbEvents, error: eErr } = await client
      .from('events')
      .select('*')
      .order('date', { ascending: true })

    if (eErr) throw eErr

    // 3. Fetch Activities
    const { data: dbActs, error: aErr } = await client
      .from('activities')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50)

    if (aErr) throw aErr

    if (dbNotices) {
      const mappedNotices = dbNotices.map((n) => ({
        id: n.id,
        filename: n.filename,
        uploadedAt: n.uploaded_at,
        thumbnail: n.thumbnail,
        eventsCount: n.events_count,
        summary: n.summary,
        kannada_summary: n.kannada_summary,
        hindi_summary: n.hindi_summary,
        status: n.status
      }))
      saveStoredNotices(mappedNotices)
    }

    if (dbEvents) {
      const mappedEvents = dbEvents.map((e) => ({
        id: e.id,
        noticeId: e.notice_id,
        title: e.title,
        description: e.description,
        event_type: e.event_type,
        date: e.date,
        time: e.time,
        deadline: e.deadline,
        venue: e.venue,
        priority: e.priority,
        reminder_days: e.reminder_days,
        source_text: e.source_text,
        is_uncertain: e.is_uncertain,
        createdAt: e.created_at
      }))
      saveStoredEvents(mappedEvents)
    }

    if (dbActs) {
      const mappedActs = dbActs.map((a) => ({
        id: a.id,
        type: a.type,
        message: a.message,
        metadata: a.metadata,
        timestamp: a.timestamp
      }))
      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(mappedActs))
    }

    return {
      success: true,
      noticesCount: dbNotices?.length || 0,
      eventsCount: dbEvents?.length || 0
    }
  } catch (err) {
    console.warn('Supabase syncFromSupabase error:', err.message)
    return { success: false, error: err.message }
  }
}

/**
 * Insert or update a notice in Supabase
 */
export async function syncNoticeToSupabase(notice) {
  const client = getSupabaseClient()
  if (!client) return

  try {
    await client.from('notices').upsert({
      id: notice.id,
      filename: notice.filename,
      uploaded_at: notice.uploadedAt || new Date().toISOString(),
      thumbnail: notice.thumbnail,
      events_count: notice.eventsCount || 0,
      summary: notice.summary,
      kannada_summary: notice.kannada_summary,
      hindi_summary: notice.hindi_summary,
      status: notice.status || 'confirmed'
    })
  } catch (err) {
    console.warn('Supabase notice upsert error:', err.message)
  }
}

/**
 * Insert or update events in Supabase
 */
export async function syncEventsToSupabase(events) {
  const client = getSupabaseClient()
  if (!client || !events || events.length === 0) return

  try {
    const rows = events.map((e) => ({
      id: e.id,
      notice_id: e.noticeId,
      title: e.title,
      description: e.description,
      event_type: e.event_type || 'Other',
      date: e.date,
      time: e.time,
      deadline: e.deadline,
      venue: e.venue,
      priority: e.priority || 'Normal',
      reminder_days: e.reminder_days || [7, 3, 1],
      source_text: e.source_text,
      is_uncertain: !!e.is_uncertain,
      created_at: e.createdAt || new Date().toISOString()
    }))

    await client.from('events').upsert(rows)
  } catch (err) {
    console.warn('Supabase events upsert error:', err.message)
  }
}

/**
 * Delete a notice and linked events from Supabase
 */
export async function deleteNoticeFromSupabase(noticeId) {
  const client = getSupabaseClient()
  if (!client) return

  try {
    await client.from('notices').delete().eq('id', noticeId)
  } catch (err) {
    console.warn('Supabase deleteNotice error:', err.message)
  }
}

/**
 * Delete an event from Supabase
 */
export async function deleteEventFromSupabase(eventId) {
  const client = getSupabaseClient()
  if (!client) return

  try {
    await client.from('events').delete().eq('id', eventId)
  } catch (err) {
    console.warn('Supabase deleteEvent error:', err.message)
  }
}

/**
 * Log activity row to Supabase
 */
export async function syncActivityToSupabase(act) {
  const client = getSupabaseClient()
  if (!client) return

  try {
    await client.from('activities').insert({
      id: act.id,
      type: act.type,
      message: act.message,
      metadata: act.metadata || {},
      timestamp: act.timestamp || new Date().toISOString()
    })
  } catch (err) {
    console.warn('Supabase activity insert error:', err.message)
  }
}
