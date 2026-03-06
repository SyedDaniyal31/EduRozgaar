import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { DrawerMenu } from './DrawerMenu';

const navItems = [
  { labelKey: 'nav.jobs', path: ROUTES.JOBS },
  { labelKey: 'nav.scholarships', path: ROUTES.SCHOLARSHIPS },
  { labelKey: 'nav.admissions', path: ROUTES.ADMISSIONS },
  {
    labelKey: 'nav.education',
    mega: [
      { labelKey: 'nav.schoolsAndColleges', path: ROUTES.SCHOOLS_AND_COLLEGES },
      { labelKey: 'nav.foreign', path: ROUTES.FOREIGN_STUDIES },
    ],
  },
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
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link to={ROUTES.HOME} className="font-bold text-lg text-gray-900 dark:text-white">
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
                    className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg"
                  >
                    {item.labelKey ? t(item.labelKey) : 'Education'} ▾
                  </button>
                  {megaOpen === (item.labelKey || 'edu') && (
                    <div className="absolute left-0 top-full pt-1 w-56">
                      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-2">
                        {item.mega.map((sub) => (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                  className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg"
                >
                  {item.labelKey ? t(item.labelKey) : item.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-1 text-sm ${lang === 'en' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'text-gray-600 dark:text-gray-400'}`}
                aria-label="English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('ur')}
                className={`px-2 py-1 text-sm ${lang === 'ur' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'text-gray-600 dark:text-gray-400'}`}
                aria-label="Urdu"
              >
                UR
              </button>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            {isAuthenticated ? (
              <>
                <Link
                  to={ROUTES.DASHBOARD}
                  className="hidden sm:inline px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-emerald-600"
                >
                  Dashboard
                </Link>
                <Link
                  to={ROUTES.RESUME_ANALYZER}
                  className="hidden sm:inline px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-emerald-600"
                >
                  Resume
                </Link>
                <Link
                  to={ROUTES.PROFILE}
                  className="hidden sm:inline px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-emerald-600"
                >
                  Profile
                </Link>
                {user?.role === 'Admin' && (
                  <Link
                    to={ROUTES.ADMIN}
                    className="hidden sm:inline px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-emerald-600"
                  >
                    Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => logout()}
                  className="hidden sm:inline px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-emerald-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="hidden sm:inline px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-emerald-600"
              >
                Login
              </Link>
            )}
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
