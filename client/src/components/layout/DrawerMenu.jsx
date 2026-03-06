import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const DRAWER_DURATION_MS = 220;

const drawerNavItems = [
  { labelKey: 'nav.home', path: ROUTES.HOME },
  { labelKey: 'nav.jobs', path: ROUTES.JOBS },
  { labelKey: 'nav.scholarships', path: ROUTES.SCHOLARSHIPS },
  { labelKey: 'nav.admissions', path: ROUTES.ADMISSIONS },
  { labelKey: 'nav.internships', path: ROUTES.INTERNSHIPS },
  {
    labelKey: 'nav.education',
    mega: [
      { labelKey: 'nav.schoolsAndColleges', path: ROUTES.SCHOOLS_AND_COLLEGES },
      { labelKey: 'nav.universities', path: ROUTES.INTL_SCHOLARSHIPS },
      { labelKey: 'nav.foreign', path: ROUTES.FOREIGN_STUDIES },
    ],
  },
  { labelKey: 'nav.examPrep', path: ROUTES.EXAM_PREP },
  { labelKey: 'nav.blog', path: ROUTES.BLOG },
  { labelKey: 'nav.contact', path: ROUTES.CONTACT },
];

export function DrawerMenu({ open, onClose }) {
  const [educationOpen, setEducationOpen] = useState(false);
  const [exiting, setExiting] = useState(false);
  const exitTimeoutRef = useRef(null);
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setExiting(false);
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) setEducationOpen(false);
  }, [open]);

  const handleClose = () => {
    if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    setExiting(true);
    exitTimeoutRef.current = setTimeout(() => {
      onClose();
      setExiting(false);
      exitTimeoutRef.current = null;
    }, DRAWER_DURATION_MS);
  };

  useEffect(() => () => { if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current); }, []);

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const linkClass = 'block px-4 py-3.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 transition-colors min-h-[44px] flex items-center';

  const show = open || exiting;
  const overlayClass = exiting
    ? 'fixed inset-0 bg-black/50 z-[100] lg:hidden animate-overlay-leave'
    : 'fixed inset-0 bg-black/50 z-[100] lg:hidden animate-overlay-enter';
  const asideClass = exiting
    ? 'fixed top-0 right-0 bottom-0 w-72 max-w-[min(85vw,320px)] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 z-[101] lg:hidden overflow-y-auto overscroll-contain shadow-2xl animate-drawer-leave'
    : 'fixed top-0 right-0 bottom-0 w-72 max-w-[min(85vw,320px)] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 z-[101] lg:hidden overflow-y-auto overscroll-contain shadow-2xl animate-drawer-enter';

  const drawer = (
    <>
      <div
        className={overlayClass}
        onClick={handleClose}
        aria-hidden="true"
      />
      <aside
        className={asideClass}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
        style={{ paddingRight: 'env(safe-area-inset-right, 0)' }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
          <span className="font-bold text-gray-900 dark:text-white text-lg">Menu</span>
          <button
            type="button"
            onClick={handleClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 -m-2"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-3 flex flex-col gap-0.5 pb-8 safe-area-inset-bottom">
          {drawerNavItems.map((item) =>
            item.mega ? (
              <div key={item.labelKey || 'edu'}>
                <button
                  type="button"
                  onClick={() => setEducationOpen((o) => !o)}
                  className={`w-full text-left ${linkClass} flex justify-between items-center`}
                  aria-expanded={educationOpen}
                >
                  {t(item.labelKey || 'nav.education')}
                  <svg className={`w-5 h-5 transition-transform ${educationOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {educationOpen && (
                  <div className="pl-4 py-1 border-l-2 border-gray-200 dark:border-gray-700 ml-4 my-1 space-y-0.5 animate-dropdown-enter">
                    {item.mega.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        onClick={onClose}
                        className={linkClass}
                      >
                        {t(sub.labelKey)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={linkClass}
              >
                {t(item.labelKey)}
              </Link>
            )
          )}
          <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2" aria-hidden="true" />
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.DASHBOARD} onClick={onClose} className={linkClass}>{t('nav.dashboard')}</Link>
              <Link to={ROUTES.PROFILE} onClick={onClose} className={linkClass}>{t('nav.profile')}</Link>
              <Link to={ROUTES.SAVED_JOBS} onClick={onClose} className={linkClass}>Saved jobs</Link>
              <Link to={ROUTES.RESUME_ANALYZER} onClick={onClose} className={linkClass}>{t('nav.resume')}</Link>
              {user?.role === 'Admin' && (
                <Link to={ROUTES.ADMIN} onClick={onClose} className={linkClass}>Admin</Link>
              )}
              <button type="button" onClick={handleLogout} className={`${linkClass} w-full text-left`}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} onClick={onClose} className={linkClass}>{t('nav.login')}</Link>
              <Link to={ROUTES.REGISTER} onClick={onClose} className={`${linkClass} font-medium bg-primary text-white dark:bg-mint dark:text-gray-900 hover:opacity-90`}>
                {t('nav.register')}
              </Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );

  if (!show) return null;
  return createPortal(drawer, document.body);
}
