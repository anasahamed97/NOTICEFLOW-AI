import React, { useState } from 'react'
import {
  Settings,
  Key,
  RotateCcw,
  Languages,
  CheckCircle2,
  ExternalLink,
  Cpu,
  X
} from 'lucide-react'

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetData
}) {
  if (!isOpen) return null

  const [apiKeyInput, setApiKeyInput] = useState(settings.customApiKey || '')
  const [demoMode, setDemoMode] = useState(!!settings.demoMode)
  const [languagePref, setLanguagePref] = useState(settings.languagePreference || 'all')
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = () => {
    onSaveSettings({
      ...settings,
      customApiKey: apiKeyInput.trim(),
      demoMode,
      languagePreference: languagePref
    })
    setSaveSuccess(true)
    setTimeout(() => {
      setSaveSuccess(false)
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="rounded-xl border border-[#E5E9E5] bg-[#FFFFFF] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E9E5] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#DDEAE4] border border-[#b8d3c7] flex items-center justify-center text-[#267F73]">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#263238] font-['Plus_Jakarta_Sans']">Application Settings</h3>
              <p className="text-xs text-[#718096] font-['Inter']">NoticeFlow AI Configuration & API Access</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#718096] hover:text-[#263238] p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gemini API Key Section */}
        <div className="space-y-2 rounded-xl border border-[#E5E9E5] bg-[#F7F7F2] p-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#263238] flex items-center gap-1.5 font-['Plus_Jakarta_Sans']">
              <Key className="w-4 h-4 text-[#267F73]" />
              <span>Google Gemini API Key</span>
            </label>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#267F73] hover:underline flex items-center gap-1"
            >
              <span>Get API Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="text-[11px] text-[#718096] leading-relaxed font-['Inter']">
            By default, NoticeFlow AI reads <code className="text-[#1E6B61] bg-[#DDEAE4] px-1 py-0.5 rounded font-mono text-[10px]">GEMINI_API_KEY</code> from the server environment. You can also provide an optional session key here for live browser testing.
          </p>

          <input
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="AIzaSy... (Leave empty to use server environment variable)"
            className="w-full px-3 py-2 rounded-lg bg-white border border-[#E5E9E5] text-xs text-[#263238] placeholder-[#718096] focus:border-[#267F73] focus:outline-none font-mono"
          />
        </div>

        {/* Demo Mode Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-[#E5E9E5] bg-[#F7F7F2]">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-[#263238] flex items-center gap-1.5 font-['Plus_Jakarta_Sans']">
              <Cpu className="w-4 h-4 text-[#D9A441]" />
              <span>Demo Mode (Sample Notices)</span>
            </span>
            <p className="text-[11px] text-[#718096] max-w-xs font-['Inter']">
              Use verified responses for sample notices without querying the live Gemini API.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={demoMode}
              onChange={(e) => setDemoMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#CBD5E1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#267F73]"></div>
          </label>
        </div>

        {/* Language Preferences */}
        <div className="space-y-2 p-4 rounded-xl border border-[#E5E9E5] bg-[#F7F7F2]">
          <label className="text-xs font-bold text-[#263238] flex items-center gap-1.5 font-['Plus_Jakarta_Sans']">
            <Languages className="w-4 h-4 text-[#267F73]" />
            <span>Multilingual Summaries</span>
          </label>
          <p className="text-[11px] text-[#718096] font-['Inter']">
            Generate translated summaries alongside English:
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <button
              type="button"
              onClick={() => setLanguagePref('all')}
              className={`p-2 rounded-lg border text-left transition-all ${
                languagePref === 'all'
                  ? 'border-[#267F73] bg-[#DDEAE4] text-[#1E6B61]'
                  : 'border-[#E5E9E5] bg-white text-[#718096]'
              }`}
            >
              <div className="font-semibold text-[#263238]">All Languages</div>
              <div className="text-[10px] text-[#718096]">English + ಕನ್ನಡ + हिंदी</div>
            </button>
            <button
              type="button"
              onClick={() => setLanguagePref('en')}
              className={`p-2 rounded-lg border text-left transition-all ${
                languagePref === 'en'
                  ? 'border-[#267F73] bg-[#DDEAE4] text-[#1E6B61]'
                  : 'border-[#E5E9E5] bg-white text-[#718096]'
              }`}
            >
              <div className="font-semibold text-[#263238]">English Only</div>
              <div className="text-[10px] text-[#718096]">Concise 2-sentence synopsis</div>
            </button>
          </div>
        </div>

        {/* Reset / Clear Data */}
        <div className="pt-2 border-t border-[#E5E9E5] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-[#B54D47]">Reset Local Data</span>
            <p className="text-[11px] text-[#718096]">Restores initial sample events</p>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset all notices and events to initial state?')) {
                onResetData()
                onClose()
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#B54D47] hover:bg-[#FDF0EF] border border-[#F7CDCA] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-[#E5E9E5] flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#718096] hover:text-[#263238]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#267F73] hover:bg-[#1E6B61] shadow-xs transition-colors"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
