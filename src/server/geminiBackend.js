/**
 * NoticeFlow AI - Gemini Extraction Backend
 * Handles multimodal analysis (text and images/PDFs) using Google Gemini API.
 */

export async function processNoticeWithGemini({ apiKey, text, imageBase64, mimeType, languageOption }) {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is required to process notices with AI.')
  }

  // Ensure clean base64 data without data URL prefix if present
  let cleanBase64 = null
  let actualMimeType = mimeType || 'image/png'
  if (imageBase64) {
    if (imageBase64.includes('base64,')) {
      const parts = imageBase64.split('base64,')
      cleanBase64 = parts[1]
      const mimeMatch = parts[0].match(/data:([^;]+);/)
      if (mimeMatch) actualMimeType = mimeMatch[1]
    } else {
      cleanBase64 = imageBase64
    }
  }

  const systemInstruction = `You are NoticeFlow AI, an expert academic notice analysis and extraction system.
Your mission: Convert official college and university notices, circulars, exam schedules, and circular announcements into actionable calendar events and deadline reminders.

Extract information with extreme precision following these strict rules:
1. NEVER invent or hallucinate missing dates, times, or deadlines. If not explicitly stated, return null.
2. DISTINGUISH announcement/issue dates (e.g. "Dated: 12-11-2026") from actual event dates or deadlines. The announcement date belongs in "issue_date", NEVER as an event deadline.
3. DISTINGUISH registration deadlines from examination dates (e.g. "Last date to pay exam fee without penalty: Nov 28" is a Registration event with deadline "2026-11-28"; "Commencement of Theory Exam: Dec 15" is an Exam event with date "2026-12-15").
4. MULTIPLE EVENTS: College notices frequently contain multiple events (e.g. Fee payment without fine, fee payment with fine, hall ticket issue, theory exam, practical exam, project submission). Create a distinct event entry for each.
5. If information is ambiguous, handwritten, or incomplete, mark "is_uncertain": true and explain in "uncertainty_reason".
6. Priority guidelines:
   - "Urgent": Deadlines within 3-5 days, late-fee cutoffs, mandatory final submissions, emergency circulars.
   - "Important": Examination schedules, fee registration, major project viva.
   - "Normal": General sports fests, guest lectures, routine notices.
7. Event types MUST be one of: "Exam", "Assignment", "Registration", "Event", "Other".
8. Date format MUST be "YYYY-MM-DD" (convert Roman numerals, e.g. "15/XI/2026" or "15th Nov 2026" to "2026-11-15").
9. Time format MUST be "HH:MM" in 24-hour format if available, or null.
10. Reminder days: default to [7, 3, 1] for deadlines/exams.
11. Multilingual summaries:
    - Provide a crisp 2-sentence summary in English.
    - Provide a 2-sentence translation/summary in Kannada (ಕನ್ನಡ ಸಾರಾಂಶ) and Hindi (हिंदी सारांश) to help regional students.

OUTPUT FORMAT: Return strictly a valid JSON object without markdown fences, matching this exact schema:
{
  "notice_title": "string (Official notice heading)",
  "college_or_dept": "string or null",
  "issue_date": "YYYY-MM-DD or null",
  "language_detected": "string (English / Kannada / Hindi / Mixed)",
  "summary": "string (Crisp 2-sentence summary in English)",
  "kannada_summary": "string or null (Summary in Kannada)",
  "hindi_summary": "string or null (Summary in Hindi)",
  "events": [
    {
      "id": "evt-1",
      "title": "string (Event or notice title)",
      "description": "string (Short explanation)",
      "event_type": "Exam | Assignment | Registration | Event | Other",
      "date": "YYYY-MM-DD",
      "time": "HH:MM or null",
      "deadline": "YYYY-MM-DD or null",
      "venue": "string or null",
      "priority": "Urgent | Important | Normal",
      "reminder_days": [7, 3, 1],
      "source_text": "string (Exact excerpt from notice confirming this event)",
      "is_uncertain": false,
      "uncertainty_reason": null
    }
  ]
}`

  const userPrompt = `Please analyze this college notice and extract all events, deadlines, and key information according to the system instructions.
Extract all actionable events. Current reference year is 2026.

${text ? `EXTRACTED NOTICE TEXT:\n"""\n${text}\n"""` : 'NOTICE DOCUMENT IS ATTACHED AS AN IMAGE/SCAN.'}`

  // Prepare Gemini API payload
  const contents = []
  const parts = []

  if (cleanBase64) {
    parts.push({
      inline_data: {
        mime_type: actualMimeType,
        data: cleanBase64
      }
    })
  }

  parts.push({
    text: userPrompt
  })

  contents.push({
    role: 'user',
    parts
  })

  // Try modern models with fallback
  const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']
  let lastError = null

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`

      const payload = {
        contents,
        system_instruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.1
        }
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errText = await response.text()
        console.warn(`Model ${model} returned error status ${response.status}:`, errText)
        lastError = new Error(`Gemini API error (${response.status}): ${errText}`)
        continue
      }

      const resData = await response.json()
      const candidateText = resData.candidates?.[0]?.content?.parts?.[0]?.text

      if (!candidateText) {
        throw new Error('Gemini returned an empty response. The notice might be illegible or blocked by safety filters.')
      }

      // Parse JSON safely
      let parsed
      try {
        parsed = JSON.parse(candidateText)
      } catch (parseErr) {
        // Strip markdown fences if Gemini added them
        const cleaned = candidateText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()
        parsed = JSON.parse(cleaned)
      }

      // Ensure events array has stable ids and default arrays
      if (parsed && Array.isArray(parsed.events)) {
        parsed.events = parsed.events.map((evt, idx) => ({
          id: evt.id || `evt-${Date.now()}-${idx}`,
          title: evt.title || 'Untitled Event',
          description: evt.description || '',
          event_type: ['Exam', 'Assignment', 'Registration', 'Event', 'Other'].includes(evt.event_type) ? evt.event_type : 'Other',
          date: evt.date || evt.deadline || new Date().toISOString().split('T')[0],
          time: evt.time || null,
          deadline: evt.deadline || null,
          venue: evt.venue || null,
          priority: ['Urgent', 'Important', 'Normal'].includes(evt.priority) ? evt.priority : 'Normal',
          reminder_days: Array.isArray(evt.reminder_days) ? evt.reminder_days : [7, 3, 1],
          source_text: evt.source_text || '',
          is_uncertain: !!evt.is_uncertain,
          uncertainty_reason: evt.uncertainty_reason || null
        }))
      } else {
        parsed.events = []
      }

      return {
        success: true,
        modelUsed: model,
        data: parsed
      }
    } catch (err) {
      console.warn(`Attempt with ${model} failed:`, err.message)
      lastError = err
    }
  }

  throw lastError || new Error('Failed to extract notice data from Gemini API.')
}
