// SessionCard.jsx – Individual study session card with live timer and status
import { useEffect, useRef } from 'react'
import { PlayIcon, PauseIcon, CheckIcon, TrashIcon } from './Icons'

function formatTime(seconds) {
  if (seconds <= 0) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function StatusBadge({ status }) {
  const configs = {
    pending:   { label: 'Ready',       className: 'badge-pending', dotClass: 'dot-pending' },
    running:   { label: 'In Progress', className: 'badge-running', dotClass: 'dot-running' },
    paused:    { label: 'Paused',      className: 'badge-paused',  dotClass: 'dot-paused' },
    completed: { label: 'Completed',   className: 'badge-done',    dotClass: 'dot-done' },
  }
  const config = configs[status] || configs.pending

  return (
    <span className={`session-status-badge ${config.className}`}>
      <span className={`status-dot ${config.dotClass}`} aria-hidden="true" />
      {config.label}
    </span>
  )
}

export default function SessionCard({ session, onTick, onToggleTimer, onComplete, onDelete }) {
  const intervalRef = useRef(null)

  // Drive the countdown via setInterval when running.
  // Preserves exact timer behavior without re-render resets.
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
  const isPaused    = session.status === 'paused'
  const timeLeft    = session.remaining

  // Calculate session elapsed progress percentage
  const totalSeconds = session.duration * 60
  const elapsedSeconds = Math.max(0, totalSeconds - (timeLeft ?? 0))
  const progressPercent = isCompleted
    ? 100
    : Math.min(100, Math.max(0, Math.round((elapsedSeconds / totalSeconds) * 100)))

  return (
    <div
      className={`session-card ${isRunning ? 'running' : ''} ${isPaused ? 'paused' : ''} ${isCompleted ? 'completed' : ''}`}
    >
      {/* Subject and metadata */}
      <div className="session-subject-col">
        <div className="session-header-row">
          <h3 className="session-subject" title={session.subject}>
            {session.subject}
          </h3>
          <StatusBadge status={session.status} />
        </div>
        <div className="session-meta">
          <span className="meta-item">{session.duration} min planned</span>
          {isCompleted && session.completedAt && (
            <span className="meta-item finished-time">
              Finished at {new Date(session.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          {!isCompleted && isRunning && (
            <span className="meta-item progress-text">{progressPercent}% elapsed</span>
          )}
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="timer-col">
        <div
          className={`timer-display ${isRunning ? 'timer-running' : ''} ${isPaused ? 'timer-paused' : ''} ${isCompleted ? 'timer-done' : ''}`}
        >
          {isCompleted ? 'Done' : formatTime(timeLeft)}
        </div>
        <span className="timer-label">
          {isCompleted ? 'Recorded' : isRunning ? 'Remaining' : isPaused ? 'Paused' : 'Duration'}
        </span>
      </div>

      {/* Action buttons */}
      <div className="session-actions">
        {!isCompleted ? (
          <>
            <button
              type="button"
              className={`btn btn-control ${isRunning ? 'btn-pause' : 'btn-start'}`}
              onClick={() => onToggleTimer(session.id)}
              title={isRunning ? 'Pause timer' : isPaused ? 'Resume timer' : 'Start timer'}
              aria-label={isRunning ? 'Pause timer' : isPaused ? 'Resume timer' : 'Start timer'}
            >
              {isRunning ? (
                <>
                  <PauseIcon size={13} />
                  <span className="btn-text">Pause</span>
                </>
              ) : (
                <>
                  <PlayIcon size={13} />
                  <span className="btn-text">{isPaused ? 'Resume' : 'Start'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="btn btn-control btn-complete"
              onClick={() => onComplete(session.id)}
              title="Mark session as complete"
              aria-label="Mark session as complete"
            >
              <CheckIcon size={14} />
            </button>

            <button
              type="button"
              className="btn btn-control btn-delete"
              onClick={() => onDelete(session.id)}
              title="Delete session"
              aria-label="Delete session"
            >
              <TrashIcon size={14} />
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn btn-control btn-delete"
            onClick={() => onDelete(session.id)}
            title="Remove from history"
            aria-label="Remove from history"
          >
            <TrashIcon size={14} />
          </button>
        )}
      </div>

      {/* Subtle progress track along the card base */}
      <div className="session-progress-track" aria-hidden="true">
        <div
          className={`session-progress-fill ${isCompleted ? 'fill-done' : isRunning ? 'fill-running' : 'fill-paused'}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  )
}
