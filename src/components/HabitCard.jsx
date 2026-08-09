import { useState } from 'react';
import { currentStreak, longestStreak, CATEGORIES } from '../hooks/useHabits';
import StampGrid from './StampGrid';

export default function HabitCard({
  habit,
  today,
  index,
  total,
  onToggleDay,
  onUpdate,
  onDelete,
  onMove,
}) {
  const [mode, setMode] = useState('view');
  const [draftName, setDraftName] = useState(habit.name);
  const [draftCategory, setDraftCategory] = useState(habit.category);

  const doneToday = habit.completions.includes(today);
  const current = currentStreak(habit.completions, today);
  const longest = longestStreak(habit.completions);

  function startEdit() {
    setDraftName(habit.name);
    setDraftCategory(habit.category);
    setMode('edit');
  }

  function saveEdit(e) {
    e.preventDefault();
    if (!draftName.trim()) return;
    onUpdate(habit.id, draftName, draftCategory);
    setMode('view');
  }

  return (
    <article className={`habit-card ${doneToday ? 'habit-card--done' : ''}`}>
      <div className="habit-card__head">
        <button
          type="button"
          className={`check ${doneToday ? 'check--done' : ''}`}
          onClick={() => onToggleDay(habit.id, today)}
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

        {mode === 'edit' ? (
          <form className="edit-form" onSubmit={saveEdit}>
            <input
              className="text-input"
              type="text"
              value={draftName}
              maxLength={60}
              aria-label="Habit name"
              onChange={(e) => setDraftName(e.target.value)}
            />
            <select
              className="select-input"
              value={draftCategory}
              aria-label="Category"
              onChange={(e) => setDraftCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="btn btn--primary btn--small"
              disabled={!draftName.trim()}
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={() => setMode('view')}
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
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
          </>
        )}
      </div>

      <StampGrid
        completions={habit.completions}
        today={today}
        onToggleDay={(key) => onToggleDay(habit.id, key)}
      />

      <div className="habit-card__foot">
        {mode === 'confirm' ? (
          <div className="confirm">
            <span className="confirm__text">Delete this habit and its history?</span>
            <button
              type="button"
              className="btn btn--danger btn--small"
              onClick={() => onDelete(habit.id)}
            >
              Delete
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={() => setMode('view')}
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <p className="grid-hint">Click a square to change a past day</p>

            <div className="actions">
              <button
                type="button"
                className="icon-btn"
                onClick={() => onMove(habit.id, -1)}
                disabled={index === 0}
                aria-label={`Move ${habit.name} up`}
                title="Move up"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M7 14.5l5-5 5 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={() => onMove(habit.id, 1)}
                disabled={index === total - 1}
                aria-label={`Move ${habit.name} down`}
                title="Move down"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M7 9.5l5 5 5-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={startEdit}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={() => setMode('confirm')}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </article>
  );
}