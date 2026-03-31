const STORAGE_KEY = 'applytrail_tracker_apps'

const safeParse = (value) => {
  try {
    return JSON.parse(value)
  } catch (err) {
    console.error('Failed to parse tracker data', err)
    return []
  }
}

export const loadApplications = () => {
  if (typeof localStorage === 'undefined') return []
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  const data = safeParse(raw)
  return Array.isArray(data) ? data : []
}

export const saveApplications = (apps = []) => {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps))
}

export const addApplication = ({ jobTitle, company, jobId, stage = 'Applied', note, dateApplied }) => {
  const now = Date.now()
  const clean = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(now),
    jobTitle: jobTitle?.trim() || 'Untitled role',
    company: company?.trim() || 'Unknown company',
    jobId: jobId ?? null,
    stage,
    dateApplied: dateApplied || new Date().toISOString().slice(0, 10),
    notes: [],
    history: [],
    lastUpdated: now
  }

  const historyEntries = [{ id: crypto.randomUUID ? crypto.randomUUID() : `${now}-add`, text: 'Added to tracker', timestamp: now }]

  if (note?.trim()) {
    clean.notes.push({ id: crypto.randomUUID ? crypto.randomUUID() : `${now}-note`, text: note.trim(), timestamp: now })
    historyEntries.unshift({ id: crypto.randomUUID ? crypto.randomUUID() : `${now}-hist`, text: 'Note added', timestamp: now })
  }

  clean.history = historyEntries

  const existing = loadApplications()
  saveApplications([...existing, clean])
  return clean
}
