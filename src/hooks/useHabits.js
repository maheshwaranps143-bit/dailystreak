import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'dailystreak.habits.v1';

export const CATEGORIES = ['Health', 'Learning', 'Work', 'Creative', 'Mind', 'Other'];

/* ------------------------------------------------------------------ *
 *  Pure, side-effect-free date + streak helpers (unit-testable)
 * ------------------------------------------------------------------ */

// Local-time YYYY-MM-DD key for a Date (avoids UTC off-by-one).
export function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayKey() {
  return dateKey(new Date());
}

// Returns a new key `delta` days away from `key`. Handles month/year rollover.
export function addDays(key, delta) {
  const [y, m, d] = key.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  return dateKey(dt);
}

// Consecutive completed days ending today, or yesterday if today isn't checked yet.
export function currentStreak(completions, today = todayKey()) {
  const set = completions instanceof Set ? completions : new Set(completions);
  let cursor;
  if (set.has(today)) {
    cursor = today;
  } else if (set.has(addDays(today, -1))) {
    cursor = addDays(today, -1);
  } else {
    return 0;
  }
  let count = 0;
  while (set.has(cursor)) {
    count += 1;
    cursor = addDays(cursor, -1);
  }
  return count;
}

// Longest run of consecutive completed days ever recorded.
export function longestStreak(completions) {
  const unique = [...new Set(completions)].sort();
  if (unique.length === 0) return 0;
  let best = 1;
  let run = 1;
  for (let i = 1; i < unique.length; i += 1) {
    if (addDays(unique[i - 1], 1) === unique[i]) {
      run += 1;
    } else {
      run = 1;
    }
    if (run > best) best = run;
  }
  return best;
}

// Builds an array of the last `days` days (oldest -> newest). Each entry gets a
// shade `level` 0..4: 0 = empty, otherwise deeper for longer running streaks —
// so it reads like ink stamps getting bolder, not a contribution graph.
export function buildHeatmap(completions, days = 90, today = todayKey()) {
  const set = completions instanceof Set ? completions : new Set(completions);
  const out = [];
  let run = 0;
  for (let i = days - 1; i >= 0; i -= 1) {
    const key = addDays(today, -i);
    const done = set.has(key);
    run = done ? run + 1 : 0;
    out.push({
      key,
      done,
      level: done ? Math.min(4, run) : 0,
      isToday: key === today,
    });
  }
  return out;
}

/* ------------------------------------------------------------------ *
 *  Storage helpers
 * ------------------------------------------------------------------ */

function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Normalise defensively so a bad record can't crash the UI.
    return parsed.map((h) => ({
      id: h.id ?? crypto.randomUUID(),
      name: String(h.name ?? 'Untitled'),
      category: CATEGORIES.includes(h.category) ? h.category : 'Other',
      createdAt: h.createdAt ?? todayKey(),
      completions: Array.isArray(h.completions) ? [...new Set(h.completions)] : [],
    }));
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ *
 *  The hook
 * ------------------------------------------------------------------ */

export function useHabits() {
  const [habits, setHabits] = useState(loadHabits);

  // Load once on mount (covers cases where the lazy initialiser was skipped).
  useEffect(() => {
    setHabits(loadHabits());
  }, []);

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch {
      /* storage full / unavailable — ignore, app still works in-memory */
    }
  }, [habits]);

  const addHabit = useCallback((name, category) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setHabits((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: trimmed,
        category: CATEGORIES.includes(category) ? category : 'Other',
        createdAt: todayKey(),
        completions: [],
      },
    ]);
  }, []);

  const deleteHabit = useCallback((id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const toggleToday = useCallback((id) => {
    const key = todayKey();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const done = h.completions.includes(key);
        return {
          ...h,
          completions: done
            ? h.completions.filter((k) => k !== key)
            : [...h.completions, key],
        };
      })
    );
  }, []);

  return { habits, addHabit, deleteHabit, toggleToday };
}