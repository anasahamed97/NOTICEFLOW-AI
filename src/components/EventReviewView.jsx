import React, { useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Sparkles,
  Languages,
  Info,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { detectEventConflicts } from '../utils/conflictDetector'

export default function EventReviewView({
  extractionData,
  existingEvents = [],
  onConfirmEvents,
  onReject,
  onBackToUpload
}) {
  const { rawResult, filename, modelUsed, thumbnail } = extractionData

  const [noticeTitle, setNoticeTitle] = useState(rawResult.notice_title || filename || 'Academic Notice')
  const [activeLangTab, setActiveLangTab] = useState('en')
  const [eventsList, setEventsList] = useState(rawResult.events || [])

  const handleUpdateEvent = (id, field, value) => {
    setEventsList((prev) =>
      prev.map((evt) => {
        if (evt.id === id) {
          const updated = { ...evt, [field]: value }
          if (field === 'date' || field === 'title') {
            updated.is_uncertain = false
          }
          return updated
        }
        return evt
      })
    )
  }

  const handleDeleteEvent = (id) => {
    setEventsList((prev) => prev.filter((evt) => evt.id !== id))
  }

  const handleAddNewEvent = () => {
    const newEvt = {
      id: `custom-evt-${Date.now()}`,
      title: 'New College Event',
      description: '',
      event_type: 'Other',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      deadline: null,
      venue: '',
      priority: 'Normal',
      reminder_days: [3, 1],
      source_text: 'Manually added by student',
      is_uncertain: false,
      uncertainty_reason: null
    }
    setEventsList((prev) => [...prev, newEvt])
  }

  const handleToggleReminderDay = (id, day) => {
    setEventsList((prev) =>
      prev.map((evt) => {
        if (evt.id === id) {
          const current = evt.reminder_days || []
          const updatedDays = current.includes(day)
            ? current.filter((d) => d !== day)
            : [...current, day].sort((a, b) => b - a)
          return { ...evt, reminder_days: updatedDays }
        }
        return evt
      })
    )
  }

  const handleConfirmAll = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      })
    } catch (e) {
      // Ignore
    }

    onConfirmEvents({
      noticeTitle,
      summary: rawResult.summary,
      kannada_summary: rawResult.kannada_summary,
      hindi_summary: rawResult.hindi_summary,
      filename,
      thumbnail,
      confirmedEvents: eventsList
    })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBackToUpload}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#718096] hover:text-[#263238] transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Upload Another Notice</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#718096]">Processed by:</span>
          <span className="text-xs font-medium text-[#1E6B61] bg-[#DDEAE4] px-2.5 py-0.5 rounded border border-[#b8d3c7]">
            {modelUsed || 'Gemini 2.5 Flash'}
          </span>
        </div>
      </div>

      {/* Notice Summary Card */}
      <div className="bg-[#FFFFFF] border border-[#E5E9E5] rounded-xl p-6 shadow-xs space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#DDEAE4] text-[#1E6B61]">
              AI Extraction Review
            </span>
            {rawResult.issue_date && (
              <span className="text-xs text-[#718096]">
                Notice Issued: <strong className="text-[#263238] font-medium">{rawResult.issue_date}</strong>
              </span>
            )}
          </div>

          <input
            type="text"
            value={noticeTitle}
            onChange={(e) => setNoticeTitle(e.target.value)}
            className="text-lg sm:text-xl font-bold text-[#263238] bg-transparent border-b border-transparent hover:border-[#E5E9E5] focus:border-[#267F73] focus:outline-none w-full transition-colors font-['Plus_Jakarta_Sans']"
          />

          {rawResult.college_or_dept && (
            <p className="text-xs font-medium text-[#718096] font-['Inter']">
              {rawResult.college_or_dept}
            </p>
          )}
        </div>

        {/* Multilingual Synopsis Tabs */}
        <div className="rounded-xl border border-[#E5E9E5] bg-[#F0F2ED] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#E5E9E5] pb-2.5">
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-[#267F73]" />
              <span className="text-xs font-semibold text-[#263238]">Multilingual Synopsis</span>
            </div>

            <div className="flex items-center gap-1 bg-[#FFFFFF] p-0.5 rounded-lg border border-[#E5E9E5]">
              <button
                onClick={() => setActiveLangTab('en')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  activeLangTab === 'en'
                    ? 'bg-[#267F73] text-white font-semibold'
                    : 'text-[#718096] hover:text-[#263238]'
                }`}
              >
                English
              </button>
              {rawResult.kannada_summary && (
                <button
                  onClick={() => setActiveLangTab('kn')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    activeLangTab === 'kn'
                      ? 'bg-[#267F73] text-white font-semibold'
                      : 'text-[#718096] hover:text-[#263238]'
                  }`}
                >
                  ಕನ್ನಡ (Kannada)
                </button>
              )}
              {rawResult.hindi_summary && (
                <button
                  onClick={() => setActiveLangTab('hi')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    activeLangTab === 'hi'
                      ? 'bg-[#267F73] text-white font-semibold'
                      : 'text-[#718096] hover:text-[#263238]'
                  }`}
                >
                  हिंदी (Hindi)
                </button>
              )}
            </div>
          </div>

          <div className="text-xs sm:text-sm text-[#263238] leading-relaxed min-h-[36px]">
            {activeLangTab === 'en' && (
              <p>{rawResult.summary || 'Notice analyzed and ready for verification.'}</p>
            )}
            {activeLangTab === 'kn' && (
              <p className="font-sans leading-relaxed text-[#263238]">
                {rawResult.kannada_summary || 'ಕನ್ನಡ ಸಾರಾಂಶ ಲಭ್ಯವಿಲ್ಲ.'}
              </p>
            )}
            {activeLangTab === 'hi' && (
              <p className="font-sans leading-relaxed text-[#263238]">
                {rawResult.hindi_summary || 'हिंदी सारांश उपलब्ध नहीं है।'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Extracted Events Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#263238] flex items-center gap-2 font-['Plus_Jakarta_Sans']">
              <CheckCircle2 className="w-4 h-4 text-[#38866B]" />
              <span>Extracted Events ({eventsList.length})</span>
            </h3>
            <p className="text-xs text-[#718096] font-['Inter']">
              Review dates, cutoffs, and priorities. Adjust any field before adding to your calendar.
            </p>
          </div>

          <button
            onClick={handleAddNewEvent}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FFFFFF] hover:bg-[#F0F2ED] text-[#263238] border border-[#E5E9E5] transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-[#267F73]" />
            <span>Add Event</span>
          </button>
        </div>

        {eventsList.length === 0 ? (
          <div className="p-8 rounded-xl border border-dashed border-[#E5E9E5] bg-[#FFFFFF] text-center space-y-3">
            <p className="text-xs text-[#718096]">No events found in this notice.</p>
            <button
              onClick={handleAddNewEvent}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#267F73] text-white"
            >
              Add an Event Manually
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {eventsList.map((evt, index) => {
              const conflicts = detectEventConflicts(evt, existingEvents)

              return (
                <div
                  key={evt.id}
                  className={`rounded-xl border ${
                    evt.is_uncertain
                      ? 'border-[#F8E3B6] bg-[#FEF7E9]'
                      : conflicts.length > 0
                      ? 'border-[#F7CDCA] bg-[#FDF0EF]'
                      : 'border-[#E5E9E5] bg-[#FFFFFF]'
                  } p-5 space-y-4 shadow-xs transition-all`}
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E9E5] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-[#DDEAE4] text-[#1E6B61] text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-xs font-semibold text-[#263238]">Event #{index + 1}</span>

                      {evt.is_uncertain && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FEF7E9] text-[#B57F24] border border-[#F8E3B6] flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-[#D9A441]" />
                          Needs Confirmation
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteEvent(evt.id)}
                      className="text-[#718096] hover:text-[#D66C65] p-1 rounded transition-colors"
                      title="Discard this event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Uncertainty Banner */}
                  {evt.is_uncertain && evt.uncertainty_reason && (
                    <div className="p-3 rounded-lg bg-[#FEF7E9] border border-[#F8E3B6] text-xs text-[#B57F24] flex items-start gap-2">
                      <Info className="w-4 h-4 text-[#D9A441] flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>AI Note:</strong> {evt.uncertainty_reason}
                      </div>
                    </div>
                  )}

                  {/* Conflict Detection Banner */}
                  {conflicts.map((conf, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-3 rounded-lg bg-[#FDF0EF] border border-[#F7CDCA] text-xs text-[#B54D47] flex items-start gap-2"
                    >
                      <ShieldAlert className="w-4 h-4 text-[#D66C65] flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Schedule Conflict:</strong> {conf.message}
                      </div>
                    </div>
                  ))}

                  {/* Editable Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Title */}
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[11px] font-semibold text-[#718096]">Event Title *</label>
                      <input
                        type="text"
                        value={evt.title || ''}
                        onChange={(e) => handleUpdateEvent(evt.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#F7F7F2] border border-[#E5E9E5] text-[#263238] text-xs font-semibold focus:border-[#267F73] focus:bg-white focus:outline-none"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#718096]">Category</label>
                      <select
                        value={evt.event_type || 'Other'}
                        onChange={(e) => handleUpdateEvent(evt.id, 'event_type', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#F7F7F2] border border-[#E5E9E5] text-[#263238] text-xs font-medium focus:border-[#267F73] focus:bg-white focus:outline-none"
                      >
                        <option value="Exam">Exam</option>
                        <option value="Assignment">Assignment</option>
                        <option value="Registration">Registration</option>
                        <option value="Event">Event / Fest</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Priority */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#718096]">Priority Level</label>
                      <select
                        value={evt.priority || 'Normal'}
                        onChange={(e) => handleUpdateEvent(evt.id, 'priority', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#F7F7F2] border border-[#E5E9E5] text-[#263238] text-xs font-medium focus:border-[#267F73] focus:bg-white focus:outline-none"
                      >
                        <option value="Urgent">Urgent</option>
                        <option value="Important">Important</option>
                        <option value="Normal">Normal</option>
                      </select>
                    </div>

                    {/* Event Date */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#718096]">Event Date *</label>
                      <input
                        type="date"
                        value={evt.date || ''}
                        onChange={(e) => handleUpdateEvent(evt.id, 'date', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#F7F7F2] border border-[#E5E9E5] text-[#263238] text-xs font-medium focus:border-[#267F73] focus:bg-white focus:outline-none"
                      />
                    </div>

                    {/* Time */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#718096]">Time (Optional)</label>
                      <input
                        type="time"
                        value={evt.time || ''}
                        onChange={(e) => handleUpdateEvent(evt.id, 'time', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#F7F7F2] border border-[#E5E9E5] text-[#263238] text-xs font-medium focus:border-[#267F73] focus:bg-white focus:outline-none"
                      />
                    </div>

                    {/* Cutoff Deadline */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#718096]">Submission Cutoff</label>
                      <input
                        type="date"
                        value={evt.deadline || ''}
                        onChange={(e) => handleUpdateEvent(evt.id, 'deadline', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#F7F7F2] border border-[#E5E9E5] text-[#263238] text-xs font-medium focus:border-[#267F73] focus:bg-white focus:outline-none"
                      />
                    </div>

                    {/* Venue */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#718096]">Venue / Location</label>
                      <input
                        type="text"
                        value={evt.venue || ''}
                        onChange={(e) => handleUpdateEvent(evt.id, 'venue', e.target.value)}
                        placeholder="e.g. Exam Hall 302"
                        className="w-full px-3 py-2 rounded-lg bg-[#F7F7F2] border border-[#E5E9E5] text-[#263238] text-xs font-medium focus:border-[#267F73] focus:bg-white focus:outline-none"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-3 space-y-1">
                      <label className="text-[11px] font-semibold text-[#718096]">Description / Instructions</label>
                      <input
                        type="text"
                        value={evt.description || ''}
                        onChange={(e) => handleUpdateEvent(evt.id, 'description', e.target.value)}
                        placeholder="Instructions, syllabus, or fee details"
                        className="w-full px-3 py-2 rounded-lg bg-[#F7F7F2] border border-[#E5E9E5] text-[#263238] text-xs font-normal focus:border-[#267F73] focus:bg-white focus:outline-none"
                      />
                    </div>

                    {/* Reminder Days */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#718096]">Reminders</label>
                      <div className="flex items-center gap-1.5 pt-1">
                        {[7, 3, 1].map((day) => {
                          const isChecked = (evt.reminder_days || []).includes(day)
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => handleToggleReminderDay(evt.id, day)}
                              className={`px-2 py-1 text-[10px] font-bold rounded ${
                                isChecked
                                  ? 'bg-[#DDEAE4] text-[#1E6B61] border border-[#b8d3c7]'
                                  : 'bg-[#F0F2ED] text-[#718096] border border-[#E5E9E5]'
                              }`}
                            >
                              {day}d
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Source Excerpt */}
                  {evt.source_text && (
                    <div className="pt-2 border-t border-[#E5E9E5] text-[11px] text-[#718096] italic flex items-start gap-1.5 font-['Inter']">
                      <span className="text-[#267F73] font-semibold not-italic">Excerpt:</span>
                      <span>"{evt.source_text}"</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Confirmation Action Footer */}
      <div className="sticky bottom-4 z-20 rounded-xl border border-[#E5E9E5] bg-[#FFFFFF] p-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-[#718096] flex items-center gap-2">
          <Info className="w-4 h-4 text-[#267F73]" />
          <span>
            Ready to confirm <strong>{eventsList.length}</strong> event(s) to your calendar.
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onReject}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold text-[#718096] hover:text-[#D66C65] hover:bg-[#FDF0EF] border border-[#E5E9E5] transition-colors"
          >
            Discard
          </button>
          <button
            onClick={handleConfirmAll}
            disabled={eventsList.length === 0}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#267F73] hover:bg-[#1E6B61] shadow-xs transition-colors disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Add to Calendar</span>
          </button>
        </div>
      </div>
    </div>
  )
}
