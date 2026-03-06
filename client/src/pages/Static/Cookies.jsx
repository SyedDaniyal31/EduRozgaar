import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

export default function Cookies() {
  return (
    <>
      <Helmet>
        <title>Cookie Policy – EduRozgaar</title>
        <meta name="description" content="How EduRozgaar uses cookies and similar technologies." />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Cookie Policy</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: 2026</p>
        <div className="prose prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences, keep you logged in, and understand how the site is used.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">How We Use Cookies</h2>
            <p>
              EduRozgaar uses cookies to: (1) keep you signed in to your account, (2) remember your language and theme preferences, (3) improve site performance and analytics, and (4) support security (e.g. rate limiting). We do not use cookies for third-party advertising on the main platform.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Your Choices</h2>
            <p>
              You can control or delete cookies through your browser settings. Note that disabling certain cookies may affect login and preferences. For more on how we handle data, see our <Link to={ROUTES.PRIVACY_POLICY} className="text-primary dark:text-mint hover:underline">Privacy Policy</Link>.
            </p>
          </section>
        </div>
        <p className="mt-8 text-gray-500 dark:text-gray-400">
          <Link to={ROUTES.CONTACT} className="text-primary dark:text-mint hover:underline">Contact us</Link> for cookie-related questions.
        </p>
      </div>
    </>
  );
}
