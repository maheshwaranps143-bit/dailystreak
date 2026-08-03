# DailyStreak

A local-first habit tracker with a **ledger / stamp-card** aesthetic. Stamp the card each day and keep the chain unbroken. Built with React + Vite — no backend, no account; your data lives in the browser's `localStorage`.

---

## Features

- **Add daily habits**, each with a category (Health, Learning, Work, Creative, Mind, Other).
- **Circular check-off** to mark a habit done for today.
- **Current streak** (consecutive days ending today, or yesterday if not yet checked) and **longest streak ever** per habit.
- **90-day heatmap** rendered as ink-stamp squares that get bolder the longer a streak runs — today's square is outlined.
- **Summary strip** — habits completed today (e.g. `3/5`) and the best active streak across all habits.
- **Delete** a habit with a confirm step.
- **Persistence** in `localStorage` — loads on mount, saves on every change.
- Responsive down to mobile, visible keyboard focus states, and respects `prefers-reduced-motion`.

## Tech stack

React 18 + Vite, functional components with hooks. Plain CSS (no UI libraries). Fonts: Fraunces (display), IBM Plex Sans (UI), IBM Plex Mono (numbers).

## Architecture

- `src/hooks/useHabits.js` — a custom hook wrapping `localStorage` read/write plus **pure, unit-testable** streak functions (`currentStreak`, `longestStreak`, `buildHeatmap`, date helpers).
- `src/hooks/useHabits.test.js` — Vitest unit tests for the pure functions.
- Components: `App`, `SummaryStrip`, `AddHabitForm`, `HabitCard`, `StampGrid`.

## Run locally

```bash
npm install
npm run dev
```

## Test

```bash
npm test
```

## Build

```bash
npm run build
npm run preview
```
