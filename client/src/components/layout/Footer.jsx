import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { NewsletterSubscribe } from '../newsletter/NewsletterSubscribe';

const platformLinks = [
  { label: 'Jobs', path: ROUTES.JOBS },
  { label: 'Scholarships', path: ROUTES.SCHOLARSHIPS },
  { label: 'Admissions', path: ROUTES.ADMISSIONS },
  { label: 'Internships', path: ROUTES.INTERNSHIPS },
];

const studentResourcesLinks = [
  { label: 'Resume Builder', path: ROUTES.RESUME_BUILDER },
  { label: 'Career Guidance', path: ROUTES.CAREER_GUIDANCE },
  { label: 'Exam Preparation', path: ROUTES.EXAM_PREP },
  { label: 'Blog', path: ROUTES.BLOG },
];

const companyLinks = [
  { label: 'About Us', path: ROUTES.ABOUT },
  { label: 'Our Services', path: ROUTES.SERVICES },
  { label: 'Contact', path: ROUTES.CONTACT },
  { label: 'Advertise With Us', path: ROUTES.ADVERTISE },
];

const supportLinks = [
  { label: 'Help Center', path: ROUTES.HELP_CENTER },
  { label: 'FAQ', path: ROUTES.FAQ },
  { label: 'Report Issue', path: ROUTES.CONTACT },
  { label: 'Submit Opportunity', path: ROUTES.SUBMIT_OPPORTUNITY },
];

const legalLinks = [
  { label: 'Privacy Policy', path: ROUTES.PRIVACY_POLICY },
  { label: 'Terms of Service', path: ROUTES.TERMS },
  { label: 'Cookie Policy', path: ROUTES.COOKIES },
];

const socialLinks = [
  {
    label: 'X (Twitter)',
    href: 'https://twitter.com/edurozgaar',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/edurozgaar',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Telegram',
    href: 'https://t.me/edurozgaar',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    label: 'Email Support',
    href: 'mailto:contact@edurozgaar.pk',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

function LinkColumn({ title, links }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider">
        {title}
      </h3>
      <ul className="space-y-2">
        {links.map(({ label, path }) => (
          <li key={path}>
            <Link
              to={path}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-mint transition-colors duration-200"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-10">
          <LinkColumn title="Platform" links={platformLinks} />
          <LinkColumn title="Student Resources" links={studentResourcesLinks} />
          <LinkColumn title="Company" links={companyLinks} />
          <LinkColumn title="Support" links={supportLinks} />
          <LinkColumn title="Legal" links={legalLinks} />
          <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-1 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider">
              Connect With Us
            </h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white dark:hover:bg-mint dark:hover:text-gray-900 transition-all duration-200"
                  aria-label={label}
                >
                  {icon}
                </a>
              ))}
            </div>
            <div className="pt-2">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider mb-3">
                Newsletter
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Get jobs, scholarships & admission alerts.
              </p>
              <NewsletterSubscribe compact />
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
          © 2026 EduRozgaar — Built for students first.
        </div>
      </div>
    </footer>
  );
}
