// AddSessionForm.jsx – Cohesive, refined session creation form
import { useState } from 'react'
import { PlusIcon, AlertCircleIcon, ClockIcon } from './Icons'

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
    <section className="add-session-panel" aria-labelledby="add-session-heading">
      <div className="panel-header">
        <h2 id="add-session-heading" className="panel-title">
          Plan a Study Session
        </h2>
        <span className="panel-hint">Start with 25 minutes of uninterrupted focus</span>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group flex-input">
            <label className="form-label" htmlFor="subject">
              Subject or Topic
            </label>
            <div className="input-wrapper">
              <input
                id="subject"
                className={`form-input ${error ? 'input-error' : ''}`}
                type="text"
                placeholder="e.g. Calculus Problem Set 3, Organic Chemistry..."
                value={subject}
                onChange={e => {
                  setSubject(e.target.value)
                  if (error) setError('')
                }}
                maxLength={80}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="form-group flex-duration">
            <label className="form-label" htmlFor="duration">
              Duration
            </label>
            <div className="select-wrapper">
              <ClockIcon className="select-icon" size={15} />
              <select
                id="duration"
                className="form-select"
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
              >
                {DURATION_OPTIONS.map(d => (
                  <option key={d} value={d}>
                    {d} min {d === 25 ? '· Pomodoro' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group flex-action">
            <label className="form-label label-spacer" aria-hidden="true">&nbsp;</label>
            <button type="submit" className="btn btn-primary btn-add-session">
              <PlusIcon size={16} />
              <span>Add Session</span>
            </button>
          </div>
        </div>

        {/* Quick duration presets for faster flow */}
        <div className="form-presets">
          <span className="preset-label">Presets:</span>
          {[15, 25, 45, 60].map(mins => (
            <button
              key={mins}
              type="button"
              className={`preset-chip ${duration === mins ? 'active' : ''}`}
              onClick={() => setDuration(mins)}
            >
              {mins}m
            </button>
          ))}
        </div>

        {error && (
          <div className="form-error" role="alert">
            <AlertCircleIcon size={14} />
            <span>{error}</span>
          </div>
        )}
      </form>
    </section>
  )
}
