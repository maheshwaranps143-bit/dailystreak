import { useRef, useState } from 'react';
import { buildBackup, parseBackup, todayKey } from '../hooks/useHabits';

export default function DataControls({ habits, onReplace }) {
  const fileRef = useRef(null);
  const [pending, setPending] = useState(null);
  const [error, setError] = useState('');

  function handleExport() {
    const blob = new Blob([buildBackup(habits)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dailystreak-${todayKey()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    setError('');
    try {
      setPending(parseBackup(await file.text()));
    } catch (err) {
      setPending(null);
      setError(err.message);
    }
  }

  function confirmImport() {
    onReplace(pending);
    setPending(null);
  }

  return (
    <section className="data-controls" aria-label="Backup">
      <div className="data-controls__row">
        <span className="data-controls__label">Backup</span>
        <div className="data-controls__buttons">
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={handleExport}
            disabled={habits.length === 0}
          >
            Export
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={() => fileRef.current?.click()}
          >
            Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="visually-hidden"
            onChange={handleFile}
          />
        </div>
      </div>

      {error ? <p className="data-controls__error">{error}</p> : null}

      {pending ? (
        <div className="confirm confirm--import">
          <span className="confirm__text">
            Replace {habits.length} {habits.length === 1 ? 'habit' : 'habits'} with{' '}
            {pending.length} from the file?
          </span>
          <button
            type="button"
            className="btn btn--danger btn--small"
            onClick={confirmImport}
          >
            Replace
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={() => setPending(null)}
          >
            Cancel
          </button>
        </div>
      ) : null}
    </section>
  );
}