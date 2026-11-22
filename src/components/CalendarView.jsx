import React, { useState, useMemo } from 'react'
import {
  Calendar as CalendarIcon,
  Clock,
  Download,
  CalendarPlus,
  Search,
  MapPin,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Flame,
  FileDown,
  CalendarDays
} from 'lucide-react'
import { formatDate, formatTime, getDeadlineBadge } from '../utils/dateUtils'
import { downloadICS, getGoogleCalendarUrl } from '../utils/icsGenerator'

export default function CalendarView({
  events = [],
  onDeleteEvent,
  onNavigate
}) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPriority, setSelectedPriority] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date())
  const [selectedDateFilter, setSelectedDateFilter] = useState(null)

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      if (selectedCategory !== 'All' && evt.event_type !== selectedCategory) return false
      if (selectedPriority !== 'All' && evt.priority !== selectedPriority) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = (evt.title || '').toLowerCase().includes(q)
        const matchDesc = (evt.description || '').toLowerCase().includes(q)
        const matchVenue = (evt.venue || '').toLowerCase().includes(q)
        if (!matchTitle && !matchDesc && !matchVenue) return false
      }

      if (selectedDateFilter) {
        const eventDate = evt.date || evt.deadline
        if (eventDate !== selectedDateFilter) return false
      }

      return true
    }).sort((a, b) => {
      const dateA = a.date || a.deadline || '9999-12-31'
      const dateB = b.date || b.deadline || '9999-12-31'
      return dateA.localeCompare(dateB)
    })
  }, [events, selectedCategory, selectedPriority, searchQuery, selectedDateFilter])

  const calendarDays = useMemo(() => {
    const year = currentMonthDate.getFullYear()
    const month = currentMonthDate.getMonth()

    const firstDayIndex = new Date(year, month, 1).getDay()
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate()

    const days = []
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: null, isCurrentMonth: false })
    }

    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const dayEvents = events.filter((e) => (e.date || e.deadline) === dateStr)
      days.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: true,
        events: dayEvents
      })
    }

    return days
  }, [currentMonthDate, events])

  const monthYearLabel = currentMonthDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1))
    setSelectedDateFilter(null)
  }

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1))
    setSelectedDateFilter(null)
  }

  const handleExportAllICS = () => {
    if (events.length === 0) return
    downloadICS(events, 'NoticeFlow_Full_Academic_Schedule.ics')
  }

  const handleDownloadWeeklySchedule = () => {
    if (events.length === 0) return

    const lines = [
      '==================================================================',
      '           NOTICEFLOW AI - ACADEMIC SCHEDULE SUMMARY              ',
      '==================================================================',
      `Generated on: ${new Date().toLocaleString()}`,
      `Total Confirmed Events: ${events.length}`,
      '------------------------------------------------------------------',
      ''
    ]

    events.forEach((evt, idx) => {
      lines.push(`[${idx + 1}] ${evt.title.toUpperCase()}`)
      lines.push(`    Category:    ${evt.event_type || 'Event'}`)
      lines.push(`    Priority:    ${evt.priority || 'Normal'}`)
      lines.push(`    Event Date:  ${formatDate(evt.date, true)} ${evt.time ? `at ${formatTime(evt.time)}` : ''}`)
      if (evt.deadline) lines.push(`    Deadline:    ${formatDate(evt.deadline)}`)
      if (evt.venue) lines.push(`    Venue:       ${evt.venue}`)
      if (evt.description) lines.push(`    Details:     ${evt.description}`)
      lines.push('------------------------------------------------------------------')
    })

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.setAttribute('download', 'NoticeFlow_Weekly_Schedule.txt')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#263238] tracking-tight flex items-center gap-2 font-['Plus_Jakarta_Sans']">
            <CalendarIcon className="w-5 h-5 text-[#267F73]" />
            <span>Academic Schedule</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#718096] font-['Inter']">
            View confirmed examination dates and submission cutoffs. Export to your calendar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadWeeklySchedule}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[#FFFFFF] hover:bg-[#F0F2ED] text-[#263238] border border-[#E5E9E5] transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-[#267F73]" />
            <span>Weekly Summary</span>
          </button>

          <button
            onClick={handleExportAllICS}
            disabled={events.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#267F73] hover:bg-[#1E6B61] shadow-xs transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export All (.ICS)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Card */}
      <div className="bg-[#FFFFFF] border border-[#E5E9E5] rounded-xl p-4 space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#718096] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, venue, or syllabus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#F7F7F2] border border-[#E5E9E5] text-xs text-[#263238] placeholder-[#718096] focus:border-[#267F73] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-[#F0F2ED] p-1 rounded-lg border border-[#E5E9E5]">
              {['All', 'Exam', 'Assignment', 'Registration', 'Event'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#267F73] text-white font-semibold'
                      : 'text-[#718096] hover:text-[#263238]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#F7F7F2] border border-[#E5E9E5] text-xs text-[#263238] font-medium focus:border-[#267F73] focus:bg-white focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent Only</option>
              <option value="Important">Important Only</option>
              <option value="Normal">Normal Only</option>
            </select>
          </div>
        </div>

        {selectedDateFilter && (
          <div className="flex items-center justify-between pt-2 border-t border-[#E5E9E5] text-xs text-[#267F73]">
            <span>Filtering events for: <strong>{selectedDateFilter}</strong></span>
            <button
              onClick={() => setSelectedDateFilter(null)}
              className="underline text-[#718096] hover:text-[#263238]"
            >
              Show all dates
            </button>
          </div>
        )}
      </div>

      {/* Grid: Calendar Matrix & Event Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Month Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E5E9E5] rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#263238] flex items-center gap-2 font-['Plus_Jakarta_Sans']">
              <CalendarDays className="w-4 h-4 text-[#267F73]" />
              <span>{monthYearLabel}</span>
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1 rounded-md text-[#718096] hover:text-[#263238] hover:bg-[#F0F2ED]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 rounded-md text-[#718096] hover:text-[#263238] hover:bg-[#F0F2ED]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#718096]">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((wd) => (
              <span key={wd} className="py-1">
                {wd}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-xs">
            {calendarDays.map((cell, idx) => {
              if (!cell.isCurrentMonth) {
                return <div key={idx} className="h-9 rounded-md bg-transparent" />
              }

              const isSelected = selectedDateFilter === cell.dateStr
              const hasEvents = cell.events && cell.events.length > 0
              const hasUrgent = cell.events.some((e) => e.priority === 'Urgent')
              const hasExam = cell.events.some((e) => e.event_type === 'Exam')

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDateFilter(isSelected ? null : cell.dateStr)}
                  className={`h-9 rounded-md p-1 flex flex-col items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-[#267F73] text-white font-bold'
                      : hasEvents
                      ? 'bg-[#F0F2ED] hover:bg-[#E5E9E5] text-[#263238] font-semibold border border-[#E5E9E5]'
                      : 'hover:bg-[#F0F2ED] text-[#718096]'
                  }`}
                >
                  <span className="text-[11px]">{cell.dayNumber}</span>
                  {hasEvents && (
                    <div className="flex items-center gap-0.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected
                            ? 'bg-white'
                            : hasUrgent
                            ? 'bg-[#D66C65]'
                            : hasExam
                            ? 'bg-[#668BA8]'
                            : 'bg-[#267F73]'
                        }`}
                      />
                      {cell.events.length > 1 && (
                        <span className={`text-[9px] ${isSelected ? 'text-white' : 'text-[#718096]'}`}>
                          +{cell.events.length}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          <div className="pt-3 border-t border-[#E5E9E5] flex items-center justify-between text-[11px] text-[#718096]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D66C65]" /> Urgent
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#668BA8]" /> Exam
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#267F73]" /> Deadline
            </span>
          </div>
        </div>

        {/* Event Cards List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#718096]">
            <span>Showing <strong>{filteredEvents.length}</strong> event(s)</span>
            <span>Chronological order</span>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="bg-[#FFFFFF] border border-[#E5E9E5] rounded-xl p-8 text-center space-y-2">
              <CalendarIcon className="w-7 h-7 text-[#718096] mx-auto opacity-50" />
              <p className="text-xs font-semibold text-[#263238]">No matching events found</p>
              <p className="text-[11px] text-[#718096]">
                Try adjusting the filters or upload a new notice.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEvents.map((evt) => {
                const badge = getDeadlineBadge(evt.date || evt.deadline, evt.time)

                return (
                  <div
                    key={evt.id}
                    className="bg-[#FFFFFF] border border-[#E5E9E5] hover:border-[#DDEAE4] rounded-xl p-4 shadow-xs transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
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

                        <h4 className="text-sm font-bold text-[#263238] leading-snug font-['Plus_Jakarta_Sans']">
                          {evt.title}
                        </h4>

                        {evt.description && (
                          <p className="text-xs text-[#718096] leading-relaxed font-['Inter']">
                            {evt.description}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => onDeleteEvent(evt.id)}
                        title="Delete event"
                        className="text-[#718096] hover:text-[#D66C65] p-1.5 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#718096] pt-2 border-t border-[#E5E9E5]">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5 text-[#267F73]" />
                        <strong className="text-[#263238] font-medium">{formatDate(evt.date || evt.deadline, true)}</strong>
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
                          <span className="truncate max-w-[180px]">{evt.venue}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <div className="text-[11px] text-[#718096]">
                        {evt.reminder_days && evt.reminder_days.length > 0 && (
                          <span>Alerts: {evt.reminder_days.join('d, ')}d before</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => downloadICS(evt, `${evt.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-[#263238] bg-[#F0F2ED] hover:bg-[#E5E9E5] border border-[#E5E9E5] transition-colors"
                        >
                          <Download className="w-3 h-3 text-[#267F73]" />
                          <span>.ICS</span>
                        </button>

                        <a
                          href={getGoogleCalendarUrl(evt)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-[#1E6B61] bg-[#DDEAE4] hover:bg-[#b8d3c7] transition-colors"
                        >
                          <CalendarPlus className="w-3 h-3" />
                          <span>Google Cal</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
