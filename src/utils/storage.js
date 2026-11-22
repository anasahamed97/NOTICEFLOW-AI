/**
 * NoticeFlow AI - LocalStorage State Manager
 * Persistent storage for notices, confirmed calendar events, reminders, and user settings.
 */

const STORAGE_KEYS = {
  NOTICES: 'noticeflow_notices_v1',
  EVENTS: 'noticeflow_events_v1',
  SETTINGS: 'noticeflow_settings_v1',
  ACTIVITY: 'noticeflow_activity_v1'
}

// Initial seed data for exciting first-run experience
export const INITIAL_EVENTS = [
  {
    id: 'seed-evt-1',
    noticeId: 'seed-notice-1',
    title: 'Final Year Capstone Project Abstract Submission',
    description: 'Submit 2-page IEEE format synopsis with guide signature on the department portal.',
    event_type: 'Assignment',
    date: '2026-11-25',
    time: '23:59',
    deadline: '2026-11-25',
    venue: 'Department Portal (Canvas)',
    priority: 'Urgent',
    reminder_days: [3, 1],
    source_text: 'All final year B.Tech students must upload the approved abstract by 25th Nov 2026 23:59 hrs.',
    is_uncertain: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'seed-evt-2',
    noticeId: 'seed-notice-2',
    title: 'VTU End-Semester Exam Fee Registration (Without Fine)',
    description: 'Last date for online payment of semester end examination fees without penalty.',
    event_type: 'Registration',
    date: '2026-11-28',
    time: '17:00',
    deadline: '2026-11-28',
    venue: 'VTU Exam Portal',
    priority: 'Urgent',
    reminder_days: [7, 3, 1],
    source_text: 'Last date for submission of examination application forms without penalty is 28-11-2026.',
    is_uncertain: false,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'seed-evt-3',
    noticeId: 'seed-notice-3',
    title: 'Smart India Hackathon Internal College Screening',
    description: 'Problem statement presentation and hardware/software prototype review before central team submission.',
    event_type: 'Event',
    date: '2026-12-02',
    time: '10:00',
    deadline: '2026-11-30',
    venue: 'Incubation Center, Lab 4',
    priority: 'Important',
    reminder_days: [7, 2],
    source_text: 'Internal screening round scheduled on 02-12-2026 from 10:00 AM at Incubation Lab.',
    is_uncertain: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'seed-evt-4',
    noticeId: 'seed-notice-2',
    title: 'Semester End Theory Examinations Commencement',
    description: 'Commencement of 7th & 5th Semester B.E/B.Tech regular theory examinations.',
    event_type: 'Exam',
    date: '2026-12-15',
    time: '09:30',
    deadline: null,
    venue: 'Main Examination Block',
    priority: 'Important',
    reminder_days: [7, 3, 1],
    source_text: 'Theory examinations for all branches will commence from 15th December 2026 at 09:30 AM.',
    is_uncertain: false,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
]

export const INITIAL_NOTICES = [
  {
    id: 'seed-notice-1',
    filename: 'Dept_Notice_Project_Phase1_Deadlines.pdf',
    uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    thumbnail: null,
    eventsCount: 1,
    summary: 'Mandatory abstract submission for 8th-semester major project. Late submissions will result in grade deduction.',
    kannada_summary: 'ಅಂತಿಮ ವರ್ಷದ ಮೇಜರ್ ಪ್ರಾಜೆಕ್ಟ್ ಸಾರಾಂಶ ಸಲ್ಲಿಕೆ ದಿನಾಂಕ ನವೆಂಬರ್ 25.',
    hindi_summary: 'अंतिम वर्ष के प्रमुख प्रोजेक्ट का सार 25 नवंबर तक जमा करना अनिवार्य है।',
    status: 'confirmed'
  },
  {
    id: 'seed-notice-2',
    filename: 'VTU_Circular_Exam_Schedule_Winter_2026.pdf',
    uploadedAt: new Date(Date.now() - 86400000).toISOString(),
    thumbnail: null,
    eventsCount: 2,
    summary: 'Official notification regarding exam fee registration deadline and winter semester theory examination commencement date.',
    kannada_summary: 'ಸೆಮಿಸ್ಟರ್ ಪರೀಕ್ಷಾ ಶುಲ್ಕ ಪಾವತಿಗೆ ನವೆಂಬರ್ 28 ಕೊನೆಯ ದಿನ. ಪರೀಕ್ಷೆಗಳು ಡಿಸೆಂಬರ್ 15 ರಂದು ಪ್ರಾರಂಭವಾಗಲಿವೆ.',
    hindi_summary: 'परीक्षा शुल्क जमा करने की अंतिम तिथि 28 नवंबर है। परीक्षाएं 15 दिसंबर से शुरू होंगी।',
    status: 'confirmed'
  }
]

// Safe Storage helpers
export function getStoredNotices() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTICES)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(INITIAL_NOTICES))
      return INITIAL_NOTICES
    }
    return JSON.parse(raw)
  } catch (e) {
    console.error('Error reading notices from storage:', e)
    return INITIAL_NOTICES
  }
}

export function saveStoredNotices(notices) {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices))
  } catch (e) {
    console.error('Error saving notices:', e)
  }
}

export function getStoredEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS))
      return INITIAL_EVENTS
    }
    return JSON.parse(raw)
  } catch (e) {
    console.error('Error reading events from storage:', e)
    return INITIAL_EVENTS
  }
}

export function saveStoredEvents(events) {
  try {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events))
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
      languagePreference: 'all', // 'en', 'kn', 'hi', or 'all'
      enableBrowserNotifications: true
    }
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults
  } catch (e) {
    return { customApiKey: '', demoMode: false, languagePreference: 'all', enableBrowserNotifications: true }
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
    // Keep last 50 activities
    const trimmed = list.slice(0, 50)
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(trimmed))
    return trimmed
  } catch (e) {
    console.error('Error logging activity:', e)
    return []
  }
}

export function getStoredActivities() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY)
    if (!raw) {
      const initial = [
        {
          id: 'act-init-1',
          type: 'event_confirmed',
          message: 'Confirmed 2 events from VTU_Circular_Exam_Schedule_Winter_2026.pdf',
          timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'act-init-2',
          type: 'notice_upload',
          message: 'Uploaded Dept_Notice_Project_Phase1_Deadlines.pdf',
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ]
      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(initial))
      return initial
    }
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}
