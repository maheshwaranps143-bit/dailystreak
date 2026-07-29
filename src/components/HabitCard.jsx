import { useState } from 'react';
import { currentStreak, longestStreak } from '../hooks/useHabits';
import StampGrid from './StampGrid';

export default function HabitCard({ habit, today, onToggle, onDelete }) {
  const [confirming, setConfirming] = useState(false);

  const doneToday = habit.completions.includes(today);
  const current = currentStreak(habit.completions, today);
  const longest = longestStreak(habit.completions);

  return (
    <article className="habit-card">
      <div className="habit-card__head">
        <button
          type="button"
          className={`check ${doneToday ? 'check--done' : ''}`}
          onClick={() => onToggle(habit.id)}
          aria-pressed={doneToday}
          aria-label={
            doneToday
              ? `Mark ${habit.name} not done for today`
              : `Mark ${habit.name} done for today`
          }
        >
          <svg viewBox="0 0 24 24" className="check__tick" aria-hidden="true">
            <path
              d="M5 12.5l4.2 4.2L19 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="habit-card__title">
          <h3 className="habit-name">{habit.name}</h3>
          <span className="tag">{habit.category}</span>
        </div>

        <div className="habit-card__stats">
          <div className="stat">
            <span className="stat__num stat__num--current">{current}</span>
            <span className="stat__label">Current</span>
          </div>
          <div className="stat">
            <span className="stat__num stat__num--best">{longest}</span>
            <span className="stat__label">Longest</span>
          </div>
        </div>
      </div>

      <StampGrid completions={habit.completions} today={today} />

      <div className="habit-card__foot">
        {confirming ? (
          <div className="confirm">
            <span className="confirm__text">Delete this habit &amp; its history?</span>
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => onDelete(habit.id)}
            >
              Delete
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setConfirming(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn--ghost btn--delete"
            onClick={() => setConfirming(true)}
          >
            Delete
          </button>
        )}
      </div>
    </article>
  );
}