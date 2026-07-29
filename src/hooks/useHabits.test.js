import { describe, it, expect } from 'vitest';
import {
  addDays,
  currentStreak,
  longestStreak,
  buildHeatmap,
} from './useHabits.js';

const TODAY = '2026-07-29';

describe('addDays', () => {
  it('adds and subtracts days', () => {
    expect(addDays('2026-07-29', 1)).toBe('2026-07-30');
    expect(addDays('2026-07-29', -1)).toBe('2026-07-28');
  });
  it('handles month and year rollover', () => {
    expect(addDays('2026-07-31', 1)).toBe('2026-08-01');
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
  });
});

describe('currentStreak', () => {
  it('is 0 with no completions', () => {
    expect(currentStreak([], TODAY)).toBe(0);
  });
  it('counts a run ending today', () => {
    expect(currentStreak(['2026-07-27', '2026-07-28', '2026-07-29'], TODAY)).toBe(3);
  });
  it('counts a run ending yesterday (grace period)', () => {
    expect(currentStreak(['2026-07-27', '2026-07-28'], TODAY)).toBe(2);
  });
  it('is 0 when the last completion is 2+ days ago', () => {
    expect(currentStreak(['2026-07-26', '2026-07-27'], TODAY)).toBe(0);
  });
  it('stops at the first gap', () => {
    expect(currentStreak(['2026-07-25', '2026-07-28', '2026-07-29'], TODAY)).toBe(2);
  });
  it('ignores duplicate dates', () => {
    expect(currentStreak(['2026-07-29', '2026-07-29'], TODAY)).toBe(1);
  });
});

describe('longestStreak', () => {
  it('is 0 with no completions', () => {
    expect(longestStreak([])).toBe(0);
  });
  it('finds the longest run regardless of order', () => {
    expect(
      longestStreak([
        '2026-07-01',
        '2026-07-10', '2026-07-11', '2026-07-12', '2026-07-13',
        '2026-07-20', '2026-07-21',
      ])
    ).toBe(4);
  });
  it('handles a single day', () => {
    expect(longestStreak(['2026-07-29'])).toBe(1);
  });
});

describe('buildHeatmap', () => {
  it('returns the requested number of days, newest last', () => {
    const cells = buildHeatmap(['2026-07-29'], 90, TODAY);
    expect(cells).toHaveLength(90);
    expect(cells[89].isToday).toBe(true);
    expect(cells[89].key).toBe(TODAY);
  });
  it('escalates shade level within a running streak (capped at 4)', () => {
    const run = ['2026-07-24', '2026-07-25', '2026-07-26', '2026-07-27', '2026-07-28', '2026-07-29'];
    const cells = buildHeatmap(run, 90, TODAY);
    const last6 = cells.slice(-6).map((c) => c.level);
    expect(last6).toEqual([1, 2, 3, 4, 4, 4]);
  });
  it('marks empty days as level 0', () => {
    const cells = buildHeatmap([], 90, TODAY);
    expect(cells.every((c) => c.level === 0 && !c.done)).toBe(true);
  });
});