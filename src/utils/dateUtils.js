/**
 * NoticeFlow AI - Date & Time Utilities
 */

// Format date nicely (e.g., "Nov 25, 2026" or "Wednesday, Nov 25, 2026")
export function formatDate(dateString, withDay = false) {
  if (!dateString) return 'Date not specified'
  try {
    const d = new Date(dateString + 'T00:00:00')
    if (isNaN(d.getTime())) return dateString

    const options = {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }
    if (withDay) {
      options.weekday = 'short'
    }
    return d.toLocaleDateString('en-US', options)
  } catch (e) {
    return dateString
  }
}

// Format time in 12-hour AM/PM format
export function formatTime(timeString) {
  if (!timeString) return 'All Day'
  try {
    const [h, m] = timeString.split(':').map(Number)
    const period = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    const minStr = String(m || 0).padStart(2, '0')
    return `${h12}:${minStr} ${period}`
  } catch (e) {
    return timeString
  }
}

// Get days difference from now
export function getDaysRemaining(dateString, timeString) {
  if (!dateString) return null
  const target = new Date(dateString + (timeString ? `T${timeString}:00` : 'T23:59:59'))
  const now = new Date()
  const diffMs = target.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return diffDays
}

// Human readable status badge: "Overdue", "Today", "Tomorrow", "In 3 days"
export function getDeadlineBadge(dateString, timeString) {
  const days = getDaysRemaining(dateString, timeString)
  if (days === null) return { text: 'No Date', color: 'slate' }

  if (days < 0) {
    const overdueDays = Math.abs(days)
    return {
      text: overdueDays === 1 ? 'Overdue by 1 day' : `Overdue by ${overdueDays} days`,
      color: 'red',
      isOverdue: true
    }
  }

  if (days === 0) {
    return { text: 'Due Today', color: 'red', isToday: true }
  }

  if (days === 1) {
    return { text: 'Due Tomorrow', color: 'amber', isTomorrow: true }
  }

  if (days <= 3) {
    return { text: `Due in ${days} days`, color: 'amber', isUrgent: true }
  }

  if (days <= 7) {
    return { text: `Due in ${days} days`, color: 'cyan', isSoon: true }
  }

  return { text: `In ${days} days`, color: 'emerald', isSafe: true }
}

// Check if an event is within the next 24 hours
export function isWithin24Hours(dateString, timeString) {
  if (!dateString) return false
  const target = new Date(dateString + (timeString ? `T${timeString}:00` : 'T23:59:59'))
  const now = new Date()
  const diffHours = (target.getTime() - now.getTime()) / (1000 * 60 * 60)
  return diffHours >= 0 && diffHours <= 24
}

// Check if an event deadline has already passed
export function isOverdue(dateString, timeString) {
  if (!dateString) return false
  const target = new Date(dateString + (timeString ? `T${timeString}:00` : 'T23:59:59'))
  const now = new Date()
  return target.getTime() < now.getTime()
}
