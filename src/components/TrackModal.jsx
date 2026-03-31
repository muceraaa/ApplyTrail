import { useEffect, useMemo, useState } from 'react'

const STAGES = ['Saved', 'Applied', 'Interviewing', 'Accepted', 'Rejected', 'Ghosted']

const TrackModal = ({ open, onClose, onSave, defaultValues }) => {
  const [stage, setStage] = useState(defaultValues?.stage || 'Applied')
  const [note, setNote] = useState('')

  useEffect(() => {
    if (open) {
      setStage(defaultValues?.stage || 'Applied')
      setNote('')
    }
  }, [open, defaultValues])

  const isDisabled = useMemo(() => !stage, [stage])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isDisabled) return
    onSave?.({
      stage,
      note,
      jobTitle: defaultValues?.jobTitle,
      company: defaultValues?.company,
      jobId: defaultValues?.jobId
    })
    setNote('')
  }

  if (!open) return null

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <header className="modal__header">
          <div>
            <p className="modal__eyebrow">Track application</p>
            <h2 className="modal__title">{defaultValues?.jobTitle || 'Add application'}</h2>
            <p className="modal__subtitle">{defaultValues?.company}</p>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Close">x</button>
        </header>

        <form className="modal__body" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Stage</span>
            <select value={stage} onChange={(e) => setStage(e.target.value)}>
              {STAGES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          <label className="auth-field">
            <span>Note (optional)</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="e.g. Submitted via careers portal"
            />
          </label>

          <div className="modal__actions">
            <button type="button" className="ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary" disabled={isDisabled}>Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TrackModal
