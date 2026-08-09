import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'dailystreak.habits.v1';

export const CATEGORIES = ['Health', 'Learning', 'Work', 'Creative', 'Mind', 'Other'];

function newId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `h${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayKey() {
  return dateKey(new Date());
}

export function addDays(key, delta) {
  const [y, m, d] = key.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  return dateKey(dt);
}

export function toggleDate(completions, key) {
  return completions.includes(key)
    ? completions.filter((k) => k !== key)
    : [...completions, key];
}

export function moveItem(list, from, delta) {
  const to = from + delta;
  if (from < 0 || from >= list.length || to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

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



export function normalizeHabits(list) {
  if (!Array.isArray(list)) return [];
  return list.map((h) => ({
    id: h && typeof h.id === 'string' && h.id ? h.id : newId(),
    name: String((h && h.name) ?? 'Untitled').slice(0, 60),
    category: h && CATEGORIES.includes(h.category) ? h.category : 'Other',
    createdAt: h && typeof h.createdAt === 'string' ? h.createdAt : todayKey(),
    completions:
      h && Array.isArray(h.completions)
        ? [...new Set(h.completions.filter((k) => typeof k === 'string'))].sort()
        : [],
  }));
}

export function buildBackup(habits) {
  return JSON.stringify(
    { app: 'dailystreak', version: 1, exportedAt: todayKey(), habits },
    null,
    2
  );
}

export function parseBackup(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('That file is not valid JSON.');
  }
  const list = Array.isArray(data) ? data : data && data.habits;
  if (!Array.isArray(list)) throw new Error('No habits found in that file.');
  return normalizeHabits(list);
}

function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeHabits(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

export function useHabits() {
  const [habits, setHabits] = useState(loadHabits);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch {
    }
  }, [habits]);

  const addHabit = useCallback((name, category) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setHabits((prev) => [
      ...prev,
      {
        id: newId(),
        name: trimmed,
        category: CATEGORIES.includes(category) ? category : 'Other',
        createdAt: todayKey(),
        completions: [],
      },
    ]);
  }, []);

  const updateHabit = useCallback((id, name, category) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              name: trimmed,
              category: CATEGORIES.includes(category) ? category : h.category,
            }
          : h
      )
    );
  }, []);

  const deleteHabit = useCallback((id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const moveHabit = useCallback((id, delta) => {
    setHabits((prev) => {
      const from = prev.findIndex((h) => h.id === id);
      return from === -1 ? prev : moveItem(prev, from, delta);
    });
  }, []);


  const toggleDay = useCallback((id, key) => {
    if (key > todayKey()) return;
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, completions: toggleDate(h.completions, key) } : h
      )
    );
  }, []);

  const replaceHabits = useCallback((list) => {
    setHabits(normalizeHabits(list));
  }, []);

  return {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    moveHabit,
    toggleDay,
    replaceHabits,
  };
}