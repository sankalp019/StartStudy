# StartStudy

> A minimal, focused study session tracker that helps students overcome procrastination.

## What it does

StartStudy lets you:
- **Add study sessions** — give each session a subject and a planned duration.
- **Run a countdown timer** — start, pause, and resume per session.
- **Complete sessions** — manually mark done, or the timer auto-completes at zero.
- **See daily progress** — stats bar shows sessions today, completed count, and total study time.
- **Persist across refreshes** — all data is stored in `localStorage`, keyed by today's date.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Styling | Plain CSS (dark navy + cyan theme) |
| State | React `useState` / `useCallback` |
| Persistence | Browser `localStorage` |
| Deployment | Vercel |

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Building for production

```bash
npm run build
```

Output goes to `dist/`.

## Project structure

```
src/
  App.jsx            # Root — session state, localStorage sync, CRUD handlers
  SessionCard.jsx    # Individual session card with live countdown timer
  AddSessionForm.jsx # Controlled form — subject input + duration picker
  useLocalStorage.js # Generic hook: React state ↔ localStorage
  index.css          # Full theme — dark navy, cyan/blue accents, responsive
```

## Design decisions

- **Timer survival across re-renders** — `setInterval` lives inside `useEffect` in `SessionCard`, keyed to `session.status`. Pausing or completing clears the interval cleanly.
- **Page-refresh persistence** — `remaining` seconds are saved on every tick, so the timer resumes from exactly where it left off (status resets to `paused` on reload — the timer won't drain silently while the tab is closed).
- **Per-day isolation** — localStorage key: `startstudy-sessions-YYYY-MM-DD`.

## License

MIT
