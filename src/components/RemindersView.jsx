import React, { useState } from 'react'
import {
  Bell,
  Clock,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Flame,
  Check,
  Download,
  CalendarPlus
} from 'lucide-react'
import { formatDate, formatTime, getDeadlineBadge, isWithin24Hours, isOverdue } from '../utils/dateUtils'
import { downloadICS, getGoogleCalendarUrl } from '../utils/icsGenerator'

export default function RemindersView({ events = [] }) {
  const [completedIds, setCompletedIds] = useState(() => {
    try {
      const raw = localStorage.getItem('noticeflow_completed_tasks_v1')
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })

  const [notificationStatus, setNotificationStatus] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission
    }
    return 'unsupported'
  })

  const handleToggleComplete = (id) => {
    setCompletedIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      localStorage.setItem('noticeflow_completed_tasks_v1', JSON.stringify(updated))
      return updated
    })
  }

  const handleRequestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationStatus(permission)
      if (permission === 'granted') {
        new Notification('NoticeFlow AI Reminders Active', {
          body: 'Browser alerts configured for upcoming academic deadlines.',
          icon: '/favicon.svg'
        })
      }
    }
  }

  const overdueEvents = events.filter((e) => isOverdue(e.deadline || e.date, e.time) && !completedIds.includes(e.id))
  const critical24h = events.filter((e) => isWithin24Hours(e.deadline || e.date, e.time) && !completedIds.includes(e.id))

  const upcomingWithin7Days = events.filter((e) => {
    if (completedIds.includes(e.id)) return false
    const badge = getDeadlineBadge(e.deadline || e.date, e.time)
    return !isOverdue(e.deadline || e.date, e.time) && (badge.isToday || badge.isTomorrow || badge.isUrgent || badge.isSoon)
  })

  const futureTasks = events.filter((e) => {
    if (completedIds.includes(e.id)) return false
    const badge = getDeadlineBadge(e.deadline || e.date, e.time)
    return badge.isSafe
  })

  const completedTasks = events.filter((e) => completedIds.includes(e.id))

  const renderEventCard = (evt, highlightType = 'normal') => {
    const isDone = completedIds.includes(evt.id)
    const badge = getDeadlineBadge(evt.deadline || evt.date, evt.time)

    let borderClass = 'border-[#E5E9E5] bg-[#FFFFFF]'
    if (highlightType === 'critical') borderClass = 'border-[#F7CDCA] bg-[#FFFFFF]'
    else if (highlightType === 'overdue') borderClass = 'border-[#F7CDCA] bg-[#FFFFFF]'
    else if (highlightType === 'soon') borderClass = 'border-[#F8E3B6] bg-[#FFFFFF]'

    return (
      <div
        key={evt.id}
        className={`rounded-xl border ${borderClass} p-4 transition-all space-y-3 shadow-xs`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <button
              onClick={() => handleToggleComplete(evt.id)}
              className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all ${
                isDone
                  ? 'bg-[#38866B] border-[#38866B] text-white'
                  : 'border-[#CBD5E1] bg-white hover:border-[#267F73]'
              }`}
              title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
            >
              {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    badge.isOverdue
                      ? 'bg-[#FDF0EF] text-[#B54D47] border border-[#F7CDCA]'
                      : badge.isToday || badge.isTomorrow
                      ? 'bg-[#FEF7E9] text-[#B57F24] border border-[#F8E3B6]'
                      : 'bg-[#DDEAE4] text-[#1E6B61] border border-[#b8d3c7]'
                  }`}
                >
                  {badge.text}
                </span>

                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F0F2ED] text-[#556976]">
                  {evt.event_type}
                </span>

                {evt.priority === 'Urgent' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FDF0EF] text-[#B54D47] flex items-center gap-1">
                    <Flame className="w-2.5 h-2.5" /> Urgent
                  </span>
                )}
              </div>

              <h4 className={`text-sm font-semibold text-[#263238] font-['Plus_Jakarta_Sans'] ${isDone ? 'line-through text-[#718096]' : ''}`}>
                {evt.title}
              </h4>

              {evt.description && (
                <p className="text-xs text-[#718096] line-clamp-2 font-['Inter']">
                  {evt.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => downloadICS(evt, `${evt.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`)}
              title="Download ICS"
              className="p-1.5 rounded-lg bg-[#F0F2ED] hover:bg-[#E5E9E5] text-[#263238]"
            >
              <Download className="w-3.5 h-3.5 text-[#267F73]" />
            </button>
            <a
              href={getGoogleCalendarUrl(evt)}
              target="_blank"
              rel="noopener noreferrer"
              title="Add to Google Calendar"
              className="p-1.5 rounded-lg bg-[#DDEAE4] hover:bg-[#b8d3c7] text-[#1E6B61]"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-[#E5E9E5] text-xs text-[#718096]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#267F73]" />
              <strong className="text-[#263238] font-medium">{formatDate(evt.deadline || evt.date, true)}</strong>
            </span>
            {evt.time && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#718096]" />
                <span>{formatTime(evt.time)}</span>
              </span>
            )}
          </div>
          {evt.venue && <span className="text-[11px] text-[#718096]">{evt.venue}</span>}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#263238] tracking-tight flex items-center gap-2 font-['Plus_Jakarta_Sans']">
            <Clock className="w-5 h-5 text-[#267F73]" />
            <span>Smart Deadlines & Reminders</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#718096] font-['Inter']">
            Browser-based tracking of submission cutoffs, exam dates, and action items.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {notificationStatus === 'granted' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#DDEAE4] border border-[#b8d3c7] text-[#1E6B61] text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Browser Alerts Active</span>
            </span>
          ) : (
            <button
              onClick={handleRequestPermission}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#F0F2ED] text-[#263238] border border-[#E5E9E5] text-xs font-semibold transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-[#267F73]" />
              <span>Enable Browser Alerts</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. Critical Approaching in 24 Hours */}
      {critical24h.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#B54D47]">
            <AlertTriangle className="w-4 h-4 text-[#D66C65]" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-['Plus_Jakarta_Sans']">
              Approaching in 24 Hours ({critical24h.length})
            </h3>
          </div>
          <div className="space-y-3">
            {critical24h.map((evt) => renderEventCard(evt, 'critical'))}
          </div>
        </div>
      )}

      {/* 2. Overdue Tasks */}
      {overdueEvents.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#B54D47]">
            <AlertCircle className="w-4 h-4 text-[#D66C65]" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-['Plus_Jakarta_Sans']">
              Overdue Submissions ({overdueEvents.length})
            </h3>
          </div>
          <div className="space-y-3">
            {overdueEvents.map((evt) => renderEventCard(evt, 'overdue'))}
          </div>
        </div>
      )}

      {/* 3. Upcoming within 7 Days */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[#B57F24]">
          <Clock className="w-4 h-4 text-[#D9A441]" />
          <h3 className="text-xs font-bold uppercase tracking-wider font-['Plus_Jakarta_Sans']">
            Due Within 7 Days ({upcomingWithin7Days.length})
          </h3>
        </div>
        {upcomingWithin7Days.length === 0 ? (
          <p className="text-xs text-[#718096] p-3 bg-[#FFFFFF] rounded-xl border border-[#E5E9E5]">
            No pending deadlines in the next 7 days.
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingWithin7Days.map((evt) => renderEventCard(evt, 'soon'))}
          </div>
        )}
      </div>

      {/* 4. Future Tasks */}
      {futureTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#263238]">
            <Calendar className="w-4 h-4 text-[#267F73]" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-['Plus_Jakarta_Sans']">
              Upcoming Later This Month ({futureTasks.length})
            </h3>
          </div>
          <div className="space-y-3">
            {futureTasks.map((evt) => renderEventCard(evt, 'normal'))}
          </div>
        </div>
      )}

      {/* 5. Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-[#E5E9E5]">
          <div className="flex items-center gap-2 text-[#1E6B61]">
            <CheckCircle2 className="w-4 h-4 text-[#38866B]" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-['Plus_Jakarta_Sans']">
              Completed Tasks ({completedTasks.length})
            </h3>
          </div>
          <div className="space-y-3 opacity-75">
            {completedTasks.map((evt) => renderEventCard(evt, 'normal'))}
          </div>
        </div>
      )}
    </div>
  )
}
