import React from 'react'
import { ArrowRight, X, Sparkles, Building } from 'lucide-react'
import { SAMPLE_NOTICES } from '../data/sampleNotices'

export default function SampleNoticesModal({
  isOpen,
  onClose,
  onSelectSample
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="rounded-xl border border-[#E5E9E5] bg-[#FFFFFF] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E5E9E5] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#DDEAE4] border border-[#b8d3c7] flex items-center justify-center text-[#267F73]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#263238] font-['Plus_Jakarta_Sans']">Select a Sample Notice</h3>
              <p className="text-xs text-[#718096] font-['Inter']">Test AI parsing instantly with realistic university circulars</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#718096] hover:text-[#263238] p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {SAMPLE_NOTICES.map((sample) => (
            <div
              key={sample.id}
              onClick={() => {
                onSelectSample(sample)
                onClose()
              }}
              className="group p-4 rounded-xl border border-[#E5E9E5] bg-[#FFFFFF] hover:border-[#267F73] hover:shadow-xs cursor-pointer transition-all duration-150 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#DDEAE4] text-[#1E6B61]">
                  {sample.badge}
                </span>

                <span className="text-xs font-semibold text-[#267F73] group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-['Inter']">
                  <span>Extract Notice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#263238] group-hover:text-[#267F73] transition-colors font-['Plus_Jakarta_Sans']">
                {sample.title}
              </h4>

              <p className="text-xs text-[#718096] leading-relaxed font-['Inter']">
                {sample.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#E5E9E5] text-[11px] text-[#718096]">
                <span className="flex items-center gap-1">
                  <Building className="w-3 h-3 text-[#718096]" />
                  <span className="truncate max-w-[280px]">{sample.college}</span>
                </span>
                <span className="font-semibold text-[#267F73]">
                  {sample.goldenResult.events.length} Events Detected
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
