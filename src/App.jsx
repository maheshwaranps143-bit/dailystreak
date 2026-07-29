import { useMemo } from 'react';
import { useHabits, currentStreak, todayKey } from './hooks/useHabits';
import SummaryStrip from './components/SummaryStrip';
import AddHabitForm from './components/AddHabitForm';
import HabitCard from './components/HabitCard';

export default function App() {
  const { habits, addHabit, deleteHabit, toggleToday } = useHabits();
  const today = todayKey();

  const { completedToday, bestStreak } = useMemo(() => {
    const done = habits.filter((h) => h.completions.includes(today)).length;
    const best = habits.reduce(
      (max, h) => Math.max(max, currentStreak(h.completions, today)),
      0
    );
    return { completedToday: done, bestStreak: best };
  }, [habits, today]);

  return (
    <div className="app">
      <header className="masthead">
        <h1 className="wordmark">
          Daily<span>Streak</span>
        </h1>
        <p className="tagline">Stamp the card. Keep the chain unbroken.</p>
      </header>

      <SummaryStrip
        completedToday={completedToday}
        totalHabits={habits.length}
        bestStreak={bestStreak}
      />

      <AddHabitForm onAdd={addHabit} />

      {habits.length === 0 ? (
        <div className="empty-state">
          <div className="empty-stamp" aria-hidden="true">✦</div>
          <h2>Your card is blank</h2>
          <p>Add your first habit above and start stamping. One day at a time.</p>
        </div>
      ) : (
        <main className="habit-list">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              today={today}
              onToggle={toggleToday}
              onDelete={deleteHabit}
            />
          ))}
        </main>
      )}

      <footer className="app-footer">
        <span>Stored locally on this device — no account, no cloud.</span>
      </footer>
    </div>
  );
}