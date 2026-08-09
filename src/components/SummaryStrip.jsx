export default function SummaryStrip({ completedToday, totalHabits, bestStreak }) {
  const percent = totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);

  return (
    <section className="summary" aria-label="Summary">
      <div className="summary__cells">
        <div className="summary-cell">
          <span className="summary-label">Done today</span>
          <span className="summary-value">
            {completedToday}
            <span className="summary-divider">/</span>
            {totalHabits}
          </span>
        </div>

        <div className="summary-rule" aria-hidden="true" />

        <div className="summary-cell summary-cell--right">
          <span className="summary-label">Best active streak</span>
          <span className="summary-value">
            {bestStreak}
            <span className="summary-unit">{bestStreak === 1 ? 'day' : 'days'}</span>
          </span>
        </div>
      </div>

      <div
        className="progress"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Habits done today"
      >
        <div className="progress__fill" style={{ width: `${percent}%` }} />
      </div>
    </section>
  );
}