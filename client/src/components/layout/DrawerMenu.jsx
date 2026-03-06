import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { useAuth } from '../../context/AuthContext';

const publicLinks = [
  { label: 'Jobs', path: ROUTES.JOBS },
  { label: 'Scholarships', path: ROUTES.SCHOLARSHIPS },
  { label: 'Admissions', path: ROUTES.ADMISSIONS },
  { label: 'Schools & Colleges', path: ROUTES.SCHOOLS_AND_COLLEGES },
  { label: 'Foreign Studies', path: ROUTES.FOREIGN_STUDIES },
  { label: 'Blog', path: ROUTES.BLOG },
  { label: 'Contact', path: ROUTES.CONTACT },
];

export function DrawerMenu({ open, onClose }) {
  const { isAuthenticated, user, logout } = useAuth();
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} aria-hidden="true" />
      <aside
        className="fixed top-0 right-0 bottom-0 w-72 max-w-[85vw] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 z-50 lg:hidden overflow-y-auto"
        role="dialog"
        aria-label="Mobile menu"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <span className="font-bold text-gray-900 dark:text-white">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-4 flex flex-col gap-1">
          {publicLinks.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={onClose}
              className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.PROFILE} onClick={onClose} className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Profile</Link>
              <Link to={ROUTES.DASHBOARD} onClick={onClose} className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Dashboard</Link>
              <Link to={ROUTES.SAVED_JOBS} onClick={onClose} className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Saved jobs</Link>
              <Link to={ROUTES.RESUME_ANALYZER} onClick={onClose} className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Resume Analyzer</Link>
              {user?.role === 'Admin' && (
                <Link to={ROUTES.ADMIN} onClick={onClose} className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Admin</Link>
              )}
              <button type="button" onClick={handleLogout} className="px-4 py-3 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 w-full">Logout</button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} onClick={onClose} className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Login</Link>
              <Link to={ROUTES.REGISTER} onClick={onClose} className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Register</Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
