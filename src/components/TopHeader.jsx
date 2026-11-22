import React from 'react'
import {
  Menu,
  Upload,
  FileText,
  Settings,
  Bell,
  Sparkles,
  Calendar,
  Clock,
  History
} from 'lucide-react'

export default function TopHeader({
  activeTab,
  onOpenMobileMenu,
  onOpenSettings,
  onSelectSample,
  onUploadClick,
  urgentCount = 0
}) {
  const titles = {
    dashboard: { title: 'Dashboard', subtitle: 'Overview of circulars, deadlines, and events' },
    upload: { title: 'Upload Notice', subtitle: 'AI document ingestion and multimodal extraction' },
    review: { title: 'Review Extracted Events', subtitle: 'Confirm and adjust detected dates and deadlines' },
    calendar: { title: 'Academic Calendar', subtitle: 'Schedule of examinations, submissions, and events' },
    reminders: { title: 'Smart Reminders', subtitle: 'Upcoming deadlines, overdue tasks, and 24h alerts' },
    history: { title: 'Notice History', subtitle: 'Archive of processed college circulars' }
  }

  const current = titles[activeTab] || titles.dashboard

  return (
    <header className="sticky top-0 z-20 bg-[#F7F7F2]/90 backdrop-blur-md border-b border-[#E5E9E5] px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-[#263238] hover:bg-[#F0F2ED] border border-[#E5E9E5]"
            title="Open Menu"
          >
            <Menu className="w-5 h-5 text-[#263238]" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#263238] tracking-tight font-['Plus_Jakarta_Sans']">
              {current.title}
            </h1>
            <p className="text-xs text-[#718096] hidden sm:block font-['Inter']">
              {current.subtitle}
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onSelectSample}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#263238] bg-[#FFFFFF] hover:bg-[#F0F2ED] border border-[#E5E9E5] shadow-xs transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-[#267F73]" />
            <span>Sample Notices</span>
          </button>

          <button
            onClick={onUploadClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#267F73] hover:bg-[#1E6B61] text-white shadow-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload Notice</span>
            <span className="sm:hidden">Upload</span>
          </button>

          <button
            onClick={onOpenSettings}
            title="Settings"
            className="p-1.5 rounded-lg text-[#718096] hover:text-[#263238] hover:bg-[#F0F2ED] border border-[#E5E9E5] transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
