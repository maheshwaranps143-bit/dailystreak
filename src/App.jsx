import { useMemo } from 'react';
import { useHabits, currentStreak, todayKey } from './hooks/useHabits';
import { useTheme } from './hooks/useTheme';
import ThemeToggle from './components/ThemeToggle';
import SummaryStrip from './components/SummaryStrip';
import AddHabitForm from './components/AddHabitForm';
import HabitCard from './components/HabitCard';
import DataControls from './components/DataControls';

export default function App() {
  const {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    moveHabit,
    toggleDay,
    replaceHabits,
  } = useHabits();
  const { theme, toggleTheme } = useTheme();
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
        <div className="masthead__text">
          <h1 className="wordmark">DailyStreak</h1>
          <p className="tagline">Daily habit tracker</p>
        </div>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      <SummaryStrip
        completedToday={completedToday}
        totalHabits={habits.length}
        bestStreak={bestStreak}
      />

      <AddHabitForm onAdd={addHabit} />

      {habits.length === 0 ? (
        <div className="empty-state">
          <h2>No habits yet</h2>
          <p>Add one above to get started.</p>
        </div>
      ) : (
        <main className="habit-list">
          {habits.map((habit, i) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              today={today}
              index={i}
              total={habits.length}
              onToggleDay={toggleDay}
              onUpdate={updateHabit}
              onDelete={deleteHabit}
              onMove={moveHabit}
            />
          ))}
        </main>
      )}

      <DataControls habits={habits} onReplace={replaceHabits} />

      <footer className="app-footer">
        <span>Saved in this browser only.</span>
      </footer>
    </div>
  );
}