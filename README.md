# DailyStreak

A habit tracker that runs entirely in the browser. React + Vite, no backend and no account; habits are kept in `localStorage`.

## Features

Add habits with a category (Health, Learning, Work, Creative, Mind, Other) and check them off each day. Each habit shows its current streak, its longest streak, and a 90-day grid where the squares darken the longer a run goes.

The grid is editable. Click any square to mark that day done or not done, so forgetting to check in doesn't cost you the streak permanently. Future days can't be set. Above the list, a summary shows how many habits are done today and the best streak currently running.

Deleting a habit takes a confirmation step, since it takes the history with it.

## Keyboard

The grid is a single tab stop rather than 90. Tab into it to land on today, then arrow left and right to move between days, or Home and End to jump to either end. Space or Enter toggles the focused day.

## Layout

`src/hooks/useHabits.js` holds the `localStorage` read/write plus the date and streak functions (`currentStreak`, `longestStreak`, `buildHeatmap`, `toggleDate`). Those are pure, and `src/hooks/useHabits.test.js` covers them with Vitest. The UI is five components: `App`, `SummaryStrip`, `AddHabitForm`, `HabitCard`, `StampGrid`. Styling is plain CSS in `src/styles.css` — Fraunces for display, IBM Plex Sans and Mono for everything else.

## Commands

```bash
 
 npm install
 npm run dev
 npm test
 npm run build

 ```