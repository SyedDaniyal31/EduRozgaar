import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants';

export function SaveButton({ type, id, saved: initialSaved, onToggle }) {
  const { isAuthenticated } = useAuth();
  const [saved, setSaved] = useState(!!initialSaved);
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    return (
      <Link
        to={ROUTES.LOGIN}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <span aria-hidden>🔖</span>
        Login to Save
      </Link>
    );
  }

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      await onToggle(id, !saved);
      setSaved((prev) => !prev);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition ${
        saved
          ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
          : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
      aria-pressed={saved}
    >
      <span aria-hidden>{saved ? '✓ Saved' : '🔖 Save'}</span>
    </button>
  );
}
