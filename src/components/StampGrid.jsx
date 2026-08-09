import { useRef, useState } from 'react';
import { buildHeatmap } from '../hooks/useHabits';

const DAYS = 90;

const dayFormat = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

function labelFor(cell) {
  const [y, m, d] = cell.key.split('-').map(Number);
  const when = cell.isToday ? 'Today' : dayFormat.format(new Date(y, m - 1, d));
  return `${when}: ${cell.done ? 'done' : 'not done'}`;
}

export default function StampGrid({ completions, today, onToggleDay }) {
  const cells = buildHeatmap(completions, DAYS, today);
  const gridRef = useRef(null);
  const [tabStop, setTabStop] = useState(DAYS - 1);

  function moveFocus(to) {
    if (to < 0 || to >= cells.length) return;
    setTabStop(to);
    gridRef.current?.children[to]?.focus();
  }

  function handleKeyDown(e) {
    const from = Number(e.target.dataset.index);
    if (Number.isNaN(from)) return;
    if (e.key === 'ArrowRight') moveFocus(from + 1);
    else if (e.key === 'ArrowLeft') moveFocus(from - 1);
    else if (e.key === 'Home') moveFocus(0);
    else if (e.key === 'End') moveFocus(cells.length - 1);
    else return;
    e.preventDefault();
  }

  return (
    <div
      className="stampgrid"
      ref={gridRef}
      role="group"
      aria-label={`Last ${DAYS} days. Pick a day to change it.`}
      onKeyDown={handleKeyDown}
    >
      {cells.map((cell, i) => (
        <button
          key={cell.key}
          type="button"
          data-index={i}
          className={`stamp stamp--l${cell.level} ${cell.isToday ? 'stamp--today' : ''}`}
          tabIndex={i === tabStop ? 0 : -1}
          aria-pressed={cell.done}
          aria-label={labelFor(cell)}
          title={labelFor(cell)}
          onFocus={() => setTabStop(i)}
          onClick={() => onToggleDay(cell.key)}
        />
      ))}
    </div>
  );
}