/**
 * NoticeFlow AI - Conflict & Duplicate Detector
 * Detects overlapping exams, multi-deadline clashes, and duplicate notices.
 */

export function detectEventConflicts(candidateEvent, existingEvents = []) {
  const warnings = []
  const candidateDate = candidateEvent.date || candidateEvent.deadline
  if (!candidateDate) return warnings

  for (const existing of existingEvents) {
    if (existing.id === candidateEvent.id) continue

    const existingDate = existing.date || existing.deadline
    if (!existingDate) continue

    // 1. Check for Duplicate Event (Exact or near title match on same date)
    const isSameDate = existingDate === candidateDate
    const candTitleNorm = (candidateEvent.title || '').trim().toLowerCase()
    const existTitleNorm = (existing.title || '').trim().toLowerCase()

    if (isSameDate && (candTitleNorm === existTitleNorm || existTitleNorm.includes(candTitleNorm) || candTitleNorm.includes(existTitleNorm))) {
      warnings.push({
        type: 'duplicate',
        severity: 'high',
        message: `Possible duplicate event: "${existing.title}" is already registered on ${candidateDate}.`,
        conflictingWith: existing
      })
      continue
    }

    // 2. Multiple Exams on the Same Day Clash
    if (isSameDate && candidateEvent.event_type === 'Exam' && existing.event_type === 'Exam') {
      warnings.push({
        type: 'exam_clash',
        severity: 'critical',
        message: `Exam Conflict: Another examination ("${existing.title}") is already scheduled on ${candidateDate}.`,
        conflictingWith: existing
      })
    }

    // 3. Urgent Deadline Clashes
    if (isSameDate && candidateEvent.priority === 'Urgent' && existing.priority === 'Urgent') {
      warnings.push({
        type: 'urgent_clash',
        severity: 'medium',
        message: `High Workload: You have another urgent task ("${existing.title}") due on ${candidateDate}.`,
        conflictingWith: existing
      })
    }

    // 4. Time Overlap (if both have times specified on same date)
    if (isSameDate && candidateEvent.time && existing.time && candidateEvent.time === existing.time) {
      warnings.push({
        type: 'time_clash',
        severity: 'high',
        message: `Exact Time Clash: Overlaps with "${existing.title}" at ${candidateEvent.time}.`,
        conflictingWith: existing
      })
    }
  }

  return warnings
}
