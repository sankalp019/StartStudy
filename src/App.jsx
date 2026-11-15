// App.jsx – Root component for StartStudy
import { useState, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import Hero from './Hero'
import AddSessionForm from './AddSessionForm'
import SessionCard from './SessionCard'
import {
  LogoIcon,
  CalendarIcon,
  TargetIcon,
  CheckCircleIcon,
  ClockIcon,
  ChevronDownIcon,
} from './Icons'

// ─── helpers ────────────────────────────────────────────────

function todayKey() {
  return new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })
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
  const completionRate = sessions.length > 0 ? Math.round((doneCount / sessions.length) * 100) : 0

  return (
    <div className="app-container">
      {/* ── Top Header / Brand Bar ──────────────────────── */}
      <header className="header">
        <div className="header-brand">
          <div className="header-logo-badge">
            <LogoIcon size={20} />
          </div>
          <div className="header-brand-info">
            <span className="header-title">StartStudy</span>
            <span className="header-tagline">Focus &amp; Study Dashboard</span>
          </div>
        </div>
        <div className="header-date-pill">
          <CalendarIcon size={13} className="header-date-icon" />
          <span className="header-date-text">{formatDate(today)}</span>
        </div>
      </header>

      {/* ── Hero Welcome Section ────────────────────────── */}
      <Hero />

      {/* ── Stats Dashboard Bar ─────────────────────────── */}
      <section className="stats-dashboard" aria-label="Study Statistics">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Sessions Today</span>
            <span className="stat-icon-wrapper stat-icon-blue">
              <TargetIcon size={16} />
            </span>
          </div>
          <div className="stat-value-group">
            <span className="stat-value stat-value-blue">{sessions.length}</span>
            <span className="stat-subtext">
              {activeCount > 0 ? `${activeCount} in progress` : '0 active'}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Completed</span>
            <span className="stat-icon-wrapper stat-icon-green">
              <CheckCircleIcon size={16} />
            </span>
          </div>
          <div className="stat-value-group">
            <span className="stat-value stat-value-green">{doneCount}</span>
            <span className="stat-subtext">
              {sessions.length > 0 ? `${completionRate}% rate` : 'Ready to start'}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Study Time</span>
            <span className="stat-icon-wrapper stat-icon-cyan">
              <ClockIcon size={16} />
            </span>
          </div>
          <div className="stat-value-group">
            <span className="stat-value stat-value-cyan">
              {totalMins < 60 ? `${totalMins}m` : `${totalHours}h`}
            </span>
            <span className="stat-subtext">
              {doneCount > 0 ? `${totalMins} min logged` : 'Target: 25m+'}
            </span>
          </div>
        </div>
      </section>

      {/* ── Add Session Form Panel ──────────────────────── */}
      <AddSessionForm onAdd={handleAdd} />

      {/* ── Active Sessions Section ─────────────────────── */}
      <section className="sessions-section" aria-label="Active Sessions">
        <div className="section-header">
          <div className="section-title-group">
            <h2 className="section-heading">Today's Sessions</h2>
            {activeCount > 0 && (
              <span className="section-count-badge">{activeCount} active</span>
            )}
          </div>
          <span className="section-meta-hint">
            {activeCount === 0
              ? 'No sessions running'
              : `${activeCount} session${activeCount > 1 ? 's' : ''} to complete`}
          </span>
        </div>

        {activeSessions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-visual">
              <div className="empty-ring" />
              <div className="empty-icon-wrap">
                <TargetIcon size={24} className="empty-icon" />
              </div>
            </div>
            <h3 className="empty-title">No active study sessions</h3>
            <p className="empty-desc">
              Ready to build momentum? Add a subject and duration above to start your first focus sprint.
            </p>
            <div className="empty-tip">
              <span className="tip-dot" />
              <span>Tip: Starting with just 15 or 25 minutes makes overcoming procrastination effortless.</span>
            </div>
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
      </section>

      {/* ── Completed Sessions Section ──────────────────── */}
      {completedSessions.length > 0 && (
        <section className="completed-section" aria-label="Completed Sessions">
          <button
            type="button"
            className="completed-accordion-btn"
            onClick={() => setShowCompleted(v => !v)}
            aria-expanded={showCompleted}
          >
            <div className="accordion-left">
              <CheckCircleIcon size={16} className="accordion-icon" />
              <span className="accordion-title">Completed Today</span>
              <span className="completed-count-pill">{doneCount}</span>
            </div>
            <div className="accordion-right">
              <span className="accordion-subtext">{totalMins} min completed</span>
              <span className={`accordion-chevron ${showCompleted ? 'chevron-open' : ''}`}>
                <ChevronDownIcon size={15} />
              </span>
            </div>
          </button>

          {showCompleted && (
            <div className="sessions-list completed-list">
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
        </section>
      )}

      {/* ── Subtle SaaS Footer ──────────────────────────── */}
      <footer className="app-footer">
        <span>StartStudy · Designed for distraction-free focus</span>
      </footer>
    </div>
  )
}
