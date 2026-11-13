# StartStudy 📚

> A focused study session web application designed to help students overcome procrastination by making it frictionless to start, track, and complete study sessions.

---

## 🎯 Scope
StartStudy directly tackles student procrastination through a distraction-free, zero-friction interface. By eliminating barriers like login walls, complicated setup, and excessive menus, students can immediately create a session, start a timer, and build study momentum.

---

## 🗺️ User Journey
1. **Open the Dashboard:** View today's date, current study stats, and active sessions.
2. **Enter a Subject:** Type the topic or subject (e.g. "Calculus Chapter 3", "Biology Cell Division").
3. **Select Study Duration:** Choose from focused duration intervals (5 to 120 minutes, defaulting to 25m Pomodoro).
4. **Create a Session:** Click **+ Add** to instantly add the session to today's queue.
5. **Start Countdown Timer:** Click **▶ Start** to initiate the countdown.
6. **Pause or Resume:** Need a quick break or interruption? Click **⏸ Pause** and **▶ Start** at any time.
7. **Complete Session:** Hit the green **✓** button or let the timer reach zero to automatically record it as completed.
8. **View Today's Progress:** Review all finished sessions with completion timestamps and total study time accumulated.

---

## ✨ Must-have Features
- **Add Study Sessions:** Subject input and duration selection.
- **Countdown Timer:** Live, accurate countdown timer with second-level precision.
- **Timer Controls:** Fluid Start, Pause, and Resume state transitions.
- **Session Completion:** Manual completion checkmark or automatic transition when the timer expires.
- **Daily Progress Dashboard:** Real-time counters for Total Sessions, Completed Sessions, and Total Study Hours/Minutes.
- **Local Storage Persistence:** All sessions and remaining times automatically saved to browser `localStorage` keyed per day (`startstudy-sessions-YYYY-MM-DD`).
- **Page Refresh Safety:** Running timers safely pause on page reload so timers never silently drain or drift in the background.
- **Responsive Interface:** Custom dark navy design with cyan/blue accents optimized for desktop, tablet, and mobile browsers.

---

## 🚫 Excluded Features (By Design)
To keep the app completely focused and lightweight, StartStudy intentionally excludes:
- No login / signup or authentication barriers
- No AI chat assistants
- No social feeds or public profiles
- No competitive leaderboards
- No intrusive notification popups
- No bloated analytics

---

## 🛠️ Technology Stack
- **Frontend Framework:** React 19 + Vite 8
- **Styling:** Modern, vanilla CSS (responsive flexbox & grid, custom properties, dark navy palette)
- **Language:** JavaScript (ES modules)
- **State & Persistence:** React hooks (`useState`, `useEffect`, `useCallback`) + browser `localStorage`
- **Version Control:** Git & GitHub
- **Deployment:** Vercel

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
Compiled production assets will be output to the `dist/` directory.

### 4. Deploy to Vercel
Deploy directly using the Vercel CLI:
```bash
vercel
```
Or push to a GitHub repository and import the repository into your [Vercel Dashboard](https://vercel.com). Vercel will automatically detect the Vite framework preset.

---

## 🏆 Success Criteria
A student must be able to create, start, and complete a study session and see the completed session recorded successfully on their dashboard.
