// AddSessionForm.jsx
import { useState } from 'react'

const DURATION_OPTIONS = [5, 10, 15, 20, 25, 30, 45, 60, 90, 120]

export default function AddSessionForm({ onAdd }) {
  const [subject, setSubject]   = useState('')
  const [duration, setDuration] = useState(25)
  const [error, setError]       = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = subject.trim()
    if (!trimmed) {
      setError('Please enter a subject name.')
      return
    }
    onAdd({ subject: trimmed, duration: Number(duration) })
    setSubject('')
    setDuration(25)
    setError('')
  }

  return (
    <div className="add-session-panel">
      <p className="section-title">Add Study Session</p>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="subject">Subject / Topic</label>
            <input
              id="subject"
              className="form-input"
              type="text"
              placeholder="e.g. Calculus Chapter 3"
              value={subject}
              onChange={e => { setSubject(e.target.value); setError('') }}
              maxLength={80}
              autoComplete="off"
            />
          </div>
          <div className="form-group duration-group">
            <label className="form-label" htmlFor="duration">Duration</label>
            <select
              id="duration"
              className="form-select"
              value={duration}
              onChange={e => setDuration(e.target.value)}
            >
              {DURATION_OPTIONS.map(d => (
                <option key={d} value={d}>{d} min</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            + Add
          </button>
        </div>
        {error && (
          <p style={{ color: 'var(--accent-red)', fontSize: 12, marginTop: 8 }}>{error}</p>
        )}
      </form>
    </div>
  )
}

