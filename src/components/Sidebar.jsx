import React, { useState } from 'react'
import {
  Sparkles,
  Upload,
  Calendar,
  Clock,
  History,
  Settings,
  Menu,
  X,
  FileText,
  CheckCircle2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react'

export default function Sidebar({
  activeTab,
  setActiveTab,
  onOpenSettings,
  urgentCount = 0,
  isDemoMode = false,
  mobileOpen,
  setMobileOpen
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
    { id: 'upload', label: 'Upload Notice', icon: Upload },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'reminders', label: 'Reminders', icon: Clock, badge: urgentCount > 0 ? urgentCount : null },
    { id: 'history', label: 'History', icon: History }
  ]

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#192B3A] text-slate-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#22374a]">
        <button
          onClick={() => {
            setActiveTab('dashboard')
            if (setMobileOpen) setMobileOpen(false)
          }}
          className="flex items-center gap-3 w-full text-left focus:outline-none group"
        >
          <div className="w-9 h-9 rounded-lg bg-[#267F73] flex items-center justify-center text-white shadow-sm flex-shrink-0 group-hover:bg-[#1E6B61] transition-colors">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white font-['Plus_Jakarta_Sans']">
                NoticeFlow <span className="text-[#DDEAE4]">AI</span>
              </span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[#22374a] text-[#DDEAE4] tracking-wider border border-[#2b445a]">
                MVP
              </span>
            </div>
            <p className="text-[11px] text-[#718096] truncate mt-0.5 font-['Inter']">
              From Notice to Action
            </p>
          </div>
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#718096] font-['Plus_Jakarta_Sans']">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                if (setMobileOpen) setMobileOpen(false)
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#267F73] text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-[#22374a]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#718096]'}`} />
                <span className="font-['Inter']">{item.label}</span>
              </div>

              {item.badge && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#D66C65] text-white">
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}

        {/* Quick CTA inside navigation */}
        <div className="pt-4 px-1">
          <button
            onClick={() => {
              setActiveTab('upload')
              if (setMobileOpen) setMobileOpen(false)
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-[#267F73] hover:bg-[#1E6B61] text-white shadow-sm transition-all duration-150"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Process New Notice</span>
          </button>
        </div>
      </div>

      {/* Bottom Status & Settings */}
      <div className="p-3 border-t border-[#22374a] space-y-2 bg-[#142330]">
        {/* Gemini AI Status Card */}
        <div className="px-3 py-2 rounded-lg bg-[#192B3A] border border-[#22374a] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                isDemoMode ? 'bg-[#D9A441]' : 'bg-[#38866B]'
              }`}
            />
            <span className="text-[11px] text-[#718096] truncate">Gemini AI</span>
          </div>
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
              isDemoMode
                ? 'bg-[#D9A441]/20 text-[#D9A441]'
                : 'bg-[#38866B]/20 text-[#DDEAE4]'
            }`}
          >
            {isDemoMode ? 'Demo' : 'Online'}
          </span>
        </div>

        {/* Settings Button */}
        <button
          onClick={() => {
            onOpenSettings()
            if (setMobileOpen) setMobileOpen(false)
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-[#22374a] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-[#718096]" />
            <span>Settings & API</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#718096]" />
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-30 shadow-md">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#192B3A] shadow-xl">
            <div className="absolute top-2 right-2 z-10">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#22374a]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
