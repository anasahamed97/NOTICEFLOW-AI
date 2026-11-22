import React, { useState, useRef } from 'react'
import {
  Upload,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  Eye,
  Trash2,
  Languages,
  FileCheck
} from 'lucide-react'
import { SAMPLE_NOTICES } from '../data/sampleNotices'

export default function UploadView({
  onExtractionComplete,
  customApiKey = '',
  isDemoMode = false,
  onOpenSettings
}) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStage, setProcessingStage] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0])
    }
  }

  const processSelectedFile = async (file) => {
    setErrorMessage(null)
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Unsupported file format. Please upload a PDF, PNG, or JPG/JPEG notice.')
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('File size exceeds 15MB limit. Please upload a smaller document.')
      return
    }

    setSelectedFile(file)

    if (file.type === 'application/pdf') {
      try {
        setProcessingStage('Parsing PDF and extracting text...')
        const { extractFromPdf } = await import('../utils/pdfExtractor')
        const { text, thumbnailBase64 } = await extractFromPdf(file)
        setExtractedText(text)
        if (thumbnailBase64) {
          setFilePreview(thumbnailBase64)
        } else {
          setFilePreview('/pdf-icon-preview.png')
        }
      } catch (err) {
        console.warn('PDF.js client parse warning:', err)
        setExtractedText('')
      }
    } else {
      const reader = new FileReader()
      reader.onload = () => {
        setFilePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClearFile = () => {
    setSelectedFile(null)
    setFilePreview(null)
    setExtractedText('')
    setErrorMessage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleExtractNotice = async () => {
    if (!selectedFile) return
    setIsProcessing(true)
    setErrorMessage(null)

    try {
      setProcessingStage('Reading document content...')
      let imageBase64 = null
      let textToSend = extractedText

      if (selectedFile.type.startsWith('image/')) {
        imageBase64 = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.readAsDataURL(selectedFile)
        })
      } else if (filePreview && filePreview.startsWith('data:image')) {
        imageBase64 = filePreview
      }

      setProcessingStage('Gemini AI analyzing dates, deadlines & venues...')

      const headers = { 'Content-Type': 'application/json' }
      if (customApiKey) {
        headers['x-gemini-api-key'] = customApiKey
      }

      const response = await fetch('/api/extract', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          text: textToSend,
          imageBase64: imageBase64,
          mimeType: selectedFile.type || 'image/png',
          languageOption: selectedLanguage
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.needsKey) {
          setErrorMessage(
            'Google Gemini API key is not configured on the server. You can enter your API key in Settings, or try one of the instant Sample Notices below.'
          )
          setIsProcessing(false)
          return
        }
        throw new Error(data.error || 'Failed to extract notice data from AI')
      }

      setProcessingStage('Formatting events and validating timeline...')

      setTimeout(() => {
        setIsProcessing(false)
        onExtractionComplete({
          rawResult: data.data,
          modelUsed: data.modelUsed,
          filename: selectedFile.name,
          thumbnail: filePreview,
          extractedText: textToSend,
          isSample: false
        })
      }, 500)

    } catch (err) {
      console.error('Notice extraction error:', err)
      setErrorMessage(err.message || 'An unexpected error occurred while processing the notice.')
      setIsProcessing(false)
    }
  }

  const handleLoadSample = (sample) => {
    setSelectedFile({
      name: `${sample.id}.pdf`,
      size: 245000,
      type: 'application/pdf'
    })
    setExtractedText(sample.rawText)
    setFilePreview(null)
    setIsProcessing(true)
    setProcessingStage('Simulating high-precision Gemini extraction...')

    setTimeout(() => {
      setIsProcessing(false)
      onExtractionComplete({
        rawResult: sample.goldenResult,
        modelUsed: 'gemini-2.5-flash (Demo Mode)',
        filename: `${sample.title.slice(0, 32).replace(/\s+/g, '_')}.pdf`,
        thumbnail: null,
        extractedText: sample.rawText,
        isSample: true
      })
    }, 600)
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#DDEAE4] text-[#1E6B61] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multimodal Document Ingestion</span>
        </div>
        <h2 className="text-2xl font-bold text-[#263238] tracking-tight font-['Plus_Jakarta_Sans']">
          Upload College Notice or Circular
        </h2>
        <p className="text-sm text-[#718096] max-w-lg mx-auto font-['Inter']">
          Upload PDF circulars, hall ticket notices, exam schedules, or WhatsApp screenshots.
          Our AI extracts all actionable dates, deadlines, and venues.
        </p>
      </div>

      {/* Main Upload Area */}
      <div className="bg-[#FFFFFF] border border-[#E5E9E5] rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
        {!selectedFile ? (
          // Dropzone
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center gap-3.5 ${
              dragActive
                ? 'border-[#267F73] bg-[#DDEAE4]/30'
                : 'border-[#E5E9E5] hover:border-[#267F73] hover:bg-[#F0F2ED]/60 bg-[#F7F7F2]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-14 h-14 rounded-xl bg-[#DDEAE4] border border-[#b8d3c7] flex items-center justify-center text-[#267F73]">
              <Upload className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <p className="text-sm sm:text-base font-semibold text-[#263238] font-['Plus_Jakarta_Sans']">
                Drag & drop your notice file here, or <span className="text-[#267F73] underline">browse files</span>
              </p>
              <p className="text-xs text-[#718096] font-['Inter']">
                Supports PDF, PNG, JPG, JPEG (Max 15MB)
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#718096] pt-1">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#267F73]" /> Digital & Scanned PDFs
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#267F73]" /> Screenshots & Photos
              </span>
            </div>
          </div>
        ) : (
          // Selected File Preview & Controls
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#F0F2ED] border border-[#E5E9E5]">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#DDEAE4] border border-[#b8d3c7] flex items-center justify-center text-[#267F73] flex-shrink-0">
                  {selectedFile.type === 'application/pdf' ? (
                    <FileText className="w-5 h-5" />
                  ) : (
                    <ImageIcon className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-[#263238] truncate max-w-sm sm:max-w-md font-['Plus_Jakarta_Sans']">
                    {selectedFile.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-[#718096] mt-0.5">
                    <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
                    <span>•</span>
                    <span className="text-[#38866B] flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Ready for AI Extraction
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleClearFile}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#718096] hover:text-[#D66C65] hover:bg-[#FDF0EF] rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove</span>
              </button>
            </div>

            {/* Document First Page Preview */}
            {filePreview && filePreview.startsWith('data:image') && (
              <div className="rounded-xl border border-[#E5E9E5] bg-[#F7F7F2] p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#718096]">
                  <span className="flex items-center gap-1.5 font-medium text-[#263238]">
                    <Eye className="w-3.5 h-3.5 text-[#267F73]" /> Document Preview (First Page)
                  </span>
                  <span className="text-[11px]">Vision AI Input</span>
                </div>
                <div className="max-h-56 overflow-hidden rounded-lg border border-[#E5E9E5] bg-white flex justify-center p-2">
                  <img
                    src={filePreview}
                    alt="Notice preview"
                    className="max-h-52 object-contain rounded"
                  />
                </div>
              </div>
            )}

            {/* Multilingual Summary Notice */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F0F2ED] border border-[#E5E9E5] text-xs">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-[#267F73]" />
                <div>
                  <span className="font-semibold text-[#263238]">Multilingual Summaries</span>
                  <p className="text-[11px] text-[#718096]">Generates summaries in English, Kannada, and Hindi</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-[#DDEAE4] text-[#1E6B61] font-semibold border border-[#b8d3c7]">
                English + ಕನ್ನಡ + हिंदी
              </span>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-[#FDF0EF] border border-[#F7CDCA] text-[#B54D47] text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#D66C65] flex-shrink-0 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <p className="font-medium leading-relaxed">{errorMessage}</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={onOpenSettings}
                      className="underline font-semibold hover:text-[#9A3631]"
                    >
                      Open Settings to configure API Key
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => handleLoadSample(SAMPLE_NOTICES[0])}
                      className="underline font-semibold text-[#267F73] hover:text-[#1E6B61]"
                    >
                      Load Sample Notice instead
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Processing Indicator */}
            {isProcessing ? (
              <div className="p-6 rounded-xl bg-[#F0F2ED] border border-[#DDEAE4] text-center space-y-3">
                <Loader2 className="w-7 h-7 text-[#267F73] animate-spin mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#263238] font-['Plus_Jakarta_Sans']">
                    {processingStage || 'Processing notice with Gemini AI...'}
                  </h4>
                  <p className="text-xs text-[#718096] font-['Inter']">
                    Extracting dates, isolating exam deadlines, and formatting calendar schema...
                  </p>
                </div>
                <div className="w-full bg-[#E5E9E5] rounded-full h-1.5 overflow-hidden max-w-xs mx-auto">
                  <div className="bg-[#267F73] h-1.5 rounded-full animate-pulse w-3/4" />
                </div>
              </div>
            ) : (
              <button
                onClick={handleExtractNotice}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-sm font-semibold text-white bg-[#267F73] hover:bg-[#1E6B61] shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Extract Events & Deadlines with Gemini AI</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Curated Sample Notices */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#263238] flex items-center gap-2 font-['Plus_Jakarta_Sans']">
            <FileCheck className="w-4 h-4 text-[#267F73]" />
            <span>Curated Sample Notices (1-Click Instant Evaluation)</span>
          </h3>
          <p className="text-xs text-[#718096] font-['Inter']">
            Realistic academic circulars to test the extraction workflow without uploading your own document.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_NOTICES.map((sample) => (
            <div
              key={sample.id}
              onClick={() => handleLoadSample(sample)}
              className="group p-4 rounded-xl border border-[#E5E9E5] bg-[#FFFFFF] hover:border-[#267F73] hover:shadow-xs cursor-pointer transition-all duration-150 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#DDEAE4] text-[#1E6B61]">
                  {sample.badge}
                </span>
                <span className="text-xs font-semibold text-[#267F73] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>Load Sample</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <h4 className="text-sm font-semibold text-[#263238] group-hover:text-[#267F73] transition-colors line-clamp-1 font-['Plus_Jakarta_Sans']">
                {sample.title}
              </h4>

              <p className="text-xs text-[#718096] line-clamp-2 leading-relaxed font-['Inter']">
                {sample.description}
              </p>

              <div className="text-[11px] text-[#718096] flex items-center justify-between pt-2 border-t border-[#E5E9E5]">
                <span className="truncate max-w-[200px]">{sample.college}</span>
                <span className="font-semibold text-[#267F73]">{sample.goldenResult.events.length} Events</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
