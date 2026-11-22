import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TopHeader from './components/TopHeader'
import DashboardView from './components/DashboardView'
import UploadView from './components/UploadView'
import EventReviewView from './components/EventReviewView'
import CalendarView from './components/CalendarView'
import RemindersView from './components/RemindersView'
import HistoryView from './components/HistoryView'
import SettingsModal from './components/SettingsModal'
import SampleNoticesModal from './components/SampleNoticesModal'

import {
  getStoredNotices,
  saveStoredNotices,
  getStoredEvents,
  saveStoredEvents,
  getStoredSettings,
  saveStoredSettings,
  getStoredActivities,
  logActivity,
  INITIAL_NOTICES,
  INITIAL_EVENTS,
  syncFromSupabase,
  syncNoticeToSupabase,
  syncEventsToSupabase,
  deleteNoticeFromSupabase,
  deleteEventFromSupabase
} from './utils/storage'
import { isSupabaseConfigured } from './utils/supabaseClient'
import { getDeadlineBadge } from './utils/dateUtils'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [notices, setNotices] = useState(getStoredNotices)
  const [events, setEvents] = useState(getStoredEvents)
  const [settings, setSettings] = useState(getStoredSettings)
  const [activities, setActivities] = useState(getStoredActivities)

  // Current active extraction being reviewed
  const [currentExtraction, setCurrentExtraction] = useState(null)

  // Modals & Mobile Drawer
  const [mobileOpen, setMobileOpen] = useState(false)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [sampleModalOpen, setSampleModalOpen] = useState(false)

  // Sync state to storage
  useEffect(() => {
    saveStoredNotices(notices)
  }, [notices])

  useEffect(() => {
    saveStoredEvents(events)
  }, [events])

  useEffect(() => {
    saveStoredSettings(settings)
  }, [settings])

  // Sync from Supabase on mount if configured
  useEffect(() => {
    if (isSupabaseConfigured()) {
      syncFromSupabase().then((res) => {
        if (res && res.success) {
          setNotices(getStoredNotices())
          setEvents(getStoredEvents())
          setActivities(getStoredActivities())
        }
      })
    }
  }, [])

  // Count urgent deadlines
  const urgentCount = events.filter((e) => {
    const badge = getDeadlineBadge(e.deadline || e.date, e.time)
    return e.priority === 'Urgent' || badge.isUrgent || badge.isToday || badge.isTomorrow
  }).length

  // Callback when AI extracts notice
  const handleExtractionComplete = (extractionData) => {
    setCurrentExtraction(extractionData)
    setActiveTab('review')
    const updatedActs = logActivity('notice_upload', `Analyzed ${extractionData.filename} with AI`)
    setActivities(updatedActs)
  }

  // Callback when user confirms events from review
  const handleConfirmEvents = ({
    noticeTitle,
    summary,
    kannada_summary,
    hindi_summary,
    filename,
    thumbnail,
    confirmedEvents
  }) => {
    const newNoticeId = `notice-${Date.now()}`

    const newNotice = {
      id: newNoticeId,
      filename: filename || noticeTitle,
      uploadedAt: new Date().toISOString(),
      thumbnail: thumbnail || null,
      eventsCount: confirmedEvents.length,
      summary: summary || '',
      kannada_summary: kannada_summary || null,
      hindi_summary: hindi_summary || null,
      status: 'confirmed'
    }

    const stampedEvents = confirmedEvents.map((evt, idx) => ({
      ...evt,
      id: evt.id || `evt-${Date.now()}-${idx}`,
      noticeId: newNoticeId,
      createdAt: new Date().toISOString()
    }))

    setNotices((prev) => [newNotice, ...prev])
    setEvents((prev) => [...stampedEvents, ...prev])

    const updatedActs = logActivity(
      'event_confirmed',
      `Confirmed ${stampedEvents.length} event(s) from ${filename || noticeTitle}`
    )
    setActivities(updatedActs)

    // Sync to Supabase cloud in background
    syncNoticeToSupabase(newNotice).catch(() => {})
    syncEventsToSupabase(stampedEvents).catch(() => {})

    setCurrentExtraction(null)
    setActiveTab('calendar')
  }

  // Delete event
  const handleDeleteEvent = (eventId) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId))
    const updatedActs = logActivity('event_deleted', 'Removed calendar event')
    setActivities(updatedActs)
    deleteEventFromSupabase(eventId).catch(() => {})
  }

  // Delete notice and associated events
  const handleDeleteNotice = (noticeId) => {
    setNotices((prev) => prev.filter((n) => n.id !== noticeId))
    setEvents((prev) => prev.filter((e) => e.noticeId !== noticeId))
    const updatedActs = logActivity('notice_deleted', 'Deleted notice and linked calendar events')
    setActivities(updatedActs)
    deleteNoticeFromSupabase(noticeId).catch(() => {})
  }

  // Reset to clean empty state
  const handleResetData = () => {
    setNotices([])
    setEvents([])
    setActivities([])
    localStorage.removeItem('noticeflow_notices_v1')
    localStorage.removeItem('noticeflow_events_v1')
    localStorage.removeItem('noticeflow_activity_v1')
    localStorage.removeItem('noticeflow_completed_tasks_v1')
  }

  // Sample Notice selected from modal or dashboard
  const handleSelectSample = (sample) => {
    handleExtractionComplete({
      rawResult: sample.goldenResult,
      modelUsed: 'gemini-2.5-flash (Demo Mode)',
      filename: `${sample.title.slice(0, 30).replace(/\s+/g, '_')}.pdf`,
      thumbnail: null,
      extractedText: sample.rawText,
      isSample: true
    })
  }

  return (
    <div className="min-h-screen bg-[#F7F7F2] text-[#263238] flex flex-col font-['Inter'] antialiased selection:bg-[#DDEAE4] selection:text-[#1E6B61]">
      {/* Midnight Navy Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setSettingsModalOpen(true)}
        urgentCount={urgentCount}
        isDemoMode={settings.demoMode}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area (Offset by sidebar width on desktop) */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Top Header Bar */}
        <TopHeader
          activeTab={activeTab}
          onOpenMobileMenu={() => setMobileOpen(true)}
          onOpenSettings={() => setSettingsModalOpen(true)}
          onSelectSample={() => setSampleModalOpen(true)}
          onUploadClick={() => setActiveTab('upload')}
          urgentCount={urgentCount}
        />

        {/* View Content */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'dashboard' && (
            <DashboardView
              notices={notices}
              events={events}
              activities={activities}
              onNavigate={setActiveTab}
              onSelectSample={() => setSampleModalOpen(true)}
            />
          )}

          {activeTab === 'upload' && (
            <UploadView
              onExtractionComplete={handleExtractionComplete}
              customApiKey={settings.customApiKey}
              isDemoMode={settings.demoMode}
              onOpenSettings={() => setSettingsModalOpen(true)}
            />
          )}

          {activeTab === 'review' && currentExtraction && (
            <EventReviewView
              extractionData={currentExtraction}
              existingEvents={events}
              onConfirmEvents={handleConfirmEvents}
              onReject={() => {
                setCurrentExtraction(null)
                setActiveTab('upload')
              }}
              onBackToUpload={() => {
                setCurrentExtraction(null)
                setActiveTab('upload')
              }}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              events={events}
              onDeleteEvent={handleDeleteEvent}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'reminders' && (
            <RemindersView events={events} />
          )}

          {activeTab === 'history' && (
            <HistoryView
              notices={notices}
              events={events}
              onDeleteNotice={handleDeleteNotice}
              onNavigate={setActiveTab}
            />
          )}
        </main>

        {/* Minimal Footer */}
        <footer className="border-t border-[#E5E9E5] bg-[#F0F2ED] py-4 text-xs text-[#718096]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#263238] font-['Plus_Jakarta_Sans']">NoticeFlow AI</span>
              <span>•</span>
              <span>From Notice to Action in Seconds</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Powered by Google Gemini 2.5 Flash</span>
              <span>•</span>
              <button
                onClick={() => setSettingsModalOpen(true)}
                className="text-[#267F73] hover:underline"
              >
                Settings
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        onResetData={handleResetData}
      />

      <SampleNoticesModal
        isOpen={sampleModalOpen}
        onClose={() => setSampleModalOpen(false)}
        onSelectSample={handleSelectSample}
      />
    </div>
  )
}
