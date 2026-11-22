import React, { useState } from 'react'
import {
  Calendar,
  Sparkles,
  Upload,
  Clock,
  History,
  Settings,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  FileText
} from 'lucide-react'

export default function Navbar({ activeTab, setActiveTab, onOpenSettings, urgentCount = 0, isDemoMode = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
    { id: 'upload', label: 'Upload Notice', icon: Upload, highlight: true },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'reminders', label: 'Reminders', icon: Clock, badge: urgentCount > 0 ? urgentCount : null },
    { id: 'history', label: 'History', icon: History }
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0f19]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-3 group text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
                <div className="w-full h-full bg-[#0d1322] rounded-[11px] flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    NoticeFlow <span className="text-cyan-400">AI</span>
                  </span>
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-300 tracking-wider">
                    MVP
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block tracking-wide">
                  From Notice to Action in Seconds
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500/90 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Demo / AI status pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300">
              <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'}`} />
              <span className="text-slate-400">Gemini AI:</span>
              <span className={isDemoMode ? 'text-amber-400' : 'text-emerald-400'}>
                {isDemoMode ? 'Demo Mode' : 'Connected'}
              </span>
            </div>

            {/* Quick Upload Button */}
            <button
              onClick={() => setActiveTab('upload')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-600/20 hover:shadow-cyan-500/30 transition-all duration-200 active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload Notice</span>
              <span className="sm:hidden">Upload</span>
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              title="Settings & API Key"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/80 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/80"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-800/80 space-y-1 bg-[#0b0f19]">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </header>
  )
}
