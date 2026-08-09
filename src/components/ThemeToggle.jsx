export default function ThemeToggle({ theme, onToggle }) {
  const dark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={dark ? 'Switch to the light theme' : 'Switch to the dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {dark ? (
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.4 5.4l1.4 1.4M17.2 17.2l1.4 1.4M18.6 5.4l-1.4 1.4M6.8 17.2l-1.4 1.4" />
          </g>
        ) : (
          <path
            d="M20.1 14.6A8.4 8.4 0 0 1 9.4 3.9a8.4 8.4 0 1 0 10.7 10.7z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}