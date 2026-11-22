/**
 * NoticeFlow AI - RFC 5545 iCalendar (.ics) Generator
 * Creates standards-compliant calendar files compatible with Apple Calendar,
 * Google Calendar, Microsoft Outlook, and mobile calendar apps.
 */

// Helper to format date into iCal format: YYYYMMDDTHHMMSSZ or YYYYMMDD
function formatICalDate(dateStr, timeStr) {
  if (!dateStr) {
    const now = new Date()
    return now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const cleanDate = dateStr.replace(/-/g, '')

  if (timeStr) {
    const cleanTime = timeStr.replace(/:/g, '').padEnd(4, '0') + '00'
    return `${cleanDate}T${cleanTime}`
  }

  // All-day event
  return cleanDate
}

// Map priority string to iCalendar integer priority (1=High, 5=Medium, 9=Low)
function mapPriority(priority) {
  switch ((priority || '').toLowerCase()) {
    case 'urgent':
      return 1
    case 'important':
      return 5
    case 'normal':
    default:
      return 9
  }
}

// Generate single VEVENT block
export function generateVEvent(event) {
  const isAllDay = !event.time
  const startStamp = formatICalDate(event.date || event.deadline, event.time)
  
  // Calculate end date/time: 1 hour later if timed, or same day if all-day
  let endStamp = startStamp
  if (!isAllDay && event.time) {
    const [h, m] = event.time.split(':').map(Number)
    const endH = (h + 1) % 24
    const endTime = `${String(endH).padStart(2, '0')}${String(m || 0).padStart(2, '0')}00`
    const cleanDate = (event.date || event.deadline).replace(/-/g, '')
    endStamp = `${cleanDate}T${endTime}`
  }

  const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const uid = `noticeflow-${event.id || Date.now()}-${Math.random().toString(36).substring(2, 9)}@noticeflow.ai`
  
  const description = [
    event.description || '',
    '',
    event.deadline ? `[!] Notice Deadline: ${event.deadline}` : '',
    event.event_type ? `Category: ${event.event_type}` : '',
    event.source_text ? `Extracted from: "${event.source_text.replace(/\r?\n/g, ' ')}"` : '',
    '',
    'Generated with NoticeFlow AI - From Notice to Action in Seconds'
  ].filter(Boolean).join('\\n')

  const alarms = (event.reminder_days || [1]).map((days) => `BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Reminder: ${event.title}
TRIGGER:-P${days}D
END:VALARM`).join('\r\n')

  return [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${nowStamp}`,
    isAllDay ? `DTSTART;VALUE=DATE:${startStamp}` : `DTSTART:${startStamp}`,
    isAllDay ? `DTEND;VALUE=DATE:${endStamp}` : `DTEND:${endStamp}`,
    `SUMMARY:${(event.title || 'College Event').replace(/\n/g, ' ')}`,
    `DESCRIPTION:${description}`,
    event.venue ? `LOCATION:${event.venue.replace(/\n/g, ' ')}` : '',
    `PRIORITY:${mapPriority(event.priority)}`,
    `CATEGORIES:${event.event_type || 'ACADEMIC'}`,
    alarms,
    'END:VEVENT'
  ].filter(Boolean).join('\r\n')
}

// Generate complete iCalendar (.ics) string for single or multiple events
export function generateICS(events, calendarName = 'NoticeFlow College Calendar') {
  const eventList = Array.isArray(events) ? events : [events]
  const vevents = eventList.map(generateVEvent).join('\r\n')

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NoticeFlow AI//Academic Notice to Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${calendarName}`,
    'X-WR-TIMEZONE:Asia/Kolkata',
    vevents,
    'END:VCALENDAR'
  ].join('\r\n')
}

// Trigger browser download of .ics file
export function downloadICS(events, filename = 'notice-events.ics') {
  const icsData = generateICS(events)
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.setAttribute('download', filename.endsWith('.ics') ? filename : `${filename}.ics`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(link.href)
}

// Generate Google Calendar direct URL
export function getGoogleCalendarUrl(event) {
  const title = encodeURIComponent(event.title || 'College Event')
  const dateStr = (event.date || event.deadline || '').replace(/-/g, '')
  
  let dates
  if (event.time) {
    const cleanTime = event.time.replace(/:/g, '').padEnd(4, '0') + '00'
    const [h, m] = event.time.split(':').map(Number)
    const endH = (h + 1) % 24
    const endTime = `${String(endH).padStart(2, '0')}${String(m || 0).padStart(2, '0')}00`
    dates = `${dateStr}T${cleanTime}/${dateStr}T${endTime}`
  } else {
    // All day
    dates = `${dateStr}/${dateStr}`
  }

  const details = encodeURIComponent(
    `${event.description || ''}\n\nCategory: ${event.event_type || 'Other'}\nPriority: ${event.priority || 'Normal'}\nNotice Deadline: ${event.deadline || 'N/A'}\n\nGenerated via NoticeFlow AI`
  )
  const location = encodeURIComponent(event.venue || '')

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`
}
