import { buildHeatmap } from '../hooks/useHabits';

const DAYS = 90;

function labelFor(cell) {
  return `${cell.key}${cell.done ? ' — completed' : ''}${cell.isToday ? ' (today)' : ''}`;
}

export default function StampGrid({ completions, today }) {
  const cells = buildHeatmap(completions, DAYS, today);

  return (
    <div className="stampgrid" role="img" aria-label={`${DAYS}-day completion history`}>
      {cells.map((cell) => (
        <span
          key={cell.key}
          className={`stamp stamp--l${cell.level} ${cell.isToday ? 'stamp--today' : ''}`}
          title={labelFor(cell)}
        />
      ))}
    </div>
  );
}