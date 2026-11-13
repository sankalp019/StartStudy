// useLocalStorage.js
// A simple hook that syncs state with localStorage.
// On load, any session that was "running" is reset to "paused" so the
// timer does not silently drain while the tab was closed.
import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      if (!item) return initialValue
      const parsed = JSON.parse(item)
      // Freeze any running timers on cold load
      if (Array.isArray(parsed)) {
        return parsed.map(s => s.status === 'running' ? { ...s, status: 'paused' } : s)
      }
      return parsed
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {
      // ignore write errors
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}

