export default function SummaryStrip({ completedToday, totalHabits, bestStreak }) {
  return (
    <section className="summary-strip" aria-label="Summary">
      <div className="summary-cell">
        <span className="summary-label">Completed today</span>
        <span className="summary-value">
          {completedToday}
          <span className="summary-divider">/</span>
          {totalHabits}
        </span>
      </div>
      <div className="summary-rule" aria-hidden="true" />
      <div className="summary-cell">
        <span className="summary-label">Best active streak</span>
        <span className="summary-value summary-value--accent">
          {bestStreak}
          <span className="summary-unit">{bestStreak === 1 ? 'day' : 'days'}</span>
        </span>
      </div>
    </section>
  );
}