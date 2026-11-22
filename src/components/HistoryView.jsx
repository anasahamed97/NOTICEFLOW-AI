import React, { useState } from 'react'
import {
  History,
  FileText,
  Calendar,
  Trash2,
  Search,
  CheckCircle2,
  Eye,
  Languages,
  X
} from 'lucide-react'

export default function HistoryView({
  notices = [],
  events = [],
  onDeleteNotice,
  onNavigate
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNoticeForModal, setSelectedNoticeForModal] = useState(null)

  const filteredNotices = notices.filter((notice) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      (notice.filename || '').toLowerCase().includes(q) ||
      (notice.summary || '').toLowerCase().includes(q) ||
      (notice.kannada_summary || '').toLowerCase().includes(q) ||
      (notice.hindi_summary || '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#263238] tracking-tight flex items-center gap-2 font-['Plus_Jakarta_Sans']">
            <History className="w-5 h-5 text-[#267F73]" />
            <span>Notice Ingestion Archive</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#718096] font-['Inter']">
            History of circulars parsed, extraction timestamps, and generated calendar entries.
          </p>
        </div>

        <button
          onClick={() => onNavigate('upload')}
          className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#267F73] hover:bg-[#1E6B61] text-white self-start sm:self-auto shadow-xs transition-colors"
        >
          Upload New Notice
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#718096] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by filename or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#E5E9E5] text-xs text-[#263238] placeholder-[#718096] focus:border-[#267F73] focus:outline-none"
        />
      </div>

      {/* Notices List */}
      {filteredNotices.length === 0 ? (
        <div className="p-12 rounded-xl border border-[#E5E9E5] bg-[#FFFFFF] text-center space-y-3 shadow-xs">
          <FileText className="w-8 h-8 text-[#718096] mx-auto opacity-50" />
          <h4 className="text-sm font-semibold text-[#263238] font-['Plus_Jakarta_Sans']">No notices in history</h4>
          <p className="text-xs text-[#718096] max-w-sm mx-auto font-['Inter']">
            Uploaded notices and extracted summaries will be cataloged here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotices.map((notice) => {
            const noticeEvents = events.filter((e) => e.noticeId === notice.id)

            return (
              <div
                key={notice.id}
                className="bg-[#FFFFFF] border border-[#E5E9E5] hover:border-[#DDEAE4] rounded-xl p-5 space-y-4 shadow-xs transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[#DDEAE4] border border-[#b8d3c7] flex items-center justify-center text-[#267F73] flex-shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#DDEAE4] text-[#1E6B61]">
                          {notice.status === 'confirmed' ? 'Confirmed' : 'Processed'}
                        </span>
                        <span className="text-[11px] text-[#718096]">
                          {new Date(notice.uploadedAt).toLocaleString()}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-[#263238] truncate max-w-lg font-['Plus_Jakarta_Sans']">
                        {notice.filename}
                      </h4>

                      {notice.summary && (
                        <p className="text-xs text-[#718096] leading-relaxed pt-1 font-['Inter']">
                          {notice.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-start">
                    <button
                      onClick={() => setSelectedNoticeForModal(notice)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F0F2ED] hover:bg-[#E5E9E5] text-[#263238] border border-[#E5E9E5] transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#267F73]" />
                      <span>Details</span>
                    </button>

                    <button
                      onClick={() => onDeleteNotice(notice.id)}
                      title="Delete notice and linked events"
                      className="p-1.5 rounded-lg text-[#718096] hover:text-[#D66C65] hover:bg-[#FDF0EF] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Multilingual summaries */}
                {(notice.kannada_summary || notice.hindi_summary) && (
                  <div className="pt-3 border-t border-[#E5E9E5] grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {notice.kannada_summary && (
                      <div className="p-2.5 rounded-lg bg-[#F0F2ED] border border-[#E5E9E5] space-y-1">
                        <span className="text-[10px] font-semibold text-[#1E6B61]">ಕನ್ನಡ ಸಾರಾಂಶ (Kannada):</span>
                        <p className="text-[#263238] font-sans leading-relaxed text-[11px]">
                          {notice.kannada_summary}
                        </p>
                      </div>
                    )}
                    {notice.hindi_summary && (
                      <div className="p-2.5 rounded-lg bg-[#F0F2ED] border border-[#E5E9E5] space-y-1">
                        <span className="text-[10px] font-semibold text-[#1E6B61]">हिंदी सारांश (Hindi):</span>
                        <p className="text-[#263238] font-sans leading-relaxed text-[11px]">
                          {notice.hindi_summary}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between text-xs text-[#718096]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#267F73]" />
                    <span>{noticeEvents.length} calendar event(s) generated</span>
                  </span>
                  <button
                    onClick={() => onNavigate('calendar')}
                    className="text-[#267F73] hover:underline text-[11px] font-semibold"
                  >
                    View in Calendar →
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Notice Details Modal */}
      {selectedNoticeForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="rounded-xl border border-[#E5E9E5] bg-[#FFFFFF] w-full max-w-xl max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#E5E9E5] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E6B61] bg-[#DDEAE4] px-2 py-0.5 rounded">
                  Notice Details
                </span>
                <h3 className="text-base font-bold text-[#263238] mt-2 font-['Plus_Jakarta_Sans']">
                  {selectedNoticeForModal.filename}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNoticeForModal(null)}
                className="text-[#718096] hover:text-[#263238] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-semibold text-[#718096]">Summary (English):</h4>
                <p className="text-[#263238] mt-1 leading-relaxed bg-[#F0F2ED] p-3 rounded-lg border border-[#E5E9E5] font-['Inter']">
                  {selectedNoticeForModal.summary || 'No summary recorded.'}
                </p>
              </div>

              {selectedNoticeForModal.kannada_summary && (
                <div>
                  <h4 className="font-semibold text-[#1E6B61]">ಕನ್ನಡ ಸಾರಾಂಶ (Kannada):</h4>
                  <p className="text-[#263238] mt-1 leading-relaxed bg-[#F0F2ED] p-3 rounded-lg border border-[#E5E9E5]">
                    {selectedNoticeForModal.kannada_summary}
                  </p>
                </div>
              )}

              {selectedNoticeForModal.hindi_summary && (
                <div>
                  <h4 className="font-semibold text-[#1E6B61]">हिंदी सारांश (Hindi):</h4>
                  <p className="text-[#263238] mt-1 leading-relaxed bg-[#F0F2ED] p-3 rounded-lg border border-[#E5E9E5]">
                    {selectedNoticeForModal.hindi_summary}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#E5E9E5] flex justify-end">
              <button
                onClick={() => setSelectedNoticeForModal(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#F0F2ED] hover:bg-[#E5E9E5] text-[#263238]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
