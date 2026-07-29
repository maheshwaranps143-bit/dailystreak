import { useState } from 'react';
import { CATEGORIES } from '../hooks/useHabits';

export default function AddHabitForm({ onAdd }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name, category);
    setName('');
    setCategory(CATEGORIES[0]);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div className="add-form__field">
        <label className="field-label" htmlFor="habit-name">
          New habit
        </label>
        <input
          id="habit-name"
          className="text-input"
          type="text"
          value={name}
          maxLength={60}
          placeholder="e.g. Read 20 pages"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="add-form__field add-form__field--category">
        <label className="field-label" htmlFor="habit-category">
          Category
        </label>
        <select
          id="habit-category"
          className="select-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn--primary" disabled={!name.trim()}>
        Add habit
      </button>
    </form>
  );
}