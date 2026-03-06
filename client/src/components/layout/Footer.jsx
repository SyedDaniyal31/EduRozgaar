import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { NewsletterSubscribe } from '../newsletter/NewsletterSubscribe';

const footerLinks = {
  Jobs: ROUTES.JOBS,
  Scholarships: ROUTES.SCHOLARSHIPS,
  Admissions: ROUTES.ADMISSIONS,
  'Schools & Colleges': ROUTES.SCHOOLS_AND_COLLEGES,
  'Foreign Studies': ROUTES.FOREIGN_STUDIES,
  Blog: ROUTES.BLOG,
  Contact: ROUTES.CONTACT,
};

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">EduRozgaar</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pakistan’s job & education portal. Helping students and reducing unemployment.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {Object.entries(footerLinks).slice(0, 4).map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">More</h3>
            <ul className="space-y-2">
              {Object.entries(footerLinks).slice(4).map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Student alerts</h3>
            <NewsletterSubscribe compact />
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} EduRozgaar. Built for students first.
        </div>
      </div>
    </footer>
  );
}
