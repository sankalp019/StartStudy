// SessionCard.jsx
// Displays a single study session with a countdown timer.
// Timer state (running / paused) is managed in the parent and
// passed down so it survives re-renders.
import { useEffect, useRef } from 'react'

function formatTime(seconds) {
  if (seconds <= 0) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function StatusBadge({ status }) {
  const map = {
    pending:   ['badge-pending',  'Pending'],
    running:   ['badge-running',  'Running'],
    paused:    ['badge-paused',   'Paused'],
    completed: ['badge-done',     'Done'],
  }
  const [cls, label] = map[status] || map.pending
  return <span className={`session-status-badge ${cls}`}>{label}</span>
}

export default function SessionCard({ session, onTick, onToggleTimer, onComplete, onDelete }) {
  const intervalRef = useRef(null)

  // Drive the countdown via setInterval when running.
  useEffect(() => {
    if (session.status === 'running') {
      intervalRef.current = setInterval(() => {
        onTick(session.id)
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [session.status, session.id, onTick])

  const isCompleted = session.status === 'completed'
  const isRunning   = session.status === 'running'
  const timeLeft    = session.remaining

  return (
    <div className={`session-card ${isRunning ? 'running' : ''} ${isCompleted ? 'completed' : ''}`}>
      {/* Subject info */}
      <div className="session-subject-col">
        <div className="session-subject">{session.subject}</div>
        <div className="session-meta">
          {session.duration} min planned
          {isCompleted && session.completedAt
            ? ` · Finished at ${new Date(session.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            : ''}
        </div>
      </div>

      {/* Status badge */}
      <StatusBadge status={session.status} />

      {/* Timer */}
      <div className="timer-col">
        <div className={`timer-display ${isRunning ? 'running' : ''} ${isCompleted ? 'done' : ''}`}>
          {isCompleted ? '✓' : formatTime(timeLeft)}
        </div>
        <div className="timer-label">
          {isCompleted ? 'done' : 'left'}
        </div>
      </div>

      {/* Actions */}
      {!isCompleted && (
        <div className="session-actions">
          <button
            className={`btn ${isRunning ? 'btn-pause' : 'btn-start'}`}
            onClick={() => onToggleTimer(session.id)}
            title={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? '⏸ Pause' : '▶ Start'}
          </button>
          <button
            className="btn btn-complete"
            onClick={() => onComplete(session.id)}
            title="Mark as complete"
          >
            ✓
          </button>
          <button
            className="btn btn-delete"
            onClick={() => onDelete(session.id)}
            title="Delete session"
          >
            ✕
          </button>
        </div>
      )}

      {isCompleted && (
        <div className="session-actions">
          <button
            className="btn btn-delete"
            onClick={() => onDelete(session.id)}
            title="Remove"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

