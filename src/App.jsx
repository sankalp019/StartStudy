// App.jsx – Root component for StartStudy
import { useState, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import AddSessionForm from './AddSessionForm'
import SessionCard from './SessionCard'

// ─── helpers ────────────────────────────────────────────────

function todayKey() {
  return new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
}

function totalMinutes(sessions) {
  return sessions
    .filter(s => s.status === 'completed')
    .reduce((acc, s) => acc + s.duration, 0)
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

// ─── App ────────────────────────────────────────────────────

export default function App() {
  const today = todayKey()

  // sessions is an array; each element:
  // { id, subject, duration (min), remaining (sec), status, createdAt, completedAt }
  const [sessions, setSessions] = useLocalStorage('startstudy-sessions-' + today, [])
  const [showCompleted, setShowCompleted] = useState(true)

  // Split sessions into active (pending/running/paused) and completed.
  const activeSessions    = sessions.filter(s => s.status !== 'completed')
  const completedSessions = sessions.filter(s => s.status === 'completed')

  // ── Add a new session ──────────────────────────────────────
  function handleAdd({ subject, duration }) {
    const newSession = {
      id:          uid(),
      subject,
      duration,              // minutes
      remaining:   duration * 60, // seconds
      status:      'pending',
      createdAt:   Date.now(),
      completedAt: null,
    }
    setSessions(prev => [newSession, ...prev])
  }

  // ── Tick (called every second by SessionCard's interval) ───
  const handleTick = useCallback((id) => {
    setSessions(prev => prev.map(s => {
      if (s.id !== id || s.status !== 'running') return s
      const newRemaining = s.remaining - 1
      if (newRemaining <= 0) {
        // Auto-complete when timer hits zero
        return { ...s, remaining: 0, status: 'completed', completedAt: Date.now() }
      }
      return { ...s, remaining: newRemaining }
    }))
  }, [setSessions])

  // ── Start / Pause toggle ───────────────────────────────────
  const handleToggleTimer = useCallback((id) => {
    setSessions(prev => prev.map(s => {
      if (s.id !== id) return s
      if (s.status === 'running') return { ...s, status: 'paused' }
      if (s.status === 'pending' || s.status === 'paused') return { ...s, status: 'running' }
      return s
    }))
  }, [setSessions])

  // ── Mark complete manually ─────────────────────────────────
  const handleComplete = useCallback((id) => {
    setSessions(prev => prev.map(s =>
      s.id === id ? { ...s, status: 'completed', completedAt: Date.now() } : s
    ))
  }, [setSessions])

  // ── Delete ─────────────────────────────────────────────────
  const handleDelete = useCallback((id) => {
    setSessions(prev => prev.filter(s => s.id !== id))
  }, [setSessions])

  // ── Stats ──────────────────────────────────────────────────
  const totalMins    = totalMinutes(sessions)
  const totalHours   = (totalMins / 60).toFixed(1)
  const doneCount    = completedSessions.length
  const activeCount  = activeSessions.length

  return (
    <div className="app-wrapper">
      {/* ── Header ─────────────────────────────────────── */}
      <header className="header">
        <div className="header-brand">
          <div className="header-logo">📚</div>
          <span className="header-title">StartStudy</span>
        </div>
        <span className="header-date">{formatDate(today)}</span>
      </header>

      {/* ── Stats Bar ──────────────────────────────────── */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-label">Sessions Today</div>
          <div className="stat-value blue">{sessions.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-value green">{doneCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Study Time</div>
          <div className="stat-value cyan">
            {totalMins < 60 ? `${totalMins}m` : `${totalHours}h`}
          </div>
        </div>
      </div>

      {/* ── Add Session ────────────────────────────────── */}
      <AddSessionForm onAdd={handleAdd} />

      {/* ── Active Sessions ────────────────────────────── */}
      <p className="section-title">
        Today's Sessions{activeCount > 0 ? ` (${activeCount})` : ''}
      </p>

      {activeSessions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎯</div>
          <h3>No active sessions</h3>
          <p>Add a session above to get started.</p>
        </div>
      ) : (
        <div className="sessions-list">
          {activeSessions.map(session => (
            <SessionCard
              key={session.id}
              session={session}
              onTick={handleTick}
              onToggleTimer={handleToggleTimer}
              onComplete={handleComplete}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* ── Completed Sessions ─────────────────────────── */}
      {completedSessions.length > 0 && (
        <div className="completed-section">
          <button
            className="completed-toggle"
            onClick={() => setShowCompleted(v => !v)}
          >
            <span className={`toggle-chevron ${showCompleted ? 'open' : ''}`}>▲</span>
            Completed ({doneCount})
          </button>

          {showCompleted && (
            <div className="sessions-list">
              {completedSessions.map(session => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onTick={handleTick}
                  onToggleTimer={handleToggleTimer}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
