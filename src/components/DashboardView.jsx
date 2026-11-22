import React from 'react'
import {
  FileText,
  Clock,
  Calendar,
  AlertTriangle,
  Upload,
  ArrowRight,
  Sparkles,
  Download,
  CalendarPlus,
  Flame,
  ChevronRight,
  TrendingUp,
  MapPin,
  CheckCircle2
} from 'lucide-react'
import { formatDate, formatTime, getDeadlineBadge, isWithin24Hours, isOverdue } from '../utils/dateUtils'
import { downloadICS, getGoogleCalendarUrl } from '../utils/icsGenerator'

export default function DashboardView({
  notices = [],
  events = [],
  activities = [],
  onNavigate,
  onSelectSample
}) {
  const totalNotices = notices.length
  const totalEvents = events.length

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = a.date || a.deadline || '9999-12-31'
    const dateB = b.date || b.deadline || '9999-12-31'
    return dateA.localeCompare(dateB)
  })

  const urgentEvents = sortedEvents.filter((evt) => {
    const badge = getDeadlineBadge(evt.date || evt.deadline, evt.time)
    return evt.priority === 'Urgent' || badge.isUrgent || badge.isToday || badge.isTomorrow
  })

  const upcomingDeadlines = sortedEvents.filter((evt) => evt.deadline && !isOverdue(evt.deadline, evt.time))
  const critical24h = sortedEvents.filter((evt) => isWithin24Hours(evt.date || evt.deadline, evt.time))

  const statCards = [
    {
      title: 'Notices Processed',
      value: totalNotices,
      subtitle: `${notices.filter(n => n.status === 'confirmed').length} confirmed`,
      icon: FileText,
      iconBg: 'bg-[#DDEAE4]',
      iconColor: 'text-[#267F73]'
    },
    {
      title: 'Active Deadlines',
      value: upcomingDeadlines.length,
      subtitle: 'Next 30 days',
      icon: Clock,
      iconBg: 'bg-[#FEF7E9]',
      iconColor: 'text-[#D9A441]'
    },
    {
      title: 'Scheduled Events',
      value: totalEvents,
      subtitle: 'Exams & Sessions',
      icon: Calendar,
      iconBg: 'bg-[#EFF4F8]',
      iconColor: 'text-[#668BA8]'
    },
    {
      title: 'Urgent Notices',
      value: urgentEvents.length,
      subtitle: urgentEvents.length > 0 ? 'Action required' : 'All clear',
      icon: Flame,
      iconBg: 'bg-[#FDF0EF]',
      iconColor: 'text-[#D66C65]'
    }
  ]

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Welcome Card */}
      <div className="bg-[#FFFFFF] border border-[#E5E9E5] rounded-xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#DDEAE4] text-[#1E6B61] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Notice-to-Calendar Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#263238] tracking-tight font-['Plus_Jakarta_Sans']">
              Turn College Circulars into Action in Seconds.
            </h2>
            <p className="text-sm text-[#718096] leading-relaxed font-['Inter']">
              Upload official PDF circulars, exam schedules, or WhatsApp notices.
              NoticeFlow AI identifies deadlines, separates registration cutoffs from exam dates, and generates calendar events with reminders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('upload')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#267F73] hover:bg-[#1E6B61] shadow-xs transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Notice</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onSelectSample}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium text-[#263238] bg-[#F0F2ED] hover:bg-[#E5E9E5] border border-[#E5E9E5] transition-colors"
            >
              <FileText className="w-4 h-4 text-[#267F73]" />
              <span>Try Sample Notice</span>
            </button>
          </div>
        </div>
      </div>

      {/* 24-Hour Critical Alert Banner */}
      {critical24h.length > 0 && (
        <div className="rounded-xl border border-[#F7CDCA] bg-[#FDF0EF] p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FFFFFF] border border-[#F7CDCA] flex items-center justify-center text-[#D66C65] flex-shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#B54D47] font-['Plus_Jakarta_Sans']">
                Action Required: {critical24h.length} deadline(s) approaching within 24 hours
              </h4>
              <p className="text-xs text-[#B54D47]/90 font-['Inter']">
                {critical24h.map(e => e.title).join(' • ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('reminders')}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FFFFFF] hover:bg-[#FDF0EF] border border-[#F7CDCA] text-[#B54D47] transition-colors"
          >
            View Reminders
          </button>
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={index}
              className="bg-[#FFFFFF] border border-[#E5E9E5] rounded-xl p-4 shadow-xs hover:border-[#DDEAE4] transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider font-['Plus_Jakarta_Sans']">
                  {card.title}
                </span>
                <div className={`p-2 rounded-lg ${card.iconBg} ${card.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-[#263238] tracking-tight font-['Plus_Jakarta_Sans']">
                  {card.value}
                </span>
                <span className="text-xs text-[#718096] font-medium font-['Inter']">
                  {card.subtitle}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Grid: Upcoming Deadlines & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Upcoming Deadlines & Events */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#267F73]" />
              <h3 className="text-base font-bold text-[#263238] font-['Plus_Jakarta_Sans']">
                Upcoming Events & Deadlines
              </h3>
            </div>
            <button
              onClick={() => onNavigate('calendar')}
              className="text-xs font-semibold text-[#267F73] hover:text-[#1E6B61] flex items-center gap-1 transition-colors font-['Inter']"
            >
              <span>Full Calendar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {sortedEvents.length === 0 ? (
            <div className="bg-[#FFFFFF] border border-[#E5E9E5] rounded-xl p-8 text-center space-y-3">
              <Calendar className="w-8 h-8 text-[#718096] mx-auto opacity-40" />
              <p className="text-xs font-semibold text-[#263238]">No upcoming events recorded</p>
              <p className="text-xs text-[#718096] max-w-sm mx-auto">
                Upload a college circular or test with a sample notice to view deadlines.
              </p>
              <button
                onClick={() => onNavigate('upload')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#267F73] hover:bg-[#1E6B61] text-white"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Notice</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedEvents.slice(0, 5).map((evt) => {
                const badge = getDeadlineBadge(evt.date || evt.deadline, evt.time)

                return (
                  <div
                    key={evt.id}
                    className="bg-[#FFFFFF] border border-[#E5E9E5] hover:border-[#DDEAE4] rounded-xl p-4 shadow-xs transition-all duration-150 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        {/* Status Badges */}
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

                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F0F2ED] text-[#556976] border border-[#E5E9E5]">
                            {evt.event_type}
                          </span>

                          {evt.priority === 'Urgent' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FDF0EF] text-[#B54D47] border border-[#F7CDCA] flex items-center gap-1">
                              <Flame className="w-2.5 h-2.5" /> Urgent
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="text-sm font-semibold text-[#263238] group-hover:text-[#267F73] transition-colors line-clamp-1 font-['Plus_Jakarta_Sans']">
                          {evt.title}
                        </h4>

                        {/* Date & Venue */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#718096]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#718096]" />
                            <span>{formatDate(evt.date || evt.deadline, true)}</span>
                          </span>
                          {evt.time && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#718096]" />
                              <span>{formatTime(evt.time)}</span>
                            </span>
                          )}
                          {evt.venue && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#718096]" />
                              <span className="truncate max-w-[140px]">{evt.venue}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Calendar Action Buttons */}
                      <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5E9E5]">
                        <button
                          onClick={() => downloadICS(evt, `${evt.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`)}
                          title="Download .ICS file"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#263238] bg-[#F0F2ED] hover:bg-[#E5E9E5] border border-[#E5E9E5] transition-colors"
                        >
                          <Download className="w-3.5 h-3.5 text-[#267F73]" />
                          <span>.ICS</span>
                        </button>
                        <a
                          href={getGoogleCalendarUrl(evt)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Add to Google Calendar"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#1E6B61] bg-[#DDEAE4] hover:bg-[#b8d3c7] transition-colors"
                        >
                          <CalendarPlus className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Google Cal</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Recent Notices & Activity */}
        <div className="space-y-6">
          {/* Recent Notices Snapshot */}
          <div className="bg-[#FFFFFF] border border-[#E5E9E5] rounded-xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#267F73]" />
                <h4 className="text-sm font-bold text-[#263238] font-['Plus_Jakarta_Sans']">
                  Recent Circulars
                </h4>
              </div>
              <button
                onClick={() => onNavigate('history')}
                className="text-xs text-[#718096] hover:text-[#267F73] transition-colors"
              >
                All ({notices.length})
              </button>
            </div>

            {notices.length === 0 ? (
              <p className="text-xs text-[#718096] py-3 text-center">No notices processed yet.</p>
            ) : (
              <div className="space-y-2">
                {notices.slice(0, 3).map((notice) => (
                  <div
                    key={notice.id}
                    className="p-2.5 rounded-lg bg-[#F0F2ED] border border-[#E5E9E5] hover:border-[#DDEAE4] transition-all text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#263238] truncate max-w-[170px]">
                        {notice.filename}
                      </span>
                      <span className="text-[10px] font-semibold text-[#1E6B61] bg-[#DDEAE4] px-1.5 py-0.5 rounded">
                        {notice.eventsCount} events
                      </span>
                    </div>
                    {notice.summary && (
                      <p className="text-[#718096] line-clamp-2 text-[11px] leading-relaxed">
                        {notice.summary}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="bg-[#FFFFFF] border border-[#E5E9E5] rounded-xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#267F73]" />
              <h4 className="text-sm font-bold text-[#263238] font-['Plus_Jakarta_Sans']">
                Recent Activity
              </h4>
            </div>

            <div className="space-y-3">
              {activities.slice(0, 4).map((act) => (
                <div key={act.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#267F73] mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[#263238] font-medium leading-relaxed">
                      {act.message}
                    </p>
                    <span className="text-[10px] text-[#718096]">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(act.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
