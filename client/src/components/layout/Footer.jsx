import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { NewsletterSubscribe } from '../newsletter/NewsletterSubscribe';

const quickLinks = [
  { label: 'Jobs', path: ROUTES.JOBS },
  { label: 'Scholarships', path: ROUTES.SCHOLARSHIPS },
  { label: 'Admissions', path: ROUTES.ADMISSIONS },
  { label: 'Internships', path: ROUTES.INTERNSHIPS },
  { label: 'Blog', path: ROUTES.BLOG },
  { label: 'Contact', path: ROUTES.CONTACT },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">About EduRozgaar</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pakistan’s student-first job & education portal. Find jobs, scholarships, admissions, and career resources in one place.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map(({ label, path }) => (
                <li key={path}>
                  <Link to={path} className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-mint link-hover">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Legal & Business</h3>
            <ul className="space-y-2">
              <li><a href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-mint link-hover">Privacy Policy</a></li>
              <li><a href="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-mint link-hover">Terms of Service</a></li>
              <li><a href={ROUTES.CONTACT} className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-mint link-hover">Advertise With Us</a></li>
              <li><a href={ROUTES.CONTACT} className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-mint link-hover">Post a Job</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Student Alerts</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="https://t.me/edurozgaar" target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-mint link-hover">Telegram Alerts</a></li>
              <li><a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-mint link-hover">WhatsApp Alerts</a></li>
            </ul>
            <div className="mt-3">
              <NewsletterSubscribe compact />
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} EduRozgaar. Built for students first.
        </div>
      </div>
    </footer>
  );
}
