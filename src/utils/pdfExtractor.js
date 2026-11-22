/**
 * NoticeFlow AI - PDF Text and Thumbnail Extractor
 * Extracts plain text from digital PDFs and renders the first page to an image canvas.
 */

import * as pdfjsLib from 'pdfjs-dist'

// Configure worker safely for Vite environment
try {
  // Use workerSrc with unpkg or cdnjs fallback to avoid bundler worker resolution issues
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.0.379'}/pdf.worker.min.mjs`
} catch (e) {
  console.warn('Failed to configure pdfjs workerSrc:', e)
}

/**
 * Extracts all text and first page image from a PDF File or ArrayBuffer
 * @param {File | ArrayBuffer} fileOrBuffer
 * @returns {Promise<{ text: string, numPages: number, thumbnailBase64: string }>}
 */
export async function extractFromPdf(fileOrBuffer) {
  let arrayBuffer
  if (fileOrBuffer instanceof File || fileOrBuffer instanceof Blob) {
    arrayBuffer = await fileOrBuffer.arrayBuffer()
  } else {
    arrayBuffer = fileOrBuffer
  }

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true
  })

  const pdf = await loadingTask.promise
  const numPages = pdf.numPages
  const textPieces = []

  // Extract text from up to first 5 pages (academic notices rarely exceed 5 pages)
  const maxPagesToRead = Math.min(numPages, 5)
  for (let i = 1; i <= maxPagesToRead; i++) {
    try {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item) => (item.str !== undefined ? item.str : ''))
        .join(' ')
      textPieces.push(`--- Page ${i} ---\n${pageText}`)
    } catch (pageErr) {
      console.warn(`Error reading page ${i}:`, pageErr)
    }
  }

  const fullText = textPieces.join('\n\n')

  // Render Page 1 to Canvas for thumbnail/vision preview
  let thumbnailBase64 = null
  try {
    const firstPage = await pdf.getPage(1)
    const viewport = firstPage.getViewport({ scale: 1.5 })

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.height = viewport.height
    canvas.width = viewport.width

    await firstPage.render({
      canvasContext: context,
      viewport: viewport
    }).promise

    thumbnailBase64 = canvas.toDataURL('image/png', 0.85)
  } catch (renderErr) {
    console.warn('Could not render PDF preview canvas:', renderErr)
  }

  return {
    text: fullText.trim(),
    numPages,
    thumbnailBase64
  }
}
