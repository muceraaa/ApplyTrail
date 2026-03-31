import { useEffect, useMemo, useState } from 'react'
import { loadApplications, saveApplications, addApplication } from '../utils/trackerStorage'

const STAGES = ['Saved', 'Applied', 'Interviewing', 'Accepted', 'Rejected', 'Ghosted']

const stageColor = {
  Saved: 'badge-saved',
  Applied: 'badge-applied',
  Interviewing: 'badge-interviewing',
  Interview: 'badge-interviewing',
  Accepted: 'badge-offer',
  Offer: 'badge-offer',
  Rejected: 'badge-rejected',
  Ghosted: 'badge-ghosted'
}

const stageTone = {
  Saved: 'stage-saved',
  Applied: 'stage-applied',
  Interviewing: 'stage-interviewing',
  Interview: 'stage-interviewing',
  Accepted: 'stage-offer',
  Offer: 'stage-offer',
  Rejected: 'stage-rejected',
  Ghosted: 'stage-ghosted'
}

const formatDate = (value) => {
  if (!value) return 'n/a'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
}

const Tracker = () => {
  const [applications, setApplications] = useState([])
  const [manual, setManual] = useState({ jobTitle: '', company: '', stage: 'Applied', note: '' })
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    setApplications(loadApplications())
  }, [])

  const persist = (next) => {
    setApplications(next)
    saveApplications(next)
  }

  const handleStageChange = (id, nextStage) => {
    const now = Date.now()
    const updated = applications.map((app) => {
      if (app.id !== id) return app
      const historyEntry = {
        id: crypto.randomUUID ? crypto.randomUUID() : `${now}-stage`,
        text: `Moved to ${nextStage}`,
        timestamp: now
      }
      return {
        ...app,
        stage: nextStage,
        lastUpdated: now,
        history: [historyEntry, ...(app.history || [])]
      }
    })
    persist(updated)
  }

  const handleAddNote = (id, text) => {
    if (!text.trim()) return
    const now = Date.now()
    const updated = applications.map((app) => {
      if (app.id !== id) return app
      const note = {
        id: crypto.randomUUID ? crypto.randomUUID() : `${now}-note`,
        text: text.trim(),
        timestamp: now
      }
      const historyEntry = {
        id: crypto.randomUUID ? crypto.randomUUID() : `${now}-hist`,
        text: 'Note added',
        timestamp: now
      }
      return {
        ...app,
        lastUpdated: now,
        notes: [note, ...(app.notes || [])],
        history: [historyEntry, ...(app.history || [])]
      }
    })
    persist(updated)
  }

  const handleManualAdd = (e) => {
    e.preventDefault()
    if (!manual.jobTitle.trim() || !manual.company.trim()) return
    const created = addApplication({
      jobTitle: manual.jobTitle,
      company: manual.company,
      stage: manual.stage,
      note: manual.note
    })
    setApplications((prev) => [...prev, created])
    setManual({ jobTitle: '', company: '', stage: 'Applied', note: '' })
  }

  const emptyState = useMemo(() => applications.length === 0, [applications])

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="tracker-page">
      <header className="tracker__header">
        <div>
          <p className="auth-eyebrow">Application Tracker</p>
          <h1 className="tracker__title">Stay on top of your pipeline</h1>
          <p className="tracker__subtitle">Track stages, notes, and a quick timeline for each job.</p>
        </div>
        <form className="tracker__add" onSubmit={handleManualAdd}>
          <input
            type="text"
            placeholder="Job title"
            value={manual.jobTitle}
            onChange={(e) => setManual((p) => ({ ...p, jobTitle: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="Company"
            value={manual.company}
            onChange={(e) => setManual((p) => ({ ...p, company: e.target.value }))}
            required
          />
          <select value={manual.stage} onChange={(e) => setManual((p) => ({ ...p, stage: e.target.value }))}>
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Note (optional)"
            value={manual.note}
            onChange={(e) => setManual((p) => ({ ...p, note: e.target.value }))}
          />
          <button className="primary" type="submit">+ Add Application</button>
        </form>
      </header>

      {emptyState && (
        <div className="tracker__empty">
          <p>No applications tracked yet.</p>
          <p className="tracker__hint">Use "Track Application" on a job or add one manually.</p>
        </div>
      )}

      <div className="tracker__list">
        {applications.map((app) => (
          <article
            key={app.id}
            className={`tracker__card ${stageTone[app.stage] || ''}`}
          >
            <header className="tracker__card-head" onClick={() => toggleExpand(app.id)}>
              <div>
                <h3>{app.jobTitle}</h3>
                <p className="company">{app.company}</p>
              </div>
              <span className={`badge ${stageColor[app.stage] || ''}`}>{app.stage}</span>
              <span className="tracker__chevron" aria-hidden="true">
                {expandedId === app.id ? '−' : '+'}
              </span>
            </header>

            <div className="tracker__meta">
              <p>Date applied: {formatDate(app.dateApplied)}</p>
              <p>Last updated: {formatDate(app.lastUpdated)}</p>
            </div>

            {expandedId === app.id && (
              <>
                <div className="tracker__controls" onClick={(e) => e.stopPropagation()}>
                  <label>
                    Stage
                    <select value={app.stage} onChange={(e) => handleStageChange(app.id, e.target.value)}>
                      {STAGES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="tracker__notes" onClick={(e) => e.stopPropagation()}>
                  <div className="notes__header">
                    <h4>Notes</h4>
                    <NoteInput onAdd={(text) => handleAddNote(app.id, text)} />
                  </div>
                  <ul className="notes__list">
                    {(app.notes || []).length === 0 && <li className="notes__empty">No notes yet.</li>}
                    {(app.notes || []).map((note) => (
                      <li key={note.id}>
                        <p>{note.text}</p>
                        <span className="notes__time">{formatDate(note.timestamp)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="tracker__history" onClick={(e) => e.stopPropagation()}>
                  <h4>History</h4>
                  <ul>
                    {(app.history || []).length === 0 && <li className="notes__empty">No history yet.</li>}
                    {(app.history || []).map((item) => (
                      <li key={item.id}>
                        <span>{item.text}</span>
                        <span className="notes__time">{formatDate(item.timestamp)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

const NoteInput = ({ onAdd }) => {
  const [value, setValue] = useState('')
  const handleAdd = () => {
    if (!value.trim()) return
    onAdd(value)
    setValue('')
  }
  return (
    <div className="notes__input">
      <input
        type="text"
        placeholder="Add a note"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button className="ghost" type="button" onClick={handleAdd}>Add</button>
    </div>
  )
}

export default Tracker
