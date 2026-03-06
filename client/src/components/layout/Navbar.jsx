import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { DrawerMenu } from './DrawerMenu';

const navItems = [
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

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(null);
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-surface/98 dark:bg-surface-dark/98 backdrop-blur safe-area-inset-top">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 md:h-16 gap-2 min-h-[56px]">
          <Link to={ROUTES.HOME} className="font-bold text-base sm:text-lg text-gray-900 dark:text-white link-hover hover:text-primary dark:hover:text-mint truncate min-w-0 shrink">
            EduRozgaar
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
            {navItems.map((item) =>
              item.mega ? (
                <div
                  key={item.labelKey || 'edu'}
                  className="relative"
                  onMouseEnter={() => setMegaOpen(item.labelKey || 'edu')}
                  onMouseLeave={() => setMegaOpen(null)}
                >
                  <button
                    type="button"
                    className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-mint rounded-lg link-hover"
                  >
                    {item.labelKey ? t(item.labelKey) : 'Education'} ▾
                  </button>
                  {megaOpen === (item.labelKey || 'edu') && (
                    <div className="absolute left-0 top-full pt-1 w-56 animate-dropdown-enter">
                      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-2">
                        {item.mega.map((sub) => (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 link-hover rounded-lg"
                          >
                            {sub.labelKey ? t(sub.labelKey) : sub.label || ''}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-mint rounded-lg link-hover"
                >
                  {item.labelKey ? t(item.labelKey) : item.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`min-w-[36px] min-h-[36px] sm:px-2 sm:py-1 flex items-center justify-center text-xs sm:text-sm ${lang === 'en' ? 'bg-mint/30 dark:bg-mint/20 text-primary dark:text-mint' : 'text-gray-600 dark:text-gray-400'}`}
                aria-label="English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('ur')}
                className={`min-w-[36px] min-h-[36px] sm:px-2 sm:py-1 flex items-center justify-center text-xs sm:text-sm ${lang === 'ur' ? 'bg-mint/30 dark:bg-mint/20 text-primary dark:text-mint' : 'text-gray-600 dark:text-gray-400'}`}
                aria-label="Urdu"
              >
                UR
              </button>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            {isAuthenticated ? (
              <>
                <Link
                  to={ROUTES.DASHBOARD}
                  className="hidden sm:inline px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary"
                >
                  Dashboard
                </Link>
                <Link
                  to={ROUTES.RESUME_ANALYZER}
                  className="hidden sm:inline px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary"
                >
                  Resume
                </Link>
                <Link
                  to={ROUTES.PROFILE}
                  className="hidden sm:inline px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary"
                >
                  Profile
                </Link>
                {user?.role === 'Admin' && (
                  <Link
                    to={ROUTES.ADMIN}
                    className="hidden sm:inline px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary"
                  >
                    Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => logout()}
                  className="hidden sm:inline px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className="hidden sm:inline px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="hidden sm:inline px-3 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-hover btn-theme"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
            <button
              type="button"
              className="lg:hidden min-w-[48px] min-h-[48px] flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 cursor-pointer"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDrawerOpen(true); }}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
            >
              <svg className="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <DrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
